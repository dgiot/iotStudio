import React from 'react';
import { OptionsControlProps, Option, FormOptionsControl } from './Options';
import { Api } from '../../types';
/**
 * 复选框
 * 文档：https://baidu.gitee.io/amis/docs/components/form/checkboxes
 */
export interface CheckboxesControlSchema extends FormOptionsControl {
    type: 'checkboxes';
    /**
     * 是否开启全选功能
     */
    checkAll?: boolean;
    /**
     * 是否默认全选
     */
    defaultCheckAll?: boolean;
    /**
     * 每行显示多少个
     */
    columnsCount?: number;
}
export interface CheckboxesProps extends OptionsControlProps, Omit<CheckboxesControlSchema, 'options' | 'type' | 'className' | 'descriptionClassName' | 'inputClassName'> {
    placeholder?: any;
    itemClassName?: string;
    columnsCount?: number;
    labelClassName?: string;
    onAdd?: () => void;
    addApi?: Api;
    creatable: boolean;
    createBtnLabel: string;
    editable?: boolean;
    removable?: boolean;
}
export default class CheckboxesControl extends React.Component<CheckboxesProps, any> {
    static defaultProps: {
        columnsCount: number;
        multiple: boolean;
        placeholder: string;
        creatable: boolean;
        inline: boolean;
        createBtnLabel: string;
    };
    reload(): void;
    handleAddClick(): void;
    handleEditClick(e: Event, item: any): void;
    handleDeleteClick(e: Event, item: any): void;
    renderGroup(option: Option, index: number): JSX.Element | null;
    renderItem(option: Option, index: number): JSX.Element | null;
    render(): JSX.Element;
}
export declare class CheckboxesControlRenderer extends CheckboxesControl {
}
