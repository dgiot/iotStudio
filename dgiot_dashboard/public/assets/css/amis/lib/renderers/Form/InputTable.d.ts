import React from 'react';
import { FormControlProps, FormBaseControl } from './Item';
import { RendererData, Action } from '../../types';
import { SimpleMap } from '../../utils/SimpleMap';
import { TableSchema } from '../Table';
import { SchemaApi } from '../../Schema';
export interface TableControlSchema extends FormBaseControl, Omit<TableSchema, 'type'> {
    type: 'input-table';
    /**
     * 可新增
     */
    addable?: boolean;
    /**
     * 可复制新增
     */
    copyable?: boolean;
    /**
     * 复制按钮文字
     */
    copyBtnLabel?: string;
    /**
     * 复制按钮图标
     */
    copyBtnIcon?: string;
    /**
     * 是否显示复制按钮
     */
    copyAddBtn?: boolean;
    /**
     * 是否可以拖拽排序
     */
    draggable?: boolean;
    /**
     * 新增 API
     */
    addApi?: SchemaApi;
    /**
     * 新增按钮文字
     */
    addBtnLabel?: string;
    /**
     * 新增按钮图标
     */
    addBtnIcon?: string;
    /**
     * 显示新增按钮
     */
    showAddBtn?: boolean;
    /**
     * 可否删除
     */
    removable?: boolean;
    /**
     * 删除的 API
     */
    deleteApi?: SchemaApi;
    /**
     * 可否编辑
     */
    editable?: boolean;
    /**
     * 更新按钮名称
     */
    editBtnLabel?: string;
    /**
     * 更新按钮图标
     */
    editBtnIcon?: string;
    /**
     * 确认按钮文字
     */
    confirmBtnLabel?: string;
    /**
     * 确认按钮图标
     */
    confirmBtnIcon?: string;
    /**
     * 取消按钮文字
     */
    cancelBtnLabel?: string;
    /**
     * 取消按钮图标
     */
    cancelBtnIcon?: string;
    /**
     * 删除按钮文字
     */
    deleteBtnLabel?: string;
    /**
     * 删除按钮图标
     */
    deleteBtnIcon?: string;
    /**
     * 更新 API
     */
    updateApi?: SchemaApi;
    /**
     * 初始值，新增的时候
     */
    scaffold?: any;
    /**
     * 删除确认文字
     */
    deleteConfirmText?: string;
    /**
     * 值字段
     */
    valueField?: string;
    /**
     * 是否为确认的编辑模式。
     */
    needConfirm?: boolean;
    /**
     * 是否可以访问父级数据，正常 combo 已经关联到数组成员，是不能访问父级数据的。
     */
    canAccessSuperData?: boolean;
    /**
     * 是否显示序号
     */
    showIndex?: boolean;
    /**
     * 分页个数，默认不分页
     */
    perPage?: number;
}
export interface TableProps extends FormControlProps, Omit<TableControlSchema, 'type' | 'className' | 'descriptionClassName' | 'inputClassName'> {
}
export interface TableState {
    items: Array<any>;
    raw?: any;
    columns: Array<any>;
    editIndex: number;
    isCreateMode?: boolean;
    page?: number;
}
export default class FormTable extends React.Component<TableProps, TableState> {
    static defaultProps: {
        placeholder: string;
        scaffold: {};
        addBtnIcon: string;
        copyBtnIcon: string;
        editBtnIcon: string;
        deleteBtnIcon: string;
        confirmBtnIcon: string;
        cancelBtnIcon: string;
        valueField: string;
    };
    static propsList: Array<string>;
    entries: SimpleMap<any, number>;
    entityId: number;
    subForms: any;
    rowPrinstine: Array<any>;
    editting: any;
    constructor(props: TableProps);
    componentDidUpdate(nextProps: TableProps): void;
    componentWillUnmount(): void;
    subFormRef(form: any, x: number, y: number): void;
    validate(): Promise<string | void>;
    emitValue(): void;
    doAction(action: Action, ctx: RendererData, ...rest: Array<any>): Promise<any>;
    copyItem(index: number): void;
    addItem(index: number): void;
    startEdit(index: number, isCreate?: boolean): void;
    confirmEdit(): Promise<void>;
    cancelEdit(): void;
    removeItem(index: number): Promise<void>;
    buildItemProps(item: any, index: number): {
        quickEditEnabled: boolean;
    } | null;
    buildColumns(props: TableProps, isCreateMode?: boolean): Array<any>;
    columnToQuickEdit(column: any): any;
    handleTableSave(rows: Array<object> | object, diff: Array<object> | object, rowIndexes: Array<string> | string): void;
    handleSaveTableOrder(moved: Array<object>, rows: Array<object>): void;
    handlePageChange(page: number): void;
    removeEntry(entry: any): void;
    getEntryId(entry: any): string;
    render(): JSX.Element | null;
}
export declare class TableControlRenderer extends FormTable {
}
