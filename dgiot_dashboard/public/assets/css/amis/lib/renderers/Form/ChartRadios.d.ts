import React from 'react';
import { OptionsControlProps, FormOptionsControl } from './Options';
/**
 * 图表 Radio 单选框。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/chart-radios
 */
export interface ChartRadiosControlSchema extends FormOptionsControl {
    type: 'chart-radios';
    config: any;
    showTooltipOnHighlight?: boolean;
    chartValueField?: string;
}
export interface ChartRadiosProps extends OptionsControlProps {
    placeholder?: any;
    labelClassName?: string;
    labelField?: string;
    config: any;
}
export default class ChartRadiosControl extends React.Component<ChartRadiosProps, any> {
    highlightIndex: number;
    prevIndex: number;
    chart?: any;
    chartRef(chart?: any): void;
    highlight(index?: number): void;
    compoonentDidMount(): void;
    componentDidUpdate(): void;
    render(): JSX.Element;
}
export declare class RadiosControlRenderer extends ChartRadiosControl {
    static defaultProps: {
        multiple: boolean;
    };
}
