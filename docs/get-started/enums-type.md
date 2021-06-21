---
title: 枚举
date: 2021-05-21 12:11:41
author: Condor Hero
---

# 枚举

## 为什么需要枚举？

我们先来看段代码：

```ts  
function handleRoles (role) {
    switch (role) {
        case 0:
            // do something
            break;
        case 1:
            // do something
            break;
        case 2:
        case 3:
        case 4:
            // do something
            break;
        default:
            // do something
            break;
    }
};
```

相信你大概能猜到这段代码的意义了，这是根据用户不同的权限，来做不同的事情，现在没有注释，导致代码的可读性非常的差，`1,2,3···` 鬼知道代表什么。

有没有解决办法呢？

- 去改后端逻辑，这个不太可能。
- 用对象来维护一个权限表。

第一个方法可能不太现实，这么看第二个方法很不错，但是在 TypeScript 我们有更好的选择，没错，就是**枚举**。

在编码过程中，为了避免使用硬编码，如果某个常量是可以被一一列举出来的，那么就建议使用枚举类型。

`enum` 类型是对 JavaScript 标准数据类型的一个补充。 像 C# 等其它语言一样，使用枚举类型可以为一组数值赋予友好的名字。

```ts
enum Role { Admin, Manager, Executive, Reporter, Guest, Owner };
// 枚举名称和枚举成员一般为大写的单数形式

function handleRoles (role: Role) {
    switch (role) {
        // 枚举值的访问就像访问对象，通过 . 或 []
        case Role.Admin:
            // do something
            break;
        // ...
    }
};
```

默认情况下，数字枚举从 `0` 开始为元素编号。

## 数字枚举 Numeric enums

我们知道数字枚举从 `0` 开始为元素编号，这个叫数字枚举的自增长属性，有点类似数组的下标了。

除了，让枚举自增长，我们还可以手动的指定成员的数值。 例如，我们将上面的例子改成从 `1` 开始编号：

```ts
enum Week { Monday = 1, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday };
// 如果指定 enum 中第一个值，则会从指定的这个值开始自增长。
let nowWeek: Week = Week.Monday;
```

或者，全部都采用手动赋值：

```ts
enum Week { Monday = 2, Tuesday = 3, Wednesday = 4, Thursday = 5, Friday = 6, Saturday = 7, Sunday = 8 };
let nowWeek: Week = Week.Monday;
```

如果枚举类型遇到了**已经初始化过得值**，会发生什么呢？

```ts
enum Direction { Up , Down , Left = 0 , Right };
// 0 1 0 1
```

这种情况下继续新赋值的下标继续进行增长。

需要注意，一旦某个属性通过函数或者其他方式初始化，只要不是直接赋值常量初始化，比如枚举中其中一个值通过函数执行进行了初始化，这时后面属性必须手动进行初始化。

```ts
function getValue() {
    return 1;
};
// right必须手动进行数字初始化
enum Direction { Up , Down , Left = getValue() , Right = 9};
console.log(Direction["Left"]); // 1
```

你以为枚举只有这点功能吗？

数字枚举，不仅可以通过枚举的名字索引，还可以由枚举的值进行索引得到它的名字。 

例如，我们知道数值为 2，但是不确定它映射到 Color 里的哪个名字，我们可以查找相应的名字：

```ts
enum Color { Red = 1, Green, Blue };
let colorName: string = Color[2];

console.log(colorName)  // 显示 'Green' 因为上面代码里它的值是 2
```

现在我们已经学会声明枚举方法了，就像下面这样：

```ts
/* 数字枚举
enum 枚举名 {
    标识符[=整型常数],
    ...
    标识符[=整型常数]
}
访问 enum 的值，很简单，直接访问即可，像对象一样。
*/
enum Direction { Up , Down , Left , Right };
let left: Direction = Direction.Left;
let up: Direction = Direction[0];
```

我们来看看，数字枚举在 TypeScript 中是如何实现的：

```ts
enum Direction { Up , Down , Left , Right };

// 编译后
"use strict";
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
```

我们看到了一个**反向映射**。

