import React from 'react';
import { IRendererStore } from './store';
import hoistNonReactStatic from 'hoist-non-react-statics';
export declare const RootStoreContext: React.Context<{
    storeType: string;
} & import("mobx-state-tree/dist/internal").NonEmptyObject & {
    readonly fetcher: any;
    readonly notify: any;
    readonly isCancel: (value: any) => boolean;
    readonly __: import("./locale").TranslateFn<any>;
    getStoreById(id: string): {
        id: string;
        path: string;
        storeType: string;
        disposed: boolean;
        parentId: string;
        childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
    } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
        readonly parentStore: any;
        readonly __: any;
        readonly hasChildren: boolean;
        readonly children: any[];
    } & {
        onChildStoreDispose(child: any): void;
        syncProps(props: any, prevProps: any, list?: string[]): void;
        dispose: (callback?: (() => void) | undefined) => void;
        addChildId: (id: string) => void;
        removeChildId: (id: string) => void;
    } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
        id: import("mobx-state-tree").ISimpleType<string>;
        path: import("mobx-state-tree").IType<string | undefined, string, string>;
        storeType: import("mobx-state-tree").ISimpleType<string>;
        disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
        parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
        childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
    }, {
        readonly parentStore: any;
        readonly __: any;
        readonly hasChildren: boolean;
        readonly children: any[];
    } & {
        onChildStoreDispose(child: any): void;
        syncProps(props: any, prevProps: any, list?: string[]): void;
        dispose: (callback?: (() => void) | undefined) => void;
        addChildId: (id: string) => void;
        removeChildId: (id: string) => void;
    }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
    readonly stores: {
        [propName: string]: {
            id: string;
            path: string;
            storeType: string;
            disposed: boolean;
            parentId: string;
            childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
        } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[]): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
            id: import("mobx-state-tree").ISimpleType<string>;
            path: import("mobx-state-tree").IType<string | undefined, string, string>;
            storeType: import("mobx-state-tree").ISimpleType<string>;
            disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
            childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
        }, {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[]): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
    };
} & {
    addStore(store: {
        [propName: string]: any;
        storeType: string;
        id: string;
        path: string;
        parentId?: string | undefined;
    }): {
        id: string;
        path: string;
        storeType: string;
        disposed: boolean;
        parentId: string;
        childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
    } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
        readonly parentStore: any;
        readonly __: any;
        readonly hasChildren: boolean;
        readonly children: any[];
    } & {
        onChildStoreDispose(child: any): void;
        syncProps(props: any, prevProps: any, list?: string[]): void;
        dispose: (callback?: (() => void) | undefined) => void;
        addChildId: (id: string) => void;
        removeChildId: (id: string) => void;
    } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
        id: import("mobx-state-tree").ISimpleType<string>;
        path: import("mobx-state-tree").IType<string | undefined, string, string>;
        storeType: import("mobx-state-tree").ISimpleType<string>;
        disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
        parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
        childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
    }, {
        readonly parentStore: any;
        readonly __: any;
        readonly hasChildren: boolean;
        readonly children: any[];
    } & {
        onChildStoreDispose(child: any): void;
        syncProps(props: any, prevProps: any, list?: string[]): void;
        dispose: (callback?: (() => void) | undefined) => void;
        addChildId: (id: string) => void;
        removeChildId: (id: string) => void;
    }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
    removeStore(store: {
        id: string;
        path: string;
        storeType: string;
        disposed: boolean;
        parentId: string;
        childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
    } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
        readonly parentStore: any;
        readonly __: any;
        readonly hasChildren: boolean;
        readonly children: any[];
    } & {
        onChildStoreDispose(child: any): void;
        syncProps(props: any, prevProps: any, list?: string[]): void;
        dispose: (callback?: (() => void) | undefined) => void;
        addChildId: (id: string) => void;
        removeChildId: (id: string) => void;
    } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
        id: import("mobx-state-tree").ISimpleType<string>;
        path: import("mobx-state-tree").IType<string | undefined, string, string>;
        storeType: import("mobx-state-tree").ISimpleType<string>;
        disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
        parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
        childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
    }, {
        readonly parentStore: any;
        readonly __: any;
        readonly hasChildren: boolean;
        readonly children: any[];
    } & {
        onChildStoreDispose(child: any): void;
        syncProps(props: any, prevProps: any, list?: string[]): void;
        dispose: (callback?: (() => void) | undefined) => void;
        addChildId: (id: string) => void;
        removeChildId: (id: string) => void;
    }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>): void;
} & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
    storeType: import("mobx-state-tree").IType<string | undefined, string, string>;
}, {
    readonly fetcher: any;
    readonly notify: any;
    readonly isCancel: (value: any) => boolean;
    readonly __: import("./locale").TranslateFn<any>;
    getStoreById(id: string): {
        id: string;
        path: string;
        storeType: string;
        disposed: boolean;
        parentId: string;
        childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
    } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
        readonly parentStore: any;
        readonly __: any;
        readonly hasChildren: boolean;
        readonly children: any[];
    } & {
        onChildStoreDispose(child: any): void;
        syncProps(props: any, prevProps: any, list?: string[]): void;
        dispose: (callback?: (() => void) | undefined) => void;
        addChildId: (id: string) => void;
        removeChildId: (id: string) => void;
    } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
        id: import("mobx-state-tree").ISimpleType<string>;
        path: import("mobx-state-tree").IType<string | undefined, string, string>;
        storeType: import("mobx-state-tree").ISimpleType<string>;
        disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
        parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
        childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
    }, {
        readonly parentStore: any;
        readonly __: any;
        readonly hasChildren: boolean;
        readonly children: any[];
    } & {
        onChildStoreDispose(child: any): void;
        syncProps(props: any, prevProps: any, list?: string[]): void;
        dispose: (callback?: (() => void) | undefined) => void;
        addChildId: (id: string) => void;
        removeChildId: (id: string) => void;
    }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
    readonly stores: {
        [propName: string]: {
            id: string;
            path: string;
            storeType: string;
            disposed: boolean;
            parentId: string;
            childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
        } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[]): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
            id: import("mobx-state-tree").ISimpleType<string>;
            path: import("mobx-state-tree").IType<string | undefined, string, string>;
            storeType: import("mobx-state-tree").ISimpleType<string>;
            disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
            childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
        }, {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[]): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
    };
} & {
    addStore(store: {
        [propName: string]: any;
        storeType: string;
        id: string;
        path: string;
        parentId?: string | undefined;
    }): {
        id: string;
        path: string;
        storeType: string;
        disposed: boolean;
        parentId: string;
        childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
    } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
        readonly parentStore: any;
        readonly __: any;
        readonly hasChildren: boolean;
        readonly children: any[];
    } & {
        onChildStoreDispose(child: any): void;
        syncProps(props: any, prevProps: any, list?: string[]): void;
        dispose: (callback?: (() => void) | undefined) => void;
        addChildId: (id: string) => void;
        removeChildId: (id: string) => void;
    } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
        id: import("mobx-state-tree").ISimpleType<string>;
        path: import("mobx-state-tree").IType<string | undefined, string, string>;
        storeType: import("mobx-state-tree").ISimpleType<string>;
        disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
        parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
        childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
    }, {
        readonly parentStore: any;
        readonly __: any;
        readonly hasChildren: boolean;
        readonly children: any[];
    } & {
        onChildStoreDispose(child: any): void;
        syncProps(props: any, prevProps: any, list?: string[]): void;
        dispose: (callback?: (() => void) | undefined) => void;
        addChildId: (id: string) => void;
        removeChildId: (id: string) => void;
    }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
    removeStore(store: {
        id: string;
        path: string;
        storeType: string;
        disposed: boolean;
        parentId: string;
        childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
    } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
        readonly parentStore: any;
        readonly __: any;
        readonly hasChildren: boolean;
        readonly children: any[];
    } & {
        onChildStoreDispose(child: any): void;
        syncProps(props: any, prevProps: any, list?: string[]): void;
        dispose: (callback?: (() => void) | undefined) => void;
        addChildId: (id: string) => void;
        removeChildId: (id: string) => void;
    } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
        id: import("mobx-state-tree").ISimpleType<string>;
        path: import("mobx-state-tree").IType<string | undefined, string, string>;
        storeType: import("mobx-state-tree").ISimpleType<string>;
        disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
        parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
        childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
    }, {
        readonly parentStore: any;
        readonly __: any;
        readonly hasChildren: boolean;
        readonly children: any[];
    } & {
        onChildStoreDispose(child: any): void;
        syncProps(props: any, prevProps: any, list?: string[]): void;
        dispose: (callback?: (() => void) | undefined) => void;
        addChildId: (id: string) => void;
        removeChildId: (id: string) => void;
    }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>): void;
}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>>;
export declare function withRootStore<T extends React.ComponentType<React.ComponentProps<T> & {
    rootStore: IRendererStore;
}>>(ComposedComponent: T): {
    new (props: JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "rootStore">> | Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "rootStore">>>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "rootStore">>>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "rootStore">>> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "rootStore">>>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "rootStore">>>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "rootStore">>>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "rootStore">>>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "rootStore">>>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "rootStore">>>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "rootStore">>>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "rootStore">>, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "rootStore">>>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "rootStore">>> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "rootStore">>>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "rootStore">>>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "rootStore">>>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "rootStore">>>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "rootStore">>>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "rootStore">>>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, "rootStore">>>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<{
        storeType: string;
    } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
        readonly fetcher: any;
        readonly notify: any;
        readonly isCancel: (value: any) => boolean;
        readonly __: import("./locale").TranslateFn<any>;
        getStoreById(id: string): {
            id: string;
            path: string;
            storeType: string;
            disposed: boolean;
            parentId: string;
            childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
        } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[]): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
            id: import("mobx-state-tree").ISimpleType<string>;
            path: import("mobx-state-tree").IType<string | undefined, string, string>;
            storeType: import("mobx-state-tree").ISimpleType<string>;
            disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
            childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
        }, {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[]): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        readonly stores: {
            [propName: string]: {
                id: string;
                path: string;
                storeType: string;
                disposed: boolean;
                parentId: string;
                childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[]): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                id: import("mobx-state-tree").ISimpleType<string>;
                path: import("mobx-state-tree").IType<string | undefined, string, string>;
                storeType: import("mobx-state-tree").ISimpleType<string>;
                disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
                childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
            }, {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[]): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        };
    } & {
        addStore(store: {
            [propName: string]: any;
            storeType: string;
            id: string;
            path: string;
            parentId?: string | undefined;
        }): {
            id: string;
            path: string;
            storeType: string;
            disposed: boolean;
            parentId: string;
            childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
        } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[]): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
            id: import("mobx-state-tree").ISimpleType<string>;
            path: import("mobx-state-tree").IType<string | undefined, string, string>;
            storeType: import("mobx-state-tree").ISimpleType<string>;
            disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
            childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
        }, {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[]): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        removeStore(store: {
            id: string;
            path: string;
            storeType: string;
            disposed: boolean;
            parentId: string;
            childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
        } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[]): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
            id: import("mobx-state-tree").ISimpleType<string>;
            path: import("mobx-state-tree").IType<string | undefined, string, string>;
            storeType: import("mobx-state-tree").ISimpleType<string>;
            disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
            childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
        }, {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[]): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>): void;
    } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
        storeType: import("mobx-state-tree").IType<string | undefined, string, string>;
    }, {
        readonly fetcher: any;
        readonly notify: any;
        readonly isCancel: (value: any) => boolean;
        readonly __: import("./locale").TranslateFn<any>;
        getStoreById(id: string): {
            id: string;
            path: string;
            storeType: string;
            disposed: boolean;
            parentId: string;
            childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
        } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[]): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
            id: import("mobx-state-tree").ISimpleType<string>;
            path: import("mobx-state-tree").IType<string | undefined, string, string>;
            storeType: import("mobx-state-tree").ISimpleType<string>;
            disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
            childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
        }, {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[]): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        readonly stores: {
            [propName: string]: {
                id: string;
                path: string;
                storeType: string;
                disposed: boolean;
                parentId: string;
                childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[]): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                id: import("mobx-state-tree").ISimpleType<string>;
                path: import("mobx-state-tree").IType<string | undefined, string, string>;
                storeType: import("mobx-state-tree").ISimpleType<string>;
                disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
                childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
            }, {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[]): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        };
    } & {
        addStore(store: {
            [propName: string]: any;
            storeType: string;
            id: string;
            path: string;
            parentId?: string | undefined;
        }): {
            id: string;
            path: string;
            storeType: string;
            disposed: boolean;
            parentId: string;
            childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
        } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[]): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
            id: import("mobx-state-tree").ISimpleType<string>;
            path: import("mobx-state-tree").IType<string | undefined, string, string>;
            storeType: import("mobx-state-tree").ISimpleType<string>;
            disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
            childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
        }, {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[]): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        removeStore(store: {
            id: string;
            path: string;
            storeType: string;
            disposed: boolean;
            parentId: string;
            childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
        } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[]): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
            id: import("mobx-state-tree").ISimpleType<string>;
            path: import("mobx-state-tree").IType<string | undefined, string, string>;
            storeType: import("mobx-state-tree").ISimpleType<string>;
            disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
            childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
        }, {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[]): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>): void;
    }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>>;
    ComposedComponent: React.ComponentType<T>;
} & hoistNonReactStatic.NonReactStatics<T, {}> & {
    ComposedComponent: T;
};
