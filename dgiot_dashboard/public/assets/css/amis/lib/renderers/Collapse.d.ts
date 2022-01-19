import React from 'react';
import { RendererProps } from '../factory';
import { BaseSchema, SchemaClassName, SchemaCollection, SchemaTpl } from '../Schema';
/**
 * Collapse 折叠渲染器，格式说明。
 * 文档：https://baidu.gitee.io/amis/docs/components/collapse
 */
export interface CollapseSchema extends BaseSchema {
    /**
     * 指定为折叠器类型
     */
    type: 'collapse';
    /**
     * 标题展示位置
     */
    titlePosition: 'top' | 'bottom';
    /**
     * 内容区域
     */
    body: SchemaCollection;
    /**
     * 配置 Body 容器 className
     */
    bodyClassName?: SchemaClassName;
    /**
     * 是否可折叠
     */
    collapsable?: boolean;
    /**
     * 默认是否折叠
     */
    collapsed?: boolean;
    /**
     * 标题 CSS 类名
     */
    headingClassName?: string;
    /**
     * 标题
     */
    title?: SchemaTpl;
    /**
     * 收起的标题
     */
    collapseTitle?: SchemaTpl;
    /**
     * 控件大小
     */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'base';
    /**
     * 点开时才加载内容
     */
    mountOnEnter?: boolean;
    /**
     * 卡片隐藏就销毁内容。
     */
    unmountOnExit?: boolean;
}
export interface CollapseProps extends RendererProps, Omit<CollapseSchema, 'type' | 'className'> {
    wrapperComponent?: any;
    headingComponent?: any;
    children?: JSX.Element | ((props?: any) => JSX.Element);
}
export interface CollapseState {
    collapsed: boolean;
}
export default class Collapse extends React.Component<CollapseProps, CollapseState> {
    static propsList: Array<string>;
    static defaultProps: Partial<CollapseProps>;
    state: {
        collapsed: boolean;
    };
    constructor(props: CollapseProps);
    componentDidUpdate(prevProps: CollapseProps): void;
    toggleCollapsed(e: React.MouseEvent<HTMLElement>): void;
    render(): JSX.Element;
}
export declare class CollapseRenderer extends Collapse {
}
