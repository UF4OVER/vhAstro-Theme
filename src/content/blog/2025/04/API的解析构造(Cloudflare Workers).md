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

# 代码
```javascript
// worker.js
export default {
    async fetch(request) {
        const { searchParams } = new URL(request.url);
        const targetUrl = searchParams.get("url") || "https://sharechain.qq.com/1bef6cf8223f3bf287d137f6e6bdceb7";
        const cacheBypassUrl = `${targetUrl}${targetUrl.includes("?") ? "&" : "?"}_=${Date.now()}`;

        const res = await fetch(cacheBypassUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "text/html,application/xhtml+xml",
            },
            cf: {
                cacheTtl: 0,
                cacheEverything: true,
            },
        });


        const html = await res.text();

        // Match all blocks between "====="
        const blockRegex = /=====\n([\s\S]*?)\n=====/g;
        const blocks = [];
        let blockMatch;

        while ((blockMatch = blockRegex.exec(html)) !== null) {
            const content = blockMatch[1];
            const dateMatch = /date:(.*)/.exec(content);
            const tagsMatch = /tags:(.*)/.exec(content);
            const textMatch = /text:(.*(?:\n(?!picture:).*)*)/.exec(content);
            const pictureMatch = /picture:(.*)/.exec(content);

            const rawDate = dateMatch ? dateMatch[1].trim() : null;
            let dateFormatted = rawDate;

            if (rawDate && /^\d{12}$/.test(rawDate)) {
                const y = rawDate.slice(0, 4);
                const m = rawDate.slice(4, 6);
                const d = rawDate.slice(6, 8);
                const h = rawDate.slice(8, 10);
                const min = rawDate.slice(10, 12);
                dateFormatted = `${y}-${m}-${d} ${h}:${min}:00`;
            }

            const text = textMatch ? textMatch[1].trim() : "";
            const picture = pictureMatch ? pictureMatch[1].trim() : "";
            const contentHtml = `${text}${picture ? `<p class=\"vh-img-flex\"><img src=\"${picture}\"></p>` : ""}`;

            blocks.push({
                date: dateFormatted,
                tags: tagsMatch ? tagsMatch[1].split(',').map(tag => tag.trim()).filter(Boolean) : [],
                content: contentHtml,
            });
        }

        return new Response(JSON.stringify(blocks, null, 2), {
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'  // 或者指定具体域名，如 'https://blog.uf4.top'
            },
        });

    },
};



```

