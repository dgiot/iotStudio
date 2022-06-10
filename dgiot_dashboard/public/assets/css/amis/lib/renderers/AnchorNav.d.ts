import React from 'react';
import { RendererProps } from '../factory';
import { BaseSchema, SchemaClassName, SchemaCollection } from '../Schema';
/**
 * AnchorNavSection 锚点区域渲染器
 * 文档：https://baidu.gitee.io/amis/docs/components/anchor-nav
 */
export declare type AnchorNavSectionSchema = {
    /**
     * 导航文字说明
     */
    title: string;
    /**
     * 锚点链接
     */
    href?: string;
    /**
     * 内容
     */
    body?: SchemaCollection;
} & Omit<BaseSchema, 'type'>;
/**
 * AnchorNav 锚点导航渲染器
 * 文档：https://baidu.gitee.io/amis/docs/components/anchor-nav
 */
export interface AnchorNavSchema extends BaseSchema {
    /**
     * 指定为 AnchorNav 锚点导航渲染器
     */
    type: 'anchor-nav';
    /**
     * 楼层集合
     */
    links: Array<AnchorNavSectionSchema>;
    /**
     * 被激活（定位）的楼层
     */
    active?: string | number;
    /**
     * 样式名
     */
    className?: SchemaClassName;
    /**
     * 导航样式名
     */
    linkClassName?: SchemaClassName;
    /**
     * 楼层样式名
     */
    sectionClassName?: SchemaClassName;
}
export interface AnchorNavProps extends RendererProps, Omit<AnchorNavSchema, 'className' | 'linkClassName' | 'sectionClassName'> {
    active?: string | number;
    sectionRender?: (section: AnchorNavSectionSchema, props: AnchorNavProps, index: number) => JSX.Element;
}
export interface AnchorNavState {
    active: any;
}
export default class AnchorNav extends React.Component<AnchorNavProps, AnchorNavState> {
    static defaultProps: Partial<AnchorNavProps>;
    renderSection?: (section: AnchorNavSectionSchema, props: AnchorNavProps, index: number) => JSX.Element;
    constructor(props: AnchorNavProps);
    handleSelect(key: any): void;
    locateTo(index: number): void;
    render(): JSX.Element | null;
}
export declare class AnchorNavRenderer extends AnchorNav {
}
