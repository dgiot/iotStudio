import React from 'react';
import { RendererProps } from '../../factory';
import { SchemaCollection } from '../../Schema';
import { FormBaseControl } from './Item';
/**
 * Group 表单集合渲染器，能让多个表单在一行显示
 * 文档：https://baidu.gitee.io/amis/docs/components/form/group
 */
export interface FormControlSchema extends FormBaseControl {
    type: 'control';
    /**
     * FormItem 内容
     */
    body: SchemaCollection;
}
export declare class ControlRenderer extends React.Component<RendererProps> {
    renderInput(): JSX.Element;
    render(): JSX.Element;
}
