import React from 'react';
import { FormControlProps, FormBaseControl } from './Item';
import { Option } from '../../components/Select';
import { PlainObject } from '../../types';
/**
 * 数字输入框
 * 文档：https://baidu.gitee.io/amis/docs/components/form/number
 */
export interface NumberControlSchema extends FormBaseControl {
    type: 'input-number';
    /**
     * 最大值
     */
    max?: number;
    /**
     * 最小值
     */
    min?: number;
    /**
     * 步长
     */
    step?: number;
    /**
     * 精度
     */
    precision?: number;
    /**
     * 默认当然是
     */
    showSteps?: boolean;
    /**
     * 边框模式，全边框，还是半边框，或者没边框。
     */
    borderMode?: 'full' | 'half' | 'none';
    /**
     * 前缀
     */
    prefix?: string;
    /**
     * 后缀
     */
    suffix?: string;
    /**
     * 单位列表
     */
    unitOptions?: string | Array<Option> | string[] | PlainObject;
    /**
     * 是否千分分隔
     */
    kilobitSeparator?: boolean;
    /**
     * 只读
     */
    readOnly?: boolean;
}
export interface NumberProps extends FormControlProps {
    placeholder?: string;
    max?: number | string;
    min?: number | string;
    step?: number;
    precision?: number;
    /**
     * 边框模式，全边框，还是半边框，或者没边框。
     */
    borderMode?: 'full' | 'half' | 'none';
    /**
     * 前缀
     */
    prefix?: string;
    /**
     * 后缀
     */
    suffix?: string;
    /**
     * 是否千分分隔
     */
    kilobitSeparator?: boolean;
    /**
     * 只读
     */
    readOnly?: boolean;
}
interface NumberState {
    unit?: string;
    unitOptions?: Option[];
}
export default class NumberControl extends React.Component<NumberProps, NumberState> {
    static defaultProps: Partial<NumberProps>;
    constructor(props: NumberProps);
    getUnit(): any;
    handleChange(inputValue: any): void;
    filterNum(value: number | string | undefined): number | undefined;
    handleChangeUnit(option: Option): void;
    componentDidUpdate(prevProps: NumberProps): void;
    render(): JSX.Element;
}
export declare class NumberControlRenderer extends NumberControl {
    static defaultProps: Partial<FormControlProps>;
}
export {};
