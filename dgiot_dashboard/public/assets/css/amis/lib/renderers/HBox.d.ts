import React from 'react';
import { RendererProps } from '../factory';
import { Schema } from '../types';
import { BaseSchema, SchemaCollection, SchemaExpression } from '../Schema';
import { FormSchemaHorizontal } from './Form/index';
export declare type HBoxColumnObject = {
    /**
     * 列上 CSS 类名
     */
    columnClassName?: string;
    /**
     * 垂直对齐方式
     */
    valign?: 'top' | 'middle' | 'bottom' | 'between';
    /**
     * 宽度
     */
    width?: number | string;
    /**
     * 高度
     */
    height?: number | string;
    /**
     * 其他样式
     */
    style?: {
        [propName: string]: any;
    };
    /**
     * 配置子表单项默认的展示方式。
     */
    mode?: 'normal' | 'inline' | 'horizontal';
    /**
     * 如果是水平排版，这个属性可以细化水平排版的左右宽度占比。
     */
    horizontal?: FormSchemaHorizontal;
    /**
     * 内容区
     */
    body?: SchemaCollection;
    /**
     * 是否显示
     */
    visible?: boolean;
    /**
     * 是否显示表达式
     */
    visibleOn?: SchemaExpression;
};
export declare type HBoxColumn = HBoxColumnObject;
/**
 * Hbox 水平布局渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/hbox
 */
export interface HBoxSchema extends BaseSchema {
    /**
     * 指定为each展示类型
     */
    type: 'hbox';
    columns: Array<HBoxColumn>;
    /**
     * 配置子表单项默认的展示方式。
     */
    subFormMode?: 'normal' | 'inline' | 'horizontal';
    /**
     * 如果是水平排版，这个属性可以细化水平排版的左右宽度占比。
     */
    subFormHorizontal?: FormSchemaHorizontal;
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
export interface HBoxProps extends RendererProps, HBoxSchema {
    className: string;
    itemRender?: (item: any, key: number, length: number, props: any) => JSX.Element;
}
export default class HBox extends React.Component<HBoxProps, object> {
    static propsList: Array<string>;
    static defaultProps: Partial<HBoxProps>;
    renderChild(region: string, node: Schema, props?: any): JSX.Element;
    renderColumn(column: HBoxColumn, key: number, length: number): JSX.Element | null;
    renderColumns(): (JSX.Element | null)[];
    render(): JSX.Element;
}
export declare class HBoxRenderer extends HBox {
}
