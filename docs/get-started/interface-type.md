---
title: 接口
date: 2021-05-23 15:11:42
author: Condor Hero
---

## 接口的作用

接口是用来约束函数、类、和对象的结构和类型。

老版的 TypeScript 文档是这样对 interface 进行定义的，不知道你能不能看懂，我当时看是挺蒙的：
::: tip
One of TypeScript’s core principles is that type checking focuses on the shape that values have. This is sometimes called “duck typing” or “structural subtyping”.
<br />
<br />
TypeScript 的核心原则之一是对值所具有的结构进行类型检查。它有时被称做“鸭式辨型法”或“结构性子类型化”。 
:::

## 接口的分类

1. 对象类型接口
2. 函数类型接口
3. 类类型接口

## 对象类型接口

下面通过一个简单示例来观察接口是如何工作的，下面是个函数，我们需要约束传入的参数：

```ts
function greet(person: { name: string; age: number }) {
    return "Hello " + person.age;
}
```

现在使用的是对象字面量来约束的，为了方便我们想把，类型注解提出来，我们有两个选择：

- 类型别名
- 对象类型接口

```ts
interface Person {
    name: string;
    age: number;
}
// or
type Person = {
    name: string;
    age: number;
};

function greet(person: Person) {
    return "Hello " + person.age;
}
```

::: tip
这里说明下 interface 和 type 的简单区别？
<br />
<br />
type 和 interface 多数情况下有相同的功能，都是定义类型。<br />
但有一些小区别：
type：不是创建新的类型，只是为一个给定的类型起一个名字。type 常常配合联合、交叉类型使用，因为引用起来更简洁。
interface：创建新的类型，接口之间还可以继承、声明合并。
:::

接下来我们来调用下函数：

```ts
interface Person {
    name: string;
    age: number;
}
function greet(person: Person) {
    // ... do something
}
const xiaoming = { name: "xiaoming", age: 10, height: 100 };
greet(xiaoming);
```

类型检查器会查看 `greet` 的调用。`greet` 函数要求传入一个对象，且必须要有 name 和 age 字段，事实上我们还多传入了 height 字段，依然顺利通过了检查，这就是开头提的**鸭式辨型法**。

来看下，改下函数调用的方式，采用字面量方式传参，你会发现报错了：

```ts
interface Person {
    name: string;
    age: number;
}
function greet(person: Person) {
    // ... do something
}
greet({ name: "xiaoming", age: 10, height: 100 });
// Argument of type '{ name: string; age: number; height: number; }' is not assignable to parameter of type 'Person'.
```

采用字面量的方式，**TS 会对额外字段进行类型检查(或额外的属性检查)**，所以报错，怎么绕过呢？方法有三种：

1. 变量接收字面量
2. 类型断言
3. 字符串索引签名

现在 Person 接口里面的属性有两个表现特性：

- 属性的值可以更改——可写属性。
- 属性都是必传的。

如果有的字段可能有可能没有，怎么办？ 可选属性。
如果不允许属性的值可以更改，怎么办？ 只读属性。

## 可选属性

接口里的属性不全都是必需的，有些是只在某些条件下存在，或者根本不存在，所以需要可选属性。带有可选属性的接口与普通的接口定义差不多，只是在可选属性名字定义的后面加一个 `?` 符号。

```ts
interface Person {
    name: string;
    age: number;
    height?: number;
}
function greet(person: Person) {
    // ... do something
}
greet({ name: "xiaoming", age: 10, height: 100 });
greet({ name: "xiaohong", age: 10 });
```

## 只读属性

一些对象属性只能在对象刚刚创建的时候修改其值。 你可以在属性名前用 `readonly` 来指定只读属性:

```ts
interface Person {
    readonly name: string;
    age: number;
    height?: number;
}
```

你可以通过赋值一个对象字面量来构造一个变量。 赋值后，`name` 再也不能被改变了。

```ts
interface Person {
    readonly name: string;
    age: number;
    height?: number;
}
let xiaoming: Person = { name: "xiaoming", age: 10 };
xiaoming.age = 20 // success!
xiaoming.name = "xiaoming" // error!
```

TypeScript 还有 `ReadonlyArray<T>` 类型，它与 `Array<T>` 相似，只是把所有可变方法去掉了，因此可以确保数组创建后再也不能被修改：

```ts
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; // error!
ro.push(5); // error!
ro.length = 100; // error!
a = ro; // error!
```

上面代码的最后一行，可以看到就算把整个 `ReadonlyArray` 赋值到一个普通数组也是不可以的。 但是你可以用类型断言重写：

```ts
a = ro as number[]
```

### readonly vs const

