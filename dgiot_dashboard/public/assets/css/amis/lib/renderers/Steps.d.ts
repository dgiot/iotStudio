import React from 'react';
import { RendererProps } from '../factory';
import { BaseSchema, SchemaCollection } from '../Schema';
import { StepStatus } from '../components/Steps';
export declare type StepSchema = {
    /**
     * 标题
     */
    title: string | SchemaCollection;
    /**
     * 子标题
     */
    subTitle?: string | SchemaCollection;
    /**
     * 图标
     */
    icon?: string;
    value?: string | number;
    /**
     * 描述
     */
    description?: string | SchemaCollection;
} & Omit<BaseSchema, 'type'>;
export interface StepsSchema extends BaseSchema {
    /**
     * 指定为 Steps 步骤条渲染器
     */
    type: 'steps';
    /**
     * 步骤
     */
    steps?: Array<StepSchema>;
    /**
     * API 或 数据映射
     */
    source?: string;
    /**
     * 指定当前步骤
     */
    value?: number | string;
    /**
     * 变量映射
     */
    name?: string;
    status?: StepStatus | {
        [propName: string]: StepStatus;
    };
    /**
     * 展示模式
     */
    mode?: 'horizontal' | 'vertical';
}
export interface StepsProps extends RendererProps, Omit<StepsSchema, 'className'> {
}
export declare function StepsCmpt(props: StepsProps): JSX.Element;
export declare class StepsRenderer extends React.Component<StepsProps> {
    render(): JSX.Element;
}
