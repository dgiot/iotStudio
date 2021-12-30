import React from 'react';
import { FormControlProps, FormBaseControl } from './Item';
import { IFormStore } from '../../store/form';
import { SchemaCollection } from '../../Schema';
/**
 * InputGroup
 * 文档：https://baidu.gitee.io/amis/docs/components/form/input-group
 */
export interface InputGroupControlSchema extends FormBaseControl {
    type: 'input-group';
    /**
     * FormItem 集合
     */
    body: SchemaCollection;
}
export interface InputGroupProps extends FormControlProps {
    body: Array<any>;
    formStore: IFormStore;
}
interface InputGroupState {
    isFocused: boolean;
}
export declare class InputGroup extends React.Component<InputGroupProps, InputGroupState> {
    constructor(props: InputGroupProps);
    handleFocus(): void;
    handleBlur(): void;
    renderControl(control: any, index: any, otherProps?: any): JSX.Element | null;
    validate(): "" | string[];
    render(): JSX.Element;
}
export default class InputGroupRenderer extends InputGroup {
}
export {};