最简单判断该用 `readonly` 还是 `const` 的方法是看要把它做为变量使用还是做为一个属性。 做为变量使用的话用 `const`，若做为属性则使用 `readonly`。


## 可索引类型的接口

有时您并不提前知道接口的所有属性，但您知道值的形状。比如一个学生全部学科的分数，我们知道分数的值是 number，但不知道到底有多少科。

这时我们可以通过 **索引签名（ index signature）** 去描述可能值的类型。

TypeScript 支持两种索引签名：字符串和数字，所以索引分为两种：

- 字符串索引基本等于对象。
- 数字索引基本等于数组。

```ts
interface StringArray {
    [index: number]: string;
}

let myArray: StringArray = ["Bob", "Fred"];

let myStr: string = myArray[0];
```

上面例子里，我们定义了 `StringArray` 接口，它具有索引签名。 这个索引签名表示了当用 `number` 去索引 `StringArray` 时会得到 `string` 类型的返回值。

字符串和数字索引可以同时使用，但是数字索引的返回值必须是字符串索引返回值类型的子类型。 这是因为当使用 `number` 来索引时，JavaScript 会将它转换成`string` 然后再去索引对象。 也就是说用 `100`（一个 `number`）去索引等同于使用`'100'`（一个 `string` ）去索引，因此两者需要保持一致。


字符串索引签名能够很好的描述 `dictionary` 模式，并且它们也会确保所有属性与其返回值类型相匹配。 因为字符串索引声明了 `obj.property` 和 `obj['property']` 两种形式都可以。 下面的例子里， `name` 的类型与字符串索引类型不匹配，所以类型检查器给出一个错误提示：

```typescript
interface NumberDictionary {
    [index: string]: number;
    length: number;    // 可以，length是number类型
    name: string;       // 错误，`name`的类型与索引类型返回值的类型不匹配
}
```

最后，你可以将索引签名设置为只读，这样就防止了给**索引赋值**：

```typescript
interface ReadonlyStringArray {
    readonly [index: number]: string;
}
let myArray: ReadonlyStringArray = ["Alice", "Bob"];
myArray[2] = "Mallory"; // error!
```

## 函数接口

接口能够描述 JavaScript 中对象拥有的各种各样的外形。 除了描述带有属性的普通对象外，接口也可以描述函数类型。

为了使用接口表示函数类型，我们需要给接口定义一个调用签名。它就像是一个只有参数列表和返回值类型的函数定义。参数列表里的每个参数都需要名字和类型。

```ts
interface SearchFunc {
    (source: string, subString: string): boolean;
}
```

这样定义后，我们可以像使用其它接口一样使用这个函数类型的接口。 下例展示了如何创建一个函数类型的变量，并将一个同类型的函数赋值给这个变量。

```ts
let mySearch: SearchFunc = function(source: string, subString: string): boolean {
    let result = source.search(subString);
    return result > -1;
}
```

对于函数类型的类型检查来说，函数的参数名不需要与接口里定义的名字相匹配。 比如，我们使用下面的代码重写上面的例子：

```ts
let mySearch: SearchFunc = function(src: string, sub: string): boolean {
    let result = src.search(sub);
    return result > -1;
}
```

函数的参数会逐个进行检查，要求对应位置上的参数类型是兼容的。如果你不想指定类型，TypeScript 的类型系统会推断出参数类型，因为函数直接赋值给了  `SearchFunc` 类型变量。 函数的返回值类型是通过其返回值推断出来的（此例是 `false` 和 `true`）。 如果让这个函数返回数字或字符串，类型检查器会警告我们函数的返回值类型与 `SearchFunc` 接口中的定义不匹配。

```ts
let mySearch: SearchFunc = function(src, sub) {
    let result = src.search(sub)
    return result > -1;
}
```

混合类型接口，必须要使用断言：

```ts
interface Lib {
    (): vold;
    version: number;
}

let lodash: Lib = (() => {}) as Lib;
lodash.version = 10;
```
## 类类型接口

### 实现接口

与 C# 或 Java 里接口的基本作用一样，TypeScript 也能够用它来明确的强制一个类去符合某种契约。

```typescript
interface ClockInterface {
  currentTime: Date
}

class Clock implements ClockInterface {
  currentTime: Date
  constructor(h: number, m: number) { }
}
```

你也可以在接口中描述一个方法，在类里实现它，如同下面的 `setTime` 方法一样：

```typescript
interface ClockInterface {
  currentTime: Date
  setTime(d: Date)
}

class Clock implements ClockInterface {
  currentTime: Date
  setTime(d: Date) {
    this.currentTime = d
  }
  constructor(h: number, m: number) { }
}
```

接口描述了类的公共部分，而不是公共和私有两部分。 它不会帮你检查类是否具有某些私有成员。

