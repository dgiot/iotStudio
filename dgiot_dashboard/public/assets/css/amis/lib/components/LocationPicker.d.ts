/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { ThemeProps } from '../theme';
import { LocaleProps } from '../locale';
export interface LocationProps extends ThemeProps, LocaleProps {
    vendor: 'baidu' | 'gaode' | 'tenxun';
    coordinatesType: 'bd09' | 'gcj02';
    placeholder: string;
    clearable: boolean;
    ak: string;
    value?: {
        address: string;
        lat: number;
        lng: number;
        city?: string;
    };
    disabled?: boolean;
    className?: string;
    popoverClassName?: string;
    onChange: (value: any) => void;
    popOverContainer?: any;
}
export interface LocationState {
    isFocused: boolean;
    isOpened: boolean;
}
export declare class LocationPicker extends React.Component<LocationProps, LocationState> {
    static defaultProps: {
        placeholder: string;
        clearable: boolean;
    };
    domRef: React.RefObject<HTMLDivElement>;
    state: {
        isFocused: boolean;
        isOpened: boolean;
    };
    handleKeyPress(e: React.KeyboardEvent): void;
    handleFocus(): void;
    handleBlur(): void;
    handleClick(): void;
    getTarget(): HTMLDivElement | null;
    getParent(): HTMLElement | null | undefined;
    open(fn?: () => void): void;
    close(): void;
    clearValue(e: React.MouseEvent<any>): void;
    handlePopOverClick(e: React.MouseEvent<any>): void;
    handleChange(value: any): void;
    render(): JSX.Element;
}
declare const ThemedCity: {
    new (props: (Omit<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
        placeholder: string;
        clearable: boolean;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
        placeholder: string;
        clearable: boolean;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
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
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Omit<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
        placeholder: string;
        clearable: boolean;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
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
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<{
        new (props: (Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof LocationPicker>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof LocationPicker, {}> & {
        ComposedComponent: typeof LocationPicker;
    }>;
} & import("hoist-non-react-statics").NonReactStatics<{
    new (props: (Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
        placeholder: string;
        clearable: boolean;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }) | Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
        placeholder: string;
        clearable: boolean;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }>): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
        placeholder: string;
        clearable: boolean;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof LocationPicker>;
} & import("hoist-non-react-statics").NonReactStatics<typeof LocationPicker, {}> & {
    ComposedComponent: typeof LocationPicker;
}, {}> & {
    ComposedComponent: {
        new (props: (Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
            placeholder: string;
            clearable: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<LocationProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "onChange" | "popoverClassName" | "popOverContainer" | "vendor" | "ak" | "coordinatesType"> & Partial<Pick<Omit<LocationProps, keyof LocaleProps>, "placeholder" | "clearable">> & Partial<Pick<{
                placeholder: string;
                clearable: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof LocationPicker>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof LocationPicker, {}> & {
        ComposedComponent: typeof LocationPicker;
    };
};
export default ThemedCity;
