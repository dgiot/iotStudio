/**
 * @file Drawer
 * @description
 * @author fex
 */
/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { ClassNamesFn } from '../theme';
declare type DrawerPosition = 'top' | 'right' | 'bottom' | 'left';
export interface DrawerProps {
    className?: string;
    bodyClassName?: string;
    size: any;
    overlay: boolean;
    onHide: (e: any) => void;
    closeOnEsc?: boolean;
    container: any;
    show?: boolean;
    position: DrawerPosition;
    disabled?: boolean;
    closeOnOutside?: boolean;
    classPrefix: string;
    classnames: ClassNamesFn;
    onExited?: () => void;
    onEntered?: () => void;
}
export interface DrawerState {
}
export declare class Drawer extends React.Component<DrawerProps, DrawerState> {
    static defaultProps: Pick<DrawerProps, 'container' | 'position' | 'size' | 'overlay'>;
    modalDom: HTMLElement;
    contentDom: HTMLElement;
    isRootClosed: boolean;
    componentDidMount(): void;
    componentDidUpdate(prevProps: DrawerProps): void;
    componentWillUnmount(): void;
    contentRef: (ref: any) => any;
    handleEnter: () => void;
    handleEntered: () => void;
    handleExited: () => void;
    modalRef: (ref: any) => void;
    handleRootClickCapture(e: MouseEvent): void;
    handleRootClick(e: MouseEvent): void;
    render(): JSX.Element;
}
declare const _default: {
    new (props: (Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "closeOnOutside" | "bodyClassName"> & Partial<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "position" | "overlay" | "size" | "container">> & Partial<Pick<Pick<DrawerProps, "position" | "overlay" | "size" | "container">, never>> & import("../theme").ThemeOutterProps) | Readonly<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "closeOnOutside" | "bodyClassName"> & Partial<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "position" | "overlay" | "size" | "container">> & Partial<Pick<Pick<DrawerProps, "position" | "overlay" | "size" | "container">, never>> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "closeOnOutside" | "bodyClassName"> & Partial<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "position" | "overlay" | "size" | "container">> & Partial<Pick<Pick<DrawerProps, "position" | "overlay" | "size" | "container">, never>> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "closeOnOutside" | "bodyClassName"> & Partial<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "position" | "overlay" | "size" | "container">> & Partial<Pick<Pick<DrawerProps, "position" | "overlay" | "size" | "container">, never>> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "closeOnOutside" | "bodyClassName"> & Partial<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "position" | "overlay" | "size" | "container">> & Partial<Pick<Pick<DrawerProps, "position" | "overlay" | "size" | "container">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "closeOnOutside" | "bodyClassName"> & Partial<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "position" | "overlay" | "size" | "container">> & Partial<Pick<Pick<DrawerProps, "position" | "overlay" | "size" | "container">, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "closeOnOutside" | "bodyClassName"> & Partial<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "position" | "overlay" | "size" | "container">> & Partial<Pick<Pick<DrawerProps, "position" | "overlay" | "size" | "container">, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "closeOnOutside" | "bodyClassName"> & Partial<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "position" | "overlay" | "size" | "container">> & Partial<Pick<Pick<DrawerProps, "position" | "overlay" | "size" | "container">, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "closeOnOutside" | "bodyClassName"> & Partial<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "position" | "overlay" | "size" | "container">> & Partial<Pick<Pick<DrawerProps, "position" | "overlay" | "size" | "container">, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "closeOnOutside" | "bodyClassName"> & Partial<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "position" | "overlay" | "size" | "container">> & Partial<Pick<Pick<DrawerProps, "position" | "overlay" | "size" | "container">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "closeOnOutside" | "bodyClassName"> & Partial<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "position" | "overlay" | "size" | "container">> & Partial<Pick<Pick<DrawerProps, "position" | "overlay" | "size" | "container">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "closeOnOutside" | "bodyClassName"> & Partial<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "position" | "overlay" | "size" | "container">> & Partial<Pick<Pick<DrawerProps, "position" | "overlay" | "size" | "container">, never>> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "closeOnOutside" | "bodyClassName"> & Partial<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "position" | "overlay" | "size" | "container">> & Partial<Pick<Pick<DrawerProps, "position" | "overlay" | "size" | "container">, never>> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "closeOnOutside" | "bodyClassName"> & Partial<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "position" | "overlay" | "size" | "container">> & Partial<Pick<Pick<DrawerProps, "position" | "overlay" | "size" | "container">, never>> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "closeOnOutside" | "bodyClassName"> & Partial<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "position" | "overlay" | "size" | "container">> & Partial<Pick<Pick<DrawerProps, "position" | "overlay" | "size" | "container">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "closeOnOutside" | "bodyClassName"> & Partial<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "position" | "overlay" | "size" | "container">> & Partial<Pick<Pick<DrawerProps, "position" | "overlay" | "size" | "container">, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "closeOnOutside" | "bodyClassName"> & Partial<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "position" | "overlay" | "size" | "container">> & Partial<Pick<Pick<DrawerProps, "position" | "overlay" | "size" | "container">, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "closeOnOutside" | "bodyClassName"> & Partial<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "position" | "overlay" | "size" | "container">> & Partial<Pick<Pick<DrawerProps, "position" | "overlay" | "size" | "container">, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "closeOnOutside" | "bodyClassName"> & Partial<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "position" | "overlay" | "size" | "container">> & Partial<Pick<Pick<DrawerProps, "position" | "overlay" | "size" | "container">, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "closeOnOutside" | "bodyClassName"> & Partial<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "position" | "overlay" | "size" | "container">> & Partial<Pick<Pick<DrawerProps, "position" | "overlay" | "size" | "container">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "closeOnOutside" | "bodyClassName"> & Partial<Pick<Omit<DrawerProps, keyof import("../theme").ThemeProps>, "position" | "overlay" | "size" | "container">> & Partial<Pick<Pick<DrawerProps, "position" | "overlay" | "size" | "container">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof Drawer>;
} & import("hoist-non-react-statics").NonReactStatics<typeof Drawer, {}> & {
    ComposedComponent: typeof Drawer;
};
export default _default;
