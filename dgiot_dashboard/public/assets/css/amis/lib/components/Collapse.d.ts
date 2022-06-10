/**
 * @file Collapse
 * @description
 * @author fex
 */
/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { ClassNamesFn } from '../theme';
export interface CollapseProps {
    show?: boolean;
    mountOnEnter?: boolean;
    unmountOnExit?: boolean;
    className?: string;
    classPrefix: string;
    classnames: ClassNamesFn;
}
export declare class Collapse extends React.Component<CollapseProps, any> {
    static defaultProps: Pick<CollapseProps, 'show' | 'mountOnEnter' | 'unmountOnExit'>;
    contentDom: any;
    contentRef: (ref: any) => any;
    handleEnter(elem: HTMLElement): void;
    handleEntering(elem: HTMLElement): void;
    handleEntered(elem: HTMLElement): void;
    handleExit(elem: HTMLElement): void;
    handleExiting(elem: HTMLElement): void;
    render(): JSX.Element;
}
declare const _default: {
    new (props: (Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, "show" | "mountOnEnter" | "unmountOnExit">> & Partial<Pick<Pick<CollapseProps, "show" | "mountOnEnter" | "unmountOnExit">, never>> & import("../theme").ThemeOutterProps) | Readonly<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, "show" | "mountOnEnter" | "unmountOnExit">> & Partial<Pick<Pick<CollapseProps, "show" | "mountOnEnter" | "unmountOnExit">, never>> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, "show" | "mountOnEnter" | "unmountOnExit">> & Partial<Pick<Pick<CollapseProps, "show" | "mountOnEnter" | "unmountOnExit">, never>> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, "show" | "mountOnEnter" | "unmountOnExit">> & Partial<Pick<Pick<CollapseProps, "show" | "mountOnEnter" | "unmountOnExit">, never>> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, "show" | "mountOnEnter" | "unmountOnExit">> & Partial<Pick<Pick<CollapseProps, "show" | "mountOnEnter" | "unmountOnExit">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, "show" | "mountOnEnter" | "unmountOnExit">> & Partial<Pick<Pick<CollapseProps, "show" | "mountOnEnter" | "unmountOnExit">, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, "show" | "mountOnEnter" | "unmountOnExit">> & Partial<Pick<Pick<CollapseProps, "show" | "mountOnEnter" | "unmountOnExit">, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, "show" | "mountOnEnter" | "unmountOnExit">> & Partial<Pick<Pick<CollapseProps, "show" | "mountOnEnter" | "unmountOnExit">, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, "show" | "mountOnEnter" | "unmountOnExit">> & Partial<Pick<Pick<CollapseProps, "show" | "mountOnEnter" | "unmountOnExit">, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, "show" | "mountOnEnter" | "unmountOnExit">> & Partial<Pick<Pick<CollapseProps, "show" | "mountOnEnter" | "unmountOnExit">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, "show" | "mountOnEnter" | "unmountOnExit">> & Partial<Pick<Pick<CollapseProps, "show" | "mountOnEnter" | "unmountOnExit">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, "show" | "mountOnEnter" | "unmountOnExit">> & Partial<Pick<Pick<CollapseProps, "show" | "mountOnEnter" | "unmountOnExit">, never>> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, "show" | "mountOnEnter" | "unmountOnExit">> & Partial<Pick<Pick<CollapseProps, "show" | "mountOnEnter" | "unmountOnExit">, never>> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, "show" | "mountOnEnter" | "unmountOnExit">> & Partial<Pick<Pick<CollapseProps, "show" | "mountOnEnter" | "unmountOnExit">, never>> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, "show" | "mountOnEnter" | "unmountOnExit">> & Partial<Pick<Pick<CollapseProps, "show" | "mountOnEnter" | "unmountOnExit">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, "show" | "mountOnEnter" | "unmountOnExit">> & Partial<Pick<Pick<CollapseProps, "show" | "mountOnEnter" | "unmountOnExit">, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, "show" | "mountOnEnter" | "unmountOnExit">> & Partial<Pick<Pick<CollapseProps, "show" | "mountOnEnter" | "unmountOnExit">, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, "show" | "mountOnEnter" | "unmountOnExit">> & Partial<Pick<Pick<CollapseProps, "show" | "mountOnEnter" | "unmountOnExit">, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, "show" | "mountOnEnter" | "unmountOnExit">> & Partial<Pick<Pick<CollapseProps, "show" | "mountOnEnter" | "unmountOnExit">, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, "show" | "mountOnEnter" | "unmountOnExit">> & Partial<Pick<Pick<CollapseProps, "show" | "mountOnEnter" | "unmountOnExit">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, never> & Partial<Pick<Omit<CollapseProps, keyof import("../theme").ThemeProps>, "show" | "mountOnEnter" | "unmountOnExit">> & Partial<Pick<Pick<CollapseProps, "show" | "mountOnEnter" | "unmountOnExit">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof Collapse>;
} & import("hoist-non-react-statics").NonReactStatics<typeof Collapse, {}> & {
    ComposedComponent: typeof Collapse;
};
export default _default;
