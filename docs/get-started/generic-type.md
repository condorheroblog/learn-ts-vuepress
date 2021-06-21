---
title: 泛型
date: 2021-05-25 12:13:45
author: Condor Hero
---

# 泛型

泛型的英译`Generics [dʒɪˈnɛrɪks] 泛型、通用类型；`。

通用类型这四个字就是泛型的真谛。很多人把泛型比作组件，这是很恰当的，组件最大的优点就是可以复用，泛型可以应用在函数、类、接口上，可以像组件一样提高它们的复用性。

具体能解决的一个大问题就是**类型输入等于类型输出**。

例如一个函数或一个类的方法或一个函数接口：我们想要传入参数类型和返回结果类型一致。

这里以函数作为演示，我们可能会想到使用函数重载或联合类型：

```ts

function returnSameType (val: number): number;
function returnSameType (val: string): string;
function returnSameType (val: any): any {
    // ...实现
};

type sameType = number | string;
function returnSameType (val: sameType): sameType { return val };
// 当类型过多可能我们就会直接使用 any 了

function returnSameType (val: any): any { return val };;
```

可以看到目前终极解决方案是使用 any，但是这就丧失了类型检查，所以泛型才是唯一的解决之道。

```ts
function returnSameType<T> (val: T): T {
    return val;
};
```

从这我们也可以得到泛型的定义：不预先确定数据的类型，具体的类型在使用的时候确定。

## 泛型的分类

泛型可分为四大类：

- 泛型函数
- 泛型类
- 泛型接口
- 泛型类型别名

## 泛型函数

我们以开头 returnSameType 函数举例：

```ts
function returnSameType<T>(val:T ): T {
    return val;
}
console.log(returnSameType<number>(1));
console.log(returnSameType("2"));
```

**这里，我们使用了 类型变量/泛型变量，它是一种特殊的变量，只用于表示类型而不是值。**

我们给 returnSameType 添加了类型变量  T（只要是大写的字母就行）。 T 帮助我们捕获用户传入的类型（比如：number），之后我们就可以使用这个类型。 之后我们再次使用了 T当做返回值类型。现在我们可以知道参数类型与返回值类型是相同的了。

**这允许我们跟踪函数里使用的类型的信息。**这就是泛型函数。

我们有两种使用办法：

1. 传入所有的参数，包含类型参数，使用尖括号。

```ts
returnSameType<number>(1);
```

2. 用类型推论，编译器会根据传入的参数自动地帮助我们确定 T 的类型（推荐）

```ts
returnSameType("2");
```

这时得介绍**泛型变量：**

依然是上面这个函数，现在我们要出入字符串并需要在函数体里面打印出字符串的长度，改写为：

```ts
function returnSameType<T>(val:T):T {
    console.log(val.length);
    return val;
}
console.log(returnSameType("9876543"));
```

程序这时提示错误：

```ts
Property 'length' does not exist on type 'T'
```

使用泛型创建像 returnSameType 这样的泛型函数时，编译器要求你在函数体必须正确的使用这个通用的类型。 换句话说，你必须把这些参数当做是任意类型（或所有类型）。上面我们程序员只考虑了，字符串这一种类型，但是编辑器会帮我们考虑所有的类型，数字类型 number 就在里面，而 number 是没有 length 的，所以会报错。

现在假设我们想操作 T 类型的数组而不直接是 T。由于我们操作的是数组，所以 .length 属性是应该存在的。

```ts
function returnSameType<T>(params: T[]): T[]{
    console.log(params.length);
    return params;
}
returnSameType([1 ,2, "3"]);
```

这时就没有错了，你可以认为这种写法就表示参数为数组的形式，T 后面不加方括号表示任意类型。那么如何理解这个数组式的写法，你现在就可以认为函数接受元素类型是 T 的数组，并返回元素类型是 T 的数组。这个数组式泛型还有一种写法：

```ts
function returnSameType<T>(params: Array<T>): Array<T>{
    console.log(params.length);
    return params;
}
returnSameType([1, 2, "3"]);
```

使用泛型还可以定义一个泛型函数类型：

```ts
type sameType = <T>(val: T) => T;
let log: sameType = function returnSameType<T>(params: Array<T>): Array<T>{
    console.log(params.length);
    return params;
}
returnSameType([1, 2, "3"]);
```

## 泛型类

类中，静态属性不能使用泛型： 

```ts
class People<T>{
    public name: T;
    constructor(name: T){
        this.name = name;
    }
};
let CH = new People("Condor Hero");
// let CH = new People<string>("Condor Hero");
console.log(CH.name);
```

## 泛型接口

泛型接口分为两种。

1. 通用型泛型接口
```ts
interface Animal<T>{
    name: T;
};
let dog: Animal<string> = { name: "旺财" };
```

2. 函数泛型接口

```ts
// 1
interface Animal {
    <T>(name: T): T
};

// 2
type Animal = {
    <T>(name: T): T
};

// 3
type Animal = <T>(name: T): T;

// 1、2、3 等同

let dog: Animal = function<T>(name: T): T {
    return name;
}
console.log(dog("旺财"));
```
## 泛型类型别名（Generic type aliases）

TypeScript 1.6 新增功能，看下官网例子：

```ts
type Lazy<T> = T | (() => T);

var s: Lazy<string>;
s = "eager";
s = () => "lazy";

interface Tuple<A, B> {
    a: A;
    b: B;
}
type Pair<T> = Tuple<T, T>;
```

## 泛型约束

泛型变量 T 其实一直是被约束的，只不过这里使用继承来实现的约束。

```ts
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}
```

现在这个泛型函数被定义了约束，因此它不再是适用于任意类型：

```ts
loggingIdentity(3);  // Error, number doesn't have a .length property
```

我们需要传入符合约束类型的值，必须包含必须的 length 属性：

```ts
loggingIdentity([ 1 ]);
loggingIdentity("qwert");
loggingIdentity({ length: 10, value: 3 });
```

数组、字符串和自定义的对象都有 length ，都可以传入。