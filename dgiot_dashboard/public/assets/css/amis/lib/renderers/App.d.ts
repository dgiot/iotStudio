import React from 'react';
import { RendererProps } from '../factory';
import { BaseSchema, SchemaApi, SchemaClassName, SchemaCollection } from '../Schema';
import { IScopedContext } from '../Scoped';
import { IAppStore } from '../store/app';
export interface AppPage {
    /**
     * 菜单文字
     */
    label?: string;
    /**
     * 菜单图标，比如： fa fa-file
     */
    icon?: string;
    /**
     * 路由规则。比如：/banner/:id。当地址以 / 打头，则不继承上层的路径，否则将集成父级页面的路径。
     */
    url?: string;
    /**
     * 当match url 时跳转到目标地址.没有配置 schema 和 shcemaApi  时有效.
     */
    redirect?: string;
    /**
     * 当match url 转成渲染目标地址的页面.没有配置 schema 和 shcemaApi  时有效.
     */
    rewrite?: string;
    /**
     * 不要出现多个，如果出现多个只有第一个有用。在路由找不到的时候作为默认页面。
     */
    isDefaultPage?: boolean;
    /**
     * 二选一，如果配置了 url 一定要配置。否则不知道如何渲染。
     */
    schema?: any;
    schemaApi?: any;
    /**
     * 单纯的地址。可以设置外部链接。
     */
    link?: string;
    /**
     * 支持多层级。
     */
    children?: Array<AppPage>;
    /**
     * 菜单上的类名
     */
    className?: SchemaClassName;
    /**
     * 是否在导航中可见，适合于那种需要携带参数才显示的页面。比如具体某个数据的编辑页面。
     */
    visible?: boolean;
}
/**
 * App 渲染器，适合 JSSDK 用来做多页渲染。
 * 文档：https://baidu.gitee.io/amis/docs/components/app
 */
export interface AppSchema extends BaseSchema {
    /**
     * 指定为 app 类型。
     */
    type: 'app';
    api?: SchemaApi;
    /**
     * 系统名称
     */
    brandName?: string;
    /**
     * logo 图片地址，可以是 svg。
     */
    logo?: string;
    /**
     * 顶部区域
     */
    header?: SchemaCollection;
    /**
     * 边栏菜单前面的区域
     */
    asideBefore?: SchemaCollection;
    /**
     * 边栏菜单后面的区域
     */
    asideAfter?: SchemaCollection;
    /**
     * 页面集合。
     */
    pages?: Array<AppPage> | AppPage;
    /**
     * 底部区域。
     */
    footer?: SchemaCollection;
    /**
     * css 类名。
     */
    className?: SchemaClassName;
}
export interface AppProps extends RendererProps, Omit<AppSchema, 'type' | 'className'> {
    children?: JSX.Element | ((props?: any) => JSX.Element);
    store: IAppStore;
}
export default class App extends React.Component<AppProps, object> {
    static propsList: Array<string>;
    static defaultProps: {};
    unWatchRouteChange?: () => void;
    constructor(props: AppProps);
    componentDidMount(): Promise<void>;
    componentDidUpdate(prevProps: AppProps): Promise<void>;
    componentWillUnmount(): void;
    reload(subpath?: any, query?: any, ctx?: any, silent?: boolean): Promise<void>;
    receive(values: object): void;
    handleNavClick(e: React.MouseEvent): void;
    renderHeader(): JSX.Element;
    renderAside(): JSX.Element;
    renderFooter(): JSX.Element | null;
    render(): JSX.Element;
}
export declare class AppRenderer extends App {
    static contextType: React.Context<IScopedContext>;
    constructor(props: AppProps, context: IScopedContext);
    componentWillUnmount(): void;
}
