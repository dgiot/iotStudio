import React from 'react';
import { FormControlProps, FormBaseControl } from './Item';
import moment from 'moment';
import 'moment/locale/zh-cn';
export interface InputDateBaseControlSchema extends FormBaseControl {
    /**
     * 指定为日期选择控件
     */
    type: 'input-date' | 'input-datetime' | 'input-time' | 'input-month' | 'input-quarter' | 'input-year';
    /**
     * 是否显示清除按钮
     */
    clearable?: boolean;
    /**
     * 日期存储格式
     */
    format?: string;
    /**
     * 日期展示格式
     */
    inputFormat?: string;
    /**
     * 设定是否存储 utc 时间。
     */
    utc?: boolean;
    /**
     * 是否为内联模式？
     */
    emebed?: boolean;
    /**
     * 边框模式，全边框，还是半边框，或者没边框。
     */
    borderMode?: 'full' | 'half' | 'none';
}
/**
 * Date日期选择控件
 * 文档：https://baidu.gitee.io/amis/docs/components/form/date
 */
export interface DateControlSchema extends InputDateBaseControlSchema {
    /**
     * 指定为日期选择控件
     */
    type: 'input-date';
    /**
     * 日期存储格式
     * @default X
     */
    format?: string;
    /**
     * 日期展示格式
     * @default YYYY-MM-DD
     */
    inputFormat?: string;
    /**
     * 点选日期后是否关闭弹窗
     */
    closeOnSelect?: boolean;
    /**
     * 限制最小日期
     */
    minDate?: string;
    /**
     * 限制最大日期
     */
    maxDate?: string;
}
/**
 * Datetime日期时间选择控件
 * 文档：https://baidu.gitee.io/amis/docs/components/form/datetime
 */
export interface DateTimeControlSchema extends InputDateBaseControlSchema {
    /**
     * 指定为日期时间选择控件
     */
    type: 'input-datetime';
    /**
     * 日期存储格式
     * @default X
     */
    format?: string;
    /**
     * 日期展示格式
     * @default YYYY-MM-DD HH:mm
     */
    inputFormat?: string;
    /**
     * 时间的格式。
     *
     * @default HH:mm
     */
    timeFormat?: string;
    /**
     * 限制最小日期
     */
    minDate?: string;
    /**
     * 限制最大日期
     */
    maxDate?: string;
    /**
     * 不记得了
     */
    timeConstraints?: any;
}
/**
 * Time 时间选择控件
 * 文档：https://baidu.gitee.io/amis/docs/components/form/time
 */
export interface TimeControlSchema extends InputDateBaseControlSchema {
    /**
     * 指定为日期时间选择控件
     */
    type: 'input-time';
    /**
     * 日期存储格式
     * @default X
     */
    format?: string;
    /**
     * 日期展示格式
     * @default YYYY-MM-DD HH:mm
     */
    inputFormat?: string;
    /**
     * 时间的格式。
     *
     * @default HH:mm
     */
    timeFormat?: string;
    /**
     * 不记得了
     */
    timeConstraints?: any;
}
/**
 * Month 月份选择控件
 * 文档：https://baidu.gitee.io/amis/docs/components/form/Month
 */
export interface MonthControlSchema extends InputDateBaseControlSchema {
    /**
     * 指定为月份时间选择控件
     */
    type: 'input-month';
    /**
     * 月份存储格式
     * @default X
     */
    format?: string;
    /**
     * 月份展示格式
     * @default YYYY-MM
     */
    inputFormat?: string;
}
/**
 * 季度选择控件
 */
export interface QuarterControlSchema extends InputDateBaseControlSchema {
    /**
     * 指定为月份时间选择控件
     */
    type: 'input-quarter';
    /**
     * 月份存储格式
     * @default X
     */
    format?: string;
    /**
     * 月份展示格式
     * @default YYYY-MM
     */
    inputFormat?: string;
}
/**
 * 年份选择控件
 */
export interface YearControlSchema extends InputDateBaseControlSchema {
    /**
     * 指定为月份时间选择控件
     */
    type: 'input-year';
    /**
     * 月份存储格式
     * @default X
     */
    format?: string;
    /**
     * 月份展示格式
     * @default YYYY-MM
     */
    inputFormat?: string;
}
export interface DateProps extends FormControlProps {
    inputFormat?: string;
    timeFormat?: string;
    format?: string;
    valueFormat?: string;
    timeConstraints?: {
        hours?: {
            min: number;
            max: number;
            step: number;
        };
        minutes?: {
            min: number;
            max: number;
            step: number;
        };
        seconds: {
            min: number;
            max: number;
            step: number;
        };
    };
    closeOnSelect?: boolean;
    disabled: boolean;
    iconClassName?: string;
    utc?: boolean;
    minDate?: string;
    maxDate?: string;
}
interface DateControlState {
    minDate?: moment.Moment;
    maxDate?: moment.Moment;
}
export default class DateControl extends React.PureComponent<DateProps, DateControlState> {
    static defaultProps: {
        format: string;
        viewMode: string;
        inputFormat: string;
        timeConstraints: {
            minutes: {
                step: number;
            };
        };
        clearable: boolean;
    };
    constructor(props: DateProps);
    componentDidUpdate(prevProps: DateProps): void;
    render(): JSX.Element;
}
export declare class DateControlRenderer extends DateControl {
    static defaultProps: {
        placeholder: string;
        dateFormat: string;
        timeFormat: string;
        strictMode: boolean;
        format: string;
        viewMode: string;
        inputFormat: string;
        timeConstraints: {
            minutes: {
                step: number;
            };
        };
        clearable: boolean;
    };
}
export declare class DatetimeControlRenderer extends DateControl {
    static defaultProps: {
        placeholder: string;
        inputFormat: string;
        dateFormat: string;
        timeFormat: string;
        closeOnSelect: boolean;
        strictMode: boolean;
        format: string;
        viewMode: string;
        timeConstraints: {
            minutes: {
                step: number;
            };
        };
        clearable: boolean;
    };
}
export declare class TimeControlRenderer extends DateControl {
    static defaultProps: {
        placeholder: string;
        inputFormat: string;
        dateFormat: string;
        timeFormat: string;
        viewMode: string;
        closeOnSelect: boolean;
        format: string;
        timeConstraints: {
            minutes: {
                step: number;
            };
        };
        clearable: boolean;
    };
}
export declare class MonthControlRenderer extends DateControl {
    static defaultProps: {
        placeholder: string;
        inputFormat: string;
        dateFormat: string;
        timeFormat: string;
        viewMode: string;
        closeOnSelect: boolean;
        format: string;
        timeConstraints: {
            minutes: {
                step: number;
            };
        };
        clearable: boolean;
    };
}
export declare class QuarterControlRenderer extends DateControl {
    static defaultProps: {
        placeholder: string;
        inputFormat: string;
        dateFormat: string;
        timeFormat: string;
        viewMode: string;
        closeOnSelect: boolean;
        format: string;
        timeConstraints: {
            minutes: {
                step: number;
            };
        };
        clearable: boolean;
    };
}
export declare class YearControlRenderer extends DateControl {
    static defaultProps: {
        placeholder: string;
        inputFormat: string;
        dateFormat: string;
        timeFormat: string;
        viewMode: string;
        closeOnSelect: boolean;
        format: string;
        timeConstraints: {
            minutes: {
                step: number;
            };
        };
        clearable: boolean;
    };
}
export {};
