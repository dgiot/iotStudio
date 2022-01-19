/**
 * @file 用来展示用户头像
 */
import React from 'react';
import { RendererProps } from '../factory';
import { BaseSchema, SchemaClassName } from '../Schema';
import { BadgeSchema } from '../components/Badge';
/**
 * Avatar 用户头像显示
 * 文档：https://baidu.gitee.io/amis/docs/components/avatar
 */
export interface AvatarSchema extends BaseSchema {
    /**
     *  指定为用户头像控件
     */
    type: 'avatar';
    /**
     * 大小
     */
    size?: number;
    /**
     * 形状
     */
    shape?: 'circle' | 'square';
    /**
     * 图标
     */
    icon?: string;
    /**
     * 文本
     */
    text?: string;
    /**
     * 图片地址
     */
    src?: string;
    /**
     * 图片相对于容器的缩放方式
     */
    fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
    /**
     * 图片无法显示时的替换文字地址
     */
    alt?: string;
    /**
     * 类名
     */
    className?: SchemaClassName;
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
export interface AvatarProps extends RendererProps, Omit<AvatarSchema, 'type' | 'className'> {
}
export declare class AvatarField extends React.Component<AvatarProps, object> {
    render(): JSX.Element;
}
export declare class AvatarFieldRenderer extends AvatarField {
}
