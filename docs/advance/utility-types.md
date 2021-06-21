---
title: TS 中的工具类型
date: 2021-06-02 01:25:39
---

# TS 中的工具类型

![Shavahn is a dickhead.png](https://upload-images.jianshu.io/upload_images/16069544-f779d61e94c89bd6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

我们知道在 TypeScript 中**一切皆是类型**，而 TypeScript 除了能够创建新类型之外，它还提供了一些工具类型实现转换现有类型的能力，这些工具类型是 TypeScript 内置的，同时它们全局可用。


### Partial<Type>

Partial 会创建一个新的类型同时它内部所有属性都变成可选的。

```ts
type Type = { x: string, y: string };

// { x?: string; y?: string }
type PartialType = Partial<Type>;
```
Partial 最常使用的地方是让一个对象的所有属性都变的可选，比如下面这个例子，我们去更新用户的某些信息：

```ts
interface User {
  name: string;
  surname: string;
  age: number;
}

const updateUser = (user: User, fields: Partial<User>): User => ({
  ...user,
  ...fields,
});

const user1: User = {
  name: "John",
  surname: "Doe",
  age: 17,
};

const user2 = updateUser(user1, { age: 18 });

// { name: "John", surname: "Doe", age: 18 }
console.log(user2);

```

我们看到 Partial 工具类型非常的好用，简单方便，我们很有必要研究下它的源码，这样当官方提供的工具类型不满足我们的需求的时候，我们还可以定制化，虽然很少遇到。

Partial 工具类型源码：

```ts
type Partial<T> = {
    [P in keyof T]-?: T[P];
};
```
我们看到，Partial 本质是一个——**泛型类型别名**，里面还用到了**索引类型**和**映射类型**。

如果你很熟悉 TS 语法，完整的 Partial 写法应该是这样的：

```ts
type Partial<T> = {
    [P in keyof T]+?: T[P]; // 多个加号
};
```

## Required<Type>

Required 是 Partial 的反面，Required 创造一个新类型，同时内部所有的属性都是必须的。

```ts
type Type = { x?: string, y?: string };

// { x: string; y: string }
type RequiredType = Required<Type>;
```

使用事例例如：

```ts
interface User {
  name?: string;
  surname?: string;
  age?: number;
}

class UserManager {
  private user: Required<User>;

  constructor(user: User) {
    this.user = {
      name: user.name || "Not Set",
      surname: user.surname || "Not Set",
      age: user.age || 0,
    };
  }

  getUser() {
    return this.user;
  }
}
```

Partial 工具类型的完整源码我们已经知道了，现在 Required 的源码相信你自己也能实现，很简单，我们只需要改下类型别名同时把加号换成减号就行了：

```ts
type Required<T> = {
    [P in keyof T]-?: T[P];
};
```

## Readonly<Type>

Readonly<T> 创建一个新类型，同时所有属性都变为只读属性，这也就意味着这些属性不能被重新赋值。

```ts
type Type = { x: string, y: string };

// { readonly x: string; readonly y: string }
type ReadonlyType = Readonly<Type>;
```

当我们使用 Object.freeze 的时候，Readonly 是非常的好用的：

```ts
interface User {
  name: string;
  surname: string;
  age: number;
}

const user: User = {
  name: "John",
  surname: "Doe",
  age: 18,
};

function freeze<T>(obj: T): Readonly<T> {
  return Object.freeze(obj);
}

const readonlyUser = freeze(user);

// Cannot assign to "name" because it is a read-only property
readonlyUser.name = "Andrew";
```

这时，我们会很自然的写出 Readonly 的源码，如下：

```ts
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};
```
上面这个代码并不完整，我简单提醒下你，你就能想出来它的完整代码了，想一下如何去除有 readonly 属性的工具函数。完整版 Readonly 是不是已经出现在你的脑海里了，没错只是简单的在 readonly 前面加个加号：

```ts
type Readonly<T> = {
    +readonly [P in keyof T]: T[P];
};
```

TypeScript 没有给出去除 Readonly 修饰符工具函数此时我们就可以自己来实现了，我们把这个工具类型叫 NonReadonly。

```ts
type position = { readonly x: string; readonly y: string};

type NonReadonly<T> = {
    -readonly [P in keyof T]: T[P]
}

// type NonReadonlyPos = { x: string; y: string; }
type NonReadonlyPos = NonReadonly<position>;
```

## Record<Keys, Type>

`Record<Keys, Type>` 创造一个新类型，同时将 Keys 中所有的属性的值的类型转化为 T 类型。

```ts
// { x: string; y: string }
type Type = Record<"x" | "y", string>;
```

Record 可以常用来组合：

```ts

interface UserInfo {
  age: number;
}

type UserName = "john" | "andrew" | "elon" | "jack";

const userList: Record<UserName, UserInfo> = {
  john: { age: 18 },
  andrew: { age: 20 },
  elon: { age: 49 },
  jack: { age: 56 },
};
```

源码实现：

```ts
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
```

泛型约束 `K extends` 相信你能看懂，`keyof any` 你可能有点犯迷糊，`keyof any`  表示对象 key 的类型，所以 `keyof any === string | number | symbol`，不信你可以复制以下代码，在 TS 环境测试下：

```ts
// type unionKeyType = string | number | symbol
type unionKeyType = keyof any;
```

## Exclude<Type, ExcludedUnion>

Exclude 通过排除类型中可分配给 ExcludedUnion 的所有联合成员来创建新类型：

```ts
// "x" | "y"
type ExcludedType = Exclude<"x" | "y" | "z", "z">;
```

确定从对象中获取固定的 key 非常有用：

```ts
interface User {
  name: string;
  surname: string;
  personalNumber: number;
}

type AllowedKeys = Exclude<keyof User, "personalNumber">;

const getUserProperty = (user: User, key: AllowedKeys) => user[key];

const user: User = {
  name: "John",
  surname: "Doe",
  personalNumber: 999999999,
};

const nameProp = getUserProperty(user, "name");
const surnameProp = getUserProperty(user, "surname");

// Argument of type "personalNumber" is not assignable to parameter of type "name" | "surname"
const personalNumberProp = getUserProperty(user, "personalNumber");
```

源码展现，就一个简单的条件类型。

```ts
type Exclude<T, U> = T extends U ? never : T;
```

## Extract<Type, Union>

Extract 是 Exclude 的反面。

它通过从可分配给联合的类型中提取所有联合成员来创建新类型。

```ts
// "x" | "y"
type ExtractedType = Extract<"x" | "y" | "z", "x" | "y">;
```

用来提取两个类型的公有属性名会非常的合适：

```
interface Human {
  id: string;
  name: string;
  surname: string;
}

interface Cat {
  id: string;
  name: string;
  sound: string;
}

// "id" | "name"
type CommonKeys = Extract<keyof Human, keyof Cat>;
```

源码展示：

```ts
type Extract<T, U> = T extends U ? T : never;
```


## Pick<Type, Keys>

Pick 的作用是将 Type 类型中的 Keys 类型提取出来，创建为一个新类型。

```
type LongType = {
  a: string;
  b: string;
  c: string;
  d: string;
};

// { a: string; b: string }
type ShortType = Pick<LongType, "a" | "b">;
```

Pick 创建的类型是 Type 类型的子类型，所以它的使用常常是从一个大类型中提取某些小类型。

```ts
interface User {
  name: string;
  surname: string;
  street: string;
  house: number;
}

type UserAddress = Pick<User, "street" | "house">;

const address: UserAddress = {
  street: "Street",
  house: 1,
};
```

源码实现，注意下泛型约束 `K extends keyof T`。
```
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
```

## Omit<Type, Keys>

Omit 从 Type 的所有属性中，移除 Keys 键，用剩下的键来创建新类型。

```ts
type LongType = {
  a: string;
  b: string;
  c: string;
  d: string;
};

// { c: string; d: string }
type ShortType = Omit<LongType, "a" | "b">;
```

这个用来删除类型中的某些不要的属性非常有用:

```ts
interface User {
  name: string;
  surname: string;
  personalNumber: number;
}

type CleanUser = Omit<User, "personalNumber">;

const getUserData = (user: User): CleanUser => {
  const { personalNumber, ...rest } = user;
  return rest;
};

```

源码展示， Pick 的实现用到了 Exclude 来实现的：

```ts
type Omit<T, K extends keyof any> = { [P in Exclude<keyof T, K>]: T[P]; }
```

> 如果你用较早期的 TS ,Omit 的实现可能是这样的，效果一样，思路不通而已：
> ```ts
> type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>; 
> ```

`keyof any` 等价于 `number |  string | symbol`，我们知道  `number |  string | symbol` 是能作为对象的 key 的类型，也就是说 `Omit<Type, Keys>` 移除键的时候，keys 可以不为 Type 里面的 key ，简单来讲写法更加宽松。

那么问题来了，移除 key 照理说应该是移除对象里面的 key ，即 `K extends keyof any` 应该改为 `K extends keyof T`，TS 没有这么做的道理是啥捏？

原因我想破了脑袋也没想到，去 Github 搜了下，发现大家普遍的需求是让 Omit 的写法更严谨，TS 官方答应着，并没实现，点击了解 ["Omit" type using "keyof any" instead of "keyof T"](https://github.com/microsoft/TypeScript/issues/32376)

如果说，我们想要一个严格的 Omit，我们可以把 Omit 的  `K extends keyof any` 改为 `K extends keyof T` 自己实现一个较为严格的 Omit，我们叫它 Remove ，源码：

```ts
type Remove<T, K extends keyof T> = { [P in Exclude<keyof T, K>]: T[P]; }

interface IPerson {
    age: number;
    name: string;
}

type noAge = Remove<IPerson, "age">; // yes type noAge = { name: string; }
type noRandomKey = Remove<IPerson, "灰机">; // no
```

## NonNullable<Type>

NonNullable 通过从类型中排除 null 和 undefined 来创建新类型。

基本上，它是 `Exclude<T，null | undefined>` 的缩写：

```ts
type Type = string | null | undefined; 

// "string"
type NonNullableType = NonNullable<Type>;
```

## Parameters<Type>

参数从函数类型 Type 的参数中使用的类型构造元组类型：

```ts
const addNumbers = (x: number, y: number) => {
  return x + y;
};

// [x: number, y: number]
type FunctionParameters = Parameters<typeof addNumbers>;
```

使用 addNumbers 的时候为什么还要加上 typeof 呢？因为 addNumbers 是 JS 代码实现，我们需要的是函数签名，所以加上 typeof ，如果我们直接给一个函数签名，就不需要加上 typeof ，例如：

```ts
type addNumbers = (x: number, y: number) => number;

// [x: number, y: number]
type FunctionParameters = Parameters<addNumbers>;
```

您还可以检索单个参数：

```ts
const addNumbers = (x: number, y: number) => {
  return x + y;
};

// "number"
type FirstParam = Parameters<typeof addNumbers>[0];

// "number"
type SecondParam = Parameters<typeof addNumbers>[1];

// "undefined"
type ThirdParam = Parameters<typeof addNumbers>[2];
```

如果获取函数参数的类型以确保类型安全很有用，尤其是在外部使用时：

```ts
const saveUser = (user: { name: string; surname: string; age: number }) => {
  // ...
};

const user: Parameters<typeof saveUser>[0] = {
  name: "John",
  surname: "Doe",
  age: 18,
};
```

源码展示，仔细看这个条件泛型，尤其是 `infer R`：

```ts
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
```

## ConstructorParameters<Type>

ConstructorParameters 根据构造函数的类型构造元组或数组类型。

基本上，它类似于参数，但适用于类构造函数：

```ts
class UserManager {
  private name: string;
  private surname: string;

  constructor(user: { name: string; surname: string }) {
    this.name = user.name;
    this.surname = user.surname;
  }
}

// "[user: { name: string, surname: string} ]"
type UserManagerConstructorParams = ConstructorParameters<typeof UserManager>;
```

与 Parameters 类型相同，当我们外部使用时，它有助于确保构造函数接受我们的参数：

```ts
class UserManager {
  private name: string;
  private surname: string;

  constructor(user: { name: string; surname: string }) {
    this.name = user.name;
    this.surname = user.surname;
  }
}

const params: ConstructorParameters<typeof UserManager>[0] = {
  name: "John",
  surname: "Doe",
};
```

源码展示：

```ts
type ConstructorParameters<T extends new (...args: any) => any> = T extends new (...args: infer P) => any ? P : never;
```

## ReturnType<Type>

ReturnType 构造函数Type的返回类型的类型：

```ts
const getUser = () => ({
  name: "John",
  surname: "Doe",
  age: 18,
});

// { name: string; surname: string; age: number; }
type FunctionReturnType = ReturnType<typeof getUser>;
```
与 Parameters 和 ConstructionParameters 一样，当您外部使用并希望获得导入函数的返回类型时，它很有用：

```ts
const getUser = () => ({
  name: "John",
  surname: "Doe",
  age: 18,
});

type User = ReturnType<typeof getUser>;

const user: User = {
  name: "Andrew",
  surname: "Hopkins",
  age: 20,
};
```

源码展示：

```ts
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
```

## InstanceType<Type>

InstanceType构建一个类型包括实例类型的构造函数的类型。

基本上，它类似于 ReturnType，但作用于类构造函数：

```
class UserManager {
  name: string;
  surname: string;

  constructor(user: { name: string; surname: string }) {
    this.name = user.name;
    this.surname = user.surname;
  }
}

// { name: string; surname: string }
type UserMangerInstanceType = InstanceType<typeof UserManager>;
```

您可能不会这样做，因为您可以直接使用 UserManager 类型：

```ts
class UserManager {
  name: string;
  surname: string;

  constructor(user: { name: string; surname: string }) {
    this.name = user.name;
    this.surname = user.surname;
  }
}

const user2: UserManager = {
  name: "John",
  surname: "Doe",
};
```

源码展示：

```ts
type InstanceType<T extends new (...args: any) => any> = T extends new (...args: any) => infer R ? R : any;
```

## ThisParameterType<Type>

提取函数 this 的类型，若函数类型并没有此参数，则提取为 unknown 类型。

```ts
function toHex(this: Number) {
  return this.toString(16);
}

function numberToString(n: ThisParameterType<typeof toHex>) {
  return toHex.apply(n);
}
```

因为 this 指向的问题，项目中并不常用.

源码展示：

```ts
type ThisParameterType<T> = T extends (this: infer U, ...args: any[]) => any ? U : unknown;
```

## 最后

以上源码展示，均可在 TypeScript 项目的 `./node_modules/typescript/lib/lib.es5.d.ts` 路径找到。

因为官方文档实施更新的缘故，此文章可能过时，请以官方文档为准：[utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)