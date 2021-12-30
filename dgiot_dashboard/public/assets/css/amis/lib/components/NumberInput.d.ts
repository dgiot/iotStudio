/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { ThemeProps } from '../theme';
export interface NumberProps extends ThemeProps {
    placeholder?: string;
    max?: number;
    min?: number;
    step?: number;
    showSteps?: boolean;
    precision?: number;
    disabled?: boolean;
    /**
     * 只读
     */
    readOnly?: boolean;
    value?: number;
    onChange?: (value: number) => void;
    /**
     * 边框模式，全边框，还是半边框，或者没边框。
     */
    borderMode?: 'full' | 'half' | 'none';
    /**
     * 指定输入框展示值的格式
     */
    formatter?: Function;
    /**
     * 指定从 formatter 里转换回数字的方式，和 formatter 搭配使用
     */
    parser?: Function;
}
export declare class NumberInput extends React.Component<NumberProps, any> {
    static defaultProps: Pick<NumberProps, 'step' | 'readOnly' | 'borderMode'>;
    handleChange(value: any): void;
    render(): JSX.Element;
}
declare const _default: {
    new (props: (Pick<Omit<NumberProps, keyof ThemeProps>, "value" | "disabled" | "min" | "placeholder" | "onChange" | "max" | "showSteps" | "precision" | "formatter" | "parser"> & Partial<Pick<Omit<NumberProps, keyof ThemeProps>, "step" | "readOnly" | "borderMode">> & Partial<Pick<Pick<NumberProps, "step" | "readOnly" | "borderMode">, never>> & import("../theme").ThemeOutterProps) | Readonly<Pick<Omit<NumberProps, keyof ThemeProps>, "value" | "disabled" | "min" | "placeholder" | "onChange" | "max" | "showSteps" | "precision" | "formatter" | "parser"> & Partial<Pick<Omit<NumberProps, keyof ThemeProps>, "step" | "readOnly" | "borderMode">> & Partial<Pick<Pick<NumberProps, "step" | "readOnly" | "borderMode">, never>> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<NumberProps, keyof ThemeProps>, "value" | "disabled" | "min" | "placeholder" | "onChange" | "max" | "showSteps" | "precision" | "formatter" | "parser"> & Partial<Pick<Omit<NumberProps, keyof ThemeProps>, "step" | "readOnly" | "borderMode">> & Partial<Pick<Pick<NumberProps, "step" | "readOnly" | "borderMode">, never>> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<NumberProps, keyof ThemeProps>, "value" | "disabled" | "min" | "placeholder" | "onChange" | "max" | "showSteps" | "precision" | "formatter" | "parser"> & Partial<Pick<Omit<NumberProps, keyof ThemeProps>, "step" | "readOnly" | "borderMode">> & Partial<Pick<Pick<NumberProps, "step" | "readOnly" | "borderMode">, never>> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<NumberProps, keyof ThemeProps>, "value" | "disabled" | "min" | "placeholder" | "onChange" | "max" | "showSteps" | "precision" | "formatter" | "parser"> & Partial<Pick<Omit<NumberProps, keyof ThemeProps>, "step" | "readOnly" | "borderMode">> & Partial<Pick<Pick<NumberProps, "step" | "readOnly" | "borderMode">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<NumberProps, keyof ThemeProps>, "value" | "disabled" | "min" | "placeholder" | "onChange" | "max" | "showSteps" | "precision" | "formatter" | "parser"> & Partial<Pick<Omit<NumberProps, keyof ThemeProps>, "step" | "readOnly" | "borderMode">> & Partial<Pick<Pick<NumberProps, "step" | "readOnly" | "borderMode">, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<NumberProps, keyof ThemeProps>, "value" | "disabled" | "min" | "placeholder" | "onChange" | "max" | "showSteps" | "precision" | "formatter" | "parser"> & Partial<Pick<Omit<NumberProps, keyof ThemeProps>, "step" | "readOnly" | "borderMode">> & Partial<Pick<Pick<NumberProps, "step" | "readOnly" | "borderMode">, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<NumberProps, keyof ThemeProps>, "value" | "disabled" | "min" | "placeholder" | "onChange" | "max" | "showSteps" | "precision" | "formatter" | "parser"> & Partial<Pick<Omit<NumberProps, keyof ThemeProps>, "step" | "readOnly" | "borderMode">> & Partial<Pick<Pick<NumberProps, "step" | "readOnly" | "borderMode">, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<NumberProps, keyof ThemeProps>, "value" | "disabled" | "min" | "placeholder" | "onChange" | "max" | "showSteps" | "precision" | "formatter" | "parser"> & Partial<Pick<Omit<NumberProps, keyof ThemeProps>, "step" | "readOnly" | "borderMode">> & Partial<Pick<Pick<NumberProps, "step" | "readOnly" | "borderMode">, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<NumberProps, keyof ThemeProps>, "value" | "disabled" | "min" | "placeholder" | "onChange" | "max" | "showSteps" | "precision" | "formatter" | "parser"> & Partial<Pick<Omit<NumberProps, keyof ThemeProps>, "step" | "readOnly" | "borderMode">> & Partial<Pick<Pick<NumberProps, "step" | "readOnly" | "borderMode">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<NumberProps, keyof ThemeProps>, "value" | "disabled" | "min" | "placeholder" | "onChange" | "max" | "showSteps" | "precision" | "formatter" | "parser"> & Partial<Pick<Omit<NumberProps, keyof ThemeProps>, "step" | "readOnly" | "borderMode">> & Partial<Pick<Pick<NumberProps, "step" | "readOnly" | "borderMode">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Pick<Omit<NumberProps, keyof ThemeProps>, "value" | "disabled" | "min" | "placeholder" | "onChange" | "max" | "showSteps" | "precision" | "formatter" | "parser"> & Partial<Pick<Omit<NumberProps, keyof ThemeProps>, "step" | "readOnly" | "borderMode">> & Partial<Pick<Pick<NumberProps, "step" | "readOnly" | "borderMode">, never>> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<NumberProps, keyof ThemeProps>, "value" | "disabled" | "min" | "placeholder" | "onChange" | "max" | "showSteps" | "precision" | "formatter" | "parser"> & Partial<Pick<Omit<NumberProps, keyof ThemeProps>, "step" | "readOnly" | "borderMode">> & Partial<Pick<Pick<NumberProps, "step" | "readOnly" | "borderMode">, never>> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<NumberProps, keyof ThemeProps>, "value" | "disabled" | "min" | "placeholder" | "onChange" | "max" | "showSteps" | "precision" | "formatter" | "parser"> & Partial<Pick<Omit<NumberProps, keyof ThemeProps>, "step" | "readOnly" | "borderMode">> & Partial<Pick<Pick<NumberProps, "step" | "readOnly" | "borderMode">, never>> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<NumberProps, keyof ThemeProps>, "value" | "disabled" | "min" | "placeholder" | "onChange" | "max" | "showSteps" | "precision" | "formatter" | "parser"> & Partial<Pick<Omit<NumberProps, keyof ThemeProps>, "step" | "readOnly" | "borderMode">> & Partial<Pick<Pick<NumberProps, "step" | "readOnly" | "borderMode">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<NumberProps, keyof ThemeProps>, "value" | "disabled" | "min" | "placeholder" | "onChange" | "max" | "showSteps" | "precision" | "formatter" | "parser"> & Partial<Pick<Omit<NumberProps, keyof ThemeProps>, "step" | "readOnly" | "borderMode">> & Partial<Pick<Pick<NumberProps, "step" | "readOnly" | "borderMode">, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<NumberProps, keyof ThemeProps>, "value" | "disabled" | "min" | "placeholder" | "onChange" | "max" | "showSteps" | "precision" | "formatter" | "parser"> & Partial<Pick<Omit<NumberProps, keyof ThemeProps>, "step" | "readOnly" | "borderMode">> & Partial<Pick<Pick<NumberProps, "step" | "readOnly" | "borderMode">, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<NumberProps, keyof ThemeProps>, "value" | "disabled" | "min" | "placeholder" | "onChange" | "max" | "showSteps" | "precision" | "formatter" | "parser"> & Partial<Pick<Omit<NumberProps, keyof ThemeProps>, "step" | "readOnly" | "borderMode">> & Partial<Pick<Pick<NumberProps, "step" | "readOnly" | "borderMode">, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<NumberProps, keyof ThemeProps>, "value" | "disabled" | "min" | "placeholder" | "onChange" | "max" | "showSteps" | "precision" | "formatter" | "parser"> & Partial<Pick<Omit<NumberProps, keyof ThemeProps>, "step" | "readOnly" | "borderMode">> & Partial<Pick<Pick<NumberProps, "step" | "readOnly" | "borderMode">, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<NumberProps, keyof ThemeProps>, "value" | "disabled" | "min" | "placeholder" | "onChange" | "max" | "showSteps" | "precision" | "formatter" | "parser"> & Partial<Pick<Omit<NumberProps, keyof ThemeProps>, "step" | "readOnly" | "borderMode">> & Partial<Pick<Pick<NumberProps, "step" | "readOnly" | "borderMode">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<NumberProps, keyof ThemeProps>, "value" | "disabled" | "min" | "placeholder" | "onChange" | "max" | "showSteps" | "precision" | "formatter" | "parser"> & Partial<Pick<Omit<NumberProps, keyof ThemeProps>, "step" | "readOnly" | "borderMode">> & Partial<Pick<Pick<NumberProps, "step" | "readOnly" | "borderMode">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof NumberInput>;
} & import("hoist-non-react-statics").NonReactStatics<typeof NumberInput, {}> & {
    ComposedComponent: typeof NumberInput;
};
export default _default;
