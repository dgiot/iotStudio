import React from 'react';
import { FormControlProps, FormBaseControl } from './Item';
/**
 * Switch
 * 文档：https://baidu.gitee.io/amis/docs/components/form/switch
 */
export interface SwitchControlSchema extends FormBaseControl {
    /**
     * 指定为多行文本输入框
     */
    type: 'switch';
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
    /**
     * 开启时显示的文本
     */
    onText?: string;
    /**
     * 关闭时显示的文本
     */
    offText?: string;
}
export interface SwitchProps extends FormControlProps {
    option?: string;
    trueValue?: any;
    falseValue?: any;
}
export default class SwitchControl extends React.Component<SwitchProps, any> {
    static defaultProps: {
        trueValue: boolean;
        falseValue: boolean;
        optionAtLeft: boolean;
    };
    render(): JSX.Element;
}
export declare class SwitchControlRenderer extends SwitchControl {
}
