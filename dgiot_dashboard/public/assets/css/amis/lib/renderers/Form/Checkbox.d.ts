import React from 'react';
import { FormControlProps, FormBaseControl } from './Item';
/**
 * Checkbox 勾选框。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/checkbox
 */
export interface CheckboxControlSchema extends FormBaseControl {
    /**
     * 指定为多行文本输入框
     */
    type: 'checkbox';
    /**
     * 勾选值
     */
    trueValue?: any;
    /**
     * 未勾选值
     */
    falseValue?: any;
    /**
     * 选项说明
     */
    option?: string;
}
export interface CheckboxProps extends FormControlProps, Omit<CheckboxControlSchema, 'type' | 'className' | 'descriptionClassName' | 'inputClassName'> {
}
export default class CheckboxControl extends React.Component<CheckboxProps, any> {
    static defaultProps: Partial<CheckboxProps>;
    render(): JSX.Element;
}
export declare class CheckboxControlRenderer extends CheckboxControl {
}
