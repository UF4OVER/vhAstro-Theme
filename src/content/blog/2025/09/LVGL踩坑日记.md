---
title: "LVGL踩坑日记"
categories: LVGL
tags:
  - LVGL
  - STM32F4
  - ST7796
id: "cf7df94444a88127"
date: 2025-09-03 08:35:14
cover: "https://img.hepi.ng/v2/qe9sEVY.png"
---

## LVGL踩坑日记
使用STM32F407VET6的SPI1进行SPI刷屏
### 1.先git lvgl的官方库文件

这里我使用的是8.4版本
```git
git clone https://github.com/lvgl/lvgl.git
cd lvgl
git checkout v8.4
```

下载完成后会得到一个如图所示的文件结构
```txt
├─📁 demos
├─📁 docs
├─📁 env_support
├─📁 examples
│ ├─📁 anim
│ ├─📁 arduino
│ ├─📁 assets
│ ├─📁 event
│ ├─📁 get_started
│ ├─📁 layouts
│ ├─📁 libs
│ ├─📁 others
│ ├─📁 porting
│ │ ├─📄 lv_port_disp_template.c----- # 显示设备
│ │ ├─📄 lv_port_disp_template.h
│ │ ├─📄 lv_port_fs_template.c------- # 储存设备
│ │ ├─📄 lv_port_fs_template.h
│ │ ├─📄 lv_port_indev_template.c---- # 触摸设备
│ │ └─📄 lv_port_indev_template.h
│ ├─📁 scroll
│ ├─📁 styles
│ ├─📁 widgets
│ ├─📄 header.py
│ ├─📄 lv_examples.h
│ ├─📄 lv_examples.mk
│ └─📄 test_ex.sh
├─📁 scripts
├─📁 src
├─📁 tests
├─📄 .codecov.yml
├─📄 .editorconfig
├─📄 .gitignore
├─📄 .pre-commit-config.yaml
├─📄 CMakeLists.txt
├─📄 component.mk
├─📄 idf_component.yml
├─📄 Kconfig
├─📄 library.json
├─📄 library.properties
├─📄 LICENCE.txt
├─📄 lv_conf_template.h
├─📄 lvgl.h
├─📄 lvgl.mk
├─📄 lvgl.pc.in
├─📄 README_pt_BR.md
├─📄 README_zh.md
├─📄 README.md
└─📄 SConscript
```

### 2.生成项目代码

#### 2.1 定时器配置
- Tout= ((arr+1)*(psc+1))/Tclk；
- arr：计数重装值，psc分频数，Tclk系统时钟频率，Tout一个周期的时间。
- 由于lvgl需要一个周期1ms的信号老保持心跳，所以使用定时器
    - 配置定时器TIM6
       ```C
          void MX_TIM6_Init(void){
              TIM_MasterConfigTypeDef sMasterConfig = {0};
              htim6.Instance = TIM6;
              htim6.Init.Prescaler = 83;
              htim6.Init.CounterMode = TIM_COUNTERMODE_UP;
              htim6.Init.Period = 1000-1;
              htim6.Init.AutoReloadPreload = TIM_AUTORELOAD_PRELOAD_ENABLE;
              if (HAL_TIM_Base_Init(&htim6) != HAL_OK){
                  Error_Handler();
              }
              sMasterConfig.MasterOutputTrigger = TIM_TRGO_RESET;
              sMasterConfig.MasterSlaveMode = TIM_MASTERSLAVEMODE_DISABLE;
              if (HAL_TIMEx_MasterConfigSynchronization(&htim6, &sMasterConfig) != HAL_OK){
                  Error_Handler();
              }
          }
        ```

