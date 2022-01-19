import React from 'react';
import { IFormStore, IFormItemStore } from '../../store/form';
import { RendererProps } from '../../factory';
import { IIRendererStore } from '../../store';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { Api } from '../../types';
export interface ControlOutterProps extends RendererProps {
    formStore?: IFormStore;
    name?: string;
    value?: any;
    id?: string;
    type?: string;
    required?: boolean;
    validations: string | {
        [propsName: string]: any;
    };
    validationErrors: {
        [propsName: string]: any;
    };
    validateOnChange: boolean;
    multiple?: boolean;
    delimiter?: string;
    joinValues?: boolean;
    extractValue?: boolean;
    valueField?: string;
    labelField?: string;
    unique?: boolean;
    selectFirst?: boolean;
    autoFill?: any;
    clearValueOnHidden?: boolean;
    validateApi?: Api;
    submitOnChange?: boolean;
    validate?: (value: any, values: any, name: string) => any;
    formItem?: IFormItemStore;
    addHook?: (fn: () => any, type?: 'validate' | 'init' | 'flush') => void;
    removeHook?: (fn: () => any, type?: 'validate' | 'init' | 'flush') => void;
    $schema: {
        pipeIn?: (value: any, data: any) => any;
        pipeOut?: (value: any, originValue: any, data: any) => any;
        [propName: string]: any;
    };
    store?: IIRendererStore;
    onChange?: (value: any, name: string, submit?: boolean, changePristine?: boolean) => void;
}
export interface ControlProps {
    onBulkChange?: (values: Object) => void;
    onChange?: (value: any, name: string, submit: boolean) => void;
    store: IIRendererStore;
}
export declare function wrapControl<T extends React.ComponentType<React.ComponentProps<T> & ControlProps>>(ComposedComponent: T): {
    new (props: Omit<any, "rootStore"> | Readonly<Omit<any, "rootStore">>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<any, "rootStore">>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<any, "rootStore">> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<any, "rootStore">>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<any, "rootStore">>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<any, "rootStore">>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<any, "rootStore">>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<any, "rootStore">>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<any, "rootStore">>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<any, "rootStore">>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Omit<any, "rootStore">, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<any, "rootStore">>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<any, "rootStore">> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<any, "rootStore">>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<any, "rootStore">>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<any, "rootStore">>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<any, "rootStore">>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<any, "rootStore">>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<any, "rootStore">>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<any, "rootStore">>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<{
        storeType: string;
    } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
        readonly fetcher: any;
        readonly notify: any;
        readonly isCancel: (value: any) => boolean;
        readonly __: import("../../locale").TranslateFn<any>;
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
        readonly __: import("../../locale").TranslateFn<any>;
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
    ComposedComponent: React.ComponentType<any>;
} & hoistNonReactStatic.NonReactStatics<any, {}> & {
    ComposedComponent: any;
} & hoistNonReactStatic.NonReactStatics<T, {}> & {
    ComposedComponent: T;
};
