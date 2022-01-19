/**
 * @file 表格的方式显示只读信息，比如产品详情
 */
import React from 'react';
import { RendererProps } from '../factory';
import { BaseSchema, SchemaExpression, SchemaObject, SchemaTpl } from '../Schema';
export declare type PropertyItemProps = {
    /**
     * 属性名
     */
    label?: SchemaTpl;
    /**
     * 属性值
     */
    content?: SchemaTpl;
    /**
     * 配置是否显示，如果不显示，后续的节点会补上来
     */
    visibleOn?: SchemaExpression;
    /**
     * 配置是否显示，如果不显示，后续的节点会补上来
     */
    hiddenOn?: SchemaExpression;
    /**
     * 跨几列
     */
    span?: number;
};
export declare type PropertyItem = PropertyItemProps & SchemaObject;
/**
 * Property 属性列表
 * 文档：https://baidu.gitee.io/amis/docs/components/property
 */
export interface PropertySchema extends BaseSchema {
    /**
     * 指定为 property 展示类型
     */
    type: 'property';
    /**
     * 标题
     */
    title?: string;
    /**
     * 一共几列
     */
    column?: number;
    /**
     * 显示模式
     */
    mode?: 'table' | 'simple';
    /**
     * 每个 property 的设置
     */
    items: Array<PropertyItem>;
    /**
     * 自定义样式
     */
    style?: {
        [propName: string]: any;
    };
    /**
     * 标题样式
     */
    titleStyle?: {
        [propName: string]: any;
    };
    /**
     * 自定义样式
     */
    labelStyle?: {
        [propName: string]: any;
    };
    separator?: string;
    /**
     * 自定义样式
     */
    contentStyle?: {
        [propName: string]: any;
    };
}
export interface PropertyProps extends RendererProps, Omit<PropertySchema, 'type' | 'className'> {
}
interface PropertyContent {
    label: any;
    content: any;
    span: number;
}
export default class Property extends React.Component<PropertyProps, object> {
    constructor(props: PropertyProps);
    /**
     * 算好每行的分布情况，方便后续渲染
     */
    prepareRows(): PropertyContent[][];
    renderRow(rows: PropertyContent[][]): JSX.Element[];
    render(): JSX.Element;
}
export declare class PropertyRenderer extends Property {
}
export {};
