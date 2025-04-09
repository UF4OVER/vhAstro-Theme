---
title: "API的解析构造(Cloudflare Workers)"
categories: Cloudflare
tags:
  - API
id: "API的解析构造(Cloudflare Workers)"
date: 2025-04-07 21:45:44
cover: "https://zycs-img-c5u.pages.dev/v2/VSVh7lG.png"
---

:::note
使用`Cloudflare Workers`和自定义域名搭建API服务
:::

# 示例(我自己构建的)

> 适配`vhAstro-Theme`中动态的API

## 1，qq收藏中的写法
标签使用英文`,`隔开
没有图片的话`picture:`后面为空

```
=====

date:202502051232

tags:淘阿松大a

text:逆天淘宝我最近只推这个

picture:

=====

=====

date:202502051113

tags:淘啊实打实的啊

text:逆天淘宝我他给我首测测额额ce

picture:

=====

=====

date:202504052213

tags:老姐

text:

picture:https://zycs-img-c5u.pages.dev/v2/poHm7cC.jpeg

=====

=====

date:202203052223

tags:学习,作业

text:作业太多了

picture:

=====

=====

date:202502051113

tags:淘宝

text:逆天淘宝我最近只买电子元器件了他给我首页推这个

picture:https://zycs-img-c5u.pages.dev/v2/01VYmeS.png

=====



```
## 2，请求方式
| 参数名称 | 值                                       |
|------|-----------------------------------------|
| 请求方式 | `GET`                                   |
| 请求地址 | `https://api.uf4.top/parse?url=xxx`     |
| 请求参数 | `xxx`（你的qq收藏的url，qq收藏不能有标题）             |
| 示例   | `GET https://api.uf4.top/parse?url=xxx` |

在`vhAstro-Theme`中的`Talking.ts`中填入对应的API即可

## 3，返回示例（多条文本）
```json

[
  {
    "date": "2025-03-25 07:04:42",
    "tags": [
      "学习",
      "作业"
    ],
    "content": "作业太多了"
  },
  {
    "date": "2025-03-28 22:09:06",
    "tags": [
      "美丽"
    ],
    "content": "动人<p class=\"vh-img-flex\"><img src=\"https://zycs-img-c5u.pages.dev/v2/ZrJRWUR.jpeg\"></p>"
  },
  {
    "date": "2025-03-29 05:02:12",
    "tags": [
      "老姐"
    ],
    "content": "<p class=\"vh-img-flex\"><img src=\"https://zycs-img-c5u.pages.dev/v2/poHm7cC.jpeg\"></p>"
  },
  {
    "date": "2025-03-26 16:03:26",
    "tags": [
      "我的老姐"
    ],
    "content": "太美啦<p class=\"vh-img-flex\"><img src=\"https://zycs-img-c5u.pages.dev/v2/VfX4e2s.jpeg\"></p>"
  }
]
```
# 问题
当我们直接GET这个qq收藏的网址时，会发现，我们的数据其实被折叠了一部分
正则匹配到的数据也不是完整的

