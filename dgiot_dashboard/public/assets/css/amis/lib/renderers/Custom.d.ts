import React from 'react';
import { BaseSchema } from '../Schema';
import { FormControlProps } from './Form/Item';
/**
 * 自定义组件
 */
export interface CustomSchema extends BaseSchema {
    /**
     * 实现自定义功能的渲染器，主要给 JS SDK 和可视化编辑器里使用。
     *
     * 文档：https://baidu.gitee.io/amis/components/custom
     */
    type: 'custom';
    onMount?: Function | string;
    onUpdate?: Function | string;
    onUnmount?: Function | string;
    inline?: boolean;
    id?: string;
    html?: string;
}
export interface CustomProps extends FormControlProps, CustomSchema {
    className?: string;
    value?: any;
    wrapperComponent?: any;
    inline?: boolean;
}
export declare class Custom extends React.Component<CustomProps, object> {
    static defaultProps: Partial<CustomProps>;
    dom: any;
    onUpdate: Function;
    onMount: Function;
    onUnmount: Function;
    constructor(props: CustomProps);
    componentDidUpdate(prevProps: CustomProps): void;
    componentDidMount(): void;
    componentwillUnmount(): void;
    render(): JSX.Element;
}
export declare class CustomRenderer extends Custom {
}
