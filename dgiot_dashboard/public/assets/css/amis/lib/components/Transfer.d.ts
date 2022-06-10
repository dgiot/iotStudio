/// <reference types="lodash" />
/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { ThemeProps } from '../theme';
import { BaseCheckboxesProps } from './Checkboxes';
import { Options, Option } from './Select';
import { LocaleProps } from '../locale';
export interface TransferProps extends ThemeProps, LocaleProps, BaseCheckboxesProps {
    inline?: boolean;
    statistics?: boolean;
    showArrow?: boolean;
    selectTitle?: string;
    selectMode?: 'table' | 'list' | 'tree' | 'chained' | 'associated';
    columns?: Array<{
        name: string;
        label: string;
        [propName: string]: any;
    }>;
    cellRender?: (column: {
        name: string;
        label: string;
        [propName: string]: any;
    }, option: Option, colIndex: number, rowIndex: number) => JSX.Element;
    leftOptions?: Array<Option>;
    leftMode?: 'tree' | 'list';
    leftDefaultValue?: any;
    rightMode?: 'table' | 'list' | 'tree' | 'chained';
    searchResultMode?: 'table' | 'list' | 'tree' | 'chained';
    searchResultColumns?: Array<{
        name: string;
        label: string;
        [propName: string]: any;
    }>;
    searchPlaceholder?: string;
    noResultsText?: string;
    onSearch?: (term: string, setCancel: (cancel: () => void) => void) => Promise<Options | void>;
    selectRender?: (props: Omit<TransferProps, 'onSearch'> & {
        onSearch: (text: string) => void;
        onSearchCancel: () => void;
        searchResult: Options | null;
    }) => JSX.Element;
    resultTitle?: string;
    optionItemRender?: (option: Option) => JSX.Element;
    resultItemRender?: (option: Option) => JSX.Element;
    sortable?: boolean;
}
export interface TransferState {
    inputValue: string;
    searchResult: Options | null;
}
export declare class Transfer extends React.Component<TransferProps, TransferState> {
    static defaultProps: {
        itemRender: (option: Option) => JSX.Element;
    };
    state: {
        inputValue: string;
        searchResult: null;
    };
    valueArray: Options;
    availableOptions: Options;
    unmounted: boolean;
    cancelSearch?: () => void;
    componentWillUnmount(): void;
    toggleAll(): void;
    clearAll(): void;
    handleSearchKeyDown(e: React.KeyboardEvent<any>): void;
    handleSearch(text: string): void;
    handleSeachCancel(): void;
    lazySearch: import("lodash").DebouncedFunc<(text: string) => void>;
    renderSelect(): JSX.Element;
    renderSearchResult(): JSX.Element;
    renderOptions(): JSX.Element;
    render(): JSX.Element;
}
declare const _default: {
    new (props: (Omit<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
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
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Omit<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
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
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<{
        new (props: (Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof Transfer>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof Transfer, {}> & {
        ComposedComponent: typeof Transfer;
    }>;
} & import("hoist-non-react-statics").NonReactStatics<{
    new (props: (Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }) | Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }>): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
        itemRender: (option: Option) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof Transfer>;
} & import("hoist-non-react-statics").NonReactStatics<typeof Transfer, {}> & {
    ComposedComponent: typeof Transfer;
}, {}> & {
    ComposedComponent: {
        new (props: (Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
            itemRender: (option: Option) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<TransferProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "columns" | "disabled" | "options" | "inline" | "placeholder" | "onChange" | "labelClassName" | "onDeferLoad" | "option2value" | "itemClassName" | "sortable" | "cellRender" | "leftOptions" | "leftDefaultValue" | "leftMode" | "rightMode" | "onSearch" | "statistics" | "showArrow" | "selectTitle" | "selectMode" | "searchResultMode" | "searchResultColumns" | "searchPlaceholder" | "noResultsText" | "selectRender" | "resultTitle" | "optionItemRender" | "resultItemRender"> & Partial<Pick<Omit<TransferProps, keyof LocaleProps>, "itemRender">> & Partial<Pick<{
                itemRender: (option: Option) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof Transfer>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof Transfer, {}> & {
        ComposedComponent: typeof Transfer;
    };
};
export default _default;
