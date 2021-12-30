/// <reference types="react" />
import { OptionsControlProps, FormOptionsControl } from './Options';
import { BaseTransferRenderer } from './Transfer';
import { SchemaApi } from '../../Schema';
/**
 * TabsTransfer
 * 文档：https://baidu.gitee.io/amis/docs/components/form/tabs-transfer
 */
export interface TabsTransferControlSchema extends FormOptionsControl {
    type: 'tabs-transfer';
    /**
     * 是否显示剪头
     */
    showArrow?: boolean;
    /**
     * 可排序？
     */
    sortable?: boolean;
    /**
     * 搜索结果展示模式
     */
    searchResultMode?: 'table' | 'list' | 'tree' | 'chained';
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
export interface TabsTransferProps extends OptionsControlProps, Omit<TabsTransferControlSchema, 'type' | 'options' | 'inputClassName' | 'className' | 'descriptionClassName'> {
}
export declare class TabsTransferRenderer extends BaseTransferRenderer<TabsTransferProps> {
    render(): JSX.Element;
}