## 字符串枚举 String enums

在一个字符串枚举里，每个成员都必须用字符串进行初始化，字符串枚举没有自增长的行为。

```ts
enum Color {
    Red = "red",
    Blue = "blue",
    Green = "green",
    White = "white",
};

//  编译成 ES5
var Color;
(function (Color) {
    Color["Red"] = "red";
    Color["Blue"] = "blue";
    Color["Green"] = "green";
    Color["White"] = "white";
})(Color || (Color = {}));
```

**观察编译后的代码，发现字符串枚举没有反向映射。**

## 异构枚举（Heterogeneous enums）

异构枚举是数字和字符串的混合，因为数字枚举有自增特性，字符串没有，所以并不建议使用 异构枚举。

```ts
enum Check {
    No = 10,
    Yes = "YES"
}
console.log(Check["Yes"]);
```

## 常量枚举

用 const 变量声明的枚举就是**常量枚举**，常量枚举有个特性就是编译完之后，代码会被移除：

```
const enum Month {
    Jan,
    Feb,
    Mar
}

// 编译之后
"use strict";
// 空
```

很明显移除代码之后，可以减少代码运行的体积。

当我们只需要枚举对象的**值**的时候，我们可以用常量枚举：

```ts
const enum Month {
    Jan,
    Feb,
    Mar
}
let month = [ Month.Jan, Month.Feb, Month.Mar ];
// 编译之后
"use strict";
let month = [0 /* Jan */, 1 /* Feb */, 2 /* Mar */];
```

常量枚举可以自己引用自己，因为常量枚举不能有计算成员。

注意：字符串常量枚举，没有反向映射。

## 枚举成员

枚举成员分为两类：

- 常量成员
- 计算成员

两者区别在于由 TS => JS 的编译过程，成员的值编译阶段确定的还是执行阶段确定的。

```ts
enum Char {
    // const number, 常量成员
    a,
    b = Char.a,
    c = 1 + 4,
    // computed number，计算成员
    d = Math.random(),
    e = "123".length,
}
```

## 枚举成员的值是否可以改变？

枚举成员的值，一旦确定就不可改变，因为枚举成员的值是只读的。

## 枚举类型

枚举和枚举成员都可以单独作为一种类型存在。

我们定义了以下枚举：

```ts
enum ShapeKind {
    Circle,
    Square
}

enum FileAccess {
    None = 1,
    Read = 2,
    Write = 3,
    ReadWrite = 4
}

enum LogLevel {
    ERROR = "ERROR",
    WARN = "WARN",
    INFO = "INFO",
    DEBUG = "DEBUG"
}

enum People {
    height = 170,
    age = 18,
    name = "CondorHero"
}

```

对于没有赋初始值的数字枚举：

无论变量类型是枚举本身还是枚举成员，其值都可以是任意 number。

```ts
let a: ShapeKind = 100;
let b: ShapeKind = 999;
let c: ShapeKind.Circle = 888;
```

对于赋初始值的数字枚举：

无论变量类型是枚举本身还是枚举成员，其值都可以是任意 number。
```ts
let a: FileAccess = 100;
let b: FileAccess = 999;
let c: FileAccess.Read = 888;
```

对于字符串枚举：

- 变量类型是枚举本身，其值只能是枚举成员。
- 变量类型是枚举成员，其值只能是枚举成员本身。

```ts
let a: LogLevel = LogLevel.ERROR;
let b: LogLevel = LogLevel.WARN;
let c: LogLevel.DEBUG = LogLevel.DEBUG;
```

对于异构枚举：

- 变量类型是枚举本身或数字枚举成员，变现为数字枚举特性。
- 变量类型是字符串枚举成员，其值只能是枚举成员本身。

```ts
let ella: People = 999;
let ella: People.height = 100;
let ella: People.name = People.name;
```

### 建议

::: warning
我们看到，数字枚举可以通过值来索引 key ，但是即**容易越界**，而且枚举类型那节，发现数字枚举的枚举类型，可以赋值任意 number，所以枚举非常不安全，非常不建议使用。
:::