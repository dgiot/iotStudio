import React from 'react';
import { RendererProps } from '../factory';
import { BaseSchema } from '../Schema';
import { ActionSchema } from './Action';
/**
 * 操作栏渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/operation
 */
export interface OperationSchema extends BaseSchema {
    /**
     * 指定为操作栏
     */
    type: 'operation';
    /**
     * 占位符
     */
    placeholder?: string;
    buttons: Array<ActionSchema>;
}
export interface OperationProps extends RendererProps, Omit<OperationSchema, 'type' | 'className'> {
}
export declare class OperationField extends React.Component<OperationProps, object> {
    static propsList: Array<string>;
    static defaultProps: Partial<OperationProps>;
    render(): JSX.Element;
}
export declare class OperationFieldRenderer extends OperationField {
}
