/**
 * @file Alert
 * @author fex
 */
/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { ThemeProps } from '../theme';
import { LocaleProps } from '../locale';
import { PlainObject } from '../types';
export interface AlertProps extends ThemeProps, LocaleProps {
    container?: any;
    confirmText?: string;
    cancelText?: string;
    title?: string;
    confirmBtnLevel?: string;
    alertBtnLevel?: string;
}
export interface AlertState {
    show: boolean;
    title?: string;
    content: string;
    confirm: boolean;
    prompt?: boolean;
    controls?: any;
    value?: any;
    confirmText?: string;
}
export declare class Alert extends React.Component<AlertProps, AlertState> {
    static instance: any;
    static getInstance(): any;
    _resolve: (value: any) => void;
    _modal: any;
    _body: any;
    state: AlertState;
    constructor(props: AlertProps);
    static defaultProps: {
        confirmText: string;
        cancelText: string;
        title: string;
        alertBtnLevel: string;
        confirmBtnLevel: string;
    };
    componentDidMount(): void;
    componentDidUpdate(prevProps: AlertProps, prevState: AlertState): void;
    componentWillUnmount(): void;
    schemaSope: any;
    scopeRef(schemaSope: any): void;
    handleConfirm(): void;
    handleCancel(): void;
    close(confirmed: boolean): void;
    alert(content: string, title?: string): void;
    confirm(content: string, title?: string, confirmText?: string): Promise<unknown>;
    prompt(controls: any, defaultValue?: any, title?: string, confirmText?: string): Promise<unknown>;
    modalRef(ref: any): void;
    handleFormSubmit(values: any): void;
    render(): JSX.Element;
}
export declare type renderSchemaFn = (controls: Array<any>, value: PlainObject, callback?: (values: PlainObject) => void, scopeRef?: (value: any) => void, theme?: string) => JSX.Element;
export declare function setRenderSchemaFn(fn: renderSchemaFn): void;
export declare const alert: (content: string, title?: string) => void;
export declare const confirm: (content: string, title?: string, confirmText?: string) => Promise<any>;
export declare const prompt: (controls: any, defaultvalue?: any, title?: string, confirmText?: string) => Promise<any>;
export declare const FinnalAlert: {
    new (props: (Omit<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
        confirmText: string;
        cancelText: string;
        title: string;
        alertBtnLevel: string;
        confirmBtnLevel: string;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
        confirmText: string;
        cancelText: string;
        title: string;
        alertBtnLevel: string;
        confirmBtnLevel: string;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Omit<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
        confirmText: string;
        cancelText: string;
        title: string;
        alertBtnLevel: string;
        confirmBtnLevel: string;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<{
        new (props: (Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof Alert>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof Alert, {}> & {
        ComposedComponent: typeof Alert;
    }>;
} & import("hoist-non-react-statics").NonReactStatics<{
    new (props: (Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
        confirmText: string;
        cancelText: string;
        title: string;
        alertBtnLevel: string;
        confirmBtnLevel: string;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }) | Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
        confirmText: string;
        cancelText: string;
        title: string;
        alertBtnLevel: string;
        confirmBtnLevel: string;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }>): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
        confirmText: string;
        cancelText: string;
        title: string;
        alertBtnLevel: string;
        confirmBtnLevel: string;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof Alert>;
} & import("hoist-non-react-statics").NonReactStatics<typeof Alert, {}> & {
    ComposedComponent: typeof Alert;
}, {}> & {
    ComposedComponent: {
        new (props: (Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
            confirmText: string;
            cancelText: string;
            title: string;
            alertBtnLevel: string;
            confirmBtnLevel: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<AlertProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "container"> & Partial<Pick<Omit<AlertProps, keyof LocaleProps>, "title" | "confirmText" | "cancelText" | "confirmBtnLevel" | "alertBtnLevel">> & Partial<Pick<{
                confirmText: string;
                cancelText: string;
                title: string;
                alertBtnLevel: string;
                confirmBtnLevel: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof Alert>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof Alert, {}> & {
        ComposedComponent: typeof Alert;
    };
};
export default FinnalAlert;
