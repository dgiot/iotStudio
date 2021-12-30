/**
 * 关联多选框，仅支持两层关联选择。
 * 左边先点选，然后右边再次点选。
 * 可以满足，先从 tree 中选中一个元素，然后查出来一个列表再次勾选。
 */
/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { BaseCheckboxesProps, BaseCheckboxes } from './Checkboxes';
import { Options, Option } from './Select';
export interface AssociatedCheckboxesProps extends BaseCheckboxesProps {
    leftOptions: Options;
    leftDefaultValue?: any;
    leftMode?: 'tree' | 'list';
    rightMode?: 'table' | 'list' | 'tree' | 'chained';
    columns?: Array<any>;
    cellRender?: (column: {
        name: string;
        label: string;
        [propName: string]: any;
    }, option: Option, colIndex: number, rowIndex: number) => JSX.Element;
}
export interface AssociatedCheckboxesState {
    leftValue?: Option;
}
export declare class AssociatedCheckboxes extends BaseCheckboxes<AssociatedCheckboxesProps, AssociatedCheckboxesState> {
    state: AssociatedCheckboxesState;
    componentDidMount(): void;
    leftOption2Value(option: Option): any;
    handleLeftSelect(value: Option): void;
    handleRetry(option: Option): void;
    render(): JSX.Element;
}
declare const _default: {
    new (props: (Omit<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
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
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Omit<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
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
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
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
        new (props: (Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof AssociatedCheckboxes>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof AssociatedCheckboxes, {}> & {
        ComposedComponent: typeof AssociatedCheckboxes;
    }>;
} & import("hoist-non-react-statics").NonReactStatics<{
    new (props: (Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }) | Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }>): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
        placeholder: string;
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof AssociatedCheckboxes>;
} & import("hoist-non-react-statics").NonReactStatics<typeof AssociatedCheckboxes, {}> & {
    ComposedComponent: typeof AssociatedCheckboxes;
}, {}> & {
    ComposedComponent: {
        new (props: (Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode"> & Partial<Pick<Omit<AssociatedCheckboxesProps, keyof import("../locale").LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof AssociatedCheckboxes>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof AssociatedCheckboxes, {}> & {
        ComposedComponent: typeof AssociatedCheckboxes;
    };
};
export default _default;
