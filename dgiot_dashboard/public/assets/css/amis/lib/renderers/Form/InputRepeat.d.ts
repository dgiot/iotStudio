/**
 * @file filter
 * @author fex
 *
 * 不建议用，以后可能会删除。可以直接用组合出来，不需要新建一个组件。
 */
import React from 'react';
import { FormControlProps, FormBaseControl } from './Item';
/**
 * Repeat
 * 文档：https://baidu.gitee.io/amis/docs/components/form/repeat
 */
export interface RepeatControlSchema extends FormBaseControl {
    type: 'input-repeat';
    options?: string;
}
import { Option } from './Options';
export interface RepeatProps extends FormControlProps {
    options?: string;
    placeholder?: string;
}
export default class RepeatControl extends React.Component<RepeatProps, any> {
    static defaultProps: {
        options: string;
        placeholder: string;
    };
    constructor(props: RepeatProps);
    handleOptionChange(option: Option): void;
    handleChange(value: string): void;
    renderInput(): JSX.Element;
    render(): JSX.Element;
}
export declare class RepeatControlRenderer extends RepeatControl {
}
