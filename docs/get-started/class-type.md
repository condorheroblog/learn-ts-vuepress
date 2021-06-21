---
title: 类
date: 2021-05-24 10:47:19
author: Condor Hero
---

# 类

对于传统的 JavaScript 程序我们会使用函数和基于原型的继承来创建可重用的组件，从 ECMAScript 2015，也就是 ES6 开始， JavaScript 程序员将能够使用基于类的面向对象的方式。

TypeScript 继承了 ES 的类，并对其进行了扩展。

## 定义一个类

```ts
class Dog {
    // 必选属性
    name: string;
    // 可选属性
    age?: number;
    // 只读属性
    readonly sex: string;
    constructor (name: string, sex: string) { // constructor Dog(name: string): Dog
        this.name = name;
        this.sex = sex;
    }
    run () {}
}
```

观察这个类，我们可知类的参数属性分为三类：

- 必选属性
- 可选属性
- 只读属性

除可选属性外，类的属性一旦定义，必须要初始化或给默认值。

```ts
// 给默认值
class Dog {
    // 必选属性
    name: string = "husky";
    constructor () {}
    run () {}
}

// 初始化

class Dog {
    // 必选属性
    name: string;
    constructor (name: string) {
         this.name = name;
    }
    run () {}
}

// 初始化情况下还有另一种写法使用，构造函数的参数也能添加修饰符 public

class Dog {
    constructor (public name: string) {
         this.name = name;
    }
    run () {}
}
```

## 继承

类有个强大的特点：基于类的程序设计中一种最基本的模式是允许使用继承来扩展现有的类。

```ts
class Animal {
    move(distance: number = 0) {
        console.log(`Animal moved ${distance}m.`);
    }
}

class Dog extends Animal {
    bark() {
        console.log("Woof! Woof!");
    }
}

const dog = new Dog();
dog.bark();
dog.move(10);
```

这个例子展示了最基本的继承：类从基类中继承了属性和方法。 这里，`Dog` 是一个 派生类，它派生自 `Animal` 基类，通过 `extends` 关键字。 派生类通常被称作*子类*，基类通常被称作*超类*。

因为 `Dog` 继承了 `Animal` 的功能，因此我们可以创建一个 `Dog` 的实例，它能够 `bark()` 和 `move()`。

## 修饰符

四种：

- 公开属性 public
- 私有属性 private
- 受保护的属性 protected
- 覆盖属性 override

### public

类的所有属性默认都是 public，当然你也可以明确的将一个成员标记成 `public`，例如。

```ts
class Dog {
    // 必选属性
    public name: string = "husky";
    constructor () {}
    run () {}
}
```

> 可以被实例调用、内部 this 调用、子类继承。

### private

```ts
class Animal {
    private species: string;
    constructor (species: string) {
        this.species = species;
    }
    eat() {
        // 内部访问
        return this.species;
    }
}
class Dog extends Animal {
    constructor (species: string) {
        super(species);
        // 不能访问 this.species  => Property 'species' is private and only accessible within class 'Animal'.(
    }
    bark() {
        console.log("Woof! Woof!");
    }
}
const lower = new Animal("lower");
// 不能实例化读取 console.log(lower.species); // Property 'species' is private and only accessible within class 'Animal' 
lower.eat();
```

> 只能内部 this 调用

如果给 `constructor` 加上私有属性，表示此类不能被实例化，也不能被继承，也就说这个类废了。

### protected

> 内部 this 调用、子类继承

如果给 `constructor` 加上受保护属性，表示此类只能被继承，和抽象类差不多，相当于声明了基类。

### override

::: warning
TypeScript 4.3 新增
:::

我们知道子类可以重写父类的方法，这时候就有个问题，子类本身的方法和重写父类的方法无法一眼就区分出来，新增的 override 就是干这个事的，首先我们需要开启 `--noImplicitOverride`选项，这时重写超类的任何方法将会抛错，除非显式使用关键字 override。

```ts
class Animal {
    sleep () {

    }

    eat () {

    }
}

class Pig extends Animal {
    override sleep() { // yes

    }

    eat () { // no

    }
}
```

## 抽象类

抽象类是对 ES 的扩展，抽象类常作其它派生类的基类使用，抽象类不会直接被实例化。

`abstract` 关键字是用于定义抽象类和在抽象类内部定义抽象方法。

不同于接口，抽象类可以包含成员的实现细节，这样就不用子类实现了。

```ts
abstract class Animal {
    abstract makeSound(): void;
    move(): void {
        console.log("roaming the earth...");
    }
}
```

抽象类中的抽象方法不包含具体实现并且必须在派生类中实现。 抽象方法的语法与接口方法相似。两者都是定义方法签名但不包含方法体。 然而，抽象方法必须包含 `abstract` 关键字并且可以包含访问修饰符。

```ts
abstract class Department {
    name: string

    constructor(name: string) {
        this.name = name
    }

    printName(): void {
        console.log('Department name: ' + this.name)
    }

    abstract printMeeting(): void // 必须在派生类中实现
}

class AccountingDepartment extends Department {
    constructor() {
        super('Accounting and Auditing') // 在派生类的构造函数中必须调用 super()
    }

    printMeeting(): void {
        console.log('The Accounting Department meets each Monday at 10am.')
    }

    generateReports(): void {
        console.log('Generating accounting reports...')
    }
}
let department: Department // 允许创建一个对抽象类型的引用
department = new Department() // 错误: 不能创建一个抽象类的实例
department = new AccountingDepartment() // 允许对一个抽象子类进行实例化和赋值
department.printName()
department.printMeeting()
department.generateReports() // 错误: 方法在声明的抽象类中不存在
```