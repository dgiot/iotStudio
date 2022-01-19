/**
 * @file Switch
 * @description
 * @author fex
 */
/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { ClassNamesFn } from '../theme';
interface SwitchProps {
    id?: string;
    size?: 'md' | 'lg' | 'middle' | 'large';
    level?: 'info' | 'primary' | 'danger';
    className?: string;
    classPrefix: string;
    classnames: ClassNamesFn;
    onChange?: (checked: boolean) => void;
    value?: any;
    inline?: boolean;
    trueValue?: any;
    falseValue?: any;
    disabled?: boolean;
    readOnly?: boolean;
    onText?: string;
    offText?: string;
    checked?: boolean;
}
export declare class Switch extends React.PureComponent<SwitchProps, any> {
    static defaultProps: {
        trueValue: boolean;
        falseValue: boolean;
    };
    constructor(props: SwitchProps);
    hanldeCheck(e: React.ChangeEvent<HTMLInputElement>): void;
    render(): JSX.Element;
}
declare const _default: {
    new (props: (Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "value" | "disabled" | "checked" | "level" | "id" | "size" | "inline" | "onChange" | "readOnly" | "onText" | "offText"> & Partial<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "trueValue" | "falseValue">> & Partial<Pick<{
        trueValue: boolean;
        falseValue: boolean;
    }, never>> & import("../theme").ThemeOutterProps) | Readonly<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "value" | "disabled" | "checked" | "level" | "id" | "size" | "inline" | "onChange" | "readOnly" | "onText" | "offText"> & Partial<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "trueValue" | "falseValue">> & Partial<Pick<{
        trueValue: boolean;
        falseValue: boolean;
    }, never>> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "value" | "disabled" | "checked" | "level" | "id" | "size" | "inline" | "onChange" | "readOnly" | "onText" | "offText"> & Partial<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "trueValue" | "falseValue">> & Partial<Pick<{
            trueValue: boolean;
            falseValue: boolean;
        }, never>> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "value" | "disabled" | "checked" | "level" | "id" | "size" | "inline" | "onChange" | "readOnly" | "onText" | "offText"> & Partial<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "trueValue" | "falseValue">> & Partial<Pick<{
            trueValue: boolean;
            falseValue: boolean;
        }, never>> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "value" | "disabled" | "checked" | "level" | "id" | "size" | "inline" | "onChange" | "readOnly" | "onText" | "offText"> & Partial<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "trueValue" | "falseValue">> & Partial<Pick<{
            trueValue: boolean;
            falseValue: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "value" | "disabled" | "checked" | "level" | "id" | "size" | "inline" | "onChange" | "readOnly" | "onText" | "offText"> & Partial<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "trueValue" | "falseValue">> & Partial<Pick<{
            trueValue: boolean;
            falseValue: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "value" | "disabled" | "checked" | "level" | "id" | "size" | "inline" | "onChange" | "readOnly" | "onText" | "offText"> & Partial<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "trueValue" | "falseValue">> & Partial<Pick<{
            trueValue: boolean;
            falseValue: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "value" | "disabled" | "checked" | "level" | "id" | "size" | "inline" | "onChange" | "readOnly" | "onText" | "offText"> & Partial<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "trueValue" | "falseValue">> & Partial<Pick<{
            trueValue: boolean;
            falseValue: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "value" | "disabled" | "checked" | "level" | "id" | "size" | "inline" | "onChange" | "readOnly" | "onText" | "offText"> & Partial<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "trueValue" | "falseValue">> & Partial<Pick<{
            trueValue: boolean;
            falseValue: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "value" | "disabled" | "checked" | "level" | "id" | "size" | "inline" | "onChange" | "readOnly" | "onText" | "offText"> & Partial<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "trueValue" | "falseValue">> & Partial<Pick<{
            trueValue: boolean;
            falseValue: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "value" | "disabled" | "checked" | "level" | "id" | "size" | "inline" | "onChange" | "readOnly" | "onText" | "offText"> & Partial<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "trueValue" | "falseValue">> & Partial<Pick<{
            trueValue: boolean;
            falseValue: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "value" | "disabled" | "checked" | "level" | "id" | "size" | "inline" | "onChange" | "readOnly" | "onText" | "offText"> & Partial<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "trueValue" | "falseValue">> & Partial<Pick<{
        trueValue: boolean;
        falseValue: boolean;
    }, never>> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "value" | "disabled" | "checked" | "level" | "id" | "size" | "inline" | "onChange" | "readOnly" | "onText" | "offText"> & Partial<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "trueValue" | "falseValue">> & Partial<Pick<{
            trueValue: boolean;
            falseValue: boolean;
        }, never>> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "value" | "disabled" | "checked" | "level" | "id" | "size" | "inline" | "onChange" | "readOnly" | "onText" | "offText"> & Partial<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "trueValue" | "falseValue">> & Partial<Pick<{
            trueValue: boolean;
            falseValue: boolean;
        }, never>> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "value" | "disabled" | "checked" | "level" | "id" | "size" | "inline" | "onChange" | "readOnly" | "onText" | "offText"> & Partial<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "trueValue" | "falseValue">> & Partial<Pick<{
            trueValue: boolean;
            falseValue: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "value" | "disabled" | "checked" | "level" | "id" | "size" | "inline" | "onChange" | "readOnly" | "onText" | "offText"> & Partial<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "trueValue" | "falseValue">> & Partial<Pick<{
            trueValue: boolean;
            falseValue: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "value" | "disabled" | "checked" | "level" | "id" | "size" | "inline" | "onChange" | "readOnly" | "onText" | "offText"> & Partial<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "trueValue" | "falseValue">> & Partial<Pick<{
            trueValue: boolean;
            falseValue: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "value" | "disabled" | "checked" | "level" | "id" | "size" | "inline" | "onChange" | "readOnly" | "onText" | "offText"> & Partial<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "trueValue" | "falseValue">> & Partial<Pick<{
            trueValue: boolean;
            falseValue: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "value" | "disabled" | "checked" | "level" | "id" | "size" | "inline" | "onChange" | "readOnly" | "onText" | "offText"> & Partial<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "trueValue" | "falseValue">> & Partial<Pick<{
            trueValue: boolean;
            falseValue: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "value" | "disabled" | "checked" | "level" | "id" | "size" | "inline" | "onChange" | "readOnly" | "onText" | "offText"> & Partial<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "trueValue" | "falseValue">> & Partial<Pick<{
            trueValue: boolean;
            falseValue: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "value" | "disabled" | "checked" | "level" | "id" | "size" | "inline" | "onChange" | "readOnly" | "onText" | "offText"> & Partial<Pick<Omit<SwitchProps, keyof import("../theme").ThemeProps>, "trueValue" | "falseValue">> & Partial<Pick<{
            trueValue: boolean;
            falseValue: boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof Switch>;
} & import("hoist-non-react-statics").NonReactStatics<typeof Switch, {}> & {
    ComposedComponent: typeof Switch;
};
export default _default;
