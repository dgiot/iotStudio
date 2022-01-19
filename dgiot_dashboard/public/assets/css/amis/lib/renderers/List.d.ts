import React from 'react';
import { RendererProps } from '../factory';
import { SchemaNode, Action } from '../types';
import { IListStore, IItem } from '../store/list';
import { SchemaQuickEdit } from './QuickEdit';
import { SchemaPopOver } from './PopOver';
import Sortable from 'sortablejs';
import { TableCell } from './Table';
import { SchemaCopyable } from './Copyable';
import { BaseSchema, SchemaClassName, SchemaCollection, SchemaExpression, SchemaObject, SchemaTokenizeableString, SchemaTpl, SchemaUrlPath } from '../Schema';
import { ActionSchema } from './Action';
import { SchemaRemark } from './Remark';
/**
 * 不指定类型默认就是文本
 */
export declare type ListBodyFieldObject = {
    /**
     * 列标题
     */
    label?: string;
    /**
     * label 类名
     */
    labelClassName?: SchemaClassName;
    /**
     * 绑定字段名
     */
    name?: string;
    /**
     * 配置查看详情功能
     */
    popOver?: SchemaPopOver;
    /**
     * 配置快速编辑功能
     */
    quickEdit?: SchemaQuickEdit;
    /**
     * 配置点击复制功能
     */
    copyable?: SchemaCopyable;
};
export declare type ListBodyField = SchemaObject & ListBodyFieldObject;
export interface ListItemSchema extends Omit<BaseSchema, 'type'> {
    actions?: Array<ActionSchema>;
    /**
     * 操作位置，默认在右侧，可以设置成左侧。
     */
    actionsPosition?: 'left' | 'right';
    /**
     * 图片地址
     */
    avatar?: SchemaUrlPath;
    /**
     * 内容区域
     */
    body?: Array<ListBodyField | ListBodyFieldObject>;
    /**
     * 描述
     */
    desc?: SchemaTpl;
    /**
     * tooltip 说明
     */
    remark?: SchemaRemark;
    /**
     * 标题
     */
    title?: SchemaTpl;
    /**
     * 副标题
     */
    subTitle?: SchemaTpl;
}
/**
 * List 列表展示控件。
 * 文档：https://baidu.gitee.io/amis/docs/components/card
 */
