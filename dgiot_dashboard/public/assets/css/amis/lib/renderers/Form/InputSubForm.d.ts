import React from 'react';
import { FormControlProps, FormBaseControl } from './Item';
import { SchemaClassName } from '../../Schema';
import { FormSchema } from '.';
import Sortable from 'sortablejs';
/**
 * SubForm 子表单
 * 文档：https://baidu.gitee.io/amis/docs/components/form/subform
 */
export interface SubFormControlSchema extends FormBaseControl {
    /**
     * 指定为 SubForm 子表单
     */
    type: 'input-sub-form';
    /**
     * 占位符
     */
    placeholder?: string;
    /**
     * 是否多选
     */
    multiple?: boolean;
    /**
     * 是否可拖拽排序
     */
    draggable?: boolean;
    /**
     * 拖拽提示信息
     */
    draggableTip?: string;
    /**
     * 是否可新增
     */
    addable?: boolean;
    /**
     * 是否可删除
     */
    removable?: boolean;
    /**
     * 最少个数
     */
    minLength?: number;
    /**
     * 最多个数
     */
    maxLength?: number;
    /**
     * 当值中存在这个字段，则按钮名称将使用此字段的值来展示。
     */
    labelField?: string;
    /**
     * 按钮默认名称
     * @default 设置
     */
    btnLabel?: string;
    /**
     * 新增按钮文字
     */
    addButtonText?: string;
    /**
     * 新增按钮 CSS 类名
     */
    addButtonClassName?: SchemaClassName;
    /**
     * 值元素的类名
     */
    itemClassName?: SchemaClassName;
    /**
     * 值列表元素的类名
     */
    itemsClassName?: SchemaClassName;
    /**
     * 子表单详情
     */
    form?: Omit<FormSchema, 'type'>;
    scaffold?: any;
}
export interface SubFormProps extends FormControlProps {
    placeholder?: string;
    multiple?: boolean;
    minLength?: number;
    maxLength?: number;
    labelField?: string;
}
export interface SubFormState {
    dialogData?: any;
    dialogCtx?: {
        mode?: 'add' | 'edit';
        index?: number;
    };
}
export default class SubFormControl extends React.PureComponent<SubFormProps, SubFormState> {
    static defaultProps: Partial<SubFormProps>;
    static propsList: Array<string>;
    state: SubFormState;
    dragTip?: HTMLElement;
    sortable?: Sortable;
    id: string;
    constructor(props: SubFormProps);
    addItem(): void;
    removeItem(e: React.UIEvent<any>): void;
    editSingle(): void;
    open(e: React.UIEvent<any>): void;
    close(): void;
    handleDialogConfirm(values: Array<object>): void;
    dragTipRef(ref: any): void;
    initDragging(): void;
    destroyDragging(): void;
    buildDialogSchema(): {
        type: string;
        body: {
            type: string;
        };
    };
    renderMultipe(): JSX.Element;
    renderSingle(): JSX.Element;
    render(): JSX.Element;
}
export declare class SubFormControlRenderer extends SubFormControl {
}