:::picture
![33349c5f90401b3e429a8fa0509f0490.png](https://zycs-img-c5u.pages.dev/v2/iiwLRlI.png)
:::


## 怎么办？？

GPT给出了这样的回答


- 如果折叠内容由异步 AJAX 请求加载：需要定位该请求的接口及必要参数，然后模拟并发请求获取全部内容。

- 如果折叠内容隐藏在初始 HTML 中：可以调整解析逻辑，使用更精准的正则或直接通过 DOM 解析所有相关节点。

- 如果需要执行 JS 才能展示全部内容：考虑将获取工作放在支持无头浏览器的环境中，Cloudflare Workers 本身无法执行 JS 渲染。


他先让我们看看控制台的请求，是不是在点击之后又请求了一次完整内容，嗯嗯嗯，我觉得说的有道理，那就尝试一下
结果出人意料，第一个请求就是
:::picture
![14298a1cb2b99f0396ab21e400603c82.png](https://zycs-img-c5u.pages.dev/v2/JbKQZmq.png)
![03b631fd4392df91f212134621067eb9.png](https://zycs-img-c5u.pages.dev/v2/9jTp14M.png)
:::
现在只需要拿着里面的请求头的参数填进去，重新请求一次，就可以拿到完整的内容了

```javascript
    // 模拟浏览器请求头
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36 Edg/135.0.0.0",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1"
    };
```

**但是**:这时候拿到的数据变成这样了,所有的标签都变成`<p>`了，内容都在`<p>`里面了
```html
    </head>
    <script type="text/javascript">
        window.IS_DEV_ENV = false;
        window.g_start_time = +new Date();
    </script>
    <body class="weiyun-note">
        <div class="wy-share-wrap">
            <div id="noteContainer">
                <section class="wy-notes-wrapper">
                    <header class="note-title-wrapper">
                        <h2 class="note-title"></h2>
                        <time class="note-time">2025-04-09 23:12:49</time>
                    </header>
                    <article class="note-body">
                        <div class="note-content">
                            <p>=====</p>
                            <p>date:202504082213</p>
                            <p>tags:逆天,淘宝</p>
                            <p>text:我最近只买了一些电子元器件啊，给我看这些干什么</p>
                            <p>picture:https://zycs-img-c5u.pages.dev/v2/01VYmeS.png</p>
                            <p>=====</p>
                            <p>=====</p>
                            <p>date:202504061312</p>
                            <p>tags:作业</p>
                            <p>text:这周作业超级多啊</p>
                            <p>picture:</p>
                            <p>=====</p>
                            <p>=====</p>
                            <p>date:202504052213</p>
                            <p>tags:考试</p>
                            <p>text:这周有考试，不开心</p>
                            <p>picture:</p>
                            <p>=====</p>
                            <p>=====</p>
                            <p>date:202502122345</p>
                            <p>tags:老姐</p>
                            <p>text:老姐超级美的</p>
                            <p>picture:https://zycs-img-c5u.pages.dev/v2/ZrJRWUR.jpeg</p>
                            <p>=====</p>
                            <p>=====</p>
                            <p>date:202502031312</p>
                            <p>tags:老姐</p>
                            <p>text:不愧是老姐，美得冒泡噗~噗~噗~</p>
                            <p>picture:https://zycs-img-c5u.pages.dev/v2/ugBgIZr.jpeg</p>
                            <p>=====</p>
                            <p></p>
                            <p></p>
                        </div>
                    </article>
                </section>
            </div>
            <script>
                document.title = 'QQ收藏';
            </script>
    </body>
</html>
```
这时候得把之前的正则匹配改成这样

```javascript

    const res = await fetch(cacheBypassUrl, {
      headers,
      cf: {
        cacheTtl: 0,
        cacheEverything: true
      }
    });

    const html = await res.text();

    // 先定位到 note-content 内的 HTML，确保只解析相关部分
    const divRegex = /<div class="note-content">([\s\S]+?)<\/div>/;
    const divMatch = divRegex.exec(html);
    const contentHtml = divMatch ? divMatch[1] : html;

    // 匹配以 <p>=====</p> 为分隔符形成的内容块
    const blockRegex =
      /<p>=====<\/p>\s*((?:<p>[\s\S]*?<\/p>\s*)+?)<p>=====<\/p>/g;
    const blocks = [];
    let match;
    while ((match = blockRegex.exec(contentHtml)) !== null) {
      const blockContent = match[1].trim();

      // 使用正则提取每一行内容（去掉 <p> 与 </p>）
      const lineRegex = /<p>(.*?)<\/p>/g;
      let lineMatch;
      let date = "";
      let tags = [];
      let text = "";
      let picture = "";
      while ((lineMatch = lineRegex.exec(blockContent)) !== null) {
        let line = lineMatch[1].trim();
        if (line.startsWith("date:")) {
          date = line.slice("date:".length).trim();
          // 如果是12位日期数字，进行格式化
          if (/^\d{12}$/.test(date)) {
            const y = date.slice(0, 4);
            const m = date.slice(4, 6);
            const d = date.slice(6, 8);
            const h = date.slice(8, 10);
            const min = date.slice(10, 12);
            date = `${y}-${m}-${d} ${h}:${min}:00`;
          }
        } else if (line.startsWith("tags:")) {
          tags = line
            .slice("tags:".length)
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);
        } else if (line.startsWith("text:")) {
          text = line.slice("text:".length).trim();
        } else if (line.startsWith("picture:")) {
          picture = line.slice("picture:".length).trim();
        }
      }
      // 合并 text 与 picture（如果图片存在，则加入一个图片标签）
      let content = text;
      if (picture) {
        content += `<p class="vh-img-flex"><img src="${picture}"></p>`;
      }
      // 返回的每个块只包含 date、tags 与 content 字段
      blocks.push({
        date,
        tags,
        content
      });
    }
    console.log("解析后的数据:", blocks);

    return new Response(JSON.stringify(blocks, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    }
```

然后就可以正常解析了



