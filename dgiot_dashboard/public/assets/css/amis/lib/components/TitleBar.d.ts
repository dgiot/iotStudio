/**
 * @file TitleBar。
 * @description
 * @author fex
 * @param 参数说明：
 * title 标题内容
 * titleClassName 标题类名，默认为 bg-light lter b-b
 * right 可以传入右侧节点, 当有右侧时自动采用 hbox 来左右布局。
 */
/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { ClassNamesFn } from '../theme';
interface TitleBarProps {
    className?: string;
    title: React.ReactNode;
    titleClassName?: string;
    right?: boolean;
    classPrefix: string;
    classnames: ClassNamesFn;
}
export declare class TitleBar extends React.PureComponent<TitleBarProps, any> {
    static defaultProps: {
        className: string;
        title: string;
        titleClassName: string;
        right: boolean;
    };
    render(): JSX.Element;
}
declare const _default: {
    new (props: (Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, "title" | "right" | "titleClassName">> & Partial<Pick<{
        className: string;
        title: string;
        titleClassName: string;
        right: boolean;
    }, "className">> & import("../theme").ThemeOutterProps) | Readonly<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, "title" | "right" | "titleClassName">> & Partial<Pick<{
        className: string;
        title: string;
        titleClassName: string;
        right: boolean;
    }, "className">> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, "title" | "right" | "titleClassName">> & Partial<Pick<{
            className: string;
            title: string;
            titleClassName: string;
            right: boolean;
        }, "className">> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, "title" | "right" | "titleClassName">> & Partial<Pick<{
            className: string;
            title: string;
            titleClassName: string;
            right: boolean;
        }, "className">> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, "title" | "right" | "titleClassName">> & Partial<Pick<{
            className: string;
            title: string;
            titleClassName: string;
            right: boolean;
        }, "className">> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, "title" | "right" | "titleClassName">> & Partial<Pick<{
            className: string;
            title: string;
            titleClassName: string;
            right: boolean;
        }, "className">> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, "title" | "right" | "titleClassName">> & Partial<Pick<{
            className: string;
            title: string;
            titleClassName: string;
            right: boolean;
        }, "className">> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, "title" | "right" | "titleClassName">> & Partial<Pick<{
            className: string;
            title: string;
            titleClassName: string;
            right: boolean;
        }, "className">> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, "title" | "right" | "titleClassName">> & Partial<Pick<{
            className: string;
            title: string;
            titleClassName: string;
            right: boolean;
        }, "className">> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, "title" | "right" | "titleClassName">> & Partial<Pick<{
            className: string;
            title: string;
            titleClassName: string;
            right: boolean;
        }, "className">> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, "title" | "right" | "titleClassName">> & Partial<Pick<{
            className: string;
            title: string;
            titleClassName: string;
            right: boolean;
        }, "className">> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, "title" | "right" | "titleClassName">> & Partial<Pick<{
        className: string;
        title: string;
        titleClassName: string;
        right: boolean;
    }, "className">> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, "title" | "right" | "titleClassName">> & Partial<Pick<{
            className: string;
            title: string;
            titleClassName: string;
            right: boolean;
        }, "className">> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, "title" | "right" | "titleClassName">> & Partial<Pick<{
            className: string;
            title: string;
            titleClassName: string;
            right: boolean;
        }, "className">> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, "title" | "right" | "titleClassName">> & Partial<Pick<{
            className: string;
            title: string;
            titleClassName: string;
            right: boolean;
        }, "className">> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, "title" | "right" | "titleClassName">> & Partial<Pick<{
            className: string;
            title: string;
            titleClassName: string;
            right: boolean;
        }, "className">> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, "title" | "right" | "titleClassName">> & Partial<Pick<{
            className: string;
            title: string;
            titleClassName: string;
            right: boolean;
        }, "className">> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, "title" | "right" | "titleClassName">> & Partial<Pick<{
            className: string;
            title: string;
            titleClassName: string;
            right: boolean;
        }, "className">> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, "title" | "right" | "titleClassName">> & Partial<Pick<{
            className: string;
            title: string;
            titleClassName: string;
            right: boolean;
        }, "className">> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, "title" | "right" | "titleClassName">> & Partial<Pick<{
            className: string;
            title: string;
            titleClassName: string;
            right: boolean;
        }, "className">> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<TitleBarProps, keyof import("../theme").ThemeProps>, "title" | "right" | "titleClassName">> & Partial<Pick<{
            className: string;
            title: string;
            titleClassName: string;
            right: boolean;
        }, "className">> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof TitleBar>;
} & import("hoist-non-react-statics").NonReactStatics<typeof TitleBar, {}> & {
    ComposedComponent: typeof TitleBar;
};
export default _default;
