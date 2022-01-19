/// <reference types="lodash" />
/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { ThemeProps } from '../theme';
import { LocaleProps } from '../locale';
export interface SearchBoxProps extends ThemeProps, LocaleProps {
    name?: string;
    disabled?: boolean;
    mini?: boolean;
    searchImediately?: boolean;
    onChange?: (text: string) => void;
    placeholder?: string;
    defaultValue?: string;
    value?: string;
    active?: boolean;
    defaultActive?: boolean;
    onActiveChange?: (active: boolean) => void;
    onSearch?: (value: string) => void;
    onCancel?: () => void;
}
export declare class SearchBox extends React.Component<SearchBoxProps> {
    inputRef: React.RefObject<HTMLInputElement>;
    static defaultProps: {
        mini: boolean;
        searchImediately: boolean;
    };
    lazyEmitSearch: import("lodash").DebouncedFunc<() => void>;
    componentWillUnmount(): void;
    handleActive(): void;
    handleCancel(): void;
    handleChange(e: React.ChangeEvent<HTMLInputElement>): void;
    handleSearch(): void;
    handleKeyDown(e: React.KeyboardEvent<any>): void;
    render(): JSX.Element;
}
declare const _default: {
    new (props: (Omit<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
        mini: boolean;
        searchImediately: boolean;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
        mini: boolean;
        searchImediately: boolean;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
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
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Omit<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
        mini: boolean;
        searchImediately: boolean;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
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
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<{
        new (props: (Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof SearchBox>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof SearchBox, {}> & {
        ComposedComponent: typeof SearchBox;
    }>;
} & import("hoist-non-react-statics").NonReactStatics<{
    new (props: (Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
        mini: boolean;
        searchImediately: boolean;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }) | Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
        mini: boolean;
        searchImediately: boolean;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }>): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
        mini: boolean;
        searchImediately: boolean;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof SearchBox>;
} & import("hoist-non-react-statics").NonReactStatics<typeof SearchBox, {}> & {
    ComposedComponent: typeof SearchBox;
}, {}> & {
    ComposedComponent: {
        new (props: (Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
            mini: boolean;
            searchImediately: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "defaultValue" | "disabled" | "name" | "active" | "placeholder" | "onChange" | "onSearch" | "onActiveChange" | "defaultActive" | "onCancel"> & Partial<Pick<Omit<SearchBoxProps, keyof LocaleProps>, "mini" | "searchImediately">> & Partial<Pick<{
                mini: boolean;
                searchImediately: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof SearchBox>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof SearchBox, {}> & {
        ComposedComponent: typeof SearchBox;
    };
};
export default _default;
