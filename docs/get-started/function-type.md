---
title: 函数
date: 2021-05-24 17:59:19
lang: en-US
author: Condor Hero
description: 函数的声明方式
tags:
    - 函数
---

## 函数的声明方式

函数类型包含两部分：参数类型和返回值类型，而有时 TypeScript 能够根据返回语句自动推断出返回值类型。

下面是常见四种函数声明方式：

```ts
function func1 (x: number, y: number) {
    return x + y;
}
let func2: (x: number, y: number) => void;
type func3 = (x: number, y: number) => void;

interface func4 {
    (): void;
}
```

## 函数的调用

```ts
function func1 (x: number, y: number) {
    return x + y;
}

let result1 = func1(1);                 // Error, 参数过少
let result2 = func1(1, 2, 3);           // Error, 参数过多
let result3 = func1(1, 2);              // OK
```

调用函数的参数类型和个数必须要和声明函数一一对应。

## 可选参数和默认参数

JavaScript 里，每个参数都是可选的，可传可不传。没传参的时候，它的值默认是 `undefined`。 

在 TypeScript 里我们可以在参数名旁使用 `?` 实现可选参数的功能。

```ts
function sum (x: number, y?: number) {
    return y ? x + y : x;
}

let result1 = sum(1); // 1
let result3 = sum(1, 2); // 1 + 2 = 3
console.log(result1, result3);
```

> 可选参数必须跟在必须参数后面。

在 TypeScript 里，我们也可以为参数提供一个默认值，当用户没有传递这个参数或传递的值是 `undefined` 时。

```ts
function sum (x: number, y = 10) {
    return y ? x + y : x;
}

let result1 = sum(1); // 11
let result3 = sum(1, 2); // 1 + 2 = 3
console.log(result1, result3);
```

注意，如果带默认值的参数出现在必须参数前面，用户必须明确的传入 `undefined` 值来获得默认值。

```ts
function sum (x: number, y = 10, z: number, n = 10) {
    return x + y + z + n;
}

let result = sum(1, undefined, 0); // 21
console.log(result);
```

### 剩余参数

同时操作多个参数，或者你并不知道会有多少参数传递进来，剩余参数会非常有用：

例如：任意个数的数，进行求和。

```ts
function sum (...argv: number[]) {
    return argv.reduce((a, b) => a + b);
}

let result = sum(1, 2, 3);
console.log(result);
```

## 重载

JavaScript 本身是个动态语言。JavaScript 里函数根据传入不同的参数而返回不同类型的数据的场景是很常见的。


```ts
function overload(...rest: number[]): number
function overload(...rest: string[]): string;

// 定义所有声明的实现
function overload(...rest: any[]): any {
    const firstItem = rest[0];
    if (typeof firstItem === "string") {
        return rest.reverse().join("");
    } else if (typeof firstItem === "number") {
        return rest.reduce((pre, cur) => pre + cur);
    }
}

const sum = overload(1, 2);
const res = overload(" World!", "Hello");

console.log(sum, res); // 3,  "Hello World!" 
```

当函数被调用，会去查找重载列表，尝试使用第一个重载定义。 如果匹配的话就使用这个。因此，在定义重载的时候，一定要把最精确的定义放在最前面。