/**
 * @file 用来展示面包屑导航
 */
import React from 'react';
import { RendererProps } from '../factory';
import { BaseSchema, SchemaIcon, SchemaUrlPath } from '../Schema';
export declare type BreadcrumbItemSchema = {
    /**
     * 文字
     */
    label?: string;
    /**
     * 图标类名
     */
    icon?: SchemaIcon;
    /**
     * 链接地址
     */
    href?: SchemaUrlPath;
} & Omit<BaseSchema, 'type'>;
/**
 * Breadcrumb 显示渲染器
 * 文档：https://baidu.gitee.io/amis/docs/components/breadcrumb
 */
export interface BreadcrumbSchema extends BaseSchema {
    /**
     *  指定为面包屑显示控件
     */
    type: 'breadcrumb';
    /**
     * 分隔符
     */
    separator?: string;
    /**
     * 分隔符类
     */
    separatorClassName?: string;
    /**
     * 列表
     */
    items: Array<BreadcrumbItemSchema>;
}
export interface BreadcrumbProps extends RendererProps, Omit<BreadcrumbSchema, 'type' | 'className'> {
}
export declare class BreadcrumbField extends React.Component<BreadcrumbProps, object> {
    static defaultProps: {
        className: string;
        itemClassName: string;
        separator: string;
    };
    render(): JSX.Element;
}
export declare class BreadcrumbFieldRenderer extends BreadcrumbField {
}
