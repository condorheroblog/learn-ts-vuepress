---
title: "函数式组件"
date: 2021-05-20
---

# 函数式组件

为什么把函数式组件放在类组件之前学习呢？这是因为函数式组件足够的灵活，而类组件笨重和过于奇怪的语法，已经让我在项目中完全抛弃了。

## 函数式组件两种声明方式

### React.FC 声明函数组件

`React.FC` 是 `React.FunctionComponent` 的简写。

```ts
type TProps = {
    message: string;
}

const HellloTs: React.FC<TProps> = ({ message, children }) => (
    <>
        {message} {children}
    </>
)

<HellloTs message="hello">TypeScript!</HellloTs>
```

我们看下泛型函数 FC 的实现，分析下这种使用方法声明函数组件的特点：

```ts
type FC<P = {}> = FunctionComponent<P>;

interface FunctionComponent<P = {}> {
    (props: PropsWithChildren<P>, context?: any): ReactElement | null;
    propTypes?: WeakValidationMap<P>;
    contextTypes?: ValidationMap<any>;
    defaultProps?: Partial<P>;
    displayName?: string;
}
```

使用用 React.FC 的特点：

- React.FC 显式地定义了返回类型
- React.FC 对静态属性：displayName、propTypes、defaultProps 提供了类型检查和自动补全

