---
title: "适用于vhAstro-Theme的本地博文编辑器"
categories: QT
tags:
  - 编辑器
  - pyqt
id: "适用于vhAstro-Theme的本地博文编辑器"
date: 2025-04-05 18:41:28
cover: "https://zycs-img-c5u.pages.dev/v2/yRgS8CB.png"
---

:::note
适用于vhAstro-Theme的本地博文编辑器（拓展markdown语法）
:::


这是编辑界面的样式，简单的demo,**第三张图是本篇博客编辑的样子**，暂时还没有上传的打算，待我完善
:::picture
![a7cef7983c0a1e1671f60882f7382a8c.png](https://zycs-img-c5u.pages.dev/v2/yRgS8CB.png)
![2195cd2ed5e20d9fbf2c57bc19ef1f04.png](https://zycs-img-c5u.pages.dev/v2/JETEBuB.png)
![544b7fdcbde8ea53e141dc90f3ee9181.png](https://zycs-img-c5u.pages.dev/v2/IGtmuGC.png)
:::

> 分别是小界面和大界面的样式<br>
> 支持一些vhAstro-Theme的语法

# 按钮组件

```
<!-- 按钮组件 -->
::btn[标题]{link="URL 链接"}
<!-- 支持类型：info、success、warning、error、import -->
::btn[按钮]{link="链接" type="info"}
```

::btn[标题]{link="URL 链接"}
::btn[按钮]{link="链接" type="success"}
::btn[按钮]{link="链接" type="warning"}
::btn[按钮]{link="链接" type="error"}
::btn[按钮]{link="链接" type="import"}

```
# Note 组件
<!-- note组件 -->
:::note
这是 note 组件 默认主题
:::
<!-- 支持类型：info、success、warning、error、import -->
:::note{type="info"}
这是 note 组件 success 主题
:::
```

:::note
这是 note 组件 默认主题
:::

:::note{type="warning"}
这是 note 组件 warning 主题
:::

:::note{type="info"}
这是 note 组件 info 主题
:::

:::note{type="success"}
这是 note 组件 success 主题
:::

:::note{type="error"}
这是 note 组件 error 主题
:::

:::note{type="import"}
这是 note 组件 import 主题
:::
# Picture 组件
```
:::picture
![Astro主题-vhAstro-Theme](https://i0.wp.com/uxiaohan.github.io/v2/2023/03/42944511.png)
![Astro主题-vhAstro-Theme](https://i0.wp.com/uxiaohan.github.io/v2/2023/03/42944511.png)
![Astro主题-vhAstro-Theme](https://i0.wp.com/uxiaohan.github.io/v2/2023/03/42944511.png)
:::
```

:::picture
![Astro主题-vhAstro-Theme](https://i0.wp.com/uxiaohan.github.io/v2/2023/03/42944511.png)
![Astro主题-vhAstro-Theme](https://i0.wp.com/uxiaohan.github.io/v2/2023/03/42944511.png)
![Astro主题-vhAstro-Theme](https://i0.wp.com/uxiaohan.github.io/v2/2023/03/42944511.png)
:::


