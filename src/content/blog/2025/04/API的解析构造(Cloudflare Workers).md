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
-----

tags:我的老姐,老姐

text:太美啦

picture:https://zycs-img-c5u.pages.dev/v2/VfX4e2s.jpeg

-----

-----

tags:老姐

text:

picture:https://zycs-img-c5u.pages.dev/v2/poHm7cC.jpeg

-----

-----

tags:美丽

text:动人

picture:https://zycs-img-c5u.pages.dev/v2/ZrJRWUR.jpeg

-----

-----

tags:学习,作业

text:作业太多了

picture:

-----

```
## 2，请求方式
| 参数名称 | 值                                |
|------|----------------------------------|
| 请求方式 | `GET`                            |
| 请求地址 | `https://api.uf4.top/parse?url=xxx` |
| 请求参数 | `xxx`（你的qq收藏的url，qq收藏不能有标题） |
|示例|`GET https://api.uf4.top/parse?url=xxx`|

在`vhAstro-Theme`中的`Talking.ts`中填入对应的API即可

## 3，返回示例（多条文本）
日期我是随便填的，懒得去手动输入日期
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
    const url = searchParams.get('url');

    if (!url) {
      return new Response(JSON.stringify({ error: 'Missing `url` parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    try {
      const res = await fetch(url);
      const html = await res.text();

      const blocks = extractBlocks(html);
      const data = blocks
      .map((block, index) => formatBlock(block, index))
      .reverse();


      const output = data.length === 1 ? data[0] : data;

      return new Response(JSON.stringify(output, null, 2), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'  // *时通配符，指任意网址，也可以加入特定的网址，跨域访问问题
        }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
    }
  }
};

function extractBlocks(html) {
  const blockRegex = /-----\s*tags:\s*(.*?)\s*text:\s*(.*?)\s*picture:\s*(.*?)\s*-----/gms;
  const matches = [...html.matchAll(blockRegex)];

  return matches.map(m => ({
    tags: m[1].trim().split(',').map(t => t.trim()), 
    text: m[2].trim(),
    picture: m[3].trim()
  }));
}


function formatBlock({ tags, text, picture }, index) {
  const date = generateRandomDate(index);
  let content = text;

  if (picture) {
    content += `<p class="vh-img-flex"><img src="${picture}"></p>`;
  }

  return { date, tags, content };
}


function generateRandomDate(index) {
  const baseDate = new Date();
  const baseTimestamp = baseDate.getTime(); 
  
  const randomOffset = Math.random() * 30 * 24 * 60 * 60 * 1000;
  const finalTimestamp = baseTimestamp - randomOffset - (index * 1000);
  
  return new Date(finalTimestamp)
    .toISOString()
    .replace('T', ' ')
    .slice(0, 19);
}
```

