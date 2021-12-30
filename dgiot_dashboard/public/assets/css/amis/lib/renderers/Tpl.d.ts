import React from 'react';
import { RendererProps } from '../factory';
import { BaseSchema, SchemaTpl } from '../Schema';
import { BadgeSchema } from '../components/Badge';
/**
 * tpl 渲染器
 */
export interface TplSchema extends BaseSchema {
    /**
     * 指定为模板渲染器。
     *
     * 文档：https://baidu.gitee.io/amis/docs/concepts/template
     */
    type: 'tpl' | 'html';
    tpl?: SchemaTpl;
    html?: SchemaTpl;
    text?: SchemaTpl;
    raw?: string;
    /**
     * 是否内联显示？
     */
    inline?: boolean;
    /**
     * 自定义样式
     */
    style?: {
        [propName: string]: any;
    };
    /**
     * 角标
     */
    badge?: BadgeSchema;
}
export interface TplProps extends RendererProps, TplSchema {
    className?: string;
    value?: string;
    wrapperComponent?: any;
    inline?: boolean;
}
export declare class Tpl extends React.Component<TplProps, object> {
    static defaultProps: Partial<TplProps>;
    dom: any;
    constructor(props: TplProps);
    componentDidUpdate(prevProps: TplProps): void;
    htmlRef(dom: any): void;
    getContent(): string;
    _render(): void;
    render(): JSX.Element;
}
export declare class TplRenderer extends Tpl {
}
