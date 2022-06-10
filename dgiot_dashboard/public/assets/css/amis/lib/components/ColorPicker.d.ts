/**
 * @file ColorPicker
 * @description 颜色选择器组件
 * @author fex
 */
/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { ColorResult } from 'react-color';
import { ThemeProps } from '../theme';
import { LocaleProps } from '../locale';
export interface ColorProps extends LocaleProps, ThemeProps {
    placeholder?: string;
    format: string;
    clearable: boolean;
    className?: string;
    popoverClassName?: string;
    disabled?: boolean;
    popOverContainer?: any;
    placement?: string;
    value?: any;
    onChange: (value: any) => void;
    presetColors?: string[];
    resetValue?: string;
    allowCustomColor?: boolean;
}
export interface ColorControlState {
    isOpened: boolean;
    isFocused: boolean;
    inputValue: string;
}
export declare class ColorControl extends React.PureComponent<ColorProps, ColorControlState> {
    static defaultProps: {
        format: string;
        clearable: boolean;
        placeholder: string;
        allowCustomColor: boolean;
    };
    state: {
        isOpened: boolean;
        isFocused: boolean;
        inputValue: any;
    };
    popover: any;
    closeTimer: number;
    preview: React.RefObject<HTMLElement>;
    input: React.RefObject<HTMLInputElement>;
    constructor(props: ColorProps);
    componentDidUpdate(prevProps: ColorProps): void;
    handleFocus(): void;
    handleBlur(): void;
    focus(): void;
    blur(): void;
    open(fn?: () => void): void;
    close(): void;
    clearValue(): void;
    handleClick(): void;
    handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void;
    validateColor(value: string): boolean;
    handleChange(color: ColorResult): void;
    render(): JSX.Element;
}
declare const _default: {
    new (props: (Omit<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
        format: string;
        clearable: boolean;
        placeholder: string;
        allowCustomColor: boolean;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
        format: string;
        clearable: boolean;
        placeholder: string;
        allowCustomColor: boolean;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Omit<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
        format: string;
        clearable: boolean;
        placeholder: string;
        allowCustomColor: boolean;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<{
        new (props: (Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<{}>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<{}>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof ColorControl>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof ColorControl, {}> & {
        ComposedComponent: typeof ColorControl;
    }>;
} & import("hoist-non-react-statics").NonReactStatics<{
    new (props: (Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
        format: string;
        clearable: boolean;
        placeholder: string;
        allowCustomColor: boolean;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }) | Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
        format: string;
        clearable: boolean;
        placeholder: string;
        allowCustomColor: boolean;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }>): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
        format: string;
        clearable: boolean;
        placeholder: string;
        allowCustomColor: boolean;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof ColorControl>;
} & import("hoist-non-react-statics").NonReactStatics<typeof ColorControl, {}> & {
    ComposedComponent: typeof ColorControl;
}, {}> & {
    ComposedComponent: {
        new (props: (Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<{}>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
            format: string;
            clearable: boolean;
            placeholder: string;
            allowCustomColor: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<{}>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ColorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "resetValue" | "placement" | "onChange" | "popoverClassName" | "popOverContainer" | "presetColors"> & Partial<Pick<Omit<ColorProps, keyof LocaleProps>, "placeholder" | "format" | "clearable" | "allowCustomColor">> & Partial<Pick<{
                format: string;
                clearable: boolean;
                placeholder: string;
                allowCustomColor: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof ColorControl>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof ColorControl, {}> & {
        ComposedComponent: typeof ColorControl;
    };
};
export default _default;
