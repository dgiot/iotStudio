/// <reference types="hoist-non-react-statics" />
import { ThemeProps } from '../theme';
import React from 'react';
import { Options, Option } from './Select';
import { LocaleProps } from '../locale';
export interface ListMenuProps extends ThemeProps, LocaleProps {
    options: Options;
    disabled?: boolean;
    selectedOptions?: Options;
    highlightIndex?: number | null;
    onSelect?: (e: any, option: Option) => void;
    placeholder: string;
    itemRender: (option: Option) => JSX.Element;
    getItemProps: (props: {
        item: Option;
        index: number;
    }) => any;
    prefix?: JSX.Element;
}
interface RenderResult {
    items: Array<JSX.Element>;
    index: number;
}
export declare class ListMenu extends React.Component<ListMenuProps> {
    static defaultProps: {
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
        getItemProps: (props: {
            item: Option;
            index: number;
        }) => null;
    };
    renderItem(result: RenderResult, option: Option, optionIndex: number): RenderResult;
    render(): JSX.Element;
}
declare const _default: {
    new (props: (Omit<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
        getItemProps: (props: {
            item: Option;
            index: number;
        }) => null;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
        getItemProps: (props: {
            item: Option;
            index: number;
        }) => null;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
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
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Omit<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
        getItemProps: (props: {
            item: Option;
            index: number;
        }) => null;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
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
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<{
        new (props: (Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof ListMenu>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof ListMenu, {}> & {
        ComposedComponent: typeof ListMenu;
    }>;
} & import("hoist-non-react-statics").NonReactStatics<{
    new (props: (Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
        getItemProps: (props: {
            item: Option;
            index: number;
        }) => null;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }) | Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
        getItemProps: (props: {
            item: Option;
            index: number;
        }) => null;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }>): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
        getItemProps: (props: {
            item: Option;
            index: number;
        }) => null;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof ListMenu>;
} & import("hoist-non-react-statics").NonReactStatics<typeof ListMenu, {}> & {
    ComposedComponent: typeof ListMenu;
}, {}> & {
    ComposedComponent: {
        new (props: (Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
            getItemProps: (props: {
                item: Option;
                index: number;
            }) => null;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ListMenuProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "options" | "selectedOptions" | "prefix" | "onSelect" | "highlightIndex"> & Partial<Pick<Omit<ListMenuProps, keyof LocaleProps>, "placeholder" | "itemRender" | "getItemProps">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
                getItemProps: (props: {
                    item: Option;
                    index: number;
                }) => null;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof ListMenu>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof ListMenu, {}> & {
        ComposedComponent: typeof ListMenu;
    };
};
export default _default;
