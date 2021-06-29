---
title: "TS + 类组件"
date: 2021-06-30 00:38:39
---

# TS + 类组件

因为现在已经不流行类组件了，所以类组件结合 TS 简单介绍，你也简单了解下即可。

## 为 State 和 Props 编写声明

类组件的 Component 本身是一个泛型——`React.Component<PropType, StateType>`，这个泛型显示注解了 State 和 Props 的类型，所以当我们使用 State 和 Props 需要像下面这样使用。

```ts
interface IProps {
    message: string;
};
type TState = {
    count: number;
};

class CountClass extends React.Component<IProps, TState> {
    state: TState = {
        count: 0,
    };

	handleIncrease (key: string) {
		// do something
	}

    render() {
        return (
            <>
                {this.props.message} {this.state.count}
                <button onClick={() => this.handleIncrease("count")}>点击</button>
            </>
        );
    }
};

<CountClass message="count 的值为："} />
```

还需要注意的是，类组件中函数有参数需要注解参数的类型，类组件的属性也需要自己定义类型。

## createRef

类组件持久化存储 DOM 也很常用，这个 API 叫 `React.createRef`：

使用案例：

```ts
class CssThemeProvider extends React.PureComponent<Props> {
    private rootRef = React.createRef<HTMLDivElement>(); // like this
    render() {
        return <div ref={this.rootRef}>{this.props.children}</div>;
    }
}
```

这个源码是最简单的如下：

```ts
interface RefObject<T> {
    readonly current: T | null;
}
function createRef<T>(): RefObject<T>;
```