- lvgl的任务处理函数最好也放在一个定时器中，定时器中断中调用lv_task_handler()，使用5ms的定时器
    - 定时器TIM7配置
    - ```c
     void MX_TIM7_Init(void){
         TIM_MasterConfigTypeDef sMasterConfig = {0};
         htim7.Instance = TIM7;
         htim7.Init.Prescaler = 420-1;
         htim7.Init.CounterMode = TIM_COUNTERMODE_UP;
         htim7.Init.Period = 1000-1;
         htim7.Init.AutoReloadPreload = TIM_AUTORELOAD_PRELOAD_ENABLE;
         if (HAL_TIM_Base_Init(&htim7) != HAL_OK){
             Error_Handler();
         }
         sMasterConfig.MasterOutputTrigger = TIM_TRGO_RESET;
         sMasterConfig.MasterSlaveMode = TIM_MASTERSLAVEMODE_DISABLE;
         if (HAL_TIMEx_MasterConfigSynchronization(&htim7, &sMasterConfig) != HAL_OK){
             Error_Handler();
         }
     }
     ```

#### 2.2 SPI配置
- 使用ABH1总线上的spi1，速度能快一点

#### 2.3 设置堆栈大小

- 设置堆栈大小`0X1000`

### 3.文件导入
- 将lvgl文件夹下的文件导入到工程中,在项目根目录下直接运行`auto_lvgl.py`文件，自己看着把文件中的根目录改一下
- 然后进入GUI文件夹下的lv_conf.h，启用该文件
- 在进入GUI/examples/porting文件夹，启用其中的所有文件
- 打开其中的lv_port_disp.c
```c
/**
* @file lv_port_disp_templ.c
*
*/

/*Copy this file as "lv_port_disp.c" and set this value to "1" to enable content*/
#if 1  //将0 改为1即可启用

/*********************
*      INCLUDES
*********************/
#include "lv_port_disp.h"
#include <stdbool.h>
#include "st7796.h"  // 导入屏幕驱动文件
/*********************
*      DEFINES
*********************/

#define MY_DISP_HOR_RES 320  // 屏幕宽度
#define MY_DISP_VER_RES 480  // 屏幕高度
// 这里有个宏定义，是自己定义的


//#ifndef MY_DISP_HOR_RES
//    #warning Please define or replace the macro MY_DISP_HOR_RES with the actual screen width, default value 320 is used for now.
//    #define MY_DISP_HOR_RES    320
//#endif
//
//#ifndef MY_DISP_VER_RES
//    #warning Please define or replace the macro MY_DISP_HOR_RES with the actual screen height, default value 240 is used for now.
//    #define MY_DISP_VER_RES    240
//#endif
//上面的直接注释了
```
### 4.初始化显示设备
1. ```c
    void lv_port_disp_init(void)
    {
        /*-------------------------
         * Initialize your display
         * -----------------------*/
        disp_init();
    
        /*-----------------------------
         * Create a buffer for drawing
         *----------------------------*/
    
        /**
         * LVGL 需要一个缓冲区，用于在内部绘制 widget。
         * 稍后，此缓冲区将传递给显示驱动程序的“flush_cb”，以将其内容复制到显示器。
         * 缓冲区必须大于 1 个显示行
         *
         * 有 3 种缓冲配置：
         * 1.创建一个缓冲区：
         * LVGL 将在此处绘制显示屏的内容并将其写入您的显示屏
         *
         * 2.创建 TWO 缓冲区：
         * LVGL 会将显示器的内容绘制到缓冲区并将其写入您的显示器。
         * 您应该使用 DMA 将缓冲区的内容写入显示器。
         * 它将使 LVGL 能够将屏幕的下一部分绘制到另一个缓冲区，同时
         * 数据正在从第一个缓冲区发送。它使渲染和刷新并行。
         *
         * 3.双缓冲
         * 设置 2 个屏幕大小的缓冲区并设置 disp_drv.full_refresh = 1。
         * 这样 LVGL 将始终以 'flush_cb' 提供整个渲染屏幕
         * 并且你只需要更改帧缓冲区的地址。
         */
    //这里有三个缓冲区
    //这里我使用的是2缓冲区
    //根据自己的需求选择
        /* Example for 1) */
    //    static lv_disp_draw_buf_t draw_buf_dsc_1;
    //    static lv_color_t buf_1[MY_DISP_HOR_RES * 10];                          /*A buffer for 10 rows*/
    //    lv_disp_draw_buf_init(&draw_buf_dsc_1, buf_1, NULL, MY_DISP_HOR_RES * 10);   /*Initialize the display buffer*/
    
    //    /* Example for 2) */
        static lv_disp_draw_buf_t draw_buf_dsc_2;
        static lv_color_t buf_2_1[MY_DISP_HOR_RES * 10];                        /*A buffer for 10 rows*/
        static lv_color_t buf_2_2[MY_DISP_HOR_RES * 10];                        /*An other buffer for 10 rows*/
        lv_disp_draw_buf_init(&draw_buf_dsc_2, buf_2_1, buf_2_2, MY_DISP_HOR_RES * 10);   /*Initialize the display buffer*/
    
    //    /* Example for 3) also set disp_drv.full_refresh = 1 below*/
    //    static lv_disp_draw_buf_t draw_buf_dsc_3;
    //    static lv_color_t buf_3_1[MY_DISP_HOR_RES * MY_DISP_VER_RES];            /*A screen sized buffer*/
    //    static lv_color_t buf_3_2[MY_DISP_HOR_RES * MY_DISP_VER_RES];            /*Another screen sized buffer*/
    //    lv_disp_draw_buf_init(&draw_buf_dsc_3, buf_3_1, buf_3_2,
    //                          MY_DISP_VER_RES * LV_VER_RES_MAX);   /*Initialize the display buffer*/
    
        /*-----------------------------------
         * Register the display in LVGL
         *----------------------------------*/
    
        static lv_disp_drv_t disp_drv;                         /*Descriptor of a display driver*/
        lv_disp_drv_init(&disp_drv);                    /*Basic initialization*/
    
        /*Set up the functions to access to your display*/
    
        /*Set the resolution of the display*/
        disp_drv.hor_res = MY_DISP_HOR_RES;
        disp_drv.ver_res = MY_DISP_VER_RES;
    
        /*Used to copy the buffer's content to the display*/
        disp_drv.flush_cb = disp_flush;
    
        /*Set a display buffer*/
        
        //注意：这里的缓冲区是2缓冲区，所以是draw_buf_dsc_2
        disp_drv.draw_buf = &draw_buf_dsc_2;
    }
    ```

    ```c
    /*初始化您的显示器和所需的外围设备.*/
    static void disp_init(void)
    {
        ST7796S_LcdInit(); //驱动文件中屏幕初始化函数
    
    }
    ```
   刷新函数
    - ```c
      static void disp_flush(lv_disp_drv_t * disp_drv, const lv_area_t * area, lv_color_t * color_p)
      {
          if(disp_flush_enabled) {
              /*最简单的情况（也是最慢的）将所有像素逐个放到屏幕上*/
      
              int16_t x;
              int16_t y;
              for(y = area->y1; y <= area->y2; y++) {
                  for(x = area->x1; x <= area->x2; x++) {
                      /*Put a pixel to the display. For example:*/
                      /*put_px(x, y, *color_p)*/
                      LCD_DrawPixel(x, y, color_p->full);  // 注意：这里是颜色值，不是颜色指针，需要指向full
                      color_p++;
                  }
              }
          }
          /*IMPORTANT!!!
           *通知图形库您已准备好进行刷新*/
          lv_disp_flush_ready(disp_drv);
      }
      ```
    - 实际在使用的时候，肯定不是一个一个像素的刷新，这里使用批量刷新
      ```c
      static void disp_flush(lv_disp_drv_t * disp_drv, const lv_area_t * area, lv_color_t * color_p)
      {
      if(!disp_flush_enabled) {
      lv_disp_flush_ready(disp_drv);
      return;
      }
      
          uint16_t x1 = area->x1;
          uint16_t y1 = area->y1;
          uint16_t x2 = area->x2;
          uint16_t y2 = area->y2;
      
          uint32_t size = (x2 - x1 + 1) * (y2 - y1 + 1);
      
          LCD_SetAddress(x1, y1, x2, y2);  // 设置区域
          LCD_PushColors((uint16_t *)color_p, size);  // 批量刷新
      
          lv_disp_flush_ready(disp_drv); // 通知 LVGL 刷新完成
      }

      ```
