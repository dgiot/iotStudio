/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { ThemeProps } from '../../theme';
export interface FormulaProps extends ThemeProps {
    value: any;
    onChange: (value: any) => void;
    disabled?: boolean;
}
export declare class Formula extends React.Component<FormulaProps> {
    render(): JSX.Element;
}
declare const _default: {
    new (props: (Omit<FormulaProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps) | Readonly<Omit<FormulaProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<FormulaProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<FormulaProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<FormulaProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<FormulaProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<FormulaProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<FormulaProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<FormulaProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<FormulaProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<FormulaProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Omit<FormulaProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<FormulaProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<FormulaProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<FormulaProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<FormulaProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<FormulaProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<FormulaProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<FormulaProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<FormulaProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<FormulaProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof Formula>;
} & import("hoist-non-react-statics").NonReactStatics<typeof Formula, {}> & {
    ComposedComponent: typeof Formula;
};
export default _default;
