import React from 'react';
import { RendererProps } from '../factory';
import { BaseSchema, SchemaClassName, SchemaCollection } from '../Schema';
/**
 * Container 容器渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/container
 */
export interface ContainerSchema extends BaseSchema {
    /**
     * 指定为 container 类型
     */
    type: 'container';
    /**
     * 内容
     */
    body: SchemaCollection;
    /**
     * body 类名
     */
    bodyClassName?: SchemaClassName;
    /**
     * 自定义样式
     */
    style?: {
        [propName: string]: any;
    };
    /**
     * 使用的标签
     */
    wrapperComponent?: string;
}
export interface ContainerProps extends RendererProps, Omit<ContainerSchema, 'type' | 'className'> {
    children?: (props: any) => React.ReactNode;
}
export default class Container<T> extends React.Component<ContainerProps & T, object> {
    static propsList: Array<string>;
    static defaultProps: {
        className: string;
    };
    renderBody(): JSX.Element | null;
    render(): JSX.Element;
}
export declare class ContainerRenderer extends Container<{}> {
}
