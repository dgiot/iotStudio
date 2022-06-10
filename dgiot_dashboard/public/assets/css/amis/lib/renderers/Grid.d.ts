import React from 'react';
import { RendererProps } from '../factory';
import { BaseSchema, SchemaClassName, SchemaCollection } from '../Schema';
import { FormSchemaHorizontal } from './Form/index';
export declare const ColProps: string[];
export declare type GridColumnObject = {
    /**
     * 极小屏（<768px）时宽度占比
     */
    xs?: number | 'auto';
    /**
     * 小屏时（>=768px）宽度占比
     */
    sm?: number | 'auto';
    /**
     * 中屏时(>=992px)宽度占比
     */
    md?: number | 'auto';
    /**
     * 大屏时(>=1200px)宽度占比
     */
    lg?: number | 'auto';
    /**
     * 垂直对齐方式
     */
    valign?: 'top' | 'middle' | 'bottom' | 'between';
    /**
     * 配置子表单项默认的展示方式。
     */
    mode?: 'normal' | 'inline' | 'horizontal';
    /**
     * 如果是水平排版，这个属性可以细化水平排版的左右宽度占比。
     */
    horizontal?: FormSchemaHorizontal;
    body?: SchemaCollection;
    /**
     * 列类名
     */
    columnClassName?: SchemaClassName;
};
export declare type GridColumn = GridColumnObject;
export declare type ColumnNode = GridColumn;
export interface ColumnArray extends Array<ColumnNode> {
}
/**
 * Grid 格子布局渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/grid
 */
export interface GridSchema extends BaseSchema {
    /**
     * 指定为 Grid 格子布局渲染器。
     */
    type: 'grid';
    /**
     * 列集合
     */
    columns: Array<GridColumn>;
    /**
     * 水平间距
     */
    gap?: 'xs' | 'sm' | 'base' | 'none' | 'md' | 'lg';
    /**
     * 垂直对齐方式
     */
    valign?: 'top' | 'middle' | 'bottom' | 'between';
    /**
     * 水平对齐方式
     */
    align?: 'left' | 'right' | 'between' | 'center';
}
export interface GridProps extends RendererProps, Omit<GridSchema, 'type' | 'className' | 'columnClassName'> {
    itemRender?: (item: any, length: number, props: any) => JSX.Element;
}
export default class Grid<T> extends React.Component<GridProps & T, object> {
    static propsList: Array<string>;
    static defaultProps: {};
    renderChild(region: string, node: SchemaCollection, length: number, props?: any): JSX.Element;
    renderColumn(column: ColumnNode, key: number, length: number): JSX.Element;
    renderColumns(columns: ColumnArray): JSX.Element[] | null;
    render(): JSX.Element;
}
export declare class GridRenderer extends Grid<{}> {
}
