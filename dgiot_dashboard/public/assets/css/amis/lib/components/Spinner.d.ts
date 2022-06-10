/**
 * @file Spinner
 * @description
 * @author fex
 * @date 2017-11-07
 */
/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { ThemeProps } from '../theme';
interface SpinnerProps extends ThemeProps {
    overlay: boolean;
    spinnerClassName: string;
    mode: string;
    size: 'sm' | 'lg' | '';
    show: boolean;
    icon?: string;
}
export declare class Spinner extends React.Component<SpinnerProps, object> {
    static defaultProps: {
        overlay: boolean;
        spinnerClassName: string;
        mode: string;
        size: "";
        show: boolean;
    };
    div: React.RefObject<HTMLDivElement>;
    overlay: React.RefObject<HTMLDivElement>;
    render(): JSX.Element;
}
declare const _default: {
    new (props: (Pick<Omit<SpinnerProps, keyof ThemeProps>, "icon"> & Partial<Pick<Omit<SpinnerProps, keyof ThemeProps>, "show" | "overlay" | "size" | "spinnerClassName" | "mode">> & Partial<Pick<{
        overlay: boolean;
        spinnerClassName: string;
        mode: string;
        size: "";
        show: boolean;
    }, never>> & import("../theme").ThemeOutterProps) | Readonly<Pick<Omit<SpinnerProps, keyof ThemeProps>, "icon"> & Partial<Pick<Omit<SpinnerProps, keyof ThemeProps>, "show" | "overlay" | "size" | "spinnerClassName" | "mode">> & Partial<Pick<{
        overlay: boolean;
        spinnerClassName: string;
        mode: string;
        size: "";
        show: boolean;
    }, never>> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<SpinnerProps, keyof ThemeProps>, "icon"> & Partial<Pick<Omit<SpinnerProps, keyof ThemeProps>, "show" | "overlay" | "size" | "spinnerClassName" | "mode">> & Partial<Pick<{
            overlay: boolean;
            spinnerClassName: string;
            mode: string;
            size: "";
            show: boolean;
        }, never>> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<SpinnerProps, keyof ThemeProps>, "icon"> & Partial<Pick<Omit<SpinnerProps, keyof ThemeProps>, "show" | "overlay" | "size" | "spinnerClassName" | "mode">> & Partial<Pick<{
            overlay: boolean;
            spinnerClassName: string;
            mode: string;
            size: "";
            show: boolean;
        }, never>> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<SpinnerProps, keyof ThemeProps>, "icon"> & Partial<Pick<Omit<SpinnerProps, keyof ThemeProps>, "show" | "overlay" | "size" | "spinnerClassName" | "mode">> & Partial<Pick<{
            overlay: boolean;
            spinnerClassName: string;
            mode: string;
            size: "";
            show: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<SpinnerProps, keyof ThemeProps>, "icon"> & Partial<Pick<Omit<SpinnerProps, keyof ThemeProps>, "show" | "overlay" | "size" | "spinnerClassName" | "mode">> & Partial<Pick<{
            overlay: boolean;
            spinnerClassName: string;
            mode: string;
            size: "";
            show: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<SpinnerProps, keyof ThemeProps>, "icon"> & Partial<Pick<Omit<SpinnerProps, keyof ThemeProps>, "show" | "overlay" | "size" | "spinnerClassName" | "mode">> & Partial<Pick<{
            overlay: boolean;
            spinnerClassName: string;
            mode: string;
            size: "";
            show: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SpinnerProps, keyof ThemeProps>, "icon"> & Partial<Pick<Omit<SpinnerProps, keyof ThemeProps>, "show" | "overlay" | "size" | "spinnerClassName" | "mode">> & Partial<Pick<{
            overlay: boolean;
            spinnerClassName: string;
            mode: string;
            size: "";
            show: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SpinnerProps, keyof ThemeProps>, "icon"> & Partial<Pick<Omit<SpinnerProps, keyof ThemeProps>, "show" | "overlay" | "size" | "spinnerClassName" | "mode">> & Partial<Pick<{
            overlay: boolean;
            spinnerClassName: string;
            mode: string;
            size: "";
            show: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<SpinnerProps, keyof ThemeProps>, "icon"> & Partial<Pick<Omit<SpinnerProps, keyof ThemeProps>, "show" | "overlay" | "size" | "spinnerClassName" | "mode">> & Partial<Pick<{
            overlay: boolean;
            spinnerClassName: string;
            mode: string;
            size: "";
            show: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<SpinnerProps, keyof ThemeProps>, "icon"> & Partial<Pick<Omit<SpinnerProps, keyof ThemeProps>, "show" | "overlay" | "size" | "spinnerClassName" | "mode">> & Partial<Pick<{
            overlay: boolean;
            spinnerClassName: string;
            mode: string;
            size: "";
            show: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Pick<Omit<SpinnerProps, keyof ThemeProps>, "icon"> & Partial<Pick<Omit<SpinnerProps, keyof ThemeProps>, "show" | "overlay" | "size" | "spinnerClassName" | "mode">> & Partial<Pick<{
        overlay: boolean;
        spinnerClassName: string;
        mode: string;
        size: "";
        show: boolean;
    }, never>> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<SpinnerProps, keyof ThemeProps>, "icon"> & Partial<Pick<Omit<SpinnerProps, keyof ThemeProps>, "show" | "overlay" | "size" | "spinnerClassName" | "mode">> & Partial<Pick<{
            overlay: boolean;
            spinnerClassName: string;
            mode: string;
            size: "";
            show: boolean;
        }, never>> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<SpinnerProps, keyof ThemeProps>, "icon"> & Partial<Pick<Omit<SpinnerProps, keyof ThemeProps>, "show" | "overlay" | "size" | "spinnerClassName" | "mode">> & Partial<Pick<{
            overlay: boolean;
            spinnerClassName: string;
            mode: string;
            size: "";
            show: boolean;
        }, never>> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<SpinnerProps, keyof ThemeProps>, "icon"> & Partial<Pick<Omit<SpinnerProps, keyof ThemeProps>, "show" | "overlay" | "size" | "spinnerClassName" | "mode">> & Partial<Pick<{
            overlay: boolean;
            spinnerClassName: string;
            mode: string;
            size: "";
            show: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<SpinnerProps, keyof ThemeProps>, "icon"> & Partial<Pick<Omit<SpinnerProps, keyof ThemeProps>, "show" | "overlay" | "size" | "spinnerClassName" | "mode">> & Partial<Pick<{
            overlay: boolean;
            spinnerClassName: string;
            mode: string;
            size: "";
            show: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<SpinnerProps, keyof ThemeProps>, "icon"> & Partial<Pick<Omit<SpinnerProps, keyof ThemeProps>, "show" | "overlay" | "size" | "spinnerClassName" | "mode">> & Partial<Pick<{
            overlay: boolean;
            spinnerClassName: string;
            mode: string;
            size: "";
            show: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SpinnerProps, keyof ThemeProps>, "icon"> & Partial<Pick<Omit<SpinnerProps, keyof ThemeProps>, "show" | "overlay" | "size" | "spinnerClassName" | "mode">> & Partial<Pick<{
            overlay: boolean;
            spinnerClassName: string;
            mode: string;
            size: "";
            show: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SpinnerProps, keyof ThemeProps>, "icon"> & Partial<Pick<Omit<SpinnerProps, keyof ThemeProps>, "show" | "overlay" | "size" | "spinnerClassName" | "mode">> & Partial<Pick<{
            overlay: boolean;
            spinnerClassName: string;
            mode: string;
            size: "";
            show: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<SpinnerProps, keyof ThemeProps>, "icon"> & Partial<Pick<Omit<SpinnerProps, keyof ThemeProps>, "show" | "overlay" | "size" | "spinnerClassName" | "mode">> & Partial<Pick<{
            overlay: boolean;
            spinnerClassName: string;
            mode: string;
            size: "";
            show: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<SpinnerProps, keyof ThemeProps>, "icon"> & Partial<Pick<Omit<SpinnerProps, keyof ThemeProps>, "show" | "overlay" | "size" | "spinnerClassName" | "mode">> & Partial<Pick<{
            overlay: boolean;
            spinnerClassName: string;
            mode: string;
            size: "";
            show: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof Spinner>;
} & import("hoist-non-react-statics").NonReactStatics<typeof Spinner, {}> & {
    ComposedComponent: typeof Spinner;
};
export default _default;
