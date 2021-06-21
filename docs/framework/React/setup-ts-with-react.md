---
title: "搭建开发环境"
date: 2021-05-18
tags:
- React
- TypeScript
categories:
- 实践
isShowComments: false
---

# 环境搭建

## 在线环境

如果你需要一个在线 React + TS 可以选择：

- [TypeScript Playground](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAKjgQwM5wEoFNkGN4BmUEIcA5FDvmQNwCwAUKJLHAN5wCuqWAyjMhhYANFx4BRAgSz44AXzhES5Snhi1GjLAA8W8XBAB2qeAGEInQ0KjjtycABsscALxwAFAEpXAPnaM4OANjeABtA0sYUR4Yc0iAXVcxPgEhdwAGT3oGAOTJaXx3L19-BkDAgBMIXE4QLCsAOhhgGCckgAMATQsgh2BcAGssCrgAEjYIqwVmutR27MC5LM0yuEoYTihDD1zAgB4K4AA3H13yvbAfbs5e-qGRiYspuBmsVD2Aekuz-YAjThgMCMcCMpj6gxcbGKLj8MTiVnck3gAGo4ABGTxyU6rcrlMF3OB1H5wT7-QFGbG4z6HE65ZYMOSMIA)

- [CodeSandbox](https://codesandbox.io/s/react-ts?utm_source=dotnew)

## 本地环境

本地搭建环境搭建：

* [Vite](https://twitter.com/swyx/status/1282727239230996480?lang=en): `npm init vite-app my-react-project --template react-ts`（推荐）

* [Create React App](https://facebook.github.io/create-react-app/docs/adding-typescript): `npx create-react-app name-of-app --template typescript`

## 文件扩展名

在 React 的 JS 项目中，你可以只有一种文件扩展名即 `.js` 文件。

但是在  React 的 TS 项目中，必须有两种扩展名的文件，即默认的 `.ts` 文件，和书写 JSX 语法的 `.tsx` 文件。

## 引入 React 的最佳方式

```ts
import * as React from "react";

import * as ReactDOM from "react-dom";
```
这种引用方式被”证明“是最可靠的一种方式，推荐使用。

我认为没啥区别，讨论请看 [import_react_from_react_will_go_away_in_distant](https://www.reddit.com/r/reactjs/comments/iyehol/import_react_from_react_will_go_away_in_distant/)：

如果你想通过默认暴露的方式引入：

```ts
import React from "react";
import ReactDOM from "react-dom";
```

需要在 `tsconfig.json` 添加额外的配置：`"allowSyntheticDefaultImports": true`。