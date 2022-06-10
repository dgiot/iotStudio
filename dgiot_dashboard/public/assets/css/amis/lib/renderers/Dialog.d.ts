/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { IScopedContext } from '../Scoped';
import { RendererProps } from '../factory';
import { SchemaNode, Action } from '../types';
import { IModalStore } from '../store/modal';
import { BaseSchema, SchemaClassName, SchemaCollection, SchemaName } from '../Schema';
import { ActionSchema } from './Action';
/**
 * Dialog 弹框渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/dialog
 */
export interface DialogSchema extends BaseSchema {
    type: 'dialog';
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
    /**
     * 是否支持点其它区域关闭 Dialog
     */
    closeOnOutside?: boolean;
    name?: SchemaName;
    /**
     * Dialog 大小
     */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
    /**
     * 请通过配置 title 设置标题
     */
    title?: SchemaCollection;
    header?: SchemaCollection;
    headerClassName?: SchemaClassName;
    footer?: SchemaCollection;
    /**
     * 影响自动生成的按钮，如果自己配置了按钮这个配置无效。
     */
    confirm?: boolean;
    /**
     * 是否显示关闭按钮
     */
    showCloseButton?: boolean;
    /**
     * 是否显示错误信息
     */
    showErrorMsg?: boolean;
}
export declare type DialogSchemaBase = Omit<DialogSchema, 'type'>;
export interface DialogProps extends RendererProps, Omit<DialogSchema, 'className'> {
    onClose: () => void;
    onConfirm: (values: Array<object>, action: Action, ctx: object, targets: Array<any>) => void;
    children?: React.ReactNode | ((props?: any) => React.ReactNode);
    store: IModalStore;
    show?: boolean;
    lazyRender?: boolean;
    lazySchema?: (props: DialogProps) => SchemaCollection;
    wrapperComponent: React.ElementType;
}
export default class Dialog extends React.Component<DialogProps> {
    static propsList: Array<string>;
    static defaultProps: {
        title: string;
        bodyClassName: string;
        confirm: boolean;
        show: boolean;
        lazyRender: boolean;
        showCloseButton: boolean;
        wrapperComponent: {
            new (props: (Omit<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>): {
                render(): JSX.Element;
                context: any;
                setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
                forceUpdate(callback?: (() => void) | undefined): void;
                readonly props: Readonly<Omit<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
                    children?: React.ReactNode;
                }>;
                state: Readonly<{}>;
                refs: {
                    [key: string]: React.ReactInstance;
                };
                componentDidMount?(): void;
                shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
                componentWillUnmount?(): void;
                componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
                componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
                componentWillMount?(): void;
                UNSAFE_componentWillMount?(): void;
                componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
                UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
                componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
                UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
            };
            new (props: Omit<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
                render(): JSX.Element;
                context: any;
                setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
                forceUpdate(callback?: (() => void) | undefined): void;
                readonly props: Readonly<Omit<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
                    children?: React.ReactNode;
                }>;
                state: Readonly<{}>;
                refs: {
                    [key: string]: React.ReactInstance;
                };
                componentDidMount?(): void;
                shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
                componentWillUnmount?(): void;
                componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
                componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
                componentWillMount?(): void;
                UNSAFE_componentWillMount?(): void;
                componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
                UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
                componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
                UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
            };
            displayName: string;
            contextType: React.Context<string>;
            ComposedComponent: React.ComponentType<{
                new (props: (Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }) | Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>): {
                    render(): JSX.Element;
                    context: any;
                    setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
                    forceUpdate(callback?: (() => void) | undefined): void;
                    readonly props: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }> & Readonly<{
                        children?: React.ReactNode;
                    }>;
                    state: Readonly<{}>;
                    refs: {
                        [key: string]: React.ReactInstance;
                    };
                    componentDidMount?(): void;
                    shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextState: Readonly<{}>, nextContext: any): boolean;
                    componentWillUnmount?(): void;
                    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                    getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, prevState: Readonly<{}>): any;
                    componentDidUpdate?(prevProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, prevState: Readonly<{}>, snapshot?: any): void;
                    componentWillMount?(): void;
                    UNSAFE_componentWillMount?(): void;
                    componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextContext: any): void;
                    UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextContext: any): void;
                    componentWillUpdate?(nextProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextState: Readonly<{}>, nextContext: any): void;
                    UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextState: Readonly<{}>, nextContext: any): void;
                };
                new (props: Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, context: any): {
                    render(): JSX.Element;
                    context: any;
                    setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
                    forceUpdate(callback?: (() => void) | undefined): void;
                    readonly props: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }> & Readonly<{
                        children?: React.ReactNode;
                    }>;
                    state: Readonly<{}>;
                    refs: {
                        [key: string]: React.ReactInstance;
                    };
                    componentDidMount?(): void;
                    shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextState: Readonly<{}>, nextContext: any): boolean;
                    componentWillUnmount?(): void;
                    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                    getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, prevState: Readonly<{}>): any;
                    componentDidUpdate?(prevProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, prevState: Readonly<{}>, snapshot?: any): void;
                    componentWillMount?(): void;
                    UNSAFE_componentWillMount?(): void;
                    componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextContext: any): void;
                    UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextContext: any): void;
                    componentWillUpdate?(nextProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextState: Readonly<{}>, nextContext: any): void;
                    UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextState: Readonly<{}>, nextContext: any): void;
                };
                displayName: string;
                contextType: React.Context<string>;
                ComposedComponent: React.ComponentType<typeof import("../components/Modal").Modal>;
            } & import("hoist-non-react-statics").NonReactStatics<typeof import("../components/Modal").Modal, {}> & {
                ComposedComponent: typeof import("../components/Modal").Modal;
            }>;
        } & import("hoist-non-react-statics").NonReactStatics<{
            new (props: (Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }) | Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>): {
                render(): JSX.Element;
                context: any;
                setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
                forceUpdate(callback?: (() => void) | undefined): void;
                readonly props: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }> & Readonly<{
                    children?: React.ReactNode;
                }>;
                state: Readonly<{}>;
                refs: {
                    [key: string]: React.ReactInstance;
                };
                componentDidMount?(): void;
                shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextState: Readonly<{}>, nextContext: any): boolean;
                componentWillUnmount?(): void;
                componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, prevState: Readonly<{}>): any;
                componentDidUpdate?(prevProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, prevState: Readonly<{}>, snapshot?: any): void;
                componentWillMount?(): void;
                UNSAFE_componentWillMount?(): void;
                componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextContext: any): void;
                UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextContext: any): void;
                componentWillUpdate?(nextProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextState: Readonly<{}>, nextContext: any): void;
                UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextState: Readonly<{}>, nextContext: any): void;
            };
            new (props: Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, context: any): {
                render(): JSX.Element;
                context: any;
                setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
                forceUpdate(callback?: (() => void) | undefined): void;
                readonly props: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }> & Readonly<{
                    children?: React.ReactNode;
                }>;
                state: Readonly<{}>;
                refs: {
                    [key: string]: React.ReactInstance;
                };
                componentDidMount?(): void;
                shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextState: Readonly<{}>, nextContext: any): boolean;
                componentWillUnmount?(): void;
                componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, prevState: Readonly<{}>): any;
                componentDidUpdate?(prevProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, prevState: Readonly<{}>, snapshot?: any): void;
                componentWillMount?(): void;
                UNSAFE_componentWillMount?(): void;
                componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextContext: any): void;
                UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextContext: any): void;
                componentWillUpdate?(nextProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextState: Readonly<{}>, nextContext: any): void;
                UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextState: Readonly<{}>, nextContext: any): void;
            };
            displayName: string;
            contextType: React.Context<string>;
            ComposedComponent: React.ComponentType<typeof import("../components/Modal").Modal>;
        } & import("hoist-non-react-statics").NonReactStatics<typeof import("../components/Modal").Modal, {}> & {
            ComposedComponent: typeof import("../components/Modal").Modal;
        }, {}> & {
            ComposedComponent: {
                new (props: (Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }) | Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>): {
                    render(): JSX.Element;
                    context: any;
                    setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
                    forceUpdate(callback?: (() => void) | undefined): void;
                    readonly props: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }> & Readonly<{
                        children?: React.ReactNode;
                    }>;
                    state: Readonly<{}>;
                    refs: {
                        [key: string]: React.ReactInstance;
                    };
                    componentDidMount?(): void;
                    shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextState: Readonly<{}>, nextContext: any): boolean;
                    componentWillUnmount?(): void;
                    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                    getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, prevState: Readonly<{}>): any;
                    componentDidUpdate?(prevProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, prevState: Readonly<{}>, snapshot?: any): void;
                    componentWillMount?(): void;
                    UNSAFE_componentWillMount?(): void;
                    componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextContext: any): void;
                    UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextContext: any): void;
                    componentWillUpdate?(nextProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextState: Readonly<{}>, nextContext: any): void;
                    UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextState: Readonly<{}>, nextContext: any): void;
                };
                new (props: Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                    container: HTMLElement;
                    size: string;
                    overlay: boolean;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, context: any): {
                    render(): JSX.Element;
                    context: any;
                    setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
                    forceUpdate(callback?: (() => void) | undefined): void;
                    readonly props: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }> & Readonly<{
                        children?: React.ReactNode;
                    }>;
                    state: Readonly<{}>;
                    refs: {
                        [key: string]: React.ReactInstance;
                    };
                    componentDidMount?(): void;
                    shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextState: Readonly<{}>, nextContext: any): boolean;
                    componentWillUnmount?(): void;
                    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                    getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, prevState: Readonly<{}>): any;
                    componentDidUpdate?(prevProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, prevState: Readonly<{}>, snapshot?: any): void;
                    componentWillMount?(): void;
                    UNSAFE_componentWillMount?(): void;
                    componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextContext: any): void;
                    UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextContext: any): void;
                    componentWillUpdate?(nextProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextState: Readonly<{}>, nextContext: any): void;
                    UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<import("../components/Modal").ModalProps, keyof import("../locale").LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                        container: HTMLElement;
                        size: string;
                        overlay: boolean;
                    }, never>> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextState: Readonly<{}>, nextContext: any): void;
                };
                displayName: string;
                contextType: React.Context<string>;
                ComposedComponent: React.ComponentType<typeof import("../components/Modal").Modal>;
            } & import("hoist-non-react-statics").NonReactStatics<typeof import("../components/Modal").Modal, {}> & {
                ComposedComponent: typeof import("../components/Modal").Modal;
            };
        } & {
            Header: {
                new (props: (Omit<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>): {
                    render(): JSX.Element;
                    context: any;
                    setState<K_2 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K_2> | null) | Pick<{}, K_2> | null, callback?: (() => void) | undefined): void;
                    forceUpdate(callback?: (() => void) | undefined): void;
                    readonly props: Readonly<Omit<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
                        children?: React.ReactNode;
                    }>;
                    state: Readonly<{}>;
                    refs: {
                        [key: string]: React.ReactInstance;
                    };
                    componentDidMount?(): void;
                    shouldComponentUpdate?(nextProps: Readonly<Omit<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
                    componentWillUnmount?(): void;
                    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                    getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
                    componentDidUpdate?(prevProps: Readonly<Omit<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
                    componentWillMount?(): void;
                    UNSAFE_componentWillMount?(): void;
                    componentWillReceiveProps?(nextProps: Readonly<Omit<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
                    UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
                    componentWillUpdate?(nextProps: Readonly<Omit<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
                    UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
                };
                new (props: Omit<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
                    render(): JSX.Element;
                    context: any;
                    setState<K_2 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K_2> | null) | Pick<{}, K_2> | null, callback?: (() => void) | undefined): void;
                    forceUpdate(callback?: (() => void) | undefined): void;
                    readonly props: Readonly<Omit<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
                        children?: React.ReactNode;
                    }>;
                    state: Readonly<{}>;
                    refs: {
                        [key: string]: React.ReactInstance;
                    };
                    componentDidMount?(): void;
                    shouldComponentUpdate?(nextProps: Readonly<Omit<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
                    componentWillUnmount?(): void;
                    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                    getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
                    componentDidUpdate?(prevProps: Readonly<Omit<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
                    componentWillMount?(): void;
                    UNSAFE_componentWillMount?(): void;
                    componentWillReceiveProps?(nextProps: Readonly<Omit<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
                    UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
                    componentWillUpdate?(nextProps: Readonly<Omit<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
                    UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
                };
                displayName: string;
                contextType: React.Context<string>;
                ComposedComponent: React.ComponentType<{
                    new (props: (Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }) | Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>): {
                        render(): JSX.Element;
                        context: any;
                        setState<K_3 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>) => {} | Pick<{}, K_3> | null) | Pick<{}, K_3> | null, callback?: (() => void) | undefined): void;
                        forceUpdate(callback?: (() => void) | undefined): void;
                        readonly props: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }> & Readonly<{
                            children?: React.ReactNode;
                        }>;
                        state: Readonly<{}>;
                        refs: {
                            [key: string]: React.ReactInstance;
                        };
                        componentDidMount?(): void;
                        shouldComponentUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, nextState: Readonly<{}>, nextContext: any): boolean;
                        componentWillUnmount?(): void;
                        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, prevState: Readonly<{}>): any;
                        componentDidUpdate?(prevProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, prevState: Readonly<{}>, snapshot?: any): void;
                        componentWillMount?(): void;
                        UNSAFE_componentWillMount?(): void;
                        componentWillReceiveProps?(nextProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, nextContext: any): void;
                        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, nextContext: any): void;
                        componentWillUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, nextState: Readonly<{}>, nextContext: any): void;
                        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, nextState: Readonly<{}>, nextContext: any): void;
                    };
                    new (props: Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }, context: any): {
                        render(): JSX.Element;
                        context: any;
                        setState<K_3 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>) => {} | Pick<{}, K_3> | null) | Pick<{}, K_3> | null, callback?: (() => void) | undefined): void;
                        forceUpdate(callback?: (() => void) | undefined): void;
                        readonly props: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }> & Readonly<{
                            children?: React.ReactNode;
                        }>;
                        state: Readonly<{}>;
                        refs: {
                            [key: string]: React.ReactInstance;
                        };
                        componentDidMount?(): void;
                        shouldComponentUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, nextState: Readonly<{}>, nextContext: any): boolean;
                        componentWillUnmount?(): void;
                        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, prevState: Readonly<{}>): any;
                        componentDidUpdate?(prevProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, prevState: Readonly<{}>, snapshot?: any): void;
                        componentWillMount?(): void;
                        UNSAFE_componentWillMount?(): void;
                        componentWillReceiveProps?(nextProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, nextContext: any): void;
                        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, nextContext: any): void;
                        componentWillUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, nextState: Readonly<{}>, nextContext: any): void;
                        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, nextState: Readonly<{}>, nextContext: any): void;
                    };
                    displayName: string;
                    contextType: React.Context<string>;
                    ComposedComponent: React.ComponentType<({ classnames: cx, className, showCloseButton, onClose, children, classPrefix, translate: __, ...rest }: import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element>;
                } & import("hoist-non-react-statics").NonReactStatics<({ classnames: cx, className, showCloseButton, onClose, children, classPrefix, translate: __, ...rest }: import("../theme").ThemeProps & import("../locale").LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element, {}> & {
                    ComposedComponent: ({ classnames: cx, className, showCloseButton, onClose, children, classPrefix, translate: __, ...rest }: import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element;
                }>;
            } & import("hoist-non-react-statics").NonReactStatics<{
                new (props: (Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }) | Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>): {
                    render(): JSX.Element;
                    context: any;
                    setState<K_3 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>) => {} | Pick<{}, K_3> | null) | Pick<{}, K_3> | null, callback?: (() => void) | undefined): void;
                    forceUpdate(callback?: (() => void) | undefined): void;
                    readonly props: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }> & Readonly<{
                        children?: React.ReactNode;
                    }>;
                    state: Readonly<{}>;
                    refs: {
                        [key: string]: React.ReactInstance;
                    };
                    componentDidMount?(): void;
                    shouldComponentUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextState: Readonly<{}>, nextContext: any): boolean;
                    componentWillUnmount?(): void;
                    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                    getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, prevState: Readonly<{}>): any;
                    componentDidUpdate?(prevProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, prevState: Readonly<{}>, snapshot?: any): void;
                    componentWillMount?(): void;
                    UNSAFE_componentWillMount?(): void;
                    componentWillReceiveProps?(nextProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextContext: any): void;
                    UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextContext: any): void;
                    componentWillUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextState: Readonly<{}>, nextContext: any): void;
                    UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextState: Readonly<{}>, nextContext: any): void;
                };
                new (props: Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, context: any): {
                    render(): JSX.Element;
                    context: any;
                    setState<K_3 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>) => {} | Pick<{}, K_3> | null) | Pick<{}, K_3> | null, callback?: (() => void) | undefined): void;
                    forceUpdate(callback?: (() => void) | undefined): void;
                    readonly props: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }> & Readonly<{
                        children?: React.ReactNode;
                    }>;
                    state: Readonly<{}>;
                    refs: {
                        [key: string]: React.ReactInstance;
                    };
                    componentDidMount?(): void;
                    shouldComponentUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextState: Readonly<{}>, nextContext: any): boolean;
                    componentWillUnmount?(): void;
                    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                    getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, prevState: Readonly<{}>): any;
                    componentDidUpdate?(prevProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, prevState: Readonly<{}>, snapshot?: any): void;
                    componentWillMount?(): void;
                    UNSAFE_componentWillMount?(): void;
                    componentWillReceiveProps?(nextProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextContext: any): void;
                    UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextContext: any): void;
                    componentWillUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextState: Readonly<{}>, nextContext: any): void;
                    UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>, nextState: Readonly<{}>, nextContext: any): void;
                };
                displayName: string;
                contextType: React.Context<string>;
                ComposedComponent: React.ComponentType<({ classnames: cx, className, showCloseButton, onClose, children, classPrefix, translate: __, ...rest }: import("../theme").ThemeProps & import("../locale").LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element>;
            } & import("hoist-non-react-statics").NonReactStatics<({ classnames: cx, className, showCloseButton, onClose, children, classPrefix, translate: __, ...rest }: import("../theme").ThemeProps & import("../locale").LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element, {}> & {
                ComposedComponent: ({ classnames: cx, className, showCloseButton, onClose, children, classPrefix, translate: __, ...rest }: import("../theme").ThemeProps & import("../locale").LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element;
            }, {}> & {
                ComposedComponent: {
                    new (props: (Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }) | Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }>): {
                        render(): JSX.Element;
                        context: any;
                        setState<K_3 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>) => {} | Pick<{}, K_3> | null) | Pick<{}, K_3> | null, callback?: (() => void) | undefined): void;
                        forceUpdate(callback?: (() => void) | undefined): void;
                        readonly props: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }> & Readonly<{
                            children?: React.ReactNode;
                        }>;
                        state: Readonly<{}>;
                        refs: {
                            [key: string]: React.ReactInstance;
                        };
                        componentDidMount?(): void;
                        shouldComponentUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, nextState: Readonly<{}>, nextContext: any): boolean;
                        componentWillUnmount?(): void;
                        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, prevState: Readonly<{}>): any;
                        componentDidUpdate?(prevProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, prevState: Readonly<{}>, snapshot?: any): void;
                        componentWillMount?(): void;
                        UNSAFE_componentWillMount?(): void;
                        componentWillReceiveProps?(nextProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, nextContext: any): void;
                        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, nextContext: any): void;
                        componentWillUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, nextState: Readonly<{}>, nextContext: any): void;
                        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, nextState: Readonly<{}>, nextContext: any): void;
                    };
                    new (props: Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                        locale?: string | undefined;
                        translate?: ((str: string, ...args: any[]) => string) | undefined;
                    }, context: any): {
                        render(): JSX.Element;
                        context: any;
                        setState<K_3 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>) => {} | Pick<{}, K_3> | null) | Pick<{}, K_3> | null, callback?: (() => void) | undefined): void;
                        forceUpdate(callback?: (() => void) | undefined): void;
                        readonly props: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }> & Readonly<{
                            children?: React.ReactNode;
                        }>;
                        state: Readonly<{}>;
                        refs: {
                            [key: string]: React.ReactInstance;
                        };
                        componentDidMount?(): void;
                        shouldComponentUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, nextState: Readonly<{}>, nextContext: any): boolean;
                        componentWillUnmount?(): void;
                        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, prevState: Readonly<{}>): any;
                        componentDidUpdate?(prevProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, prevState: Readonly<{}>, snapshot?: any): void;
                        componentWillMount?(): void;
                        UNSAFE_componentWillMount?(): void;
                        componentWillReceiveProps?(nextProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, nextContext: any): void;
                        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, nextContext: any): void;
                        componentWillUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, nextState: Readonly<{}>, nextContext: any): void;
                        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & import("../locale").LocaleProps & {
                            className?: string | undefined;
                            showCloseButton?: boolean | undefined;
                            onClose?: (() => void) | undefined;
                            children?: React.ReactNode;
                        } & React.HTMLAttributes<HTMLDivElement>, keyof import("../locale").LocaleProps> & {
                            locale?: string | undefined;
                            translate?: ((str: string, ...args: any[]) => string) | undefined;
                        }>, nextState: Readonly<{}>, nextContext: any): void;
                    };
                    displayName: string;
                    contextType: React.Context<string>;
                    ComposedComponent: React.ComponentType<({ classnames: cx, className, showCloseButton, onClose, children, classPrefix, translate: __, ...rest }: import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element>;
                } & import("hoist-non-react-statics").NonReactStatics<({ classnames: cx, className, showCloseButton, onClose, children, classPrefix, translate: __, ...rest }: import("../theme").ThemeProps & import("../locale").LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element, {}> & {
                    ComposedComponent: ({ classnames: cx, className, showCloseButton, onClose, children, classPrefix, translate: __, ...rest }: import("../theme").ThemeProps & import("../locale").LocaleProps & {
                        className?: string | undefined;
                        showCloseButton?: boolean | undefined;
                        onClose?: (() => void) | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element;
                };
            };
            Title: {
                new (props: (Omit<import("../theme").ThemeProps & {
                    className?: string | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<import("../theme").ThemeProps & {
                    className?: string | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>): {
                    render(): JSX.Element;
                    context: any;
                    setState<K_4 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K_4> | null) | Pick<{}, K_4> | null, callback?: (() => void) | undefined): void;
                    forceUpdate(callback?: (() => void) | undefined): void;
                    readonly props: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
                        children?: React.ReactNode;
                    }>;
                    state: Readonly<{}>;
                    refs: {
                        [key: string]: React.ReactInstance;
                    };
                    componentDidMount?(): void;
                    shouldComponentUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
                    componentWillUnmount?(): void;
                    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                    getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
                    componentDidUpdate?(prevProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
                    componentWillMount?(): void;
                    UNSAFE_componentWillMount?(): void;
                    componentWillReceiveProps?(nextProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
                    UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
                    componentWillUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
                    UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
                };
                new (props: Omit<import("../theme").ThemeProps & {
                    className?: string | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
                    render(): JSX.Element;
                    context: any;
                    setState<K_4 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K_4> | null) | Pick<{}, K_4> | null, callback?: (() => void) | undefined): void;
                    forceUpdate(callback?: (() => void) | undefined): void;
                    readonly props: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
                        children?: React.ReactNode;
                    }>;
                    state: Readonly<{}>;
                    refs: {
                        [key: string]: React.ReactInstance;
                    };
                    componentDidMount?(): void;
                    shouldComponentUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
                    componentWillUnmount?(): void;
                    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                    getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
                    componentDidUpdate?(prevProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
                    componentWillMount?(): void;
                    UNSAFE_componentWillMount?(): void;
                    componentWillReceiveProps?(nextProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
                    UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
                    componentWillUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
                    UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
                };
                displayName: string;
                contextType: React.Context<string>;
                ComposedComponent: React.ComponentType<({ classnames: cx, className, children, classPrefix, ...rest }: import("../theme").ThemeProps & {
                    className?: string | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element>;
            } & import("hoist-non-react-statics").NonReactStatics<({ classnames: cx, className, children, classPrefix, ...rest }: import("../theme").ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element, {}> & {
                ComposedComponent: ({ classnames: cx, className, children, classPrefix, ...rest }: import("../theme").ThemeProps & {
                    className?: string | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element;
            };
            Body: {
                new (props: (Omit<import("../theme").ThemeProps & {
                    className?: string | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<import("../theme").ThemeProps & {
                    className?: string | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>): {
                    render(): JSX.Element;
                    context: any;
                    setState<K_5 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K_5> | null) | Pick<{}, K_5> | null, callback?: (() => void) | undefined): void;
                    forceUpdate(callback?: (() => void) | undefined): void;
                    readonly props: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
                        children?: React.ReactNode;
                    }>;
                    state: Readonly<{}>;
                    refs: {
                        [key: string]: React.ReactInstance;
                    };
                    componentDidMount?(): void;
                    shouldComponentUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
                    componentWillUnmount?(): void;
                    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                    getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
                    componentDidUpdate?(prevProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
                    componentWillMount?(): void;
                    UNSAFE_componentWillMount?(): void;
                    componentWillReceiveProps?(nextProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
                    UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
                    componentWillUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
                    UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
                };
                new (props: Omit<import("../theme").ThemeProps & {
                    className?: string | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
                    render(): JSX.Element;
                    context: any;
                    setState<K_5 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K_5> | null) | Pick<{}, K_5> | null, callback?: (() => void) | undefined): void;
                    forceUpdate(callback?: (() => void) | undefined): void;
                    readonly props: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
                        children?: React.ReactNode;
                    }>;
                    state: Readonly<{}>;
                    refs: {
                        [key: string]: React.ReactInstance;
                    };
                    componentDidMount?(): void;
                    shouldComponentUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
                    componentWillUnmount?(): void;
                    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                    getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
                    componentDidUpdate?(prevProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
                    componentWillMount?(): void;
                    UNSAFE_componentWillMount?(): void;
                    componentWillReceiveProps?(nextProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
                    UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
                    componentWillUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
                    UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
                };
                displayName: string;
                contextType: React.Context<string>;
                ComposedComponent: React.ComponentType<({ classnames: cx, className, children, classPrefix, ...rest }: import("../theme").ThemeProps & {
                    className?: string | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element>;
            } & import("hoist-non-react-statics").NonReactStatics<({ classnames: cx, className, children, classPrefix, ...rest }: import("../theme").ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element, {}> & {
                ComposedComponent: ({ classnames: cx, className, children, classPrefix, ...rest }: import("../theme").ThemeProps & {
                    className?: string | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element;
            };
            Footer: {
                new (props: (Omit<import("../theme").ThemeProps & {
                    className?: string | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<import("../theme").ThemeProps & {
                    className?: string | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>): {
                    render(): JSX.Element;
                    context: any;
                    setState<K_6 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K_6> | null) | Pick<{}, K_6> | null, callback?: (() => void) | undefined): void;
                    forceUpdate(callback?: (() => void) | undefined): void;
                    readonly props: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
                        children?: React.ReactNode;
                    }>;
                    state: Readonly<{}>;
                    refs: {
                        [key: string]: React.ReactInstance;
                    };
                    componentDidMount?(): void;
                    shouldComponentUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
                    componentWillUnmount?(): void;
                    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                    getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
                    componentDidUpdate?(prevProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
                    componentWillMount?(): void;
                    UNSAFE_componentWillMount?(): void;
                    componentWillReceiveProps?(nextProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
                    UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
                    componentWillUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
                    UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
                };
                new (props: Omit<import("../theme").ThemeProps & {
                    className?: string | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
                    render(): JSX.Element;
                    context: any;
                    setState<K_6 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K_6> | null) | Pick<{}, K_6> | null, callback?: (() => void) | undefined): void;
                    forceUpdate(callback?: (() => void) | undefined): void;
                    readonly props: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
                        children?: React.ReactNode;
                    }>;
                    state: Readonly<{}>;
                    refs: {
                        [key: string]: React.ReactInstance;
                    };
                    componentDidMount?(): void;
                    shouldComponentUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
                    componentWillUnmount?(): void;
                    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                    getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
                    componentDidUpdate?(prevProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
                    componentWillMount?(): void;
                    UNSAFE_componentWillMount?(): void;
                    componentWillReceiveProps?(nextProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
                    UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
                    componentWillUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
                    UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<import("../theme").ThemeProps & {
                        className?: string | undefined;
                        children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLDivElement>, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
                };
                displayName: string;
                contextType: React.Context<string>;
                ComposedComponent: React.ComponentType<({ classnames: cx, className, children, classPrefix, ...rest }: import("../theme").ThemeProps & {
                    className?: string | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element>;
            } & import("hoist-non-react-statics").NonReactStatics<({ classnames: cx, className, children, classPrefix, ...rest }: import("../theme").ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element, {}> & {
                ComposedComponent: ({ classnames: cx, className, children, classPrefix, ...rest }: import("../theme").ThemeProps & {
                    className?: string | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element;
            };
        };
        closeOnEsc: boolean;
        closeOnOutside: boolean;
        showErrorMsg: boolean;
    };
    reaction: any;
    isDead: boolean;
    $$id: string;
    constructor(props: DialogProps);
    componentWillUnmount(): void;
    buildActions(): Array<ActionSchema>;
    handleSelfClose(): void;
    handleAction(e: React.UIEvent<any>, action: Action, data: object): void;
    handleDialogConfirm(values: object[], action: Action, ...args: Array<any>): void;
    handleDialogClose(...args: Array<any>): void;
    handleDrawerConfirm(values: object[], action: Action, ...args: Array<any>): void;
    handleDrawerClose(...args: Array<any>): void;
    handleEntered(): void;
    handleExited(): void;
    handleFormInit(data: any): void;
    handleFormChange(data: any, name?: string): void;
    handleFormSaved(data: any, response: any): void;
    handleChildFinished(value: any, action: Action): void;
    openFeedback(dialog: any, ctx: any): Promise<unknown>;
    getPopOverContainer(): Element | null;
    renderBody(body: SchemaNode, key?: any): React.ReactNode;
    renderFooter(): JSX.Element | null;
    render(): JSX.Element;
}
export declare class DialogRenderer extends Dialog {
    static contextType: React.Context<IScopedContext>;
    constructor(props: DialogProps, context: IScopedContext);
    componentWillUnmount(): void;
    tryChildrenToHandle(action: Action, ctx: object, rawAction?: Action): boolean;
    handleAction(e: React.UIEvent<any>, action: Action, data: object, throwErrors?: boolean, delegate?: IScopedContext): any;
    handleChildFinished(value: any, action: Action): void;
    handleDialogConfirm(values: object[], action: Action, ...rest: Array<any>): void;
    handleDrawerConfirm(values: object[], action: Action, ...rest: Array<any>): void;
    reloadTarget(target: string, data?: any): void;
    closeTarget(target: string): void;
}
