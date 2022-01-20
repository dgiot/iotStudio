import React from 'react';
import { RendererProps } from '../factory';
import { IServiceStore } from '../store/service';
import { Api, RendererData, Action } from '../types';
import { IScopedContext } from '../Scoped';
import { BaseSchema, SchemaApi, SchemaCollection, SchemaExpression, SchemaMessage, SchemaName } from '../Schema';
/**
 * Service 服务类控件。
 * 文档：https://baidu.gitee.io/amis/docs/components/service
 */
export interface ServiceSchema extends BaseSchema {
    /**
     * 指定为 Service 数据拉取控件。
     */
    type: 'service';
    /**
     * 页面初始化的时候，可以设置一个 API 让其取拉取，发送数据会携带当前 data 数据（包含地址栏参数），获取得数据会合并到 data 中，供组件内使用。
     */
    api?: SchemaApi;
    /**
     * WebScocket 地址，用于实时获取数据
     */
    ws?: string;
    /**
     * 通过调用外部函数来获取数据
     */
    dataProvider?: string | Function;
    /**
     * 内容区域
     */
    body?: SchemaCollection;
    /**
     * @deprecated 改成 api 的 sendOn。
     */
    fetchOn?: SchemaExpression;
    /**
     * 是否默认就拉取？
     */
    initFetch?: boolean;
    /**
     * 是否默认就拉取？通过表达式来决定.
     *
     * @deprecated 改成 api 的 sendOn。
     */
    initFetchOn?: SchemaExpression;
    /**
     * 用来获取远程 Schema 的 api
     */
    schemaApi?: SchemaApi;
    /**
     * 是否默认加载 schemaApi
     */
    initFetchSchema?: boolean;
    /**
     * 用表达式来配置。
     * @deprecated 改成 api 的 sendOn。
     */
    initFetchSchemaOn?: SchemaExpression;
    /**
     * 是否轮询拉取
     */
    interval?: number;
    /**
     * 是否静默拉取
     */
    silentPolling?: boolean;
    /**
     * 关闭轮询的条件。
     */
    stopAutoRefreshWhen?: SchemaExpression;
    messages?: SchemaMessage;
    name?: SchemaName;
}
export interface ServiceProps extends RendererProps, Omit<ServiceSchema, 'type' | 'className'> {
    store: IServiceStore;
    messages: SchemaMessage;
}
export default class Service extends React.Component<ServiceProps> {
    timer: ReturnType<typeof setTimeout>;
    mounted: boolean;
    socket: any;
    dataProviderUnsubscribe?: Function;
    static defaultProps: Partial<ServiceProps>;
    static propsList: Array<string>;
    constructor(props: ServiceProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: ServiceProps): void;
    componentWillUnmount(): void;
    initFetch(): void;
    runDataProvider(): Promise<void>;
    runDataProviderUnsubscribe(): void;
    dataProviderSetData(data: any): void;
    fetchWSData(ws: string | Api, data: any): void;
    afterDataFetch(result: any): void;
    afterSchemaFetch(schema: any): void;
    initInterval(value: any): any;
    reload(subpath?: string, query?: any, ctx?: RendererData, silent?: boolean): void;
    silentReload(target?: string, query?: any): void;
    receive(values: object): void;
    handleQuery(query: any): void;
    reloadTarget(target: string, data?: any): void;
    openFeedback(dialog: any, ctx: any): Promise<unknown>;
    handleAction(e: React.UIEvent<any> | void, action: Action, data: object, throwErrors?: boolean, delegate?: IScopedContext): void;
    handleChange(value: any, name: string, submit?: boolean, changePristine?: boolean): void;
    renderBody(): JSX.Element;
    render(): JSX.Element;
}
export declare class ServiceRenderer extends Service {
    static contextType: React.Context<IScopedContext>;
    constructor(props: ServiceProps, context: IScopedContext);
    reload(subpath?: string, query?: any, ctx?: any, silent?: boolean): void;
    receive(values: any, subPath?: string): void;
    componentWillUnmount(): void;
    reloadTarget(target: string, data?: any): void;
}
