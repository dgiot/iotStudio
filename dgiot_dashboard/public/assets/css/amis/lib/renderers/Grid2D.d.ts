import React from 'react';
import { RendererProps } from '../factory';
import { Schema } from '../types';
import { BaseSchema, SchemaObject } from '../Schema';
export declare type GridObject = {
    /**
     * 起始横坐标位置，以 1 为起点
     */
    x: number;
    /**
     * 起始纵坐标位置，以 1 为起点
     */
    y: number;
    /**
     * 宽度，跨几列
     */
    w: number;
    /**
     * 高度，跨几行
     */
    h: number;
    /**
     * 宽度，会影响起始位置对应那一列的宽度
     */
    width?: number | string;
    /**
     * 高度，会影响起始位置那一行的高度，设置为 auto 就会自适应
     */
    height?: number | string;
    /**
     * 水平展示方式，用于内容宽度比 grid 小的情况，默认是 auto 自动撑满
     */
    align?: 'left' | 'right' | 'center' | 'auto';
    /**
     * 垂直展示方式，用于内容高度比 grid 小的情况，默认是 auto 自动撑满
     */
    valign?: 'top' | 'bottom' | 'middle' | 'auto';
    /**
     * 每个格子最外层容器的 className
     */
    gridClassName?: string;
};
export declare type Grid = GridObject & SchemaObject;
/**
 * 二维布局渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/grid-2d
 */
export interface Grid2DSchema extends BaseSchema {
    /**
     * 指定为 grid-2d 展示类型
     */
    type: 'grid-2d';
    /**
     * 列数量，默认是 12
     */
    cols?: number;
    /**
     * grid 2d 容器宽度，默认是 auto
     */
    width?: number | string | 'auto';
    /**
     * 格子间距，默认 0，包含行和列
     */
    gap?: number | string;
    /**
     * 格子行级别的间距，如果不设置就和 gap 一样
     */
    gapRow?: number | string;
    /**
     * 单位行高度，默认 50 px
     */
    rowHeight?: number | string;
    /**
     * 每个格子的配置
     */
    grids: Array<Grid>;
}
export interface Grid2DProps extends RendererProps, Omit<Grid2DSchema, 'type' | 'className'> {
    itemRender?: (item: any, key: number, length: number, props: any) => JSX.Element;
}
export default class Grid2D extends React.Component<Grid2DProps, object> {
    static propsList: Array<string>;
    static defaultProps: Partial<Grid2DProps>;
    constructor(props: Grid2DProps);
    renderChild(region: string, node: Schema): JSX.Element;
    renderGrid(grid: GridObject, key: number, length: number): JSX.Element | null;
    renderGrids(): (JSX.Element | null)[];
    render(): JSX.Element;
}
export declare class Grid2DRenderer extends Grid2D {
}
