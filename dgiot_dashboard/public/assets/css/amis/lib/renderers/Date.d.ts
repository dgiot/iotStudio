import React from 'react';
import { RendererProps } from '../factory';
import { BaseSchema } from '../Schema';
/**
 * Date 展示渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/date
 */
export interface DateSchema extends BaseSchema {
    /**
     * 指定为日期展示类型
     */
    type: 'date' | 'datetime' | 'time' | 'static-date' | 'static-datetime' | 'static-time';
    /**
     * 展示的时间格式，参考 moment 中的格式说明。
     */
    format?: string;
    /**
     * 占位符
     */
    placeholder?: string;
    /**
     * 值的时间格式，参考 moment 中的格式说明。
     */
    valueFormat?: string;
    /**
     * 显示成相对时间，比如1分钟前
     */
    fromNow?: boolean;
    /**
     * 更新频率， 默认为1分钟
     */
    updateFrequency?: number;
}
export interface DateProps extends RendererProps, Omit<DateSchema, 'type' | 'className'> {
}
export interface DateState {
    random?: number;
}
export declare class DateField extends React.Component<DateProps, DateState> {
    refreshInterval: ReturnType<typeof setTimeout>;
    static defaultProps: Pick<DateProps, 'placeholder' | 'format' | 'valueFormat' | 'fromNow' | 'updateFrequency'>;
    state: DateState;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export declare class DateFieldRenderer extends DateField {
    static defaultProps: Partial<DateProps>;
}
export declare class DateTimeFieldRenderer extends DateField {
    static defaultProps: Partial<DateProps>;
}
export declare class TimeFieldRenderer extends DateField {
    static defaultProps: Partial<DateProps>;
}
export declare class MonthFieldRenderer extends DateField {
    static defaultProps: Partial<DateProps>;
}
