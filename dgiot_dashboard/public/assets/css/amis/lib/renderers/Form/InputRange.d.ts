import React from 'react';
import { FormControlProps, FormBaseControl } from './Item';
/**
 * Range
 * 文档：https://baidu.gitee.io/amis/docs/components/form/range
 */
export interface RangeControlSchema extends FormBaseControl {
    type: 'input-range';
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
     * 单位
     */
    unit?: string;
}
export interface RangeProps extends FormControlProps {
    max?: number;
    min?: number;
    step?: number;
    unit?: string;
    clearable?: boolean;
    name?: string;
    showInput?: boolean;
    className?: string;
    value: any;
    onChange: (value: any) => void;
    multiple?: boolean;
    joinValues?: boolean;
    delimiter?: string;
}
export interface DefaultProps {
    max: number;
    min: number;
    step: number;
    unit: string;
    clearable: boolean;
    disabled: boolean;
    showInput: boolean;
    multiple: boolean;
    joinValues: boolean;
    delimiter: string;
}
export declare function formatValue(value: string | number | {
    min: number;
    max: number;
}, props: Partial<RangeProps>): string | number | {
    min: number | undefined;
    max: number | undefined;
};
export interface RangeState {
    value: {
        min?: number;
        max?: number;
    } | number | string | undefined;
    minValue?: any;
    maxValue?: any;
}
export default class RangeControl extends React.PureComponent<RangeProps, RangeState> {
    midLabel?: HTMLSpanElement;
    static defaultProps: DefaultProps;
    constructor(props: RangeProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: RangeProps): void;
    updateStyle(): void;
    midLabelRef(ref: any): void;
    handleChange(value: any): void;
    clearValue(): void;
    handleEnd(value: any): void;
    getStepPrecision(): number;
    getValue(value: any, type?: string): any;
    handleInputChange(evt: React.ChangeEvent<HTMLInputElement>): void;
    handleMinInputBlur(evt: React.ChangeEvent<HTMLInputElement>): void;
    handleMaxInputBlur(evt: React.ChangeEvent<HTMLInputElement>): void;
    handleMinInputChange(evt: React.ChangeEvent<HTMLInputElement>): void;
    handleMaxInputChange(evt: React.ChangeEvent<HTMLInputElement>): void;
    render(): JSX.Element;
}
export declare class RangeControlRenderer extends RangeControl {
}
