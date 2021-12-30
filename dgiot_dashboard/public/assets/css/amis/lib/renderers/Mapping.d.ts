/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { RendererEnv, RendererProps } from '../factory';
import { Api } from '../types';
import { BaseSchema, SchemaApi, SchemaTokenizeableString, SchemaTpl } from '../Schema';
import { Instance } from 'mobx-state-tree';
/**
 * Mapping 映射展示控件。
 * 文档：https://baidu.gitee.io/amis/docs/components/mapping
 */
export interface MappingSchema extends BaseSchema {
    /**
     * 指定为映射展示控件
     */
    type: 'map' | 'mapping';
    /**
     * 关联字段名。
     */
    name?: string;
    /**
     * 配置映射规则，值可以使用模板语法。当 key 为 * 时表示 else，也就是说值没有映射到任何规则时用 * 对应的值展示。
     */
    map?: {
        [propName: string]: SchemaTpl;
    };
    /**
     * 如果想远程拉取字典，请配置 source 为接口。
     */
    source?: SchemaApi | SchemaTokenizeableString;
    /**
     * 占位符
     */
    placeholder?: string;
}
export declare const Store: import("mobx-state-tree").IModelType<{
    id: import("mobx-state-tree").ISimpleType<string>;
    path: import("mobx-state-tree").IType<string | undefined, string, string>;
    storeType: import("mobx-state-tree").ISimpleType<string>;
    disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
    childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
} & {
    fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
    map: import("mobx-state-tree").IType<{
        [propName: string]: any;
    } | null | undefined, {
        [propName: string]: any;
    }, {
        [propName: string]: any;
    }>;
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
} & {
    load: (env: RendererEnv, api: Api, data: any) => Promise<any>;
    setMap(options: any): void;
}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>;
export declare type IStore = Instance<typeof Store>;
export interface MappingProps extends Omit<RendererProps, 'store'>, Omit<MappingSchema, 'type' | 'className'> {
    store: IStore;
}
export declare const MappingField: {
    new (props: Omit<MappingProps, "store"> | Readonly<Omit<MappingProps, "store">>): {
        ref: any;
        store?: ({
            id: string;
            path: string;
            storeType: string;
            disposed: boolean;
            parentId: string;
            childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
            fetching: boolean;
            errorMsg: string;
            map: {
                [propName: string]: any;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{
                [propName: string]: any;
            } | null | undefined, {
                [propName: string]: any;
            }, {
                [propName: string]: any;
            }>>;
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
        } & {
            load: (env: RendererEnv, api: Api, data: any) => Promise<any>;
            setMap(options: any): void;
        } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
            id: import("mobx-state-tree").ISimpleType<string>;
            path: import("mobx-state-tree").IType<string | undefined, string, string>;
            storeType: import("mobx-state-tree").ISimpleType<string>;
            disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
            childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
        } & {
            fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
            map: import("mobx-state-tree").IType<{
                [propName: string]: any;
            } | null | undefined, {
                [propName: string]: any;
            }, {
                [propName: string]: any;
            }>;
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
        } & {
            load: (env: RendererEnv, api: Api, data: any) => Promise<any>;
            setMap(options: any): void;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>) | undefined;
        refFn: (ref: any) => void;
        componentWillUnmount(): void;
        getWrappedInstance(): any;
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<MappingProps, "store">>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<MappingProps, "store">> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<MappingProps, "store">>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<MappingProps, "store">>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<MappingProps, "store">>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<MappingProps, "store">>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<MappingProps, "store">>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<MappingProps, "store">>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<MappingProps, "store">>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Omit<MappingProps, "store">, context: any): {
        ref: any;
        store?: ({
            id: string;
            path: string;
            storeType: string;
            disposed: boolean;
            parentId: string;
            childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
            fetching: boolean;
            errorMsg: string;
            map: {
                [propName: string]: any;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{
                [propName: string]: any;
            } | null | undefined, {
                [propName: string]: any;
            }, {
                [propName: string]: any;
            }>>;
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
        } & {
            load: (env: RendererEnv, api: Api, data: any) => Promise<any>;
            setMap(options: any): void;
        } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
            id: import("mobx-state-tree").ISimpleType<string>;
            path: import("mobx-state-tree").IType<string | undefined, string, string>;
            storeType: import("mobx-state-tree").ISimpleType<string>;
            disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
            childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
        } & {
            fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
            map: import("mobx-state-tree").IType<{
                [propName: string]: any;
            } | null | undefined, {
                [propName: string]: any;
            }, {
                [propName: string]: any;
            }>;
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
        } & {
            load: (env: RendererEnv, api: Api, data: any) => Promise<any>;
            setMap(options: any): void;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>) | undefined;
        refFn: (ref: any) => void;
        componentWillUnmount(): void;
        getWrappedInstance(): any;
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<MappingProps, "store">>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<MappingProps, "store">> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<MappingProps, "store">>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<MappingProps, "store">>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<MappingProps, "store">>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<MappingProps, "store">>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<MappingProps, "store">>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<MappingProps, "store">>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<MappingProps, "store">>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    ComposedComponent: React.ComponentType<{
        new (props: MappingProps): {
            componentDidMount(): void;
            componentDidUpdate(prevProps: MappingProps): void;
            reload(): void;
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: object | ((prevState: object, props: Readonly<MappingProps>) => object | Pick<object, K_1> | null) | Pick<object, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<MappingProps> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: object;
            refs: {
                [key: string]: React.ReactInstance;
            };
            shouldComponentUpdate?(nextProps: Readonly<MappingProps>, nextState: object, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<MappingProps>, prevState: object): any;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<MappingProps>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<MappingProps>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<MappingProps>, nextState: object, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<MappingProps>, nextState: object, nextContext: any): void;
        };
        defaultProps: Partial<MappingProps>;
        contextType?: React.Context<any> | undefined;
    }>;
    contextType?: React.Context<any> | undefined;
} & import("hoist-non-react-statics").NonReactStatics<{
    new (props: MappingProps): {
        componentDidMount(): void;
        componentDidUpdate(prevProps: MappingProps): void;
        reload(): void;
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: object | ((prevState: object, props: Readonly<MappingProps>) => object | Pick<object, K_1> | null) | Pick<object, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<MappingProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: object;
        refs: {
            [key: string]: React.ReactInstance;
        };
        shouldComponentUpdate?(nextProps: Readonly<MappingProps>, nextState: object, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<MappingProps>, prevState: object): any;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<MappingProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<MappingProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<MappingProps>, nextState: object, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<MappingProps>, nextState: object, nextContext: any): void;
    };
    defaultProps: Partial<MappingProps>;
    contextType?: React.Context<any> | undefined;
}, {}> & {
    ComposedComponent: {
        new (props: MappingProps): {
            componentDidMount(): void;
            componentDidUpdate(prevProps: MappingProps): void;
            reload(): void;
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: object | ((prevState: object, props: Readonly<MappingProps>) => object | Pick<object, K_1> | null) | Pick<object, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<MappingProps> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: object;
            refs: {
                [key: string]: React.ReactInstance;
            };
            shouldComponentUpdate?(nextProps: Readonly<MappingProps>, nextState: object, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<MappingProps>, prevState: object): any;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<MappingProps>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<MappingProps>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<MappingProps>, nextState: object, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<MappingProps>, nextState: object, nextContext: any): void;
        };
        defaultProps: Partial<MappingProps>;
        contextType?: React.Context<any> | undefined;
    };
};
export declare class MappingFieldRenderer extends React.Component<RendererProps> {
    render(): JSX.Element;
}
