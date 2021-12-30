/**
 * @file 用于表格类型的展现效果，界面可定制化能力更强
 */
import React from 'react';
import { RendererProps } from '../factory';
import { BaseSchema, SchemaObject } from '../Schema';
export declare type TdObject = {
    /**
     * 单元格背景色
     */
    background?: string;
    /**
     * 单元格文字颜色
     */
    color?: string;
    /**
     * 单元格文字是否加粗
     */
    bold?: boolean;
    /**
     * 单元格的内边距
     */
    padding?: number;
    /**
     * 单元格宽度
     */
    width?: number;
    /**
     * 单元格内的组件
     */
    body?: SchemaObject;
    /**
     * 水平对齐
     */
    align?: 'left' | 'center' | 'right' | 'justify';
    /**
     * 垂直对齐
     */
    valign?: 'top' | 'middle' | 'bottom' | 'baseline';
    /**
     * 跨几行
     */
    colspan?: number;
    /**
     * 跨几列
     */
    rowspan?: number;
    /**
     * 自定义样式
     */
    style?: object;
};
/**
 * 行设置
 */
export declare type TrObject = {
    /**
     * 行背景色
     */
    background?: string;
    /**
     * 行高度
     */
    height?: number;
    /**
     * 单元格配置
     */
    tds: TdObject[];
    style?: object;
};
/**
 * 列设置
 */
export declare type ColObject = {
    span?: number;
    style?: Object;
};
/**
 * 表格展现渲染器
 * 文档：https://baidu.gitee.io/amis/docs/components/table-view
 */
export interface TableViewSchema extends BaseSchema {
    /**
     * 指定为 table-view 展示类型
     */
    type: 'table-view';
    /**
     * table 容器宽度，默认是 auto
     */
    width?: number | string;
    /**
     *  默认单元格内边距
     */
    padding?: number | string;
    /**
     * 是否显示边框
     */
    border?: boolean;
    /**
     * 边框颜色
     */
    borderColor?: string;
    /**
     * 标题设置
     */
    caption?: string;
    /**
     * 标题位置
     */
    captionSide?: 'top' | 'bottom';
    /**
     * 行设置
     */
    trs: TrObject[];
    /**
     * 列设置
     */
    cols: ColObject[];
}
export interface TableViewProps extends RendererProps, Omit<TableViewSchema, 'type' | 'className'> {
    itemRender?: (item: any, key: number, length: number, props: any) => JSX.Element;
}
export default class TableView extends React.Component<TableViewProps, object> {
    static defaultProps: Partial<TableViewProps>;
    constructor(props: TableViewProps);
    renderTd(td: TdObject, colIndex: number, rowIndex: number): JSX.Element;
    renderTdBody(body?: SchemaObject): JSX.Element;
    renderTds(tds: TdObject[], rowIndex: number): JSX.Element[];
    renderTr(tr: TrObject, rowIndex: number): JSX.Element;
    renderTrs(trs: TrObject[]): JSX.Element[];
    renderCols(): JSX.Element | null;
    renderCaption(): JSX.Element | null;
    render(): JSX.Element;
}
export declare class TableViewRenderer extends TableView {
}
