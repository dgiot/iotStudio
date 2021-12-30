import React from 'react';
import { RendererProps } from '../factory';
import { Schema } from '../types';
import { BaseSchema, SchemaCollection } from '../Schema';
/**
 * Each 循环功能渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/each
 */
export interface EachSchema extends BaseSchema {
    /**
     * 指定为each展示类型
     */
    type: 'each';
    /**
     * 关联字段名
     */
    name?: string;
    /**
     * 关联字段名 支持数据映射
     */
    source?: string;
    items?: SchemaCollection;
    placeholder?: string;
}
export interface EachProps extends RendererProps {
    name: string;
    items: Schema;
}
export default class Each extends React.Component<EachProps> {
    static propsList: Array<string>;
    static defaultProps: {
        className: string;
        placeholder: string;
    };
    render(): JSX.Element;
}
export declare class EachRenderer extends Each {
}
