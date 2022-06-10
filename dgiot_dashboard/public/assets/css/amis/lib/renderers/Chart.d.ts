import React from 'react';
import { RendererProps } from '../factory';
import { IServiceStore } from '../store/service';
import { IScopedContext } from '../Scoped';
import { BaseSchema, SchemaApi, SchemaExpression, SchemaFunction, SchemaName, SchemaTokenizeableString } from '../Schema';
import { ActionSchema } from './Action';
/**
 * Chart 图表渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/carousel
 */
export interface ChartSchema extends BaseSchema {
    /**
     * 指定为 chart 类型
     */
    type: 'chart';
    /**
     * Chart 主题配置
     */
    chartTheme?: any;
    /**
     * 图表配置接口
     */
    api?: SchemaApi;
    /**
     * 是否初始加载。
     * @deprecated 建议直接配置 api 的 sendOn
     */
    initFetch?: boolean;
    /**
     * 是否初始加载用表达式来配置
     * @deprecated 建议用 api.sendOn 属性。
     */
    initFetchOn?: SchemaExpression;
    /**
     * 配置echart的config，支持数据映射。如果用了数据映射，为了同步更新，请设置 trackExpression
     */
    config?: any;
    /**
     * 跟踪表达式，如果这个表达式的运行结果发生变化了，则会更新 Echart，当 config 中用了数据映射时有用。
     */
    trackExpression?: string;
    /**
     * 宽度设置
     */
    width?: number;
    /**
     * 高度设置
     */
    height?: number;
    /**
     * 刷新时间
     */
    interval?: number;
    name?: SchemaName;
    /**
     * style样式
     */
    style?: {
        [propName: string]: any;
    };
    dataFilter?: SchemaFunction;
    source?: SchemaTokenizeableString;
    /**
     * 默认开启 Config 中的数据映射，如果想关闭，请开启此功能。
     */
    disableDataMapping?: boolean;
    /**
     * 点击行为配置，可以用来满足下钻操作等。
     */
    clickAction?: ActionSchema;
    /**
     * 默认配置时追加的，如果更新配置想完全替换配置请配置为 true.
     */
    replaceChartOption?: boolean;
    /**
     * 不可见的时候隐藏
     */
    unMountOnHidden?: boolean;
}
export interface ChartProps extends RendererProps, Omit<ChartSchema, 'type' | 'className'> {
    chartRef?: (echart: any) => void;
    onDataFilter?: (config: any, echarts: any, data?: any) => any;
    onChartWillMount?: (echarts: any) => void | Promise<void>;
    onChartMount?: (chart: any, echarts: any) => void;
    onChartUnMount?: (chart: any, echarts: any) => void;
    store: IServiceStore;
}
export declare class Chart extends React.Component<ChartProps> {
    static defaultProps: Partial<ChartProps>;
    static propsList: Array<string>;
    ref: any;
    echarts?: any;
    unSensor: Function;
    pending?: object;
    pendingCtx?: any;
    timer: ReturnType<typeof setTimeout>;
    mounted: boolean;
    reloadCancel?: Function;
    constructor(props: ChartProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: ChartProps): void;
    componentWillUnmount(): void;
    handleClick(ctx: object): void;
    refFn(ref: any): void;
    reload(subpath?: string, query?: any): void;
    receive(data: object): void;
    renderChart(config?: object, data?: any): void;
    render(): JSX.Element;
}
export declare class ChartRenderer extends Chart {
    static contextType: React.Context<IScopedContext>;
    constructor(props: ChartProps, context: IScopedContext);
    componentWillUnmount(): void;
}
