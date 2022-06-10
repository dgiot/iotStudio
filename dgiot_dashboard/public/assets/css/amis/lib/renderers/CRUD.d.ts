import React from 'react';
import { RendererProps } from '../factory';
import { SchemaNode, Schema, Action, PlainObject } from '../types';
import { ICRUDStore } from '../store/crud';
import { IScopedContext } from '../Scoped';
import { BaseSchema, SchemaApi, SchemaClassName, SchemaExpression, SchemaMessage, SchemaName, SchemaObject, SchemaTokenizeableString, SchemaTpl } from '../Schema';
import { ActionSchema } from './Action';
import { CardsSchema } from './Cards';
import { ListSchema } from './List';
import { TableSchema } from './Table';
export declare type CRUDBultinToolbarType = 'columns-toggler' | 'drag-toggler' | 'pagination' | 'bulkActions' | 'bulk-actions' | 'statistics' | 'switch-per-page' | 'load-more' | 'filter-toggler' | 'export-csv' | 'export-excel';
export interface CRUDBultinToolbar extends Omit<BaseSchema, 'type'> {
    type: CRUDBultinToolbarType;
}
export declare type CRUDToolbarChild = SchemaObject | CRUDBultinToolbar;
export declare type CRUDToolbarObject = {
    /**
     * 对齐方式
     */
    align?: 'left' | 'right';
};
export interface CRUDCommonSchema extends BaseSchema {
    /**
     *  指定为 CRUD 渲染器。
     */
    type: 'crud';
    /**
     * 指定内容区的展示模式。
     */
    mode?: 'table' | 'grid' | 'cards' | /* grid 的别名*/ 'list';
    /**
     * 初始化数据 API
     */
    api?: SchemaApi;
    /**
     * 批量操作
     */
    bulkActions?: Array<ActionSchema>;
    /**
     * 单条操作
     */
    itemActions?: Array<ActionSchema>;
    /**
     * 每页个数，默认为 10，如果不是请设置。
     *
     * @default 10
     */
    perPage?: number;
    /**
     * 可以默认给定初始参数如： {\"perPage\": 24}
     */
    defaultParams?: PlainObject;
    /**
     * 是否可通过拖拽排序
     */
    draggable?: boolean;
    /**
     * 是否可通过拖拽排序，通过表达式来配置
     */
    draggableOn?: SchemaExpression;
    name?: SchemaName;
    /**
     * 过滤器表单
     */
    filter?: any;
    /**
     * 初始是否拉取
     * @deprecated 建议用 api 的 sendOn 代替。
     */
    initFetch?: boolean;
    /**
     * 初始是否拉取，用表达式来配置。
     * @deprecated 建议用 api 的 sendOn 代替。
     */
    initFetchOn?: SchemaExpression;
    /**
     * 配置内部 DOM 的 className
     */
    innerClassName?: SchemaClassName;
    /**
     * 设置自动刷新时间
     */
    interval?: number;
    /**
     * 设置用来确定位置的字段名，设置后新的顺序将被赋值到该字段中。
     */
    orderField?: string;
    /**
     * 设置分页页码字段名。
     * @default page
     */
    pageField?: string;
    /**
     * 设置分页一页显示的多少条数据的字段名。
     * @default perPage
     */
    perPageField?: string;
    /**
     * 快速编辑后用来批量保存的 API
     */
    quickSaveApi?: SchemaApi;
    /**
     * 快速编辑配置成及时保存时使用的 API
     */
    quickSaveItemApi?: SchemaApi;
    /**
     * 保存排序的 api
     */
    saveOrderApi?: SchemaApi;
    /**
     * 是否将过滤条件的参数同步到地址栏,默认为true
     * @default true
     */
    syncLocation?: boolean;
    /**
     * 顶部工具栏
     */
    headerToolbar?: Array<(CRUDToolbarChild & CRUDToolbarObject) | CRUDBultinToolbarType>;
    /**
     * 底部工具栏
     */
    footerToolbar?: Array<(CRUDToolbarChild & CRUDToolbarObject) | CRUDBultinToolbarType>;
    /**
     * 每页显示多少个空间成员的配置如： [10, 20, 50, 100]。
     */
    perPageAvailable?: Array<number>;
    messages?: SchemaMessage;
    /**
     * 是否隐藏快速编辑的按钮。
     */
    hideQuickSaveBtn?: boolean;
    /**
     * 是否自动跳顶部，当切分页的时候。
     */
    autoJumpToTopOnPagerChange?: boolean;
    /**
     * 静默拉取
     */
    silentPolling?: boolean;
    stopAutoRefreshWhen?: SchemaExpression;
    stopAutoRefreshWhenModalIsOpen?: boolean;
    filterTogglable?: boolean;
    filterDefaultVisible?: boolean;
    /**
     * 是否将接口返回的内容自动同步到地址栏，前提是开启了同步地址栏。
     */
    syncResponse2Query?: boolean;
    /**
     * 分页的时候是否保留用户选择。
     */
    keepItemSelectionOnPageChange?: boolean;
    /**
     * 当配置 keepItemSelectionOnPageChange 时有用，用来配置已勾选项的文案。
     */
    labelTpl?: SchemaTpl;
    /**
     * 是否为前端单次加载模式，可以用来实现前端分页。
     */
    loadDataOnce?: boolean;
    /**
     * 在开启loadDataOnce时，filter时是否去重新请求api
     */
    loadDataOnceFetchOnFilter?: boolean;
    /**
     * 也可以直接从环境变量中读取，但是不太推荐。
     */
    source?: SchemaTokenizeableString;
    /**
     * 如果时内嵌模式，可以通过这个来配置默认的展开选项。
     */
    expandConfig?: {
        /**
         * 默认是展开第一个、所有、还是都不展开。
         */
        expand?: 'first' | 'all' | 'none';
        /**
         * 是否显示全部切换按钮
         */
        expandAll?: boolean;
        /**
         * 是否为手风琴模式
         */
        accordion?: boolean;
    };
    /**
     * 默认只有当分页数大于 1 是才显示，如果总是想显示请配置。
     */
    alwaysShowPagination?: boolean;
}
export declare type CRUDCardsSchema = CRUDCommonSchema & {
    mode: 'cards';
} & Omit<CardsSchema, 'type'>;
export declare type CRUDListSchema = CRUDCommonSchema & {
    mode: 'list';
} & Omit<ListSchema, 'type'>;
export declare type CRUDTableSchema = CRUDCommonSchema & {
    mode?: 'table';
} & Omit<TableSchema, 'type'>;
/**
 * CRUD 增删改查渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/crud
 */
