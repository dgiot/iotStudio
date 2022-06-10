/**
 * @file Layout
 * @description 页面布局，支持左边栏、顶部、内容区域布局。
 * @author fex
 *
 * @param 参数说明：
 * * children 会渲染在内容区。
 * * header 头部区域
 * * aside 边栏
 * * asideClassName 边栏附加样式class
 * * footer 页脚
 * * folder 是否收起边栏
 * * asideFixed 边栏是否为固定模式，如果是会用 position:fixed 来定位.
 * * className 附件的样式名
 * * contentClassName 内容区域附加样式名称
 */
/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { ClassNamesFn } from '../theme';
interface LayoutProps {
    header?: boolean | React.ReactNode;
    headerClassName?: string;
    aside?: boolean | React.ReactNode;
    asideClassName: string;
    boxed?: boolean;
    folded?: boolean;
    asideFixed: boolean;
    headerFixed: boolean;
    className?: string;
    contentClassName?: string;
    footer: boolean | React.ReactNode;
    offScreen: boolean;
    classPrefix: string;
    classnames: ClassNamesFn;
    size?: 'sm' | 'base' | 'md' | 'lg';
    children?: React.ReactNode;
    bodyClassName?: string;
}
export declare function Layout({ header, headerClassName, aside, asideClassName, children, className, contentClassName, folded, asideFixed, headerFixed, footer, offScreen, size, boxed, classnames: cx, bodyClassName }: LayoutProps): JSX.Element;
export declare namespace Layout {
    var defaultProps: {
        asideFixed: boolean;
        asideClassName: string;
        headerFixed: boolean;
        offScreen: boolean;
        footer: boolean;
    };
}
declare const _default: {
    new (props: (Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "aside" | "header" | "children" | "size" | "contentClassName" | "bodyClassName" | "headerClassName" | "folded" | "boxed"> & Partial<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "footer" | "asideClassName" | "asideFixed" | "headerFixed" | "offScreen">> & Partial<Pick<{
        asideFixed: boolean;
        asideClassName: string;
        headerFixed: boolean;
        offScreen: boolean;
        footer: boolean;
    }, never>> & import("../theme").ThemeOutterProps) | Readonly<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "aside" | "header" | "children" | "size" | "contentClassName" | "bodyClassName" | "headerClassName" | "folded" | "boxed"> & Partial<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "footer" | "asideClassName" | "asideFixed" | "headerFixed" | "offScreen">> & Partial<Pick<{
        asideFixed: boolean;
        asideClassName: string;
        headerFixed: boolean;
        offScreen: boolean;
        footer: boolean;
    }, never>> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "aside" | "header" | "children" | "size" | "contentClassName" | "bodyClassName" | "headerClassName" | "folded" | "boxed"> & Partial<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "footer" | "asideClassName" | "asideFixed" | "headerFixed" | "offScreen">> & Partial<Pick<{
            asideFixed: boolean;
            asideClassName: string;
            headerFixed: boolean;
            offScreen: boolean;
            footer: boolean;
        }, never>> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "aside" | "header" | "children" | "size" | "contentClassName" | "bodyClassName" | "headerClassName" | "folded" | "boxed"> & Partial<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "footer" | "asideClassName" | "asideFixed" | "headerFixed" | "offScreen">> & Partial<Pick<{
            asideFixed: boolean;
            asideClassName: string;
            headerFixed: boolean;
            offScreen: boolean;
            footer: boolean;
        }, never>> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "aside" | "header" | "children" | "size" | "contentClassName" | "bodyClassName" | "headerClassName" | "folded" | "boxed"> & Partial<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "footer" | "asideClassName" | "asideFixed" | "headerFixed" | "offScreen">> & Partial<Pick<{
            asideFixed: boolean;
            asideClassName: string;
            headerFixed: boolean;
            offScreen: boolean;
            footer: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "aside" | "header" | "children" | "size" | "contentClassName" | "bodyClassName" | "headerClassName" | "folded" | "boxed"> & Partial<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "footer" | "asideClassName" | "asideFixed" | "headerFixed" | "offScreen">> & Partial<Pick<{
            asideFixed: boolean;
            asideClassName: string;
            headerFixed: boolean;
            offScreen: boolean;
            footer: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "aside" | "header" | "children" | "size" | "contentClassName" | "bodyClassName" | "headerClassName" | "folded" | "boxed"> & Partial<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "footer" | "asideClassName" | "asideFixed" | "headerFixed" | "offScreen">> & Partial<Pick<{
            asideFixed: boolean;
            asideClassName: string;
            headerFixed: boolean;
            offScreen: boolean;
            footer: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "aside" | "header" | "children" | "size" | "contentClassName" | "bodyClassName" | "headerClassName" | "folded" | "boxed"> & Partial<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "footer" | "asideClassName" | "asideFixed" | "headerFixed" | "offScreen">> & Partial<Pick<{
            asideFixed: boolean;
            asideClassName: string;
            headerFixed: boolean;
            offScreen: boolean;
            footer: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "aside" | "header" | "children" | "size" | "contentClassName" | "bodyClassName" | "headerClassName" | "folded" | "boxed"> & Partial<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "footer" | "asideClassName" | "asideFixed" | "headerFixed" | "offScreen">> & Partial<Pick<{
            asideFixed: boolean;
            asideClassName: string;
            headerFixed: boolean;
            offScreen: boolean;
            footer: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "aside" | "header" | "children" | "size" | "contentClassName" | "bodyClassName" | "headerClassName" | "folded" | "boxed"> & Partial<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "footer" | "asideClassName" | "asideFixed" | "headerFixed" | "offScreen">> & Partial<Pick<{
            asideFixed: boolean;
            asideClassName: string;
            headerFixed: boolean;
            offScreen: boolean;
            footer: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "aside" | "header" | "children" | "size" | "contentClassName" | "bodyClassName" | "headerClassName" | "folded" | "boxed"> & Partial<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "footer" | "asideClassName" | "asideFixed" | "headerFixed" | "offScreen">> & Partial<Pick<{
            asideFixed: boolean;
            asideClassName: string;
            headerFixed: boolean;
            offScreen: boolean;
            footer: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "aside" | "header" | "children" | "size" | "contentClassName" | "bodyClassName" | "headerClassName" | "folded" | "boxed"> & Partial<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "footer" | "asideClassName" | "asideFixed" | "headerFixed" | "offScreen">> & Partial<Pick<{
        asideFixed: boolean;
        asideClassName: string;
        headerFixed: boolean;
        offScreen: boolean;
        footer: boolean;
    }, never>> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "aside" | "header" | "children" | "size" | "contentClassName" | "bodyClassName" | "headerClassName" | "folded" | "boxed"> & Partial<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "footer" | "asideClassName" | "asideFixed" | "headerFixed" | "offScreen">> & Partial<Pick<{
            asideFixed: boolean;
            asideClassName: string;
            headerFixed: boolean;
            offScreen: boolean;
            footer: boolean;
        }, never>> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "aside" | "header" | "children" | "size" | "contentClassName" | "bodyClassName" | "headerClassName" | "folded" | "boxed"> & Partial<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "footer" | "asideClassName" | "asideFixed" | "headerFixed" | "offScreen">> & Partial<Pick<{
            asideFixed: boolean;
            asideClassName: string;
            headerFixed: boolean;
            offScreen: boolean;
            footer: boolean;
        }, never>> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "aside" | "header" | "children" | "size" | "contentClassName" | "bodyClassName" | "headerClassName" | "folded" | "boxed"> & Partial<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "footer" | "asideClassName" | "asideFixed" | "headerFixed" | "offScreen">> & Partial<Pick<{
            asideFixed: boolean;
            asideClassName: string;
            headerFixed: boolean;
            offScreen: boolean;
            footer: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "aside" | "header" | "children" | "size" | "contentClassName" | "bodyClassName" | "headerClassName" | "folded" | "boxed"> & Partial<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "footer" | "asideClassName" | "asideFixed" | "headerFixed" | "offScreen">> & Partial<Pick<{
            asideFixed: boolean;
            asideClassName: string;
            headerFixed: boolean;
            offScreen: boolean;
            footer: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "aside" | "header" | "children" | "size" | "contentClassName" | "bodyClassName" | "headerClassName" | "folded" | "boxed"> & Partial<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "footer" | "asideClassName" | "asideFixed" | "headerFixed" | "offScreen">> & Partial<Pick<{
            asideFixed: boolean;
            asideClassName: string;
            headerFixed: boolean;
            offScreen: boolean;
            footer: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "aside" | "header" | "children" | "size" | "contentClassName" | "bodyClassName" | "headerClassName" | "folded" | "boxed"> & Partial<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "footer" | "asideClassName" | "asideFixed" | "headerFixed" | "offScreen">> & Partial<Pick<{
            asideFixed: boolean;
            asideClassName: string;
            headerFixed: boolean;
            offScreen: boolean;
            footer: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "aside" | "header" | "children" | "size" | "contentClassName" | "bodyClassName" | "headerClassName" | "folded" | "boxed"> & Partial<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "footer" | "asideClassName" | "asideFixed" | "headerFixed" | "offScreen">> & Partial<Pick<{
            asideFixed: boolean;
            asideClassName: string;
            headerFixed: boolean;
            offScreen: boolean;
            footer: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "aside" | "header" | "children" | "size" | "contentClassName" | "bodyClassName" | "headerClassName" | "folded" | "boxed"> & Partial<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "footer" | "asideClassName" | "asideFixed" | "headerFixed" | "offScreen">> & Partial<Pick<{
            asideFixed: boolean;
            asideClassName: string;
            headerFixed: boolean;
            offScreen: boolean;
            footer: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "aside" | "header" | "children" | "size" | "contentClassName" | "bodyClassName" | "headerClassName" | "folded" | "boxed"> & Partial<Pick<Omit<LayoutProps, keyof import("../theme").ThemeProps>, "footer" | "asideClassName" | "asideFixed" | "headerFixed" | "offScreen">> & Partial<Pick<{
            asideFixed: boolean;
            asideClassName: string;
            headerFixed: boolean;
            offScreen: boolean;
            footer: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof Layout>;
} & import("hoist-non-react-statics").NonReactStatics<typeof Layout, {}> & {
    ComposedComponent: typeof Layout;
};
export default _default;
