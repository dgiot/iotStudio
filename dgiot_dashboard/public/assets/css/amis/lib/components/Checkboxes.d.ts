/**
 * @file Checkboxes
 * @description 多选输入框
 * @author fex
 */
/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { ThemeProps } from '../theme';
import { Option, Options } from './Select';
import { LocaleProps } from '../locale';
export interface BaseCheckboxesProps extends ThemeProps, LocaleProps {
    options: Options;
    className?: string;
    placeholder?: string;
    value?: Array<any>;
    onChange?: (value: Array<Option>) => void;
    onDeferLoad?: (option: Option) => void;
    inline?: boolean;
    labelClassName?: string;
    option2value?: (option: Option) => any;
    itemClassName?: string;
    itemRender: (option: Option) => JSX.Element;
    disabled?: boolean;
}
export declare class BaseCheckboxes<T extends BaseCheckboxesProps = BaseCheckboxesProps, S = any> extends React.Component<T, S> {
    static defaultProps: {
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
    };
    static value2array(value: any, options: Options, option2value?: (option: Option) => any): Options;
    toggleOption(option: Option): void;
    toggleAll(): void;
    render(): JSX.Element;
}
export declare class Checkboxes extends BaseCheckboxes {
}
declare const _default: {
    new (props: (Omit<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
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
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Omit<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
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
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<{
        new (props: (Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof Checkboxes>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof Checkboxes, {}> & {
        ComposedComponent: typeof Checkboxes;
    }>;
} & import("hoist-non-react-statics").NonReactStatics<{
    new (props: (Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }) | Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }>): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof Checkboxes>;
} & import("hoist-non-react-statics").NonReactStatics<typeof Checkboxes, {}> & {
    ComposedComponent: typeof Checkboxes;
}, {}> & {
    ComposedComponent: {
        new (props: (Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName"> & Partial<Pick<Omit<BaseCheckboxesProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof Checkboxes>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof Checkboxes, {}> & {
        ComposedComponent: typeof Checkboxes;
    };
};
export default _default;
