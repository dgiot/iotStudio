import React from 'react';
import { FormControlProps } from './Item';
import { IComboStore } from '../../store/combo';
import { ComboControlSchema } from './Combo';
import { SchemaCollection } from '../../Schema';
/**
 * InputArray 数组输入框。 combo 的别名。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/array
 */
export interface ArrayControlSchema extends Omit<ComboControlSchema, 'type' | 'controls' | 'conditions' | 'items'> {
    /**
     * 指定为数组输入框类型
     */
    type: 'input-array';
    /**
     * 成员渲染器配置
     */
    items: SchemaCollection;
}
export interface InputArrayProps extends FormControlProps, Omit<ArrayControlSchema, 'type' | 'className' | 'descriptionClassName' | 'inputClassName'> {
    store: IComboStore;
}
export default class InputArrayControl extends React.Component<InputArrayProps> {
    comboInstance: any;
    constructor(props: InputArrayProps);
    comboRef(ref: any): void;
    validate(args: Array<any>): any;
    render(): JSX.Element;
}
export declare class ArrayControlRenderer extends InputArrayControl {
}
