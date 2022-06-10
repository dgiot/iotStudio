/// <reference types="hoist-non-react-statics" />
/**
 * 用来显示选择结果，垂直显示。支持移出、排序等操作。
 */
import React from 'react';
import { Option } from './Select';
import { ThemeProps } from '../theme';
import Sortable from 'sortablejs';
import { LocaleProps } from '../locale';
export interface ResultListProps extends ThemeProps, LocaleProps {
    className?: string;
    value?: Array<Option>;
    onChange?: (value: Array<Option>) => void;
    sortable?: boolean;
    disabled?: boolean;
    title?: string;
    placeholder: string;
    itemRender: (option: Option) => JSX.Element;
    itemClassName?: string;
}
export declare class ResultList extends React.Component<ResultListProps> {
    static defaultProps: Pick<ResultListProps, 'placeholder' | 'itemRender'>;
    id: string;
    sortable?: Sortable;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    handleRemove(e: React.MouseEvent<HTMLElement>): void;
    initSortable(): void;
    desposeSortable(): void;
    render(): JSX.Element;
}
declare const _default: {
    new (props: (Omit<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
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
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Omit<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
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
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<{
        new (props: (Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof ResultList>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof ResultList, {}> & {
        ComposedComponent: typeof ResultList;
    }>;
} & import("hoist-non-react-statics").NonReactStatics<{
    new (props: (Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }) | Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }>): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof ResultList>;
} & import("hoist-non-react-statics").NonReactStatics<typeof ResultList, {}> & {
    ComposedComponent: typeof ResultList;
}, {}> & {
    ComposedComponent: {
        new (props: (Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ResultListProps, keyof LocaleProps>, "classPrefix" | "classnames" | "title" | "className" | "theme" | "value" | "disabled" | "onChange" | "itemClassName" | "sortable"> & Partial<Pick<Omit<ResultListProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<Pick<ResultListProps, "placeholder" | "itemRender">, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof ResultList>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof ResultList, {}> & {
        ComposedComponent: typeof ResultList;
    };
};
export default _default;
