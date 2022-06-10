import React from 'react';
import { RendererProps } from '../factory';
import { Payload } from '../types';
import { IScopedContext } from '../Scoped';
import { BaseSchema, SchemaApi, SchemaClassName, SchemaName } from '../Schema';
/**
 * Tasks 渲染器，格式说明
 * 文档：https://baidu.gitee.io/amis/docs/components/tasks
 */
export interface TasksSchema extends BaseSchema {
    /** 指定为任务类型 */
    type: 'tasks';
    btnClassName?: SchemaClassName;
    /**
     * 操作按钮文字
     * @default 上线
     */
    btnText?: string;
    /**
     * 用来获取任务状态的 API，当没有进行时任务时不会发送。
     */
    checkApi?: SchemaApi;
    /**
     * 当有任务进行中，会每隔一段时间再次检测，而时间间隔就是通过此项配置，默认 3s。
     * @default 3000
     */
    interval?: number;
    items?: Array<{
        /**
         * 任务键值，请唯一区分
         */
        key?: string;
        /**
         * 任务名称
         */
        label?: string;
        /**
         * 当前任务状态，支持 html
         */
        remark?: string;
        /**
         * 任务状态：
         * 0: 初始状态，不可操作。
         * 1: 就绪，可操作状态。
         * 2: 进行中，还没有结束。
         * 3：有错误，不可重试。
         * 4: 已正常结束。
         * 5：有错误，且可以重试。
         */
        status?: 0 | 1 | 2 | 3 | 4 | 5;
    }>;
    name?: SchemaName;
    /**
     * 操作列说明
     */
    operationLabel?: string;
    /**
     * 如果任务失败，且可以重试，提交的时候会使用此 API
     */
    reSubmitApi?: SchemaApi;
    /**
     * 备注列说明
     * @default 备注
     */
    remarkLabel?: string;
    /**
     * 配置容器重试按钮 className
     * @default btn-sm btn-danger
     */
    retryBtnClassName?: SchemaClassName;
    /**
     * 重试操作按钮文字
     * @default 重试
     */
    retryBtnText?: string;
    /**
     * 状态列说明
     * @default 状态
     */
    statusLabel?: string;
    /**
     * 状态显示对应的类名配置。
     * @default [ "label-warning", "label-info", "label-success", "label-danger", "label-default", "label-danger" ]
     */
    statusLabelMap?: Array<string>;
    /**
     * 状态显示对应的文字显示配置。
     * @default ["未开始", "就绪", "进行中", "出错", "已完成", "出错"],
     */
    statusTextMap?: Array<string>;
    /**
     * 提交任务使用的 API
     */
    submitApi?: SchemaApi;
    /**
     * 配置 table className
     */
    tableClassName?: SchemaClassName;
    /**
     * 任务名称列说明
     * @default 任务名称
     */
    taskNameLabel?: string;
    initialStatusCode?: number;
    readyStatusCode?: number;
    loadingStatusCode?: number;
    canRetryStatusCode?: number;
    finishStatusCode?: number;
    errorStatusCode?: number;
}
export interface TaskProps extends RendererProps, Omit<TasksSchema, 'className'> {
}
export interface TaskItem {
    label?: string;
    key?: string;
    remark?: string;
    status?: any;
}
export interface TaskState {
    error?: string;
    items: Array<TaskItem>;
}
export default class Task extends React.Component<TaskProps, TaskState> {
    static defaultProps: Partial<TaskProps>;
    timer: any;
    constructor(props: TaskProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: TaskProps): void;
    componentWillUnmount(): void;
    reload(): void;
    tick(force?: boolean): void;
    handleLoaded(ret: Payload): void;
    submitTask(item: TaskItem, index: number, retry?: boolean): void;
    render(): JSX.Element;
}
export declare class TaskRenderer extends Task {
    static contextType: React.Context<IScopedContext>;
    constructor(props: TaskProps, context: IScopedContext);
    componentWillUnmount(): void;
}
