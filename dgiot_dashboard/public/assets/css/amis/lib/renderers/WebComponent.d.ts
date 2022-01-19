import React from 'react';
import { RendererProps } from '../factory';
import { BaseSchema, SchemaCollection } from '../Schema';
/**
 * WebComponent 容器渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/web-component
 */
export interface WebComponentSchema extends BaseSchema {
    /**
     * 指定为 web-component 类型
     */
    type: 'web-component';
    /**
     * 标签
     */
    tag: string;
    /**
     * 子节点
     */
    body: SchemaCollection;
    /**
     * 组件属性
     */
    prpos?: {
        [propName: string]: any;
    };
}
export default class WebComponent extends React.Component<RendererProps> {
    renderBody(): JSX.Element | null;
    render(): JSX.Element;
}
export declare class WebComponentRenderer extends WebComponent {
}
