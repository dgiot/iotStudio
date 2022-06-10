/// <reference types="hoist-non-react-statics" />
import { ThemeProps } from '../theme';
import React from 'react';
import { Option, Options } from './Select';
import { LocaleProps } from '../locale';
export interface BaseRadiosProps extends ThemeProps, LocaleProps {
    options: Options;
    className?: string;
    placeholder: string;
    value?: any;
    onChange?: (value: any) => void;
    onDeferLoad?: (option: Option) => void;
    option2value?: (option: Option) => any;
    itemClassName?: string;
    itemRender: (option: Option) => JSX.Element;
    disabled?: boolean;
    clearable?: boolean;
    showRadio?: boolean;
    onClick?: (e: React.MouseEvent) => void;
}
export declare class BaseRadios<T extends BaseRadiosProps = BaseRadiosProps, S = {}> extends React.Component<T, S> {
    selected: Option | undefined | null;
    static defaultProps: {
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
    };
    static resolveSelected(value: any, options: Options, option2value?: (option: Option) => any): Option | null;
    toggleOption(option: Option): void;
    renderOption(option: Option, index: number): JSX.Element;
    render(): JSX.Element;
}
export declare class ListRadios extends BaseRadios {
}
declare const themedListRadios: {
    new (props: (Omit<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
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
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Omit<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
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
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
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
        new (props: (Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof ListRadios>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof ListRadios, {}> & {
        ComposedComponent: typeof ListRadios;
    }>;
} & import("hoist-non-react-statics").NonReactStatics<{
    new (props: (Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }) | Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }>): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof ListRadios>;
} & import("hoist-non-react-statics").NonReactStatics<typeof ListRadios, {}> & {
    ComposedComponent: typeof ListRadios;
}, {}> & {
    ComposedComponent: {
        new (props: (Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onClick" | "options" | "onChange" | "onDeferLoad" | "option2value" | "itemClassName" | "clearable" | "showRadio"> & Partial<Pick<Omit<BaseRadiosProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof ListRadios>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof ListRadios, {}> & {
        ComposedComponent: typeof ListRadios;
    };
};
export default themedListRadios;
