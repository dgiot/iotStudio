/// <reference types="lodash" />
/**
 * 一个可以拉取远程配置的 HOC
 *
 */
import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { Api, Payload } from '../types';
import { SchemaApi, SchemaTokenizeableString } from '../Schema';
import { RendererEnv } from '../env';
import { Instance } from 'mobx-state-tree';
export declare const Store: import("mobx-state-tree").IModelType<{
    fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
    config: import("mobx-state-tree").IType<any, any, any>;
    data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
}, {
    setComponent(c: any): void;
    load: (env: RendererEnv, api: Api, ctx: any, config: WithRemoteConfigSettings) => Promise<any>;
    setData(data: any): void;
    setConfig(options: any, config: WithRemoteConfigSettings, motivation?: any): void;
}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>;
export declare type IStore = Instance<typeof Store>;
export interface OutterProps {
    env?: RendererEnv;
    data: any;
    source?: SchemaApi | SchemaTokenizeableString;
    autoComplete?: SchemaApi | SchemaTokenizeableString;
    deferApi?: SchemaApi;
    remoteConfigRef?: (instance: {
        loadConfig: (ctx?: any) => Promise<any> | void;
        setConfig: (value: any) => void;
    } | undefined) => void;
}
export interface RemoteOptionsProps<T = any> {
    config: T;
    loading?: boolean;
    deferLoad: (item: any) => Promise<any>;
    updateConfig: (value: T, ctx?: any) => void;
}
export interface WithRemoteConfigSettings {
    /**
     * 从接口返回数据适配到配置
     */
    adaptor?: (json: any, props: any) => any;
    /**
     * 配置格式化
     */
    normalizeConfig?: (config: any, origin: any, props: any, motivation?: any) => any;
    /**
     * 请求返回后的回调
     */
    afterLoad?: (ret: any, config: any, props: any) => void;
    /**
     * 懒加载选项相关，开始懒加载的回调
     */
    beforeDeferLoad?: (item: any, indexes: Array<number>, config: any, props: any) => any;
    /**
     * 懒加载选项相关，结束懒加载的回调
     */
    afterDeferLoad?: (item: any, indexes: Array<number>, reponse: Payload, config: any, props: any) => any;
}
export declare function withRemoteConfig<P = any>(config?: WithRemoteConfigSettings): <T extends React.ComponentType<React.ComponentProps<T> & RemoteOptionsProps<P>>>(ComposedComponent: T) => {
    new (props: Omit<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
        store: IStore;
    }, "store"> | Readonly<Omit<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
        store: IStore;
    }, "store">>): {
        ref: any;
        store?: ({
            fetching: boolean;
            errorMsg: string;
            config: any;
            data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
        } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
            setComponent(c: any): void;
            load: (env: RendererEnv, api: Api, ctx: any, config: WithRemoteConfigSettings) => Promise<any>;
            setData(data: any): void;
            setConfig(options: any, config: WithRemoteConfigSettings, motivation?: any): void;
        } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
            fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
            config: import("mobx-state-tree").IType<any, any, any>;
            data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
        }, {
            setComponent(c: any): void;
            load: (env: RendererEnv, api: Api, ctx: any, config: WithRemoteConfigSettings) => Promise<any>;
            setData(data: any): void;
            setConfig(options: any, config: WithRemoteConfigSettings, motivation?: any): void;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>) | undefined;
        refFn: (ref: any) => void;
        componentWillUnmount(): void;
        getWrappedInstance(): any;
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
            store: IStore;
        }, "store">>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
            store: IStore;
        }, "store">> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
            store: IStore;
        }, "store">>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
            store: IStore;
        }, "store">>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
            store: IStore;
        }, "store">>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
            store: IStore;
        }, "store">>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
            store: IStore;
        }, "store">>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
            store: IStore;
        }, "store">>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
            store: IStore;
        }, "store">>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Omit<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
        store: IStore;
    }, "store">, context: any): {
        ref: any;
        store?: ({
            fetching: boolean;
            errorMsg: string;
            config: any;
            data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
        } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
            setComponent(c: any): void;
            load: (env: RendererEnv, api: Api, ctx: any, config: WithRemoteConfigSettings) => Promise<any>;
            setData(data: any): void;
            setConfig(options: any, config: WithRemoteConfigSettings, motivation?: any): void;
        } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
            fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
            config: import("mobx-state-tree").IType<any, any, any>;
            data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
        }, {
            setComponent(c: any): void;
            load: (env: RendererEnv, api: Api, ctx: any, config: WithRemoteConfigSettings) => Promise<any>;
            setData(data: any): void;
            setConfig(options: any, config: WithRemoteConfigSettings, motivation?: any): void;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>) | undefined;
        refFn: (ref: any) => void;
        componentWillUnmount(): void;
        getWrappedInstance(): any;
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
            store: IStore;
        }, "store">>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
            store: IStore;
        }, "store">> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
            store: IStore;
        }, "store">>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
            store: IStore;
        }, "store">>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
            store: IStore;
        }, "store">>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
            store: IStore;
        }, "store">>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
            store: IStore;
        }, "store">>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
            store: IStore;
        }, "store">>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
            store: IStore;
        }, "store">>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    ComposedComponent: React.ComponentType<{
        new (props: JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
            store: IStore;
        }): {
            toDispose: Array<() => void>;
            loadOptions: import("lodash").DebouncedFunc<any>;
            componentDidMount(): void;
            componentDidUpdate(prevProps: any): void;
            componentWillUnmount(): void;
            loadConfig(ctx?: (JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
                store: IStore;
            })["data"]): Promise<void>;
            loadAutoComplete(input: string): Promise<any>;
            setConfig(value: any, ctx?: any): void;
            syncConfig(): void;
            deferLoadConfig(item: any): Promise<void>;
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
                store: IStore;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
                store: IStore;
            }> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<{}>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            shouldComponentUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
                store: IStore;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
                store: IStore;
            }>, prevState: Readonly<{}>): any;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
                store: IStore;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
                store: IStore;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
                store: IStore;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
                store: IStore;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        ComposedComponent: React.ComponentType<T>;
        contextType: React.Context<void | RendererEnv>;
    }>;
    contextType?: React.Context<any> | undefined;
} & hoistNonReactStatic.NonReactStatics<{
    new (props: JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
        store: IStore;
    }): {
        toDispose: Array<() => void>;
        loadOptions: import("lodash").DebouncedFunc<any>;
        componentDidMount(): void;
        componentDidUpdate(prevProps: any): void;
        componentWillUnmount(): void;
        loadConfig(ctx?: (JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
            store: IStore;
        })["data"]): Promise<void>;
        loadAutoComplete(input: string): Promise<any>;
        setConfig(value: any, ctx?: any): void;
        syncConfig(): void;
        deferLoadConfig(item: any): Promise<void>;
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
            store: IStore;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
            store: IStore;
        }> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        shouldComponentUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
            store: IStore;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
            store: IStore;
        }>, prevState: Readonly<{}>): any;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
            store: IStore;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
            store: IStore;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
            store: IStore;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
            store: IStore;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    ComposedComponent: React.ComponentType<T>;
    contextType: React.Context<void | RendererEnv>;
}, {}> & {
    ComposedComponent: {
        new (props: JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
            store: IStore;
        }): {
            toDispose: Array<() => void>;
            loadOptions: import("lodash").DebouncedFunc<any>;
            componentDidMount(): void;
            componentDidUpdate(prevProps: any): void;
            componentWillUnmount(): void;
            loadConfig(ctx?: (JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
                store: IStore;
            })["data"]): Promise<void>;
            loadAutoComplete(input: string): Promise<any>;
            setConfig(value: any, ctx?: any): void;
            syncConfig(): void;
            deferLoadConfig(item: any): Promise<void>;
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
                store: IStore;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
                store: IStore;
            }> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<{}>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            shouldComponentUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
                store: IStore;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
                store: IStore;
            }>, prevState: Readonly<{}>): any;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
                store: IStore;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
                store: IStore;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
                store: IStore;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>> & OutterProps & {
                store: IStore;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        ComposedComponent: React.ComponentType<T>;
        contextType: React.Context<void | RendererEnv>;
    };
} & hoistNonReactStatic.NonReactStatics<T, {}> & {
    ComposedComponent: T;
};
