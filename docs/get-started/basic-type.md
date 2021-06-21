---
title: 基本类型
date: 2020-05-20 17:56
author: Condor Hero
---

# 基本类型

## 类型注解

一定要注意 ⚠️：在 TypeScript 中不叫类型声明而叫类型注解

语法为：

> (变量/函数): type

<br />

TypeScript 不仅支持 JavaScript 中所有的数据类型 ，而且还对其进行了扩展。

## 布尔值 boolean

最基本的数据类型就是简单的 true/false 值，在 JavaScript 和 TypeScript 里叫做 `boolean`（其它语言中也一样）。

```ts
let isDone: boolean = false;
```

## 数字 number

和 JavaScript 一样，TypeScript 里的所有数字都是浮点数。 这些浮点数的类型是 number。 除了支持十进制和十六进制字面量，TypeScript 还支持 ECMAScript 2015 中引入的二进制和八进制字面量。

```ts
let decLiteral: number = 20;
let hexLiteral: number = 0x14;
let binaryLiteral: number = 0b10100;
let octalLiteral: number = 0o24;
```

## 大整数 bigint

```ts
const num1: bigint = BigInt(10);
const num2: bigint = 10n;
```

## 字符串 string

JavaScript 程序的另一项基本操作是处理网页或服务器端的文本数据。 像其它语言里一样，我们使用 `string` 表示文本数据类型。 和 JavaScript 一样，可以使用双引号（`"`）或单引号（`'`表示字符串。

```ts
let name: string = "shanshu";
name = 'shanshu';
```

你还可以使用模版字符串，它可以定义多行文本和内嵌表达式。 这种字符串是被反引号包围（ ``` ` ```），并且以 `${ expr }` 这种形式嵌入表达式

```ts
let name: string = `shanshu`;
let age: number = 4;
let sentence: string = `Hello, my name is ${ name }.

I'll be ${ age + 1 } years old next month.`;
```

这与下面定义 `sentence` 的方式效果相同：

```typescript
let sentence: string = 'Hello, my name is ' + name + '.\n\n' +
	'I\'ll be ' + (age + 1) + ' years old next month.';
```

## 数组 Array

TypeScript 像 JavaScript 一样可以操作数组元素。 有两种方式可以定义数组。

第一种，可以在元素类型后面接上 `[]`，表示由此类型元素组成的一个数组：

```ts
let list: number[] = [1, 2, 3];
```

第二种方式是使用数组泛型，`Array<元素类型>`：

```ts
let list: Array<number> = [1, 2, 3];
```

一般情况下，数组的类型尽量要统一，保持**同质**。

## 元组 Tuple

元组是数组的子类型，元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。

比如，你可以定义一对值分别为 `string` 和 `number` 类型的元组。

```ts
let tuple: [string, number] = [ "hello", 10 ]; // OK
tuple = [ 10, "hello" ]; // Error
```

当访问一个已知索引的元素，会得到正确的类型：

```ts
console.log(tuple[0].substr(1)) // OK
console.log(tuple[1].substr(1)) // Error, 'number' 不存在 'substr' 方法
```

我们可以从后面往一个元组添加新的成员，但不允许进行越界访问：

```ts
let tuple: [string, number] = [ "hello", 10 ];
tuple.push(10); // OK
tuple[2]; // 但是依然不允许越界访问
```

元组也支持可选元素，语法就像对象类型中的 `?` 表示可选：

```ts
let optionTuple: [ number, string? ] = [ 1 ];
// 或 let optionTuple: [ number, string? ] = [ 1, "哈哈哈" ];
```

需要注意一点，当声明了可选元素，但是没有初始化，当我们 push 的时候，能 push 的进去元素的类型为元组所有类型的联合类型。

```ts
let optionTuple: [ number, string? ] = [ 1 ];

optionTuple.push(999);
```

元组还支持剩余元素：

```ts
let friends: [ string, ...string[] ] = [ "Shavahn", "CondorHero", "Tail", "Chole", "John" ];

