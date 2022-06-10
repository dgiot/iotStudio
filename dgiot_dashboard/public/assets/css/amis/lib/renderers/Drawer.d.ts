import React from 'react';
import { IScopedContext } from '../Scoped';
import { RendererProps } from '../factory';
import { SchemaNode, Action } from '../types';
import { IModalStore } from '../store/modal';
import { BaseSchema, SchemaClassName, SchemaCollection, SchemaName } from '../Schema';
import { ActionSchema } from './Action';
/**
 * Drawer 抽出式弹框。
 * 文档：https://baidu.gitee.io/amis/docs/components/drawer
 */
export interface DrawerSchema extends BaseSchema {
    type: 'drawer';
    /**
     * 默认不用填写，自动会创建确认和取消按钮。
     */
    actions?: Array<ActionSchema>;
    /**
     * 内容区域
     */
    body?: SchemaCollection;
    /**
     * 配置 Body 容器 className
     */
    bodyClassName?: SchemaClassName;
    /**
     * 是否支持按 ESC 关闭 Dialog
     */
    closeOnEsc?: boolean;
    name?: SchemaName;
    /**
     * Dialog 大小
     */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
    /**
     * 请通过配置 title 设置标题
     */
    title?: SchemaCollection;
    /**
     * 从什么位置弹出
     */
    position?: 'left' | 'right' | 'top' | 'bottom';
    /**
     * 头部
     */
    header?: SchemaCollection;
    /**
     * 底部
     */
    footer?: SchemaCollection;
    /**
     * 影响自动生成的按钮，如果自己配置了按钮这个配置无效。
     */
    confirm?: boolean;
    /**
     * 是否可以拖动弹窗大小
     */
    resizable?: boolean;
    /**
     * 是否显示蒙层
     */
    overlay?: boolean;
    /**
     * 点击外部的时候是否关闭弹框。
     */
    closeOnOutside?: boolean;
    /**
     * 是否显示错误信息
     */
    showErrorMsg?: boolean;
}
export declare type DrawerSchemaBase = Omit<DrawerSchema, 'type'>;
export interface DrawerProps extends RendererProps, Omit<DrawerSchema, 'className'> {
    onClose: () => void;
    onConfirm: (values: Array<object>, action: Action, ctx: object, targets: Array<any>) => void;
    children?: React.ReactNode | ((props?: any) => React.ReactNode);
    wrapperComponent: React.ElementType;
    lazySchema?: (props: DrawerProps) => SchemaCollection;
    store: IModalStore;
    show?: boolean;
    drawerContainer?: () => HTMLElement;
}
export interface DrawerState {
    entered: boolean;
    resizeCoord: number;
    [propName: string]: any;
}
export default class Drawer extends React.Component<DrawerProps> {
    static propsList: Array<string>;
    static defaultProps: Partial<DrawerProps>;
    reaction: any;
    $$id: string;
    drawer: any;
    constructor(props: DrawerProps);
    componentWillUnmount(): void;
    buildActions(): Array<ActionSchema>;
    handleSelfClose(): void;
    handleAction(e: React.UIEvent<any>, action: Action, data: object): void;
    handleDrawerConfirm(values: object[], action: Action, ...args: Array<any>): void;
    handleDrawerClose(...args: Array<any>): void;
    handleDialogConfirm(values: object[], action: Action, ...args: Array<any>): void;
    handleDialogClose(...args: Array<any>): void;
    handleChildFinished(value: any, action: Action): void;
    handleFormInit(data: any): void;
    handleFormChange(data: any, name?: string): void;
    handleFormSaved(data: any, response: any): void;
    handleEntered(): void;
    handleExited(): void;
    getPopOverContainer(): Element | null;
    renderBody(body: SchemaNode, key?: any): React.ReactNode;
    renderFooter(): JSX.Element | null;
    renderResizeCtrl(): JSX.Element;
    resizeMouseDown(e: React.MouseEvent<any>): void;
    bindResize(e: any): void;
    removeResize(): void;
    openFeedback(dialog: any, ctx: any): Promise<unknown>;
    render(): JSX.Element;
}
export declare class DrawerRenderer extends Drawer {
    static contextType: React.Context<IScopedContext>;
    constructor(props: DrawerProps, context: IScopedContext);
    componentWillUnmount(): void;
    tryChildrenToHandle(action: Action, ctx: object, rawAction?: Action): boolean;
    handleAction(e: React.UIEvent<any>, action: Action, data: object, throwErrors?: boolean, delegate?: IScopedContext): any;
    handleChildFinished(value: any, action: Action): void;
    handleDialogConfirm(values: object[], action: Action, ...rest: Array<any>): void;
    handleDrawerConfirm(values: object[], action: Action, ...rest: Array<any>): void;
    reloadTarget(target: string, data?: any): void;
    closeTarget(target: string): void;
}
