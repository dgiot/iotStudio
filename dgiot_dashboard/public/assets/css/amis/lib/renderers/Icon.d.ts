import React from 'react';
import { RendererProps } from '../factory';
import { BaseSchema } from '../Schema';
import { BadgeSchema } from '../components/Badge';
/**
 * Icon 图表渲染器
 * 文档：https://baidu.gitee.io/amis/docs/components/icon
 */
export interface IconSchema extends BaseSchema {
    type: 'icon';
    /**
     * 按钮类型
     */
    icon: string;
    vendor?: 'iconfont' | 'fa';
    /**
     * 角标
     */
    badge?: BadgeSchema;
}
export interface IconProps extends RendererProps, Omit<IconSchema, 'type' | 'className'> {
}
export declare class Icon extends React.Component<IconProps, object> {
    static defaultProps: Partial<IconProps>;
    render(): JSX.Element;
}
export declare class TplRenderer extends Icon {
}
