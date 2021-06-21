---
title: 类型检查机制
date: 2020-05-24 11:40
author: Condor Hero
---

# 类型检查机制

## 什么是类型检查机制？

TypeScript 编译器在做类型检查时，所秉承的一些原则，以及变现出的一些行为，作用是辅助开发者提高开发效率。

## 类型检查机制内容

类型检查机制包括三个部分

- 类型推断
- 类型兼容性
- 类型保护

## 类型推断
 
不指定变量的类型（函数返回值的类型），TypeScript 可以根据某些规则自动为其推断出一个类型。

类型推断包含三个部分：

- 基础类型推断
- 最佳通用型类型推断
- 上下文类型推断

### 基础类型推断

初始化一个变量：

```ts
let a; // let a: any
let a = 10; // let a: number = 10;
let arr = []; // let arr: any[]
let arrNum = [ 1 ]; // let arrNum: number[]
let func = (x = 10) => x + 100; // let func: (x?: number) => number
```

### 最佳通用型类型推断

```ts
let arr = [ 1, "2" ]; // let arr: (string | number)[];
```

### 上下文类型推断

::: warning
TypeScript 版本要求小于等于 3.5.x 才会有上下文类型推断，大于 3 版本，都已经不支持了，官方最新文档没有更新。
:::

上面的类型推断方向都是从又往左的，由值推断出类型。上下文类型推断比较特殊，正好反过来。

```ts
window.onmousedown = function (mouseEvent) { // (parameter) mouseEvent: MouseEvent
    console.log(mouseEvent); //<- OK
};
```

## 类型断言

有时候你会遇到这样的情况，你会比 TypeScript 更了解某个值的详细信息。**通常这会发生在你清楚地知道一个实体具有比它现有类型更确切的类型。**

通过类型断言这种方式可以告诉编译器，“相信我，我知道自己在干什么”。 类型断言好比其它语言里的类型转换，但是不进行特殊的数据检查和解构。 它没有运行时的影响，只是在编译阶段起作用。 TypeScript 会假设你，程序员，已经进行了必须的检查。

类型断言有两种形式。 其一是「尖括号」语法：

```ts
let someValue: any = "this is a string";

let strLength: number = (<string>someValue).length
```

另一个为 `as` 语法：

```ts
let someValue: any = "this is a string";

let strLength: number = (someValue as string).length;
```

两种形式是等价的。 至于使用哪个大多数情况下是凭个人喜好；然而，当你在 TypeScript 里使用 JSX 时，只有 `as` 语法断言是被允许的。


## 类型兼容性

当一个类型 Y 可以赋值给另一个类型 X 时， 我们就可以说类型 X 兼容类型 Y。

> X 兼容 Y：X(目标类型) => Y(源类型)

类型兼容性会出现在哪呢？广泛存在于 TS 中，但常出现在接口、类、函数中。

### 接口兼容

```ts
interface X {
    a: any;
    b: any;
}
interface Y {
    a: any;
    b: any;
    c: any;
}
let x:X = { a: 1, b: 2 };
let y:Y = { a: 1, b: 2, c: 3 };
```

问题来了， x 和 y 是否可以相互赋值？

```ts
x = y; // yes
y = x; // no
```

根据代码执行的结果我们知道，X 类型 兼容 Y 类型，即**成员少的可以兼容成员多的**。

### 函数兼容

函数兼容就是函数之前是否可以相互赋值，常出现在高阶函数中。

```ts
type Handler = (x: number, y: number) => void;
function hoc (handler: Handler) {
    return handler;
}
hoc(() => {}); // ?
```
函数的兼容比较复杂，分为下面几种情况：

- 参数的个数
- 参数的类型
- 返回值类型 

#### 函数参数个数

参数个数：多的可以兼容少的。

##### 只有固定参数情况下

目标函数的固定参数个数一定是大于等于待传参数的：

```ts
hoc(() => {}); // yes
hoc((x: number, y: number) => {}); //yes
hoc((x: number, y: number, z: number ) => {}); // no
```
#### 固定参数、可选参数和剩余参数

```ts
let a = (p1: number, p2: number) => {};
let b = (p1?: number, p2?: number) => {};
let c = (...rest: number[]) => {};
```

- 固定参数可以兼容可选和剩余参数的。

```ts
a = b; // yes
a = c; // yes
```

- 可选参数不兼容固定和剩余参数的。

```ts
b = a; // no
b = c; // no
```

不过你可以通过 `tsconfig.json` 中的 `"strictFunctionTypes": false,` 来让 b 兼容 a 和 c。

- 剩余参数可以兼容可选和固定参数的。

```ts
c = a; // yes
c = b; // yes
```

#### 函数参数的类型

```ts
interface PeopleOne {
    name: string;
}
interface PeopleTwo {
    name: string;
    age: number;
}

let xiaoming = (ins: PeopleOne) => {};
let honghong = (ins: PeopleTwo) => {};
```

把接口的个数看成，函数的参数，就变成了参数多的兼容参数少的。

```ts
honghong = xiaoming; // yes
xiaoming = honghong; // no
```

函数参数的之间可以相互赋值，叫函数参数的** **。避免了函数的断言。

#### 函数返回值类型

```ts
let f = () => ({ name: "shanshu" });
let g = () => ({ name: "shanshu", age: 90 });
``` 
函数返回值类型遵循**少兼容多** 和鸭式辨型法。

```ts
f = g; // yes
g = f; // no
```

#### 函数的重载

为了便于理解，可以认为**重载列表**是**目标函数**，函数的实现是**源函数**。

```ts
function overload (x: number, y: number): number;
function overload (x: string, y: string): string;

function overload (x: any, y: any): any {}
```

注意两点，函数的实现，参数个数不能超过目标函数，且返回值正确。

### 枚举类型的兼容

数字枚举和数字类型互相兼容：

```ts
enum Month {
    Jan,
    Feb,
    Mar
}

let num0: number = Month.Jan;
let num1: Month.Jan = 19;
let no: Month.Jan = Month.Feb; // 枚举之间不兼容
```

### 类类型的兼容

静态成员和构造函数不参与比较。

```ts

class A {
    id = 10;
    constructor(x: number, y: number) {}
    static a = 10;
}

class B {
    id = 10;
    age = 90;
    constructor(x: number) {}
    static b = 90;
}

let a = new A(1, 2);
let b = new B(1);
a = b; // yes
b = a; // No
```

和接口差不多，**少兼容多。**注意，如果有私有（private|protected）属性，只有父类和子类相互兼容。

```ts
class A {
    id = 10;
    constructor(x: number, y: number) {}
    static a = 10;
    protected abc = 10;
}
class C extends A {};
let a = new A(1, 2);
let c = new C(2, 5);
c = a;
a = c;
```

### 泛型兼容

#### 泛型接口

在两个泛型参数类型不相同时，只有在泛型参数使用时才出现兼容性。

```ts
interface Empty<T> {}
let obj1: Empty<number> = {};
let obj2: Empty<string> = {};
obj1 = obj2; // yes
obj2 = obj1; // yes

interface Empty<T> {
    value: T;
}

obj1 = obj2; // no
obj2 = obj1; // no
```

#### 泛型函数

泛型函数的**定义**是可以相同的。

```ts
function log1<T> (x: T): T {
  return x;
};

function log2<U> (y: U): U {
  return y;
};

log1 = log2
```


## 总结

结构之间兼容：成员少兼容成员多。<br />
函数之间兼容：参数多兼容参数少。