import React from 'react';
import { RendererProps } from '../factory';
import { BaseSchema } from '../Schema';
/**
 * Divider 分割线渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/divider
 */
export interface DividerSchema extends BaseSchema {
    type: 'divider';
    lineStyle?: 'dashed' | 'solid';
    [propName: string]: any;
}
export interface DividerProps extends RendererProps, Omit<DividerSchema, 'type' | 'className'> {
}
export default class Divider extends React.Component<DividerProps, object> {
    static defaultProps: Pick<DividerProps, 'className' | 'lineStyle'>;
    render(): JSX.Element;
}
export declare class DividerRenderer extends Divider {
}
