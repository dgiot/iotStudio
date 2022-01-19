import React from 'react';
import { RendererProps } from '../../factory';
import { FormBaseControl } from './Item';
import { SchemaClassName, SchemaObject } from '../../Schema';
import { FormSchemaHorizontal } from './index';
export declare type GroupSubControl = SchemaObject & {
    /**
     * 列类名
     */
    columnClassName?: SchemaClassName;
    /**
     * 宽度占用比率。在某些容器里面有用比如 group
     */
    columnRatio?: number | 'auto';
};
/**
 * Group 表单集合渲染器，能让多个表单在一行显示
 * 文档：https://baidu.gitee.io/amis/docs/components/form/group
 */
export interface GroupControlSchema extends FormBaseControl {
    type: 'group';
    /**
     * FormItem 集合
     */
    body: Array<GroupSubControl>;
    /**
     * 间隔
     */
    gap?: 'xs' | 'sm' | 'normal';
    /**
     * 配置时垂直摆放还是左右摆放。
     */
    direction?: 'horizontal' | 'vertical';
    /**
     * 配置子表单项默认的展示方式。
     */
    subFormMode?: 'normal' | 'inline' | 'horizontal';
    /**
     * 如果是水平排版，这个属性可以细化水平排版的左右宽度占比。
     */
    subFormHorizontal?: FormSchemaHorizontal;
}
export interface InputGroupProps extends RendererProps, Omit<GroupControlSchema, 'type' | 'className'> {
}
export declare class ControlGroupRenderer extends React.Component<InputGroupProps> {
    constructor(props: InputGroupProps);
    renderControl(control: any, index: any, otherProps?: any): JSX.Element | null;
    renderVertical(props?: Readonly<InputGroupProps> & Readonly<{
        children?: React.ReactNode;
    }>): JSX.Element | null;
    renderHorizontal(props?: Readonly<InputGroupProps> & Readonly<{
        children?: React.ReactNode;
    }>): JSX.Element | null;
    renderInput(props?: Readonly<InputGroupProps> & Readonly<{
        children?: React.ReactNode;
    }>): JSX.Element | null;
    render(): JSX.Element | null;
}
