import React from 'react';
import { RendererProps } from '../factory';
import { BaseSchema } from '../Schema';
/**
 * 状态展示控件。
 * 文档：https://baidu.gitee.io/amis/docs/components/status
 */
export interface StatusSchema extends BaseSchema {
    /**
     * 指定为状态展示控件
     */
    type: 'status';
    /**
     * 占位符
     * @default -
     */
    placeholder?: string;
    /**
     * 状态图标映射关系
     * @default {
     *    0: 'svg-fail',
     *    1: 'svg-success',
     *    success: 'svg-success',
     *    pending: 'rolling',
     *    fail: 'svg-fail',
     *    queue: 'svg-warning',
     *    schedule: 'svg-schedule'
     *  }
     */
    map?: {
        [propName: string]: string;
    };
    /**
     * 文字映射关系
     *
     * @default {
     *     success: '成功',
     *     pending: '运行中',
     *     fail: '失败',
     *     queue: '排队中',
     *     schedule: '调度中'
     * }
     */
    labelMap?: {
        [propName: string]: string;
    };
}
export interface StatusProps extends RendererProps, Omit<StatusSchema, 'className'> {
}
export declare class StatusField extends React.Component<StatusProps, object> {
    static defaultProps: Partial<StatusProps>;
    render(): JSX.Element;
}
export declare class StatusFieldRenderer extends StatusField {
}