React.FC 为 children 提供了隐式的类型（ReactElement | null），但是目前，提供的类型存在一些 [DefinitelyTyped#33006](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/33006) 问题。

### 普通函数声明函数组件

```ts
type TProps = {
    message: string;
};

// 声明一个函数组件，返回值自动推断
const App = ({ message }: TProps) => <div>{message}</div>;

// 指定返回值
const App = ({ message }: TProps): JSX.Element => <div>{message}</div>;

// 扁平化声明
const App = ({ message }: { message: string }) => <div>{message}</div>;
```

### 选择哪一种？

我们知道函数组件最大的特性就是灵活，如果使用 FC 来声明组件，会对我们写的 React 组件强加限制，而这些限制是没有必要的，例如声明一个函数组件，但是想返回一个数组或字符串等，反正就是不返回 JSX，这时候我们就的对组件返回值使用**断言**。

而使用普通函数组件，就没有这个烦恼，尤其是借用类型推论使得普通函数组件声明更加贴近函数组件的本质。


## useState

一般情况，特别是在基础类型的情况下， TS 会自动帮我们推导 state 的类型:

```ts
// val 会推导为 boolean 类型， toggle 只接收 boolean 类型的参数
const [ val, toggle ] = React.useState(false)
// obj 会自动推导为类型: { name: string }
const [ obj ] = React.useState({ name: "CondorHero" })
// arr 会自动推导为类型: (string | number)[]
const [ arr ] = React.useState(["One", 2])
```

useState 结合 typeof 操作符配合 useCallback 也是很常见的例如：

```ts
export default function App() {
    // userInfo 会自动推导为类型: { name: string, age: number }
    const [ userInfo, setUserInfo ] = React.useState({ name: "CondorHero", age: 19 });
    const showUser = React.useCallback((newUserInfo: typeof userInfo) => {
        setUserInfo(userInfo);
        return `My name is ${newUserInfo.name}, My age is ${newUserInfo.age}`;
    }, [])
    return <div className="App">用户: {showUser(userInfo)}</div>
}
```

还有一些情况，一些 state 的初始值为空时（null），需要显示地声明类型：

```ts
type User = {
    name: string
    age: number
}
const [ userInfo, setUserInfo ] = React.useState<User | null>(null);
// 或者使用断言（不推荐）
const [ userInfo, setUserInfo ] = React.useState<User>(null as User);
```

知其然，知其所以然，我们来看下 useState 的源码：

```ts
function useState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
```
useState 是个函数，所以，它的声明是函数泛型，我们看上面有两个同名函数声明，在 JS 中会造成同名函数覆盖，但是在 TS 中不会，而且它有个专业技术名词叫**函数重载**。

## useEffect

useEffect 需要注意回调函数的返回值只能是函数或者 undefined:

```ts
function App() {
    // undefined 作为回调函数的返回值
    React.useEffect(() => {
        // do something...
    }, [])
    // 返回值是一个函数
    React.useEffect(() => {
        // do something...
        return () => {}
    }, [])
}
```

看下声明文件的 useEffect 源码：

```ts
type DependencyList = ReadonlyArray<any>; // readonly any[] or readonly Array<any>
type EffectCallback = () => (void | (() => void | undefined));
function useEffect(effect: EffectCallback, deps?: DependencyList): void;
```

## useMemo/useCallback

用法很简单：

```ts
const value = 10;
// 自动推断返回值为 number
const result = React.useMemo(() => value * 2, [ value ]);
```

看下声明文件的 useMemo 源码：

```ts
function useMemo<T>(factory: () => T, deps: DependencyList | undefined): T;
```

useCallback 用法也很简单：

```ts
const [ count ] = React.useState(10);
// 自动推断 (value: number) => number
const getCount = React.useCallback(
    (value: typeof count) => value * count,
    [ count, ]
);
```

看下声明文件的 useCallback 源码：

```ts
type DependencyList = ReadonlyArray<any>;
function useCallback<T extends (...args: any[]) => any>(callback: T, deps: DependencyList): T;
```

上面用法，我们都是直接让它们从返回的值去推断出它们的类型，看完源码你会发现，它们也支持传入泛型，例如：

```ts
// 显式的指定返回值类型
const result = React.useMemo<number>(() => 2, []);
// useCallback 的泛型写法留给你了
```

## useRef

经过前面几个训练这个我们直接看 useRef 声明文件的源码，然后在研究它的用法：

```ts
interface RefObject<T> {
    readonly current: T | null;
}
function useRef<T>(initialValue: T|null): RefObject<T>;

interface MutableRefObject<T> {
    current: T;
}
function useRef<T>(initialValue: T): MutableRefObject<T>;
```

我们发现这个函数重载泛型很牛，这么牛的代码干了啥事呢？主要干了返回的 current 是否可以改变。

也就是说 useRef，有两种创建方式:

```ts
const ref1 = React.useRef<HTMLInputElement>(null); // current 不可改变
const ref2 = React.useRef<number>(10); // current 可以改变
```

顺便一提，这里 useRef 之所以能够提前使用静态检查，在于 React 改变了 ref 的绑定规则，即先绑定。

上面两种方式对应着不同的应用场景：

- current 不可改变，用于 DOM 绑定。
- current 可以改变，数据持久化存储。

但是无论哪一种方式，都需要对类型进行检查:

```ts
const onButtonClick = () => {
    ref1.current?.focus();
    ref2.current?.focus();
};
```

如果我们确定 current 不可能出现 null，通过添加 ! 断言：

```ts
function MyComponent() {
    const ref1 = React.useRef<HTMLDivElement>(null!)
    React.useEffect(() => {
        //  不需要做类型检查，需要人为保证 ref1.current.focus 一定存在
        doSomethingWith(ref1.current.focus());
    });
    return <div ref={ref1}> etc </div>;
}
```

## Custom Hooks

自定义 Hook 和普通函数几乎没啥区别，唯一需要注意的是自定义 Hook 的返回值如果是数组类型，TS 会自动推导为 Union 类型，而我们实际需要的是数组里里每一项的具体类型，需要手动添加 **const 断言**进行处理，或直接声明返回字面量数组类型。

```ts
// one resolve
function useLoading() {
    const [ isLoading, setState ] = React.useState(false);
    const load = (aPromise: Promise<any>) => {
        setState(true);
        return aPromise.then(() => setState(false));
    };
    // 实际需要: [boolean, typeof load] 类型
    // 而不是自动推导的：(boolean | typeof load)[]
    return [ isLoading, load ] as const;
};

// two resolve
export function useLoading(): [ boolean, (aPromise: Promise<any>) => Promise<any> ] {
   const [ isLoading, setState ] = React.useState(false);
    const load = (aPromise: Promise<any>) => {
        setState(true);
        return aPromise.then(() => setState(false));
    };
    return [ isLoading, load ];
}
```

## useReducer

```ts
 type ReducerState<R extends Reducer<any, any>> = R extends Reducer<infer S, any> ? S : never;
type Reducer<S, A> = (prevState: S, action: A) => S;
function useReducer<R extends Reducer<any, any>>(
    reducer: R,
    initialState: ReducerState<R>,
    initializer?: undefined
): [ReducerState<R>, Dispatch<ReducerAction<R>>];
```

```ts{7}
const initialState = { count: 0 };

type ACTIONTYPE =
	| { type: "increment"; payload: number }
	| { type: "decrement"; payload: string };

function reducer(state: typeof initialState, action: ACTIONTYPE) {
	switch (action.type) {
		case "increment":
			return { count: state.count + action.payload };
		case "decrement":
			return { count: state.count - Number(action.payload) };
		default:
			throw new Error();
	}
}

function Counter() {
	const [state, dispatch] = React.useReducer(reducer, initialState);
	return (
		<>
			Count: {state.count}
			<button onClick={() => dispatch({ type: "decrement", payload: "5" })}>
				-
      </button>
			<button onClick={() => dispatch({ type: "increment", payload: 5 })}>
				+
      </button>
		</>
	);
}

```

## useImperativeHandle

https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#useeffect


### 使用 TS 时我还需要使用 React.PropTypes 吗？
### 什么时候使用 interface 声明，什么时候使用 type 别名?

# 参考

- [react-typescript-cheatsheet](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/default_props/)
- [static-type-checking](https://reactjs.org/docs/static-type-checking.html#typescript)