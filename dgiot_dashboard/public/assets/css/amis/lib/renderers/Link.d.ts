import React from 'react';
import { RendererProps } from '../factory';
import { BaseSchema, SchemaTpl } from '../Schema';
import { BadgeSchema } from '../components/Badge';
/**
 * Link 链接展示控件。
 * 文档：https://baidu.gitee.io/amis/docs/components/link
 */
export interface LinkSchema extends BaseSchema {
    /**
     * 指定为 link 链接展示控件
     */
    type: 'link';
    /**
     * 是否新窗口打开。
     */
    blank?: boolean;
    /**
     * 链接内容，如果不配置将显示链接地址。
     */
    body?: SchemaTpl;
    /**
     * 角标
     */
    badge?: BadgeSchema;
}
export interface LinkProps extends RendererProps, Omit<LinkSchema, 'type' | 'className'> {
}
export declare class LinkField extends React.Component<LinkProps, object> {
    static defaultProps: {
        className: string;
        blank: boolean;
    };
    render(): JSX.Element;
}
export declare class LinkFieldRenderer extends LinkField {
}
