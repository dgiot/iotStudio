/**
 * @file 简化版 Flex 布局，主要用于不熟悉 CSS 的开发者
 */
import React from 'react';
import { RendererProps } from '../factory';
import { BaseSchema, SchemaCollection } from '../Schema';
/**
 * Flex 布局
 * 文档：https://baidu.gitee.io/amis/docs/components/flex
 */
export interface FlexSchema extends BaseSchema {
    /**
     * 指定为 flex 展示类型
     */
    type: 'flex';
    /**
     * 水平分布
     */
    justify?: 'start' | 'flex-start' | 'center' | 'end' | 'flex-end' | 'space-around' | 'space-between' | 'space-evenly';
    /**
     * 垂直布局
     */
    alignItems?: 'stretch' | 'start' | 'flex-start' | 'flex-end' | 'end' | 'center' | 'baseline';
    /**
     * 多行情况下的垂直分布
     */
    alignContent?: 'normal' | 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | 'stretch';
    /**
     * 方向
     */
    direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    /**
     * 每个 flex 的设置
     */
    items: SchemaCollection;
    /**
     * 自定义样式
     */
    style?: {
        [propName: string]: any;
    };
}
export interface FlexProps extends RendererProps, Omit<FlexSchema, 'type' | 'className'> {
}
export default class Flex extends React.Component<FlexProps, object> {
    static defaultProps: Partial<FlexProps>;
    constructor(props: FlexProps);
    render(): JSX.Element;
}
export interface FlexItemSchema extends BaseSchema {
    /**
     * 功能和 wrapper 类似，主要是给 flex 子节点用的
     */
    type: 'flex-item';
    /**
     * 内容
     */
    body: SchemaCollection;
    /**
     * 自定义样式
     */
    style?: {
        [propName: string]: any;
    };
}
export interface FlexItemProps extends RendererProps, Omit<FlexItemSchema, 'className'> {
    children?: JSX.Element | ((props?: any) => JSX.Element);
}
export declare class FlexItem extends React.Component<FlexItemProps, object> {
    static propsList: Array<string>;
    renderBody(): JSX.Element | null;
    render(): JSX.Element;
}
export declare class FlexRenderer extends Flex {
}
export declare class FlexItemRenderer extends FlexItem {
}