export interface ListSchema extends BaseSchema {
    /**
     * 指定为 List 列表展示控件。
     */
    type: 'list' | 'static-list';
    /**
     * 标题
     */
    title?: SchemaTpl;
    /**
     * 底部区域
     */
    footer?: SchemaCollection;
    /**
     * 底部区域类名
     */
    footerClassName?: SchemaClassName;
    /**
     * 顶部区域
     */
    header?: SchemaCollection;
    /**
     * 顶部区域类名
     */
    headerClassName?: SchemaClassName;
    /**
     * 单条数据展示内容配置
     */
    listItem?: ListItemSchema;
    /**
     * 数据源: 绑定当前环境变量
     *
     * @default ${items}
     */
    source?: SchemaTokenizeableString;
    /**
     * 是否显示底部
     */
    showFooter?: boolean;
    /**
     * 是否显示头部
     */
    showHeader?: boolean;
    /**
     * 无数据提示
     *
     * @default 暂无数据
     */
    placeholder?: SchemaTpl;
    /**
     * 是否隐藏勾选框
     */
    hideCheckToggler?: boolean;
    /**
     * 是否固顶
     */
    affixHeader?: boolean;
    /**
     * 配置某项是否可以点选
     */
    itemCheckableOn?: SchemaExpression;
    /**
     * 配置某项是否可拖拽排序，前提是要开启拖拽功能
     */
    itemDraggableOn?: SchemaExpression;
    /**
     * 点击卡片的时候是否勾选卡片。
     */
    checkOnItemClick?: boolean;
    /**
     * 可以用来作为值的字段
     */
    valueField?: string;
    /**
     * 大小
     */
    size?: 'sm' | 'base';
    /**
     * 点击列表项的行为
     */
    itemAction?: ActionSchema;
}
export interface Column {
    type: string;
    [propName: string]: any;
}
export interface ListProps extends RendererProps, Omit<ListSchema, 'type' | 'className'> {
    store: IListStore;
    selectable?: boolean;
    selected?: Array<any>;
    draggable?: boolean;
    onSelect: (selectedItems: Array<object>, unSelectedItems: Array<object>) => void;
    onSave?: (items: Array<object> | object, diff: Array<object> | object, rowIndexes: Array<number> | number, unModifiedItems?: Array<object>, rowOrigins?: Array<object> | object, resetOnFailed?: boolean) => void;
    onSaveOrder?: (moved: Array<object>, items: Array<object>) => void;
    onQuery: (values: object) => void;
}
export default class List extends React.Component<ListProps, object> {
    static propsList: Array<keyof ListProps>;
    static defaultProps: Partial<ListProps>;
    dragTip?: HTMLElement;
    sortable?: Sortable;
    parentNode?: any;
    body?: any;
    renderedToolbars: Array<string>;
    constructor(props: ListProps);
    static syncItems(store: IListStore, props: ListProps, prevProps?: ListProps): boolean;
    componentDidMount(): void;
    componentDidUpdate(prevProps: ListProps): void;
    componentWillUnmount(): void;
    bodyRef(ref: HTMLDivElement): void;
    affixDetect(): void;
    getPopOverContainer(): Element | Text | null;
    handleAction(e: React.UIEvent<any>, action: Action, ctx: object): void;
    handleCheck(item: IItem): void;
    handleCheckAll(): void;
    syncSelected(): void;
    handleQuickChange(item: IItem, values: object, saveImmediately?: boolean | any, savePristine?: boolean, resetOnFailed?: boolean): void;
    handleSave(): void;
    handleSaveOrder(): void;
    reset(): void;
    bulkUpdate(value: object, items: Array<object>): void;
    getSelected(): any[];
    dragTipRef(ref: any): void;
    initDragging(): void;
    destroyDragging(): void;
    renderActions(region: string): JSX.Element | null;
    renderHeading(): JSX.Element | null;
    renderHeader(): JSX.Element | JSX.Element[] | null;
    renderFooter(): JSX.Element | JSX.Element[] | null;
    renderCheckAll(): JSX.Element | null;
    renderDragToggler(): JSX.Element | null;
    renderToolbar(toolbar: SchemaNode, index: number): JSX.Element | null | undefined;
    render(): JSX.Element;
}
export declare class ListRenderer extends List {
    dragging: boolean;
    selectable: boolean;
    selected: boolean;
    title?: string;
    subTitle?: string;
    desc?: string;
    avatar?: string;
    avatarClassName?: string;
    body?: SchemaNode;
    actions?: Array<Action>;
    onCheck: (item: IItem) => void;
}
export interface ListItemProps extends RendererProps, Omit<ListItemSchema, 'type' | 'className'> {
    hideCheckToggler?: boolean;
    item: IItem;
    itemIndex?: number;
    checkable?: boolean;
    checkOnItemClick?: boolean;
    itemAction?: ActionSchema;
}
export declare class ListItem extends React.Component<ListItemProps> {
    static defaultProps: Partial<ListItemProps>;
    static propsList: Array<string>;
    constructor(props: ListItemProps);
    handleClick(e: React.MouseEvent<HTMLDivElement>): void;
    handleCheck(): void;
    handleAction(e: React.UIEvent<any>, action: Action, ctx: object): void;
    handleQuickChange(values: object, saveImmediately?: boolean, savePristine?: boolean, resetOnFailed?: boolean): void;
    renderLeft(): JSX.Element | null;
    renderRight(): JSX.Element | null;
    renderChild(node: SchemaNode, region?: string, key?: any): React.ReactNode;
    itemRender(field: any, index: number, props: any): JSX.Element | null;
    renderFeild(region: string, field: any, key: any, props: any): JSX.Element | null;
    renderBody(): React.ReactNode;
    render(): JSX.Element;
}
export declare class ListItemRenderer extends ListItem {
    static propsList: string[];
}
export declare class ListItemFieldRenderer extends TableCell {
    static defaultProps: {
        wrapperComponent: string;
    };
    static propsList: string[];
    render(): JSX.Element;
}