### 类静态部分与实例部分的区别

当你操作类和接口的时候，你要知道类是具有两个类型的：静态部分的类型和实例的类型。 你会注意到，当你用构造器签名去定义一个接口并试图定义一个类去实现这个接口时会得到一个错误：

```typescript
interface ClockConstructor {
  new (hour: number, minute: number)
}

// error
class Clock implements ClockConstructor {
  currentTime: Date
  constructor(h: number, m: number) { }
}
```

这里因为当一个类实现了一个接口时，只对其实例部分进行类型检查。`constructor` 存在于类的静态部分，所以不在检查的范围内。

看下面的例子，我们定义了两个接口，  `ClockConstructor` 为构造函数所用和 `ClockInterface` 为实例方法所用。 为了方便我们定义一个构造函数 `createClock`，它用传入的类型创建实例。

```typescript
interface ClockConstructor {
  new (hour: number, minute: number): ClockInterface
}
interface ClockInterface {
  tick()
}

function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
  return new ctor(hour, minute)
}

class DigitalClock implements ClockInterface {
  constructor(h: number, m: number) { }
  tick() {
    console.log('beep beep')
  }
}
class AnalogClock implements ClockInterface {
  constructor(h: number, m: number) { }
  tick() {
    console.log('tick tock')
  }
}

let digital = createClock(DigitalClock, 12, 17)
let analog = createClock(AnalogClock, 7, 32)
```

因为 `createClock` 的第一个参数是 `ClockConstructor` 类型，在 `createClock(AnalogClock, 7, 32)` 里，会检查 `AnalogClock` 是否符合构造函数签名。


## 继承接口

和类一样，接口也可以相互继承。 这让我们能够从一个接口里复制成员到另一个接口里，可以更灵活地将接口分割到可重用的模块里。

```typescript
interface Shape {
  color: string
}

interface Square extends Shape {
  sideLength: number
}

let square = {} as Square
square.color = 'blue'
square.sideLength = 10
```

一个接口可以继承多个接口，创建出多个接口的合成接口。

```typescript
interface Shape {
  color: string
}

interface PenStroke {
  penWidth: number
}

interface Square extends Shape, PenStroke {
  sideLength: number
}

let square = {} as Square
square.color = 'blue'
square.sideLength = 10
square.penWidth = 5.0
```

## 混合类型

先前我们提过，接口能够描述 JavaScript 里丰富的类型。 因为 JavaScript 其动态灵活的特点，有时你会希望一个对象可以同时具有上面提到的多种类型。

一个例子就是，一个对象可以同时做为函数和对象使用，并带有额外的属性。

```typescript
interface Counter {
  (start: number): string
  interval: number
  reset(): void
}

function getCounter(): Counter {
  let counter = (function (start: number) { }) as Counter
  counter.interval = 123
  counter.reset = function () { }
  return counter
}

let c = getCounter()
c(10)
c.reset()
c.interval = 5.0
```

在使用 JavaScript 第三方库的时候，你可能需要像上面那样去完整地定义类型。这门课要重构的 `axios` 库就是一个很好的例子。

## 接口继承类

当接口继承了一个类类型时，它会继承类的成员但不包括其实现。 就好像接口声明了所有类中存在的成员，但并没有提供具体实现一样。 接口同样会继承到类的 `private` 和 `protected` 成员。 这意味着当你创建了一个接口继承了一个拥有私有或受保护的成员的类时，这个接口类型只能被这个类或其子类所实现（implement）。

当你有一个庞大的继承结构时这很有用，但要指出的是你的代码只在子类拥有特定属性时起作用。 这个子类除了继承至基类外与基类没有任何关系。例：

```typescript
class Control {
  private state: any
}

interface SelectableControl extends Control {
  select(): void
}

class Button extends Control implements SelectableControl {
  select() { }
}

class TextBox extends Control {
  select() { }
}

// Error：“ImageC”类型缺少“state”属性。
class ImageC implements SelectableControl {
  select() { }
}
```
在上面的例子里，`SelectableControl` 包含了 `Control` 的所有成员，包括私有成员 `state`。 因为 `state` 是私有成员，所以只能够是 `Control` 的子类们才能实现 `SelectableControl` 接口。 因为只有 `Control` 的子类才能够拥有一个声明于`Control` 的私有成员 `state`，这对私有成员的兼容性是必需的。

在 `Control` 类内部，是允许通过 `SelectableControl` 的实例来访问私有成员 `state` 的。 实际上，`SelectableControl` 接口和拥有 `select` 方法的 `Control` 类是一样的。`Button`和 `TextBox` 类是 `SelectableControl` 的子类（因为它们都继承自`Control` 并有 `select` 方法），但 `ImageC` 类并不是这样的。
