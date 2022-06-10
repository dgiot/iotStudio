/// <reference types="hoist-non-react-statics" />
/**
 * 级联多选框，支持无限极。从左侧到右侧一层层点选。
 */
import { BaseCheckboxes, BaseCheckboxesProps } from './Checkboxes';
import React from 'react';
import { Option } from './Select';
export interface ChainedCheckboxesProps extends BaseCheckboxesProps {
    defaultSelectedIndex?: string;
}
export interface ChainedCheckboxesState {
    selected: Array<string>;
}
export declare class ChainedCheckboxes extends BaseCheckboxes<ChainedCheckboxesProps, ChainedCheckboxesState> {
    valueArray: Array<Option>;
    state: ChainedCheckboxesState;
    componentDidMount(): void;
    selectOption(option: Option, depth: number, id: string): void;
    renderOption(option: Option, index: number, depth: number, id: string): JSX.Element;
    render(): JSX.Element;
}
declare const _default: {
    new (props: (Omit<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Omit<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<{
        new (props: (Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof ChainedCheckboxes>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof ChainedCheckboxes, {}> & {
        ComposedComponent: typeof ChainedCheckboxes;
    }>;
} & import("hoist-non-react-statics").NonReactStatics<{
    new (props: (Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }) | Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }>): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof ChainedCheckboxes>;
} & import("hoist-non-react-statics").NonReactStatics<typeof ChainedCheckboxes, {}> & {
    ComposedComponent: typeof ChainedCheckboxes;
}, {}> & {
    ComposedComponent: {
        new (props: (Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "defaultSelectedIndex"> & Partial<Pick<Omit<ChainedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof ChainedCheckboxes>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof ChainedCheckboxes, {}> & {
        ComposedComponent: typeof ChainedCheckboxes;
    };
};
export default _default;
