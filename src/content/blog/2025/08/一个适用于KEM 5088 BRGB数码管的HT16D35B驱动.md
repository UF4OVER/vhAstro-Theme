---
title: "一个适用于KEM 5088 BRGB数码管的HT16D35B驱动"
categories: 电子
tags:
  - 数码管
  - 驱动
  - HT16D35B
  - KEM 5088
  - python 
id: "HT16D35B"
date: 2025-08-26 22:12:24
cover: "https://img.hepi.ng/v2/rf3fVnf.png"
---

## 硬件连接
1. KEM 5088 BRGB数码管模块
   ![mokuai](https://img.hepi.ng/v2/XA85XEs.jpeg)
2. 这是模块引出的引脚，按照左到右的顺序
   ![img.png](https://img.hepi.ng/v2/JTOUrQl.png)
3. KEM 5088 BRGB数码管连接HT16D35B，上下引脚对应HT16D35B的引脚
   ![img_1.png](https://img.hepi.ng/v2/3TV6i8E.png)
4. 按照5088的原理图
   ![as.png](https://img.hepi.ng/v2/rf3fVnf.png)
5. 引脚对应关系，芯片row0对应数码管col1，依次类推
   ![img_2.png](https://img.hepi.ng/v2/LOIvKho.png)
   ![img_3.png](https://img.hepi.ng/v2/3fsYyyf.png)

## 代码
1. 在ht16d35b.py文件中,首先有一个基类`HT16D35Base`,在这个基类中定义了所有的IO方法，包括初始化，设置亮度，设置显示模式，这些方法都是适用于任何练级方式的数码管，不管是否是RGB的。
2. `HT16D35B`类继承自`HT16D35Base`类，在`HT16D35B`类中定义了RGB实现的方法，比如设置了RGB的缓冲区，clear，update等方法，不同的链接方式的话，也有不同的`_initChip`方法，具体详见**simHT16D35A_Bv141.pdf**

### 模块导入
```python
import time
from machine import I2C
from font import ASCII_5x7
```
- `time`：用于延时，比如复位后等待芯片响应。
- `machine.I2C`：MicroPython 提供的硬件接口类。
- `ASCII_5x7`：字模库，用于字符绘制，采用 5×7 点阵。
### Command 命令类
```python
class Command:
   def __init__(self, command: int, val: list):
      self._command = command
      self._val = val
```
为了让代码更直观，将 `HT16D35B` 的寄存器写操作封装成 `Command` 对象，每个命令包括 **命令字节** 和 **数据列表**。
### 基础类 HT16D35Base
```python
class HT16D35Base:
   def __init__(self, i2c: I2C, addr=0x68):
      self.i2c = i2c
      self.addr = addr
      self.display_ram = [0] * 28

```
- 绑定 I2C 总线和芯片地址（默认 0x68）。
- `display_ram` 用来 缓存当前的显示数据，减少不必要的重复写入。

### RAM 操作
```python
def _writeRam(self, address, value):
   self._writeCommand(0x80, [address, value])
   self.display_ram[address] = value
```
- 0x80 → 写 RAM 命令。
- 更新 `display_ram` 缓存，保证软件层和硬件状态一致。

### 单芯片驱动类 HT16D35BS
继承自基础类，主要实现 点阵映射、绘制和更新逻辑。
### 初始化
```python
def _initChip(self):
   self._writeCommand(0XCC)  # 软件复位
   time.sleep_ms(5)
   ...
   self.clear()
   self.update()
```
初始化时依次配置：
- 模式选择（二进制/灰度）
- 打开所有 COM/ROW 输出
- 设置恒流、亮度
- 启动振荡器

最后清屏并刷新。

### 像素引脚映射
```python
def _mapPixelPins(self, x, y, color):
   column_to_row = {
      0: [0, 8, 23],  # 第一列RGB对应的ROW引脚
      ...
   }
   row_to_com = {0: 0, 1: 1, ..., 7: 7}

```

`HT16D35B` 并不是直接对应 (x, y) → LED，而是通过 COM（行共阳极）+ ROW（列RGB引脚） 组合来点亮某个像素。
- `column_to_row`：定义每一列的 RGB 分别对应哪几个 ROW 引脚。
- `row_to_com`：定义每一行对应的 COM 引脚。
- 例如：`(x=0, y=0, color=(1,0,0))` → 会点亮 ROW0 + COM0。

### 绘制字符
```python
def setChar(self, char, x_offset=0, y_offset=0, color=(1, 0, 0)):
   char_data = ASCII_5x7.get(char, ASCII_5x7[' '])
   for col in range(5):
      col_data = char_data[col]
      for row in range(7):
         if col_data & (1 << (6 - row)):
            self.buffer[y][x] = color
```
- 从 `ASCII_5x7` 取出字模。
- 遍历字模的列与行，如果位为 1 就点亮像素，否则关闭。
- 支持偏移 `(x_offset, y_offset)` 控制字符位置。

### 设置与刷新像素
```python
def setPoint(self, x, y, color):
   if 0 <= x < 8 and 0 <= y < 8:
      self.buffer[y][x] = color
```
只修改缓冲区，不立即写入硬件。
```python
def update(self):
   ram_updates = {}
   for y in range(8):
      for x in range(8):
         updates = self._mapPixelPins(x, y, self.buffer[y][x])
         ...
   # 只更新变化的RAM地址
   for ram_address in range(28):
      if new_value != self.display_ram[ram_address]:
         self._writeRam(ram_address, new_value)

```
这样保证：
- 先在 `buffer` 中修改像素。
- 调用 `update()` 时才写入 I2C。
- 避免频繁 IO，提升效率。
### 清屏
```python
def clear(self, color=(0, 0, 0)):
   for i in range(28):
      self._writeRam(i, 0x00)
   for y in range(8):
      for x in range(8):
         self.buffer[y][x] = color
```
