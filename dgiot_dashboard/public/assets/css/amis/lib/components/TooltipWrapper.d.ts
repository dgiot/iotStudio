/**
 * @file TooltipWrapper
 * @description
 * @author fex
 */
/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { ClassNamesFn } from '../theme';
export interface TooltipObject {
    title?: string;
    content?: string;
    render?: () => JSX.Element;
    dom?: JSX.Element;
}
export declare type Trigger = 'hover' | 'click' | 'focus';
export interface TooltipWrapperProps {
    classPrefix: string;
    classnames: ClassNamesFn;
    placement: 'top' | 'right' | 'bottom' | 'left';
    tooltip?: string | TooltipObject;
    container?: React.ReactNode;
    trigger: Trigger | Array<Trigger>;
    rootClose: boolean;
    overlay?: any;
    delay: number;
    theme?: string;
    tooltipClassName?: string;
}
interface TooltipWrapperState {
    show?: boolean;
}
export declare class TooltipWrapper extends React.Component<TooltipWrapperProps, TooltipWrapperState> {
    static defaultProps: Pick<TooltipWrapperProps, 'placement' | 'trigger' | 'rootClose' | 'delay'>;
    target: HTMLElement;
    timer: ReturnType<typeof setTimeout>;
    moutned: boolean;
    constructor(props: TooltipWrapperProps);
    componentWillUnmount(): void;
    getTarget(): Element | Text | null;
    show(): void;
    hide(): void;
    getChildProps(): any;
    handleShow(): void;
    handleHide(): void;
    handleFocus(e: any): void;
    handleBlur(e: any): void;
    handleMouseOver(e: any): void;
    handleMouseOut(e: any): void;
    handleMouseOverOut(handler: Function, e: React.MouseEvent<HTMLElement>, relatedNative: string): void;
    handleClick(e: any): void;
    render(): {} | null | undefined;
}
declare const _default: {
    new (props: (Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "tooltip" | "overlay" | "container" | "tooltipClassName"> & Partial<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "placement" | "rootClose" | "trigger" | "delay">> & Partial<Pick<Pick<TooltipWrapperProps, "placement" | "rootClose" | "trigger" | "delay">, never>> & import("../theme").ThemeOutterProps) | Readonly<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "tooltip" | "overlay" | "container" | "tooltipClassName"> & Partial<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "placement" | "rootClose" | "trigger" | "delay">> & Partial<Pick<Pick<TooltipWrapperProps, "placement" | "rootClose" | "trigger" | "delay">, never>> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "tooltip" | "overlay" | "container" | "tooltipClassName"> & Partial<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "placement" | "rootClose" | "trigger" | "delay">> & Partial<Pick<Pick<TooltipWrapperProps, "placement" | "rootClose" | "trigger" | "delay">, never>> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "tooltip" | "overlay" | "container" | "tooltipClassName"> & Partial<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "placement" | "rootClose" | "trigger" | "delay">> & Partial<Pick<Pick<TooltipWrapperProps, "placement" | "rootClose" | "trigger" | "delay">, never>> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "tooltip" | "overlay" | "container" | "tooltipClassName"> & Partial<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "placement" | "rootClose" | "trigger" | "delay">> & Partial<Pick<Pick<TooltipWrapperProps, "placement" | "rootClose" | "trigger" | "delay">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "tooltip" | "overlay" | "container" | "tooltipClassName"> & Partial<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "placement" | "rootClose" | "trigger" | "delay">> & Partial<Pick<Pick<TooltipWrapperProps, "placement" | "rootClose" | "trigger" | "delay">, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "tooltip" | "overlay" | "container" | "tooltipClassName"> & Partial<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "placement" | "rootClose" | "trigger" | "delay">> & Partial<Pick<Pick<TooltipWrapperProps, "placement" | "rootClose" | "trigger" | "delay">, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "tooltip" | "overlay" | "container" | "tooltipClassName"> & Partial<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "placement" | "rootClose" | "trigger" | "delay">> & Partial<Pick<Pick<TooltipWrapperProps, "placement" | "rootClose" | "trigger" | "delay">, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "tooltip" | "overlay" | "container" | "tooltipClassName"> & Partial<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "placement" | "rootClose" | "trigger" | "delay">> & Partial<Pick<Pick<TooltipWrapperProps, "placement" | "rootClose" | "trigger" | "delay">, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "tooltip" | "overlay" | "container" | "tooltipClassName"> & Partial<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "placement" | "rootClose" | "trigger" | "delay">> & Partial<Pick<Pick<TooltipWrapperProps, "placement" | "rootClose" | "trigger" | "delay">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "tooltip" | "overlay" | "container" | "tooltipClassName"> & Partial<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "placement" | "rootClose" | "trigger" | "delay">> & Partial<Pick<Pick<TooltipWrapperProps, "placement" | "rootClose" | "trigger" | "delay">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "tooltip" | "overlay" | "container" | "tooltipClassName"> & Partial<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "placement" | "rootClose" | "trigger" | "delay">> & Partial<Pick<Pick<TooltipWrapperProps, "placement" | "rootClose" | "trigger" | "delay">, never>> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "tooltip" | "overlay" | "container" | "tooltipClassName"> & Partial<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "placement" | "rootClose" | "trigger" | "delay">> & Partial<Pick<Pick<TooltipWrapperProps, "placement" | "rootClose" | "trigger" | "delay">, never>> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "tooltip" | "overlay" | "container" | "tooltipClassName"> & Partial<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "placement" | "rootClose" | "trigger" | "delay">> & Partial<Pick<Pick<TooltipWrapperProps, "placement" | "rootClose" | "trigger" | "delay">, never>> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "tooltip" | "overlay" | "container" | "tooltipClassName"> & Partial<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "placement" | "rootClose" | "trigger" | "delay">> & Partial<Pick<Pick<TooltipWrapperProps, "placement" | "rootClose" | "trigger" | "delay">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "tooltip" | "overlay" | "container" | "tooltipClassName"> & Partial<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "placement" | "rootClose" | "trigger" | "delay">> & Partial<Pick<Pick<TooltipWrapperProps, "placement" | "rootClose" | "trigger" | "delay">, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "tooltip" | "overlay" | "container" | "tooltipClassName"> & Partial<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "placement" | "rootClose" | "trigger" | "delay">> & Partial<Pick<Pick<TooltipWrapperProps, "placement" | "rootClose" | "trigger" | "delay">, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "tooltip" | "overlay" | "container" | "tooltipClassName"> & Partial<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "placement" | "rootClose" | "trigger" | "delay">> & Partial<Pick<Pick<TooltipWrapperProps, "placement" | "rootClose" | "trigger" | "delay">, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "tooltip" | "overlay" | "container" | "tooltipClassName"> & Partial<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "placement" | "rootClose" | "trigger" | "delay">> & Partial<Pick<Pick<TooltipWrapperProps, "placement" | "rootClose" | "trigger" | "delay">, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "tooltip" | "overlay" | "container" | "tooltipClassName"> & Partial<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "placement" | "rootClose" | "trigger" | "delay">> & Partial<Pick<Pick<TooltipWrapperProps, "placement" | "rootClose" | "trigger" | "delay">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "tooltip" | "overlay" | "container" | "tooltipClassName"> & Partial<Pick<Omit<TooltipWrapperProps, keyof import("../theme").ThemeProps>, "placement" | "rootClose" | "trigger" | "delay">> & Partial<Pick<Pick<TooltipWrapperProps, "placement" | "rootClose" | "trigger" | "delay">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof TooltipWrapper>;
} & import("hoist-non-react-statics").NonReactStatics<typeof TooltipWrapper, {}> & {
    ComposedComponent: typeof TooltipWrapper;
};
export default _default;
