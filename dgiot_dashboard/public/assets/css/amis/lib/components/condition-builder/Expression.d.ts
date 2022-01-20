/// <reference types="hoist-non-react-statics" />
import { ExpressionComplex, Field, Funcs, FieldSimple, OperatorType } from './types';
import React from 'react';
import { ThemeProps } from '../../theme';
import { Config } from './config';
/**
 * 支持4中表达式设置方式
 *
 * 1. 直接就是值，由用户直接填写。
 * 2. 选择字段，让用户选一个字段。
 * 3. 选择一个函数，然后会参数里面的输入情况是个递归。
 * 4. 粗暴点，函数让用户自己书写。
 */
export interface ExpressionProps extends ThemeProps {
    value: ExpressionComplex;
    data?: any;
    index?: number;
    onChange: (value: ExpressionComplex, index?: number) => void;
    valueField?: FieldSimple;
    fields?: Field[];
    funcs?: Funcs;
    allowedTypes?: Array<'value' | 'field' | 'func' | 'formula'>;
    op?: OperatorType;
    config: Config;
    disabled?: boolean;
    searchable?: boolean;
    fieldClassName?: string;
}
export declare class Expression extends React.Component<ExpressionProps> {
    handleInputTypeChange(type: 'value' | 'field' | 'func' | 'formula'): void;
    handleValueChange(data: any): void;
    handleFieldChange(field: string): void;
    handleFuncChange(func: any): void;
    handleFormulaChange(formula: string): void;
    render(): JSX.Element;
}
declare const _default: {
    new (props: (Omit<ExpressionProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps) | Readonly<Omit<ExpressionProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<ExpressionProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<ExpressionProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<ExpressionProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<ExpressionProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<ExpressionProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<ExpressionProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<ExpressionProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<ExpressionProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<ExpressionProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Omit<ExpressionProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<ExpressionProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<ExpressionProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<ExpressionProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<ExpressionProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<ExpressionProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<ExpressionProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<ExpressionProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<ExpressionProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<ExpressionProps, keyof ThemeProps> & import("../../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof Expression>;
} & import("hoist-non-react-statics").NonReactStatics<typeof Expression, {}> & {
    ComposedComponent: typeof Expression;
};
export default _default;
