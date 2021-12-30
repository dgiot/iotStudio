/**
 * 接管 store 的生命周期，这个比较轻量，适合在组件中使用。
 * 相比渲染器中的 withStore，这里面的 store 不会在一个大树中。
 * 而且不会知道父级和子级中还有哪些 store。
 */
import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { IAnyStateTreeNode } from 'mobx-state-tree';
export declare function withStore<K extends IAnyStateTreeNode>(storeFactory: (props: any) => K): <T extends React.ComponentType<React.ComponentProps<T> & {
    store: K;
}>>(ComposedComponent: T) => {
    new (props: JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "store">> | Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "store">>>): {
        ref: any;
        store?: K | undefined;
        refFn: (ref: any) => void;
        componentWillUnmount(): void;
        getWrappedInstance(): any;
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "store">>>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "store">>> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "store">>>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "store">>>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "store">>>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "store">>>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "store">>>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "store">>>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "store">>>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "store">>, context: any): {
        ref: any;
        store?: K | undefined;
        refFn: (ref: any) => void;
        componentWillUnmount(): void;
        getWrappedInstance(): any;
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "store">>>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "store">>> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "store">>>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "store">>>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "store">>>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "store">>>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "store">>>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "store">>>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "store">>>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    ComposedComponent: React.ComponentType<T>;
    contextType?: React.Context<any> | undefined;
} & hoistNonReactStatic.NonReactStatics<T, {}> & {
    ComposedComponent: T;
};
