import React from 'react';
import { RendererProps } from '../factory';
import { IScopedContext } from '../Scoped';
import { BaseSchema, SchemaUrlPath } from '../Schema';
import { ActionSchema } from './Action';
/**
 * IFrame 渲染器
 * 文档：https://baidu.gitee.io/amis/docs/components/iframe
 */
export interface IFrameSchema extends BaseSchema {
    type: 'iframe';
    /**
     * 页面地址
     */
    src: SchemaUrlPath;
    /**
     * 事件相应，配置后当 iframe 通过 postMessage 发送事件时，可以触发 AMIS 内部的动作。
     */
    events?: {
        [eventName: string]: ActionSchema;
    };
    width?: number | string;
    height?: number | string;
}
export interface IFrameProps extends RendererProps, Omit<IFrameSchema, 'type' | 'className'> {
}
export default class IFrame extends React.Component<IFrameProps, object> {
    IFrameRef: React.RefObject<HTMLIFrameElement>;
    static propsList: Array<string>;
    static defaultProps: Partial<IFrameProps>;
    state: {
        width: string | number;
        height: string | number;
    };
    componentDidMount(): void;
    componentDidUpdate(prevProps: IFrameProps): void;
    componentWillUnmount(): void;
    onMessage(e: MessageEvent): void;
    onLoad(): void;
    reload(subpath?: any, query?: any): void;
    receive(values: object): void;
    postMessage(type: string, data: any): void;
    render(): JSX.Element;
}
export declare class IFrameRenderer extends IFrame {
    static contextType: React.Context<IScopedContext>;
    constructor(props: IFrameProps, context: IScopedContext);
    componentWillUnmount(): void;
}