### 初始化触摸设备
1.在```lv_port_indev.c```中
```c

void lv_port_indev_init(void)
{

    static lv_indev_drv_t indev_drv;

    touchpad_init();

    lv_indev_drv_init(&indev_drv);
    indev_drv.type = LV_INDEV_TYPE_POINTER;
    indev_drv.read_cb = touchpad_read;
    indev_touchpad = lv_indev_drv_register(&indev_drv);

}

/**********************
 *   STATIC FUNCTIONS
 **********************/

/*------------------
 * Touchpad
 * -----------------*/

/*Initialize your touchpad*/
static void touchpad_init(void)
{
    /*Your code comes here*/
   TP_Init();
}


/*Will be called by the library to read the touchpad*/
static void touchpad_read(lv_indev_drv_t * indev_drv, lv_indev_data_t * data)
{
    static lv_coord_t last_x = 0;
    static lv_coord_t last_y = 0;

    if (touchpad_is_pressed()) {
        touchpad_get_xy(&last_x, &last_y);
        data->state = LV_INDEV_STATE_PR; // 按下
        TOUCHPRESSED = false;           // 清除中断标志
    } else {
        data->state = LV_INDEV_STATE_REL; // 松开
    }

    data->point.x = last_x;
    data->point.y = last_y;
}

/*Return true is the touchpad is pressed*/
static bool touchpad_is_pressed(void)
{
    if (!TOUCHPRESSED) return false;  // 没有中断触发就不扫描

    if (FT6336_Scan()) {  // 有中断才去I2C读取
        if (tp_dev.sta & TP_PRES_DOWN) {
            return true;  // 有触摸
        }
    }

    // 扫描后没有按下，说明触摸松开，清标志
    TOUCHPRESSED = false;
    return false;
}

/*如果按下触摸板，则获取 x 和 y 坐标*/
static void touchpad_get_xy(lv_coord_t * x, lv_coord_t * y)
{
    *x = tp_dev.x[0];
    *y = tp_dev.y[0];
}
```
- 再打开Drivers/STM32F4xx_HAL_Driver/Src/stm32f4xx_hal_tim.c

```c
//__weak void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim)
//{
//  /* Prevent unused argument(s) compilation warning */
//  UNUSED(htim);
//
//  /* NOTE : This function should not be modified, when the callback is needed,
//            the HAL_TIM_PeriodElapsedCallback could be implemented in the user file
//   */
//}
// 以上是原代码，弱定义了一个回调函数，可以在main.c中重写，所以直接注释了，下面重定义了，当定时器溢出时调用这个回调函数 lv_tick_inc(1)是lvgl的心跳，每1ms 调用一次
// 在main.c中添加
void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim){  // LVGL心跳与刷新
    if (htim->Instance == TIM6){
    lv_tick_inc(1);
    }
    if (htim->Instance == TIM7){
    lv_task_handler();
    }
}
```

main.c
```c
int main(void){    
    MX_TIM6_Init();
    HAL_TIM_Base_Start_IT(&htim6);  // 开启TIM6中断
    MX_TIM7_Init();
    HAL_TIM_Base_Start_IT(&htim7);
    lv_init();
    lv_port_disp_init();
    lv_port_indev_init();
    
    lv_example_win_1();

  while (1)
  {

  }}

```
