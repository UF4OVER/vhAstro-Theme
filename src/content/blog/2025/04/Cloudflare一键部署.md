---
title: "Cloudflare一键部署主题"
categories: Cloudflare
tags:
  - Cloudflare一键部署
id: "Cloudflare一键部署"
date: 2025-04-06 17:38:32
cover: "https://zycs-img-c5u.pages.dev/v2/dLYz6AS.png"
---

:::note
此博客由Cloudflare免费部署
:::

## 目录
- [工作原理](#工作原理)
- [部署流程](#部署流程)
    - [1. 克隆仓库](#1-克隆仓库)
    - [2. 推送至GitHub](#2-推送至github)
    - [3. Cloudflare配置](#3-cloudflare配置)
    - [4. 依赖冲突解决方案](#4-依赖冲突解决方案)
- [自定义域名](#自定义域名)
- [部署验证](#部署验证)


## 部署流程

### 1. 克隆仓库
```bash
git clone https://github.com/uxiaohan/vhAstro-Theme.git 
cd vhAstro-Theme
```

> **配置说明**  
> 修改前请参考：[vhAstro主题配置文档](https://www.vvhan.com/article/astro-theme-vhastro-theme)  
> 暂不执行 `npm install`

### 2. 推送至GitHub
将配置好的项目推送到您的GitHub仓库

### 3. Cloudflare配置
1. 访问 [Cloudflare控制台](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** → **创建应用程序** → **Pages**
3. 连接Git仓库并授权访问

**环境变量设置**  

| 键              | 值          |
|-----------------|------------|
| `NODE_VERSION`  | `18.19.0`  |

**构建命令配置**
```bash
npm install --force && npm run build

```
:::picture
![配置示意图](https://zycs-img-c5u.pages.dev/v2/yHa2Xjy.png)
![构建界面](https://zycs-img-c5u.pages.dev/v2/DYApz5Q.png)
:::
### 4. 依赖冲突解决方案

**常见错误**
```log
log npm ERR! Invalid: lock file's yaml@1.10.2 does not satisfy yaml@2.7.1
```

**解决方案**
1. 修改 `package.json`：

```json

{ "overrides": 
    { 
      "yaml": "2.7.1", 
      "cosmiconfig": 
          { 
            "yaml": "2.7.1"
          },
          "cssnano": 
          { 
            "yaml": "2.7.1"
          }, 
          "postcss-load-config": 
          { 
            "yaml": "2.7.1"
          }
    }
}
```
2. 创建 `.npmrc` 文件：
```ini
shamefully-hoist=true
save-exact=true
```
3. 重建依赖：

```bash
rm -rf node_modules package-lock.json npm install --force
# 只要删除 node_modules package-lock.json 再次执行 npm install --force 即可
```
**验证命令**
```bash
npm ls yaml --all
```
应输出 → yaml@2.7.1

---

完成之后push 到GitHub仓库
cloudflare 会自己构建你的新提交，最后默认会生成一个 `*.pages.dev` 域名，可以访问此域名查看效果

## 自定义域名
1. 进入 Pages 项目设置
2. 选择 **自定义域**
3. 输入已备案（不备案也ok）的域名并按指引配置DNS

---

## 部署验证
完成部署后，可通过以下方式验证：

✅ Cloudflare 控制台显示构建成功状态  
✅ 访问自动生成的 `*.pages.dev` 域名  
✅ 检查控制台无报错信息

[返回目录](#目录)


