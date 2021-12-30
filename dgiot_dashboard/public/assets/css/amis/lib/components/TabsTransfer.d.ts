/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { Options, Option } from './Select';
import { TransferProps } from './Transfer';
export interface TabsTransferProps extends Omit<TransferProps, 'selectMode' | 'columns' | 'selectRender' | 'statistics'> {
    cellRender?: (column: {
        name: string;
        label: string;
        [propName: string]: any;
    }, option: Option, colIndex: number, rowIndex: number) => JSX.Element;
}
export declare class TabsTransfer extends React.Component<TabsTransferProps> {
    static defaultProps: {
        itemRender: (option: Option) => JSX.Element;
    };
    renderSearchResult(searchResult: Options | null): JSX.Element;
    renderSelect({ onSearch, onSearchCancel, searchResult }: any): JSX.Element;
    render(): JSX.Element;
}
declare const _default: {
    new (props: (Omit<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
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
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Omit<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
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
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<{
        new (props: (Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof TabsTransfer>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof TabsTransfer, {}> & {
        ComposedComponent: typeof TabsTransfer;
    }>;
} & import("hoist-non-react-statics").NonReactStatics<{
    new (props: (Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }) | Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }>): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof TabsTransfer>;
} & import("hoist-non-react-statics").NonReactStatics<typeof TabsTransfer, {}> & {
    ComposedComponent: typeof TabsTransfer;
}, {}> & {
    ComposedComponent: {
        new (props: (Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "showArrow" | "selectTitle" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TabsTransferProps, keyof import("../locale").LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof TabsTransfer>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof TabsTransfer, {}> & {
        ComposedComponent: typeof TabsTransfer;
    };
};
export default _default;
