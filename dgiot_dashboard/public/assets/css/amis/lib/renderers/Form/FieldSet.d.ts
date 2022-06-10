import React from 'react';
import { FormSchemaHorizontal } from './index';
import { RendererProps } from '../../factory';
import { SchemaCollection, SchemaTpl } from '../../Schema';
import { CollapseSchema } from '../Collapse';
import { FormBaseControl } from './Item';
/**
 * FieldSet 表单项集合
 * 文档：https://baidu.gitee.io/amis/docs/components/form/fieldset
 */
export interface FieldSetControlSchema extends Omit<FormBaseControl, 'size'>, Omit<CollapseSchema, 'type' | 'body'> {
    /**
     * 指定为表单项集合
     */
    type: 'fieldset' | 'fieldSet';
    /**
     * 标题展示位置
     */
    titlePosition: 'top' | 'bottom';
    /**
     * 是否可折叠
     */
    collapsable?: boolean;
    /**
     * 默认是否折叠
     */
    collapsed?: boolean;
    /**
     * 内容区域
     */
    body?: SchemaCollection;
    /**
     * 标题
     */
    title?: SchemaTpl;
    /**
     * 收起的标题
     */
    collapseTitle?: SchemaTpl;
    /**
     * 点开时才加载内容
     */
    mountOnEnter?: boolean;
    /**
     * 卡片隐藏就销毁内容。
     */
    unmountOnExit?: boolean;
    /**
     * 配置子表单项默认的展示方式。
     */
    subFormMode?: 'normal' | 'inline' | 'horizontal';
    /**
     * 如果是水平排版，这个属性可以细化水平排版的左右宽度占比。
     */
    subFormHorizontal?: FormSchemaHorizontal;
}
export interface FieldSetProps extends RendererProps, Omit<FieldSetControlSchema, 'type' | 'className' | 'descriptionClassName' | 'inputClassName'> {
}
export default class FieldSetControl extends React.Component<FieldSetProps, any> {
    constructor(props: FieldSetProps);
    static defaultProps: {
        titlePosition: string;
        headingClassName: string;
        collapsable: boolean;
    };
    renderBody(): JSX.Element;
    render(): JSX.Element;
}
export declare class FieldSetRenderer extends FieldSetControl {
}
