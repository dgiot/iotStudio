import { OptionsControlProps, FormOptionsControl } from './Options';
import React from 'react';
import { Option } from './Options';
import { SchemaApi } from '../../Schema';
/**
 * Transfer
 * 文档：https://baidu.gitee.io/amis/docs/components/form/transfer
 */
export interface TransferControlSchema extends FormOptionsControl {
    type: 'transfer';
    /**
     * 是否显示剪头
     */
    showArrow?: boolean;
    /**
     * 可排序？
     */
    sortable?: boolean;
    /**
     * 勾选展示模式
     */
    selectMode?: 'table' | 'list' | 'tree' | 'chained' | 'associated';
    /**
     * 当 selectMode 为 associated 时用来定义左侧的选项
     */
    leftOptions?: Array<Option>;
    /**
     * 当 selectMode 为 associated 时用来定义左侧的选择模式
     */
    leftMode?: 'tree' | 'list';
    /**
     * 当 selectMode 为 associated 时用来定义右侧的选择模式
     */
    rightMode?: 'table' | 'list' | 'tree' | 'chained';
    /**
     * 搜索结果展示模式
     */
    searchResultMode?: 'table' | 'list' | 'tree' | 'chained';
    /**
     * 当 selectMode 为 table 时定义表格列信息。
     */
    columns?: Array<any>;
    /**
     * 当 searchResultMode 为 table 时定义表格列信息。
     */
    searchResultColumns?: Array<any>;
    /**
     * 可搜索？
     */
    searchable?: boolean;
    /**
     * 搜索 API
     */
    searchApi?: SchemaApi;
    /**
     * 左侧的标题文字
     */
    selectTitle?: string;
    /**
     * 右侧结果的标题文字
     */
    resultTitle?: string;
}
export interface BaseTransferProps extends OptionsControlProps, Omit<TransferControlSchema, 'type' | 'options' | 'className' | 'descriptionClassName' | 'inputClassName'> {
    optionItemRender?: (option: Option) => JSX.Element;
    resultItemRender?: (option: Option) => JSX.Element;
}
export declare class BaseTransferRenderer<T extends OptionsControlProps = BaseTransferProps> extends React.Component<T> {
    handleChange(value: Array<Option>): void;
    option2value(option: Option): Option;
    handleSearch(term: string, cancelExecutor: Function): Promise<any[]>;
    renderCell(column: {
        name: string;
        label: string;
        [propName: string]: any;
    }, option: Option, colIndex: number, rowIndex: number): JSX.Element;
    render(): JSX.Element;
}
export declare class TransferRender extends BaseTransferRenderer {
}
declare const _default: typeof TransferRender;
export default _default;
