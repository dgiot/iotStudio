import React from 'react';
import { RendererProps } from '../factory';
import { BaseSchema, SchemaCollection } from '../Schema';
/**
 * Wrapper 容器渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/wrapper
 */
export interface WrapperSchema extends BaseSchema {
    /**
     * 指定为 container 类型
     */
    type: 'wrapper';
    /**
     * 内容
     */
    body: SchemaCollection;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'none';
    wrap?: boolean;
    /**
     * 自定义样式
     */
    style?: {
        [propName: string]: any;
    };
}
export interface WrapperProps extends RendererProps, Omit<WrapperSchema, 'className'> {
    children?: JSX.Element | ((props?: any) => JSX.Element);
}
export default class Wrapper extends React.Component<WrapperProps, object> {
    static propsList: Array<string>;
    static defaultProps: Partial<WrapperProps>;
    renderBody(): JSX.Element | null;
    render(): JSX.Element | null;
}
export declare class WrapperRenderer extends Wrapper {
}
