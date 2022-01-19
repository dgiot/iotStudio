import React from 'react';
import { RendererProps } from '../factory';
import { SchemaNode, Action } from '../types';
import { IItem } from '../store/list';
import { SchemaQuickEdit } from './QuickEdit';
import { SchemaPopOver } from './PopOver';
import { TableCell } from './Table';
import { SchemaCopyable } from './Copyable';
import { BaseSchema, SchemaClassName, SchemaExpression, SchemaObject, SchemaTpl, SchemaUrlPath } from '../Schema';
import { ActionSchema } from './Action';
export declare type CardBodyField = SchemaObject & {
    /**
     * 列标题
     */
    label: string;
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
/**
 * Card 卡片渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/card
 */
export interface CardSchema extends BaseSchema {
    /**
     * 指定为 card 类型
     */
    type: 'card';
    /**
     * 头部配置
     */
    header?: {
        className?: SchemaClassName;
        /**
         * 标题
         */
        title?: SchemaTpl;
        titleClassName?: string;
        /**
         * 副标题
         */
        subTitle?: SchemaTpl;
        subTitleClassName?: SchemaClassName;
        subTitlePlaceholder?: string;
        /**
         * 描述
         */
        description?: SchemaTpl;
        /**
         * 描述占位内容
         */
        descriptionPlaceholder?: string;
        /**
         * 描述占位类名
         */
        descriptionClassName?: string;
        /**
         * @deprecated 建议用 description
         */
        desc?: SchemaTpl;
        /**
         * @deprecated 建议用 descriptionPlaceholder
         */
        descPlaceholder?: SchemaTpl;
        /**
         * @deprecated 建议用 descriptionClassName
         */
        descClassName?: SchemaClassName;
        /**
         * 图片地址
         */
        avatar?: SchemaUrlPath;
        avatarText?: SchemaTpl;
        avatarTextClassName?: SchemaClassName;
        /**
         * 图片包括层类名
         */
        avatarClassName?: SchemaClassName;
        /**
         * 图片类名。
         */
        imageClassName?: SchemaClassName;
        /**
         * 是否点亮
         */
        highlight?: SchemaExpression;
        highlightClassName?: SchemaClassName;
        /**
         * 链接地址
         */
        href?: SchemaTpl;
        /**
         * 是否新窗口打开
         */
        blank?: boolean;
    };
    /**
     * 内容区域
     */
    body?: Array<CardBodyField>;
    /**
     * 底部按钮集合。
     */
    actions?: Array<ActionSchema>;
}
export interface CardProps extends RendererProps, Omit<CardSchema, 'className'> {
    onCheck: (item: IItem) => void;
    itemIndex?: number;
    multiple?: boolean;
    highlightClassName?: string;
    hideCheckToggler?: boolean;
    item: IItem;
    checkOnItemClick?: boolean;
}
export declare class Card extends React.Component<CardProps> {
    static defaultProps: Partial<CardProps>;
    static propsList: Array<string>;
    constructor(props: CardProps);
    handleClick(e: React.MouseEvent<HTMLDivElement>): void;
    handleCheck(): void;
    handleAction(e: React.UIEvent<any>, action: Action, ctx: object): void;
    handleQuickChange(values: object, saveImmediately?: boolean, savePristine?: boolean, resetOnFailed?: boolean): void;
    getPopOverContainer(): Element | Text | null;
    renderToolbar(): JSX.Element | null;
    renderActions(): JSX.Element[] | null;
    renderChild(node: SchemaNode, region?: string, key?: any): React.ReactNode;
    itemRender(field: any, index: number, props: any): JSX.Element | undefined;
    renderFeild(region: string, field: any, key: any, props: any): JSX.Element | undefined;
    renderBody(): React.ReactNode;
    render(): JSX.Element;
}
export declare class CardRenderer extends Card {
    static propsList: string[];
}
export declare class CardItemFieldRenderer extends TableCell {
    static defaultProps: {
        wrapperComponent: string;
    };
    static propsList: string[];
    render(): JSX.Element;
}
