/**
 * @file Toast
 * @description toast提示组件, 单例模式，App级别只需要一个ToastComponent，引入了多个会兼容，也只有第一个生效
 * @author fex
 */
/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { ClassNamesFn, ThemeProps } from '../theme';
import { LocaleProps, TranslateFn } from '../locale';
interface Config {
    closeButton?: boolean;
    timeout?: number;
}
interface ToastComponentProps extends ThemeProps, LocaleProps {
    position: 'top-right' | 'top-center' | 'top-left' | 'bottom-center' | 'bottom-left' | 'bottom-right';
    closeButton: boolean;
    showIcon?: boolean;
    timeout: number;
    className?: string;
}
interface Item extends Config {
    body: string;
    level: 'info' | 'success' | 'error' | 'warning';
    id: string;
    onDissmiss?: () => void;
    position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-center' | 'bottom-left' | 'bottom-right';
}
interface ToastComponentState {
    items: Array<Item>;
}
export declare class ToastComponent extends React.Component<ToastComponentProps, ToastComponentState> {
    static defaultProps: Pick<ToastComponentProps, 'position' | 'closeButton' | 'timeout'>;
    static themeKey: string;
    hasRendered: boolean;
    state: ToastComponentState;
    componentDidMount(): void;
    componentWillUnmount(): void;
    notifiy(level: string, content: string, config?: any): void;
    success(content: string, config?: any): void;
    error(content: string, config?: any): void;
    info(content: string, config?: any): void;
    warning(content: string, config?: any): void;
    handleDismissed(index: number): void;
    render(): JSX.Element[] | null;
}
declare const _default: {
    new (props: (Omit<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
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
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Omit<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
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
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<{
        new (props: (Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof ToastComponent>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof ToastComponent, {}> & {
        ComposedComponent: typeof ToastComponent;
    }>;
} & import("hoist-non-react-statics").NonReactStatics<{
    new (props: (Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }) | Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }>): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof ToastComponent>;
} & import("hoist-non-react-statics").NonReactStatics<typeof ToastComponent, {}> & {
    ComposedComponent: typeof ToastComponent;
}, {}> & {
    ComposedComponent: {
        new (props: (Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "showIcon"> & Partial<Pick<Omit<ToastComponentProps, keyof LocaleProps>, "position" | "timeout" | "closeButton">> & Partial<Pick<Pick<ToastComponentProps, "position" | "timeout" | "closeButton">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof ToastComponent>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof ToastComponent, {}> & {
        ComposedComponent: typeof ToastComponent;
    };
};
export default _default;
interface ToastMessageProps {
    body: string;
    level: 'info' | 'success' | 'error' | 'warning';
    timeout: number;
    closeButton?: boolean;
    showIcon?: boolean;
    position: 'top-right' | 'top-center' | 'top-left' | 'bottom-center' | 'bottom-left' | 'bottom-right';
    onDismiss?: () => void;
    classnames: ClassNamesFn;
    translate: TranslateFn;
    allowHtml: boolean;
}
interface ToastMessageState {
    visible: boolean;
}
export declare class ToastMessage extends React.Component<ToastMessageProps, ToastMessageState> {
    static defaultProps: {
        timeout: number;
        classPrefix: string;
        position: string;
        allowHtml: boolean;
        level: string;
    };
    state: {
        visible: boolean;
    };
    timer: ReturnType<typeof setTimeout>;
    mounted: boolean;
    componentDidMount(): void;
    componentWillUnmount(): void;
    handleMouseEnter(): void;
    handleMouseLeave(): void;
    handleEntered(): void;
    close(): void;
    render(): JSX.Element;
}
export declare const toast: {
    container: any;
    success: (content: string, conf?: any) => void;
    error: (content: string, conf?: any) => void;
    info: (content: string, conf?: any) => void;
    warning: (content: string, conf?: any) => void;
};
