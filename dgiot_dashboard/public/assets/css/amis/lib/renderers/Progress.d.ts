import React from 'react';
import { RendererProps } from '../factory';
import { BaseSchema, SchemaClassName } from '../Schema';
/**
 * 进度展示控件。
 * 文档：https://baidu.gitee.io/amis/docs/components/progress
 */
export interface ProgressSchema extends BaseSchema {
    type: 'progress';
    /**
     * 关联字段名。
     */
    name?: string;
    /**
     * 进度条 CSS 类名
     */
    progressClassName?: SchemaClassName;
    /**
     * 进度外层 CSS 类名
     */
    progressBarClassName?: SchemaClassName;
    /**
     * 配置不通的值段，用不通的样式提示用户
     */
    map?: Array<SchemaClassName>;
    /**
     * 是否显示值
     */
    showLabel?: boolean;
    /**
     * 占位符
     */
    placeholder?: string;
    /**
     * 是否显示背景间隔
     */
    stripe?: boolean;
    /**
     * 是否显示动画（只有在开启的时候才能看出来）
     */
    animate?: boolean;
}
export interface ProgressProps extends RendererProps, Omit<ProgressSchema, 'type' | 'className'> {
    map: Array<SchemaClassName>;
}
export declare class ProgressField extends React.Component<ProgressProps, object> {
    static defaultProps: {
        placeholder: string;
        progressClassName: string;
        progressBarClassName: string;
        map: string[];
        showLabel: boolean;
        stripe: boolean;
        animate: boolean;
    };
    autoClassName(value: number): SchemaClassName;
    render(): JSX.Element;
}
export declare class ProgressFieldRenderer extends ProgressField {
}
