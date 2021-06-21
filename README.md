
# learn-ts-vuepress

<p align="center">
    <a href="https://condorheroblog.github.io/learn-ts-vuepress/" target="_blank"><img alt="GitHub" src="https://img.shields.io/badge/GitHub-learn_ts_vuepress-d05577?style=flat-square&logo=github"></a>
    <br/>
    <a href="https://github.com/vuejs/vuepress" target="_blank"><img alt="VuePress" src="https://img.shields.io/badge/VuePress-build-05a564?style=flat-square&logo=vue.js"></a>
    <a href="./LICENSE"><img alt="LICENSE" src="https://img.shields.io/npm/l/craco-plugin-style-resources-loader"></a>
    <br/>
    <a href="https://condorhero.gitee.io/learn-ts-vuepress/"><img alt="CondorHero site" src="https://img.shields.io/badge/learn_ts_vuepress-pages-a06bc1?style=flat-square&logo=zulip"></a>
</p>

## 项目介绍

基本上都是关于 TS 的知识，偶尔写点别的东西放在上面...

## 开发构建命令

- `npm run docs:dev` 本地构建预览，启动完成打开 http://localhost:8080/learn-ts-vuepress/
- `npm run docs:build` 打包
- `npm run deploy` 部署

```

## 项目目录

```bash
learn-ts-vuepress
├─── docs
│   └── .vuepress       // 配置目录
│   │    ├── public     // 静态资源
│   │    ├── components // 全局组件
│   │    ├── styles     // 全局样式
│   │    ├── config     // 侧边栏等配置文件
│   │    ├── README.md  // gh-pages 分支的 README.md
│   │    └── config.js  // 配置文件
│   ├── README.md   // 网站首页
│   ├── about       // 关于模块
│   ├── advance     // 高级模块
│   ├── framework   // 框架模块
│   ├── front-end   // 前端模块
│   ├── get-started // 入门模块
│   ├── guide       // 引导模块
│   └── translate   // 翻译模块
├─── .gitignore
├─── LICENSE
├─── README.md
├─── deploy.sh
└──  package.json // 项目依赖
```

## 编写 Markdown

参考示例：

```md
---
title: 文章标题
date: 2021-05-01
tags:
    - 标签
categories:
    - 分类
isShowComments: false // 是否开启评论
publish: true // 文章是否发布
author: Condor Hero
---

[[toc]] // 自动生成目录链接

<Clock/> // 这是个全局的组件

::: tip
这是建议
:::

::: warning
这是警告
:::
```