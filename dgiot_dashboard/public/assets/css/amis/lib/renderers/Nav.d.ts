/// <reference types="hoist-non-react-statics" />
import React from 'react';
import Sortable from 'sortablejs';
import { RendererEnv, RendererProps } from '../factory';
import { IScopedContext } from '../Scoped';
import { ThemeProps } from '../theme';
import { BaseSchema, SchemaApi, SchemaIcon, SchemaUrlPath, SchemaCollection } from '../Schema';
import { BadgeSchema } from '../components/Badge';
export declare type NavItemSchema = {
    /**
     * 文字说明
     */
    label?: string | SchemaCollection;
    /**
     * 图标类名，参考 fontawesome 4。
     */
    icon?: SchemaIcon;
    to?: SchemaUrlPath;
    target?: string;
    unfolded?: boolean;
    active?: boolean;
    defer?: boolean;
    deferApi?: SchemaApi;
    children?: Array<NavItemSchema>;
    /**
     * 角标
     */
    badge?: BadgeSchema;
} & Omit<BaseSchema, 'type'>;
/**
 * Nav 导航渲染器
 * 文档：https://baidu.gitee.io/amis/docs/components/nav
 */
export interface NavSchema extends BaseSchema {
    /**
     * 指定为 Nav 导航渲染器
     */
    type: 'nav';
    /**
     * 链接地址集合
     */
    links?: Array<NavItemSchema>;
    /**
     * @default 24
     */
    indentSize: number;
    /**
     * 可以通过 API 拉取。
     */
    source?: SchemaApi;
    /**
     * 懒加载 api，如果不配置复用 source 接口。
     */
    deferApi?: SchemaApi;
    /**
     * true 为垂直排列，false 为水平排列类似如 tabs。
     */
    stacked?: boolean;
    /**
     * 更多操作菜单列表
     */
    itemActions?: SchemaCollection;
    /**
     * 可拖拽
     */
    draggable?: boolean;
    /**
     * 保存排序的 api
     */
    saveOrderApi?: SchemaApi;
    /**
     * 角标
     */
    badge?: BadgeSchema;
}
export interface Link {
    className?: string;
    label?: string | SchemaCollection;
    to?: string;
    target?: string;
    icon?: string;
    active?: boolean;
    activeOn?: string;
    unfolded?: boolean;
    children?: Links;
    defer?: boolean;
    loading?: boolean;
    loaded?: boolean;
    [propName: string]: any;
    badge?: BadgeSchema;
}
export interface Links extends Array<Link> {
}
export interface NavigationState {
    links: Links;
    error?: string;
}
export interface NavigationProps extends ThemeProps, Omit<NavSchema, 'type' | 'className'> {
    onSelect?: (item: Link) => void | false;
    onToggle?: (item: Link) => void;
    togglerClassName?: string;
    links?: Array<Link>;
    loading?: boolean;
    render: RendererProps['render'];
    env: RendererEnv;
    reload?: any;
}
export declare class Navigation extends React.Component<NavigationProps, NavigationState> {
    static defaultProps: {
        indentSize: number;
    };
    sortable: Sortable[];
    id: string;
    dragRef?: HTMLElement;
    handleClick(link: Link): void;
    toggleLink(target: Link): void;
    dragRefFn(ref: any): void;
    initDragging(ref: HTMLElement): void;
    renderItem(link: Link, index: number, depth?: number): JSX.Element | null;
    render(): JSX.Element;
}
declare const ThemedNavigation: {
    new (props: (Pick<Omit<NavigationProps, keyof ThemeProps>, "source" | "hidden" | "reload" | "disabled" | "onToggle" | "loading" | "visible" | "render" | "env" | "links" | "draggable" | "onSelect" | "$ref" | "disabledOn" | "hiddenOn" | "visibleOn" | "badge" | "deferApi" | "itemActions" | "stacked" | "saveOrderApi" | "togglerClassName"> & Partial<Pick<Omit<NavigationProps, keyof ThemeProps>, "indentSize">> & Partial<Pick<{
        indentSize: number;
    }, never>> & import("../theme").ThemeOutterProps) | Readonly<Pick<Omit<NavigationProps, keyof ThemeProps>, "source" | "hidden" | "reload" | "disabled" | "onToggle" | "loading" | "visible" | "render" | "env" | "links" | "draggable" | "onSelect" | "$ref" | "disabledOn" | "hiddenOn" | "visibleOn" | "badge" | "deferApi" | "itemActions" | "stacked" | "saveOrderApi" | "togglerClassName"> & Partial<Pick<Omit<NavigationProps, keyof ThemeProps>, "indentSize">> & Partial<Pick<{
        indentSize: number;
    }, never>> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<NavigationProps, keyof ThemeProps>, "source" | "hidden" | "reload" | "disabled" | "onToggle" | "loading" | "visible" | "render" | "env" | "links" | "draggable" | "onSelect" | "$ref" | "disabledOn" | "hiddenOn" | "visibleOn" | "badge" | "deferApi" | "itemActions" | "stacked" | "saveOrderApi" | "togglerClassName"> & Partial<Pick<Omit<NavigationProps, keyof ThemeProps>, "indentSize">> & Partial<Pick<{
            indentSize: number;
        }, never>> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<NavigationProps, keyof ThemeProps>, "source" | "hidden" | "reload" | "disabled" | "onToggle" | "loading" | "visible" | "render" | "env" | "links" | "draggable" | "onSelect" | "$ref" | "disabledOn" | "hiddenOn" | "visibleOn" | "badge" | "deferApi" | "itemActions" | "stacked" | "saveOrderApi" | "togglerClassName"> & Partial<Pick<Omit<NavigationProps, keyof ThemeProps>, "indentSize">> & Partial<Pick<{
            indentSize: number;
        }, never>> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<NavigationProps, keyof ThemeProps>, "source" | "hidden" | "reload" | "disabled" | "onToggle" | "loading" | "visible" | "render" | "env" | "links" | "draggable" | "onSelect" | "$ref" | "disabledOn" | "hiddenOn" | "visibleOn" | "badge" | "deferApi" | "itemActions" | "stacked" | "saveOrderApi" | "togglerClassName"> & Partial<Pick<Omit<NavigationProps, keyof ThemeProps>, "indentSize">> & Partial<Pick<{
            indentSize: number;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<NavigationProps, keyof ThemeProps>, "source" | "hidden" | "reload" | "disabled" | "onToggle" | "loading" | "visible" | "render" | "env" | "links" | "draggable" | "onSelect" | "$ref" | "disabledOn" | "hiddenOn" | "visibleOn" | "badge" | "deferApi" | "itemActions" | "stacked" | "saveOrderApi" | "togglerClassName"> & Partial<Pick<Omit<NavigationProps, keyof ThemeProps>, "indentSize">> & Partial<Pick<{
            indentSize: number;
        }, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<NavigationProps, keyof ThemeProps>, "source" | "hidden" | "reload" | "disabled" | "onToggle" | "loading" | "visible" | "render" | "env" | "links" | "draggable" | "onSelect" | "$ref" | "disabledOn" | "hiddenOn" | "visibleOn" | "badge" | "deferApi" | "itemActions" | "stacked" | "saveOrderApi" | "togglerClassName"> & Partial<Pick<Omit<NavigationProps, keyof ThemeProps>, "indentSize">> & Partial<Pick<{
            indentSize: number;
        }, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<NavigationProps, keyof ThemeProps>, "source" | "hidden" | "reload" | "disabled" | "onToggle" | "loading" | "visible" | "render" | "env" | "links" | "draggable" | "onSelect" | "$ref" | "disabledOn" | "hiddenOn" | "visibleOn" | "badge" | "deferApi" | "itemActions" | "stacked" | "saveOrderApi" | "togglerClassName"> & Partial<Pick<Omit<NavigationProps, keyof ThemeProps>, "indentSize">> & Partial<Pick<{
            indentSize: number;
        }, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<NavigationProps, keyof ThemeProps>, "source" | "hidden" | "reload" | "disabled" | "onToggle" | "loading" | "visible" | "render" | "env" | "links" | "draggable" | "onSelect" | "$ref" | "disabledOn" | "hiddenOn" | "visibleOn" | "badge" | "deferApi" | "itemActions" | "stacked" | "saveOrderApi" | "togglerClassName"> & Partial<Pick<Omit<NavigationProps, keyof ThemeProps>, "indentSize">> & Partial<Pick<{
            indentSize: number;
        }, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<NavigationProps, keyof ThemeProps>, "source" | "hidden" | "reload" | "disabled" | "onToggle" | "loading" | "visible" | "render" | "env" | "links" | "draggable" | "onSelect" | "$ref" | "disabledOn" | "hiddenOn" | "visibleOn" | "badge" | "deferApi" | "itemActions" | "stacked" | "saveOrderApi" | "togglerClassName"> & Partial<Pick<Omit<NavigationProps, keyof ThemeProps>, "indentSize">> & Partial<Pick<{
            indentSize: number;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<NavigationProps, keyof ThemeProps>, "source" | "hidden" | "reload" | "disabled" | "onToggle" | "loading" | "visible" | "render" | "env" | "links" | "draggable" | "onSelect" | "$ref" | "disabledOn" | "hiddenOn" | "visibleOn" | "badge" | "deferApi" | "itemActions" | "stacked" | "saveOrderApi" | "togglerClassName"> & Partial<Pick<Omit<NavigationProps, keyof ThemeProps>, "indentSize">> & Partial<Pick<{
            indentSize: number;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Pick<Omit<NavigationProps, keyof ThemeProps>, "source" | "hidden" | "reload" | "disabled" | "onToggle" | "loading" | "visible" | "render" | "env" | "links" | "draggable" | "onSelect" | "$ref" | "disabledOn" | "hiddenOn" | "visibleOn" | "badge" | "deferApi" | "itemActions" | "stacked" | "saveOrderApi" | "togglerClassName"> & Partial<Pick<Omit<NavigationProps, keyof ThemeProps>, "indentSize">> & Partial<Pick<{
        indentSize: number;
    }, never>> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<NavigationProps, keyof ThemeProps>, "source" | "hidden" | "reload" | "disabled" | "onToggle" | "loading" | "visible" | "render" | "env" | "links" | "draggable" | "onSelect" | "$ref" | "disabledOn" | "hiddenOn" | "visibleOn" | "badge" | "deferApi" | "itemActions" | "stacked" | "saveOrderApi" | "togglerClassName"> & Partial<Pick<Omit<NavigationProps, keyof ThemeProps>, "indentSize">> & Partial<Pick<{
            indentSize: number;
        }, never>> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<NavigationProps, keyof ThemeProps>, "source" | "hidden" | "reload" | "disabled" | "onToggle" | "loading" | "visible" | "render" | "env" | "links" | "draggable" | "onSelect" | "$ref" | "disabledOn" | "hiddenOn" | "visibleOn" | "badge" | "deferApi" | "itemActions" | "stacked" | "saveOrderApi" | "togglerClassName"> & Partial<Pick<Omit<NavigationProps, keyof ThemeProps>, "indentSize">> & Partial<Pick<{
            indentSize: number;
        }, never>> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<NavigationProps, keyof ThemeProps>, "source" | "hidden" | "reload" | "disabled" | "onToggle" | "loading" | "visible" | "render" | "env" | "links" | "draggable" | "onSelect" | "$ref" | "disabledOn" | "hiddenOn" | "visibleOn" | "badge" | "deferApi" | "itemActions" | "stacked" | "saveOrderApi" | "togglerClassName"> & Partial<Pick<Omit<NavigationProps, keyof ThemeProps>, "indentSize">> & Partial<Pick<{
            indentSize: number;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<NavigationProps, keyof ThemeProps>, "source" | "hidden" | "reload" | "disabled" | "onToggle" | "loading" | "visible" | "render" | "env" | "links" | "draggable" | "onSelect" | "$ref" | "disabledOn" | "hiddenOn" | "visibleOn" | "badge" | "deferApi" | "itemActions" | "stacked" | "saveOrderApi" | "togglerClassName"> & Partial<Pick<Omit<NavigationProps, keyof ThemeProps>, "indentSize">> & Partial<Pick<{
            indentSize: number;
        }, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<NavigationProps, keyof ThemeProps>, "source" | "hidden" | "reload" | "disabled" | "onToggle" | "loading" | "visible" | "render" | "env" | "links" | "draggable" | "onSelect" | "$ref" | "disabledOn" | "hiddenOn" | "visibleOn" | "badge" | "deferApi" | "itemActions" | "stacked" | "saveOrderApi" | "togglerClassName"> & Partial<Pick<Omit<NavigationProps, keyof ThemeProps>, "indentSize">> & Partial<Pick<{
            indentSize: number;
        }, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<NavigationProps, keyof ThemeProps>, "source" | "hidden" | "reload" | "disabled" | "onToggle" | "loading" | "visible" | "render" | "env" | "links" | "draggable" | "onSelect" | "$ref" | "disabledOn" | "hiddenOn" | "visibleOn" | "badge" | "deferApi" | "itemActions" | "stacked" | "saveOrderApi" | "togglerClassName"> & Partial<Pick<Omit<NavigationProps, keyof ThemeProps>, "indentSize">> & Partial<Pick<{
            indentSize: number;
        }, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<NavigationProps, keyof ThemeProps>, "source" | "hidden" | "reload" | "disabled" | "onToggle" | "loading" | "visible" | "render" | "env" | "links" | "draggable" | "onSelect" | "$ref" | "disabledOn" | "hiddenOn" | "visibleOn" | "badge" | "deferApi" | "itemActions" | "stacked" | "saveOrderApi" | "togglerClassName"> & Partial<Pick<Omit<NavigationProps, keyof ThemeProps>, "indentSize">> & Partial<Pick<{
            indentSize: number;
        }, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<NavigationProps, keyof ThemeProps>, "source" | "hidden" | "reload" | "disabled" | "onToggle" | "loading" | "visible" | "render" | "env" | "links" | "draggable" | "onSelect" | "$ref" | "disabledOn" | "hiddenOn" | "visibleOn" | "badge" | "deferApi" | "itemActions" | "stacked" | "saveOrderApi" | "togglerClassName"> & Partial<Pick<Omit<NavigationProps, keyof ThemeProps>, "indentSize">> & Partial<Pick<{
            indentSize: number;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<NavigationProps, keyof ThemeProps>, "source" | "hidden" | "reload" | "disabled" | "onToggle" | "loading" | "visible" | "render" | "env" | "links" | "draggable" | "onSelect" | "$ref" | "disabledOn" | "hiddenOn" | "visibleOn" | "badge" | "deferApi" | "itemActions" | "stacked" | "saveOrderApi" | "togglerClassName"> & Partial<Pick<Omit<NavigationProps, keyof ThemeProps>, "indentSize">> & Partial<Pick<{
            indentSize: number;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof Navigation>;
} & import("hoist-non-react-statics").NonReactStatics<typeof Navigation, {}> & {
    ComposedComponent: typeof Navigation;
};
export default ThemedNavigation;
export declare class NavigationRenderer extends React.Component<RendererProps> {
    static contextType: React.Context<IScopedContext>;
    remoteRef: {
        loadConfig: (ctx?: any) => Promise<any> | void;
        setConfig: (value: any) => void;
    } | undefined;
    remoteConfigRef(ref: any): void;
    constructor(props: RendererProps, context: IScopedContext);
    componentWillUnmount(): void;
    reload(target?: string, query?: any, values?: object): void;
    receive(values: object): void;
    render(): JSX.Element;
}
