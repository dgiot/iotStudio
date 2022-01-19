import React from 'react';
import { OptionsControlProps, FormOptionsControl } from './Options';
import { SchemaNode, Action, PlainObject } from '../../types';
import { SchemaTpl } from '../../Schema';
/**
 * Picker
 * 文档：https://baidu.gitee.io/amis/docs/components/form/picker
 */
export interface PickerControlSchema extends FormOptionsControl {
    type: 'picker';
    /**
     * 可用来生成选中的值的描述文字
     */
    labelTpl?: SchemaTpl;
    /**
     * 建议用 labelTpl
     * 选中一个字段名用来作为值的描述文字
     */
    labelField?: string;
    /**
     * 选一个可以用来作为值的字段。
     */
    valueField?: string;
    /**
     * 弹窗选择框详情。
     */
    pickerSchema?: any;
    /**
     * 弹窗模式，dialog 或者 drawer
     */
    modalMode?: 'dialog' | 'drawer';
    /**
     * 内嵌模式，也就是说不弹框了。
     */
    embed?: boolean;
}
export interface PickerProps extends OptionsControlProps {
    modalMode: 'dialog' | 'drawer';
    pickerSchema: PlainObject;
    labelField: string;
}
export interface PickerState {
    isOpened: boolean;
    isFocused: boolean;
    schema: SchemaNode;
}
export default class PickerControl extends React.PureComponent<PickerProps, any> {
    static propsList: Array<string>;
    static defaultProps: Partial<PickerProps>;
    state: PickerState;
    input: React.RefObject<HTMLInputElement>;
    componentDidMount(): void;
    componentDidUpdate(prevProps: PickerProps): void;
    fetchOptions(): void;
    buildSchema(props: PickerProps): {
        labelTpl: any;
        type: string;
        pickerMode: boolean;
        syncLocation: boolean;
        api: import("../../Schema").SchemaApi | undefined;
        keepItemSelectionOnPageChange: boolean;
        valueField: any;
        labelField: string;
        bulkActions: any;
        checkOnItemClick: boolean;
    };
    crud: any;
    crudRef(ref: any): void;
    reload(): void;
    open(): void;
    close(): void;
    handleModalConfirm(values: Array<any>, action: Action, ctx: any, components: Array<any>): void;
    handleChange(items: Array<any>): void;
    removeItem(index: number): void;
    handleKeyDown(e: React.KeyboardEvent): void;
    handleFocus(): void;
    handleBlur(): void;
    handleClick(): void;
    clearValue(): void;
    renderValues(): JSX.Element;
    renderBody({ popOverContainer }?: any): JSX.Element;
    render(): JSX.Element;
}
export declare class PickerControlRenderer extends PickerControl {
}
