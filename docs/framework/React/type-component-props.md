---
title: "组件的 props"
date: 2021-05-18
---

# 组件的 props

props 是父子组件传值，最有用的功能了。如果项目中没有使用 TS 这种静态语言进行检查，我们为了组件的不易出现 bug，会使用 React 组件提供的静态属性 defaultProps 来约束。

## 还需要 defaultProps 吗？

但是现在，很明显是不需要的，因为 defaultProps 的出现就是为了，静态检查，如今项目出现了 TS 这么强大的静态语言，defaultProps就应该被束之高阁。

> 关于 defaultProps 的去留，你也可以看下这个讨论 [You May Not Need defaultProps](https://twitter.com/hswolff/status/1133759319571345408)

TS 项目中：

函数组件：

```ts{3}
type GreetProps = { age?: number };

const Greet = ({ age = 21 }: GreetProps) => // etc
```

类组件：

```ts{5}
interface IProps = {
    age?: number;
};

class Greet extends React.Component<IProps> {
    render() {
        const { age = 21 } = this.props;
        /*...*/
    }
}

let el = <Greet age={3} />;
```

## 最基本的 props

父组件传过来的 props 是个对象，但是这个对象的内容可是很千变万化的，我们来看看它常出现的结构：

```ts
type AppProps = {
    /** 基本类型 */
    message: string;
    count: number;
    disabled: boolean;
    /** 数组 */
    names: string[];
    ages: Array<string>;
    /** 字面量联合类型 */
    status: "waiting" | "success";
    /** 引用类型，不能访问类型的属性，（不推荐使用，但是作为占位很有用） */
    obj: object;
    /** 字面量对象类型表现和 object 几乎一样，也不能访问类型的属性 ，和 Object 类型完全一样 */
    obj2: {};
    /** 一个固定数量对象类型(常用！) */
    obj3: {
        id: string;
        title: string;
    };
    /** 数组对象类型(常用！) */
    objArr: {
        id: string;
        title: string; 
    }[];
    /** 一个字典对象，对象包含的属性全部都属于同一种类型 */
    dict1: {
        [key: string]: MyTypeHere;
    };
    dict2: Record<string, MyTypeHere>; // 等同于 dict1
    /** 定义一个函数，调用时返回的值的类型是 any (不推荐使用) */
    onSomething: Function;
    /** 定一个不返回值的函数(非常推荐) */
    onClick: () => void;
    /** 函数传了些形参 (非常推荐) */
    onChange: (id: number) => void;
    /** 携带事件的函数 (非常推荐) */
    onClick(event: React.MouseEvent<HTMLButtonElement>): void;
    /** 可选属性 (非常常用！) */
    optional?: OptionalType;
};
```

如果你足够细心，会发现上面代码的使用的多行注释，都多了个星号，这是用的 [tsdoc](https://github.com/Microsoft/tsdoc) 语法，推荐你使用。

## props 优雅接收 children

父组件在使用的过程中，children 可能是 JSX、字符串、数组等，那问题来了，哪种接受方法最好呢？

```ts

export declare interface AppProps {
    /**  差, 只支持 JSX */
    children1: JSX.Element;
    /** 一般, 不支持字符串 */
    children2: JSX.Element | JSX.Element[];
    /** React.Children 是 React 暴露出来的顶层 API，包含一系列处理 props.children 的方法*/
    children3: React.ReactChildren;
    /** 很好 */
    children4: React.ReactChild;
    /** 最佳，支持所有类型 推荐使用 */
    children: React.ReactNode;
}
```

你一定好奇上面代码的好坏我是怎么知道的，可别是瞎掰的。凡事都讲究证据，我来带你看看 React 对上面 API 的具体实现：

- `JSX.Element`

一目了然，`JSX.Element` 其实就是 `ReactElement`。

```ts
declare global {
    namespace JSX {
        // tslint:disable-next-line:no-empty-interface
        interface Element extends React.ReactElement<any, any> { }
    }
}
```

- ReactChildren

ReactChildren 是一系列方法的组合，使用可参考下面两个链接：

    1. [reactchildren](https://reactjs.org/docs/react-api.html#reactchildren)
    2. [对React children 的深入理解](https://www.jianshu.com/p/d1975493b5ea)

```ts
interface ReactChildren {
    map<T, C>(children: C | C[], fn: (child: C, index: number) => T): C extends null | undefined ? C : Array<Exclude<T, boolean | null | undefined>>;
    forEach<C>(children: C | C[], fn: (child: C, index: number) => void): void;
    count(children: any): number;
    only<C>(children: C): C extends any[] ? never : C;
    toArray(children: ReactNode | ReactNode[]): Array<Exclude<ReactNode, boolean | null | undefined>>;
}
```

- ReactChild

ReactChild 是就是在 JSX.element 的基础上加了 ReactText 类型。

```ts
type ReactText = string | number;
type ReactChild = ReactElement | ReactText;
```

- ReactNode

非常牛的类型，涵盖了 props.children 可能出现的所有情况：

```ts
interface ReactNodeArray extends Array<ReactNode> {}
type ReactFragment = {} | ReactNodeArray;
type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined;
```

```ts
functionChildren: (name: string) => React.ReactNode // recommended function as a child render prop type
style?: React.CSSProperties // 传递style对象
onChange?: React.FormEventHandler<HTMLInputElement> // 表单事件, 泛型参数是event.target的类型
//  more info: https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase/#wrappingmirroring
props: Props & React.ComponentPropsWithoutRef<"button">; // to impersonate all the props of a button element and explicitly not forwarding its ref
props2: Props & React.ComponentPropsWithRef<MyButtonWithForwardRef>; // to impersonate all the props of MyButtonForwardedRef and explicitly forwarding its ref
```

```ts
import React, { useState } from "react";

export default function App() {
    const [value, setValue] = useState("哈哈哈");
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>):void => {
        let value = event.target.value;
        console.log(value, event.target)
        setValue(event.target.value);
    }
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>):void => {
        event.persist()
        console.log(event)
    }
    return (
        <div className="App">
            <input value={value} onChange={handleChange} />
            <button onClick={handleClick}>按我</button>
        </div>
    );
}

```



