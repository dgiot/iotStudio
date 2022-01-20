/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { Func, ExpressionFunc, Field, Funcs } from './types';
import { ThemeProps } from '../../theme';
import { Config } from './config';
export interface ConditionFuncProps extends ThemeProps {
    value: ExpressionFunc;
    onChange: (value: ExpressionFunc) => void;
    disabled?: boolean;
    config: Config;
    fields?: Field[];
    funcs?: Funcs;
    allowedTypes?: Array<'value' | 'field' | 'func' | 'formula'>;
    fieldClassName?: string;
}
export declare class ConditionFunc extends React.Component<ConditionFuncProps> {
    handleFuncChange(type: string): void;
    handleArgChange(arg: any, index: number): void;
    renderFunc(func: Func): JSX.Element;
    render(): JSX.Element;
}
declare const _default: {
    new (props: (Omit<ConditionFuncProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps) | Readonly<Omit<ConditionFuncProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<ConditionFuncProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<ConditionFuncProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<ConditionFuncProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<ConditionFuncProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<ConditionFuncProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<ConditionFuncProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<ConditionFuncProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<ConditionFuncProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<ConditionFuncProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Omit<ConditionFuncProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<ConditionFuncProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<ConditionFuncProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<ConditionFuncProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<ConditionFuncProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<ConditionFuncProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<ConditionFuncProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<ConditionFuncProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<ConditionFuncProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<ConditionFuncProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof ConditionFunc>;
} & import("hoist-non-react-statics").NonReactStatics<typeof ConditionFunc, {}> & {
    ComposedComponent: typeof ConditionFunc;
};
export default _default;