// 元组突破了越界访问
console.log(friends[100]); // undefined
```

元组更加可以预测，比数组更加安全，应该经常使用。

声明只读元组/数组：

```ts
let onlyReadArr1: readonly number[] = [ 1, 2, 3 ];
let onlyReadArr2: ReadonlyArray<number> = [ 1, 2, 3 ];
let onlyReadArr3: Readonly<number[]> = [ 1, 2, 3 ];
```

## 符号 symbol

```ts
let s1: symbol = Symbol();
let s2 = Symbol();
```

symbol 的字面量类型：


```ts
const symbolName = Symbol("shanshu"); // const symbolName: typeof symbolName
```

使用 const（而不是 let 和 var）声明的 symbol， TS 会自动推导为 unique symbol 类型，在代码编辑器中则显示为 typeof yourVariableName，而不是  unique symbol。

我们可以显示注解 const 变量的类型为 unique symbol。

```ts
const symbolName: unique symbol = Symbol("shanshu");
// unique symbol 类型的值始终和自己相等
symbolName === symbolName;
```

unique symbol 常常结合 const 和 readonly 使用。

## null 和 undefined

TypeScript 里，`undefined` 和 `null` 两者各自有自己的类型分别叫做 `undefined` 和 `null`。

```ts
let u: undefined = undefined;
let n: null = null;
```

默认情况下 `null` 和 `undefined` 是所有类型的子类型。 就是说你可以把 `null` 和 `undefined` 赋值给 `number` 类型的变量。

然而，当你指定了 `--strictNullChecks` 标记，`null` 和 `undefined` 只能赋值给 `void` 和它们各自，这能避免 很多常见的问题。 也许在某处你想传入一个 `string` 或 `null` 或 `undefined`，你可以使用联合类型 `string | null | undefined`。 

## any

有时候，我们会想要为那些在编程阶段还不清楚类型的变量指定一个类型。 这些值可能来自于动态的内容，比如来自用户输入或第三方代码库。 这种情况下，我们不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查。 那么我们可以使用 `any` 类型来标记这些变量：

```ts
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // 也可以是个 boolean
```

在对现有代码进行改写的时候，`any` 类型是十分有用的，它允许你在编译时可选择地包含或移除类型检查。并且当你只知道一部分数据的类型时，`any` 类型也是有用的。 比如，你有一个数组，它包含了不同的类型的数据：

```ts
let list: any[] = [1, true, "free"];

list[1] = 100;
```

## unknow

在 TS 中使用 any 类型等于放弃了检查，回到了 JS 时代，有没有什么方法，即能让值为任意类型，又不放弃类型检查呢，没错就是 unknown 类型。

```ts
function f1(a: any) {
	a.b(); // OK
};
function f2(a: unknown) {
	a.b();
	Object is of type 'unknown'.
}
```

被 unknown 标记了，只能简单的使用它的值。

## void

某种程度上来说，`void` 类型像是与 `any` 类型相反，它表示没有任何类型。 当一个函数没有返回值时，你通常会见到其返回值类型是 `void`：

```ts
const warnUser = () => void; 
```

声明一个 `void` 类型的变量没有什么大用，因为你只能为它赋予 `undefined` 和 `null`：

```ts
let unusable: void = undefined
```

## never

`never` 类型表示的是那些永不存在的值的类型。 例如，`never` 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型； 变量也可能是 `never` 类型，当它们被永不为真的类型保护所约束时。

`never` 类型是任何类型的子类型，也可以赋值给任何类型；然而，没有类型是 `never` 的子类型或可以赋值给`never` 类型（除了 `never` 本身之外）。 即使 `any` 也不可以赋值给 `never`。

下面是一些返回 `never` 类型的函数：

```ts
// 返回 never 的函数必须存在无法达到的终点
function error(message: string): never {
	throw new Error(message);
};

// 推断的返回值类型为 never
function fail() {
  return error("Something failed");
}

// 返回 neve r的函数必须存在无法达到的终点
function infiniteLoop(): never {
  while (true) {
  }
}
```

## object

`object` 表示非原始类型，也就是除 `number`，`string`，`boolean`，`symbol`，`null` 或 `undefined` 之外的类型。

使用 `object` 类型，通常作为占位符使用，就可以更好的表示像 `Object.create` 这样的 `API`。例如：

```ts
declare function create(o: object | null): void

create({ prop: 0 }) // OK
create(null) // OK

create(42) // Error
create('string') // Error
create(false) // Error
create(undefined) // Error
```


## 函数 function

这里只是简单做下函数声明，更多玩法参见函数章节：

```ts
let add: (x: number, y: number) => x + y;
```