export declare type CRUDSchema = CRUDCardsSchema | CRUDListSchema | CRUDTableSchema;
export interface CRUDProps extends RendererProps, Omit<CRUDCommonSchema, 'type' | 'className'> {
    store: ICRUDStore;
    pickerMode?: boolean;
}
export default class CRUD extends React.Component<CRUDProps, any> {
    static propsList: Array<keyof CRUDProps>;
    static defaultProps: {
        toolbarInline: boolean;
        headerToolbar: string[];
        footerToolbar: string[];
        primaryField: string;
        syncLocation: boolean;
        pageField: string;
        perPageField: string;
        hideQuickSaveBtn: boolean;
        autoJumpToTopOnPagerChange: boolean;
        silentPolling: boolean;
        filterTogglable: boolean;
        filterDefaultVisible: boolean;
        loadDataOnce: boolean;
        loadDataOnceFetchOnFilter: boolean;
    };
    control: any;
    lastQuery: any;
    timer: ReturnType<typeof setTimeout>;
    mounted: boolean;
    constructor(props: CRUDProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: CRUDProps): void;
    componentWillUnmount(): void;
    controlRef(control: any): void;
    handleAction(e: React.UIEvent<any> | undefined, action: Action, ctx: object, throwErrors?: boolean, delegate?: IScopedContext): any;
    handleBulkAction(selectedItems: Array<any>, unSelectedItems: Array<any>, e: React.UIEvent<any>, action: Action): void;
    handleItemAction(action: Action, ctx: any): void;
    handleFilterInit(values: object): void;
    handleFilterReset(values: object): void;
    handleFilterSubmit(values: object, jumpToFirstPage?: boolean, replaceLocation?: boolean, search?: boolean): void;
    handleBulkGo(selectedItems: Array<any>, unSelectedItems: Array<any>, e: React.MouseEvent<any>): void | Promise<false | void>;
    handleDialogConfirm(values: object[], action: Action, ctx: any, components: Array<any>): any;
    handleDialogClose(): void;
    openFeedback(dialog: any, ctx: any): Promise<unknown>;
    search(values?: any, silent?: boolean, clearSelection?: boolean, forceReload?: boolean): void;
    silentSearch(values?: object, clearSelection?: boolean, forceReload?: boolean): void;
    handleChangePage(page: number, perPage?: number): void;
    handleSave(rows: Array<object> | object, diff: Array<object> | object, indexes: Array<string>, unModifiedItems?: Array<any>, rowsOrigin?: Array<object> | object, resetOnFailed?: boolean): void;
    handleSaveOrder(moved: Array<object>, rows: Array<object>): void;
    handleSelect(items: Array<any>, unSelectedItems: Array<any>): void;
    handleChildPopOverOpen(popOver: any): void;
    handleChildPopOverClose(popOver: any): void;
    handleQuery(values: object, forceReload?: boolean): void;
    reload(subpath?: string, query?: any): void;
    receive(values: object): void;
    reloadTarget(target: string, data: any): void;
    closeTarget(target: string): void;
    doAction(action: Action, data: object, throwErrors?: boolean): any;
    unSelectItem(item: any, index: number): void;
    clearSelection(): void;
    hasBulkActionsToolbar(): any;
    hasBulkActions(): number | false;
    renderBulkActions(childProps: any): JSX.Element | null;
    renderPagination(toolbar: SchemaNode): JSX.Element | null;
    renderStatistics(): JSX.Element | null;
    renderSwitchPerPage(childProps: any): JSX.Element | null;
    renderLoadMore(): "" | JSX.Element;
    renderFilterToggler(): JSX.Element | null;
    renderExportCSV(toolbar: Schema): JSX.Element;
    renderToolbar(toolbar?: SchemaNode, index?: number, childProps?: any, toolbarRenderer?: (toolbar: SchemaNode, index: number) => React.ReactNode): {} | null;
    renderHeaderToolbar(childProps: any, toolbarRenderer?: (toolbar: SchemaNode, index: number) => React.ReactNode): {} | null;
    renderFooterToolbar(childProps: any, toolbarRenderer?: (toolbar: SchemaNode, index: number) => React.ReactNode): {} | null;
    renderSelection(): React.ReactNode;
    render(): JSX.Element;
}
export declare class CRUDRenderer extends CRUD {
    static contextType: React.Context<IScopedContext>;
    constructor(props: CRUDProps, context: IScopedContext);
    componentWillUnmount(): void;
    reload(subpath?: string, query?: any, ctx?: any): void;
    receive(values: any, subPath?: string): void;
    reloadTarget(target: string, data: any): void;
    closeTarget(target: string): void;
}
