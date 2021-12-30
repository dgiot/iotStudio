/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { ThemeProps } from '../theme';
import { LocaleProps } from '../locale';
import Sortable from 'sortablejs';
export interface ArrayInputProps extends ThemeProps, LocaleProps {
    value?: Array<any>;
    onChange?: (value: Array<any>) => void;
    placeholder: string;
    itemRender: (props: {
        value: any;
        onChange: (value: any) => void;
        index: number;
        disabled?: boolean;
    }) => JSX.Element;
    itemInitalValue?: any;
    maxLength?: number;
    minLength?: number;
    disabled?: boolean;
    sortable?: boolean;
    removable?: boolean;
    addable?: boolean;
    editable?: boolean;
    sortTip?: string;
}
export declare class ArrayInput extends React.Component<ArrayInputProps> {
    static defaultProps: {
        placeholder: string;
        itemRender: ({ value, onChange }: {
            value: any;
            onChange: (value: any) => void;
            index: number;
            disabled?: boolean | undefined;
        }) => JSX.Element;
    };
    id: string;
    dragTip?: HTMLElement;
    sortable?: Sortable;
    handleItemOnChange(index: number, itemValue: any): void;
    dragTipRef(ref: any): void;
    handleAdd(): void;
    handleRemove(e: React.MouseEvent<HTMLElement>): void;
    initDragging(): void;
    destroyDragging(): void;
    renderItem(value: any, index: number, collection: Array<any>): JSX.Element;
    render(): JSX.Element;
}
declare const _default: {
    new (props: (Omit<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
        placeholder: string;
        itemRender: ({ value, onChange }: {
            value: any;
            onChange: (value: any) => void;
            index: number;
            disabled?: boolean | undefined;
        }) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
        placeholder: string;
        itemRender: ({ value, onChange }: {
            value: any;
            onChange: (value: any) => void;
            index: number;
            disabled?: boolean | undefined;
        }) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
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
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Omit<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
        placeholder: string;
        itemRender: ({ value, onChange }: {
            value: any;
            onChange: (value: any) => void;
            index: number;
            disabled?: boolean | undefined;
        }) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
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
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<{
        new (props: (Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof ArrayInput>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof ArrayInput, {}> & {
        ComposedComponent: typeof ArrayInput;
    }>;
} & import("hoist-non-react-statics").NonReactStatics<{
    new (props: (Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
        placeholder: string;
        itemRender: ({ value, onChange }: {
            value: any;
            onChange: (value: any) => void;
            index: number;
            disabled?: boolean | undefined;
        }) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }) | Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
        placeholder: string;
        itemRender: ({ value, onChange }: {
            value: any;
            onChange: (value: any) => void;
            index: number;
            disabled?: boolean | undefined;
        }) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }>): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
        placeholder: string;
        itemRender: ({ value, onChange }: {
            value: any;
            onChange: (value: any) => void;
            index: number;
            disabled?: boolean | undefined;
        }) => JSX.Element;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof ArrayInput>;
} & import("hoist-non-react-statics").NonReactStatics<typeof ArrayInput, {}> & {
    ComposedComponent: typeof ArrayInput;
}, {}> & {
    ComposedComponent: {
        new (props: (Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
            placeholder: string;
            itemRender: ({ value, onChange }: {
                value: any;
                onChange: (value: any) => void;
                index: number;
                disabled?: boolean | undefined;
            }) => JSX.Element;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "disabled" | "maxLength" | "minLength" | "onChange" | "editable" | "removable" | "sortable" | "itemInitalValue" | "addable" | "sortTip"> & Partial<Pick<Omit<ArrayInputProps, keyof LocaleProps>, "placeholder" | "itemRender">> & Partial<Pick<{
                placeholder: string;
                itemRender: ({ value, onChange }: {
                    value: any;
                    onChange: (value: any) => void;
                    index: number;
                    disabled?: boolean | undefined;
                }) => JSX.Element;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof ArrayInput>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof ArrayInput, {}> & {
        ComposedComponent: typeof ArrayInput;
    };
};
export default _default;
