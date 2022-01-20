/**
 * @file Select
 * @description
 * @author fex
 * @date 2017-11-07
 */
/// <reference types="hoist-non-react-statics" />
/// <reference types="lodash" />
import React from 'react';
import { ControllerStateAndHelpers } from 'downshift';
import { ThemeProps } from '../theme';
import { Api } from '../types';
import { LocaleProps } from '../locale';
import { Option, Options } from '../Schema';
import { RemoteOptionsProps } from './WithRemoteConfig';
export { Option, Options };
export interface OptionProps {
    className?: string;
    multi?: boolean;
    multiple?: boolean;
    valueField?: string;
    labelField?: string;
    simpleValue?: boolean;
    options: Options;
    loading?: boolean;
    joinValues?: boolean;
    extractValue?: boolean;
    delimiter?: string;
    clearable?: boolean;
    resetValue: any;
    placeholder?: string;
    disabled?: boolean;
    creatable?: boolean;
    pathSeparator?: string;
    onAdd?: (idx?: number | Array<number>, value?: any, skipForm?: boolean) => void;
    editable?: boolean;
    onEdit?: (value: Option, origin?: Option, skipForm?: boolean) => void;
    removable?: boolean;
    onDelete?: (value: Option) => void;
}
export declare type OptionValue = string | number | null | undefined | Option;
export declare function value2array(value: OptionValue | Array<OptionValue>, props: Pick<OptionProps, 'multi' | 'multiple' | 'delimiter' | 'valueField' | 'labelField' | 'options' | 'pathSeparator'>, enableNodePath?: boolean): Array<Option>;
export declare function expandValue(value: OptionValue, options: Options, valueField?: string): Option | null;
export declare function matchOptionValue(a: OptionValue, b: Option, valueField?: string): boolean;
export declare function optionValueCompare(a: OptionValue, valueField?: string): (b: Option) => boolean;
export declare function normalizeOptions(options: string | {
    [propName: string]: string;
} | Array<string> | Options, share?: {
    values: Array<any>;
    options: Array<any>;
}): Options;
interface SelectProps extends OptionProps, ThemeProps, LocaleProps {
    className?: string;
    popoverClassName?: string;
    creatable: boolean;
    createBtnLabel: string;
    multiple: boolean;
    valuesNoWrap?: boolean;
    valueField: string;
    labelField: string;
    renderMenu?: (item: Option, states: {
        index: number;
        multiple?: boolean;
        checkAll?: boolean;
        checked: boolean;
        onChange: () => void;
        inputValue?: string;
        searchable?: boolean;
    }) => JSX.Element;
    searchable?: boolean;
    options: Array<Option>;
    value: any;
    loadOptions?: Function;
    searchPromptText: string;
    loadingPlaceholder: string;
    spinnerClassName?: string;
    noResultsText: string;
    clearable: boolean;
    clearAllText: string;
    clearValueText: string;
    placeholder: string;
    inline: boolean;
    disabled: boolean;
    popOverContainer?: any;
    overlayPlacement?: string;
    onChange: (value: void | string | Option | Array<Option>) => void;
    onFocus?: Function;
    onBlur?: Function;
    checkAll?: boolean;
    checkAllLabel?: string;
    checkAllBySearch?: boolean;
    defaultCheckAll?: boolean;
    simpleValue?: boolean;
    defaultOpen?: boolean;
    /**
     * 边框模式，全边框，还是半边框，或者没边框。
     */
    borderMode?: 'full' | 'half' | 'none';
    /**
     * 是否隐藏已选项
     */
    hideSelected?: boolean;
}
interface SelectState {
    itemHeight: number;
    isOpen: boolean;
    isFocused: boolean;
    inputValue: string;
    highlightedIndex: number;
    selection: Array<Option>;
}
export declare class Select extends React.Component<SelectProps, SelectState> {
    static defaultProps: {
        multiple: boolean;
        clearable: boolean;
        creatable: boolean;
        createBtnLabel: string;
        searchPromptText: string;
        loadingPlaceholder: string;
        noResultsText: string;
        clearAllText: string;
        clearValueText: string;
        placeholder: string;
        valueField: string;
        labelField: string;
        resetValue: string;
        inline: boolean;
        disabled: boolean;
        checkAll: boolean;
        checkAllLabel: string;
        defaultCheckAll: boolean;
        overlayPlacement: string;
    };
    input: HTMLInputElement;
    target: HTMLElement;
    menu: React.RefObject<HTMLDivElement>;
    constructor(props: SelectProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: SelectProps): void;
    open(): void;
    close(): void;
    toggle(e?: React.MouseEvent<HTMLDivElement>): void;
    onFocus(e: any): void;
    onBlur(e: any): void;
    focus(): void;
    blur(): void;
    getTarget(): HTMLElement;
    inputRef(ref: HTMLInputElement): void;
    toggleCheckAll(): void;
    removeItem(index: number, e?: React.MouseEvent<HTMLElement>): void;
    handleInputChange(evt: React.ChangeEvent<HTMLInputElement>): void;
    handleChange(selectItem: any): void;
    handleStateChange(changes: any): void;
    handleKeyPress(e: React.KeyboardEvent): void;
    clearValue(e: React.MouseEvent<any>): void;
    clearSearchValue(): void;
    handleAddClick(): void;
    handleEditClick(e: Event, item: any): void;
    handleDeleteClick(e: Event, item: any): void;
    menuItemRef(ref: any): void;
    renderValue({ inputValue, isOpen }: ControllerStateAndHelpers<any>): JSX.Element | (string | JSX.Element)[];
    renderOuter({ selectedItem, getItemProps, highlightedIndex, inputValue, isOpen, getToggleButtonProps, getInputProps }: ControllerStateAndHelpers<any>): JSX.Element;
    render(): JSX.Element;
}
declare const EnhancedSelect: {
    new (props: (Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
        multiple: boolean;
        clearable: boolean;
        creatable: boolean;
        createBtnLabel: string;
        searchPromptText: string;
        loadingPlaceholder: string;
        noResultsText: string;
        clearAllText: string;
        clearValueText: string;
        placeholder: string;
        valueField: string;
        labelField: string;
        resetValue: string;
        inline: boolean;
        disabled: boolean;
        checkAll: boolean;
        checkAllLabel: string;
        defaultCheckAll: boolean;
        overlayPlacement: string;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
        multiple: boolean;
        clearable: boolean;
        creatable: boolean;
        createBtnLabel: string;
        searchPromptText: string;
        loadingPlaceholder: string;
        noResultsText: string;
        clearAllText: string;
        clearValueText: string;
        placeholder: string;
        valueField: string;
        labelField: string;
        resetValue: string;
        inline: boolean;
        disabled: boolean;
        checkAll: boolean;
        checkAllLabel: string;
        defaultCheckAll: boolean;
        overlayPlacement: string;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
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
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
        multiple: boolean;
        clearable: boolean;
        creatable: boolean;
        createBtnLabel: string;
        searchPromptText: string;
        loadingPlaceholder: string;
        noResultsText: string;
        clearAllText: string;
        clearValueText: string;
        placeholder: string;
        valueField: string;
        labelField: string;
        resetValue: string;
        inline: boolean;
        disabled: boolean;
        checkAll: boolean;
        checkAllLabel: string;
        defaultCheckAll: boolean;
        overlayPlacement: string;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
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
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<{
        new (props: (Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof Select>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof Select, {}> & {
        ComposedComponent: typeof Select;
    }>;
} & import("hoist-non-react-statics").NonReactStatics<{
    new (props: (Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
        multiple: boolean;
        clearable: boolean;
        creatable: boolean;
        createBtnLabel: string;
        searchPromptText: string;
        loadingPlaceholder: string;
        noResultsText: string;
        clearAllText: string;
        clearValueText: string;
        placeholder: string;
        valueField: string;
        labelField: string;
        resetValue: string;
        inline: boolean;
        disabled: boolean;
        checkAll: boolean;
        checkAllLabel: string;
        defaultCheckAll: boolean;
        overlayPlacement: string;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }) | Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
        multiple: boolean;
        clearable: boolean;
        creatable: boolean;
        createBtnLabel: string;
        searchPromptText: string;
        loadingPlaceholder: string;
        noResultsText: string;
        clearAllText: string;
        clearValueText: string;
        placeholder: string;
        valueField: string;
        labelField: string;
        resetValue: string;
        inline: boolean;
        disabled: boolean;
        checkAll: boolean;
        checkAllLabel: string;
        defaultCheckAll: boolean;
        overlayPlacement: string;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }>): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
        multiple: boolean;
        clearable: boolean;
        creatable: boolean;
        createBtnLabel: string;
        searchPromptText: string;
        loadingPlaceholder: string;
        noResultsText: string;
        clearAllText: string;
        clearValueText: string;
        placeholder: string;
        valueField: string;
        labelField: string;
        resetValue: string;
        inline: boolean;
        disabled: boolean;
        checkAll: boolean;
        checkAllLabel: string;
        defaultCheckAll: boolean;
        overlayPlacement: string;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof Select>;
} & import("hoist-non-react-statics").NonReactStatics<typeof Select, {}> & {
    ComposedComponent: typeof Select;
}, {}> & {
    ComposedComponent: {
        new (props: (Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof Select>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof Select, {}> & {
        ComposedComponent: typeof Select;
    };
};
export default EnhancedSelect;
export declare const SelectWithRemoteOptions: {
    new (props: Omit<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
        multiple: boolean;
        clearable: boolean;
        creatable: boolean;
        createBtnLabel: string;
        searchPromptText: string;
        loadingPlaceholder: string;
        noResultsText: string;
        clearAllText: string;
        clearValueText: string;
        placeholder: string;
        valueField: string;
        labelField: string;
        resetValue: string;
        inline: boolean;
        disabled: boolean;
        checkAll: boolean;
        checkAllLabel: string;
        defaultCheckAll: boolean;
        overlayPlacement: string;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
        store: {
            fetching: boolean;
            errorMsg: string;
            config: any;
            data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
        } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
            setComponent(c: any): void;
            load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
            setData(data: any): void;
            setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
        } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
            fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
            config: import("mobx-state-tree").IType<any, any, any>;
            data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
        }, {
            setComponent(c: any): void;
            load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
            setData(data: any): void;
            setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
    }, "store"> | Readonly<Omit<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
        multiple: boolean;
        clearable: boolean;
        creatable: boolean;
        createBtnLabel: string;
        searchPromptText: string;
        loadingPlaceholder: string;
        noResultsText: string;
        clearAllText: string;
        clearValueText: string;
        placeholder: string;
        valueField: string;
        labelField: string;
        resetValue: string;
        inline: boolean;
        disabled: boolean;
        checkAll: boolean;
        checkAllLabel: string;
        defaultCheckAll: boolean;
        overlayPlacement: string;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
        store: {
            fetching: boolean;
            errorMsg: string;
            config: any;
            data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
        } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
            setComponent(c: any): void;
            load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
            setData(data: any): void;
            setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
        } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
            fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
            config: import("mobx-state-tree").IType<any, any, any>;
            data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
        }, {
            setComponent(c: any): void;
            load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
            setData(data: any): void;
            setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
    }, "store">>): {
        ref: any;
        store?: ({
            fetching: boolean;
            errorMsg: string;
            config: any;
            data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
        } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
            setComponent(c: any): void;
            load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
            setData(data: any): void;
            setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
        } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
            fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
            config: import("mobx-state-tree").IType<any, any, any>;
            data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
        }, {
            setComponent(c: any): void;
            load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
            setData(data: any): void;
            setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>) | undefined;
        refFn: (ref: any) => void;
        componentWillUnmount(): void;
        getWrappedInstance(): any;
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
            store: {
                fetching: boolean;
                errorMsg: string;
                config: any;
                data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                config: import("mobx-state-tree").IType<any, any, any>;
                data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
            }, {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        }, "store">>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
            store: {
                fetching: boolean;
                errorMsg: string;
                config: any;
                data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                config: import("mobx-state-tree").IType<any, any, any>;
                data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
            }, {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        }, "store">> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
            store: {
                fetching: boolean;
                errorMsg: string;
                config: any;
                data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                config: import("mobx-state-tree").IType<any, any, any>;
                data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
            }, {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        }, "store">>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
            store: {
                fetching: boolean;
                errorMsg: string;
                config: any;
                data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                config: import("mobx-state-tree").IType<any, any, any>;
                data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
            }, {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        }, "store">>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
            store: {
                fetching: boolean;
                errorMsg: string;
                config: any;
                data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                config: import("mobx-state-tree").IType<any, any, any>;
                data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
            }, {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        }, "store">>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
            store: {
                fetching: boolean;
                errorMsg: string;
                config: any;
                data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                config: import("mobx-state-tree").IType<any, any, any>;
                data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
            }, {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        }, "store">>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
            store: {
                fetching: boolean;
                errorMsg: string;
                config: any;
                data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                config: import("mobx-state-tree").IType<any, any, any>;
                data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
            }, {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        }, "store">>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
            store: {
                fetching: boolean;
                errorMsg: string;
                config: any;
                data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                config: import("mobx-state-tree").IType<any, any, any>;
                data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
            }, {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        }, "store">>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
            store: {
                fetching: boolean;
                errorMsg: string;
                config: any;
                data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                config: import("mobx-state-tree").IType<any, any, any>;
                data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
            }, {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        }, "store">>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Omit<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
        multiple: boolean;
        clearable: boolean;
        creatable: boolean;
        createBtnLabel: string;
        searchPromptText: string;
        loadingPlaceholder: string;
        noResultsText: string;
        clearAllText: string;
        clearValueText: string;
        placeholder: string;
        valueField: string;
        labelField: string;
        resetValue: string;
        inline: boolean;
        disabled: boolean;
        checkAll: boolean;
        checkAllLabel: string;
        defaultCheckAll: boolean;
        overlayPlacement: string;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
        store: {
            fetching: boolean;
            errorMsg: string;
            config: any;
            data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
        } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
            setComponent(c: any): void;
            load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
            setData(data: any): void;
            setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
        } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
            fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
            config: import("mobx-state-tree").IType<any, any, any>;
            data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
        }, {
            setComponent(c: any): void;
            load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
            setData(data: any): void;
            setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
    }, "store">, context: any): {
        ref: any;
        store?: ({
            fetching: boolean;
            errorMsg: string;
            config: any;
            data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
        } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
            setComponent(c: any): void;
            load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
            setData(data: any): void;
            setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
        } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
            fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
            config: import("mobx-state-tree").IType<any, any, any>;
            data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
        }, {
            setComponent(c: any): void;
            load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
            setData(data: any): void;
            setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>) | undefined;
        refFn: (ref: any) => void;
        componentWillUnmount(): void;
        getWrappedInstance(): any;
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
            store: {
                fetching: boolean;
                errorMsg: string;
                config: any;
                data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                config: import("mobx-state-tree").IType<any, any, any>;
                data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
            }, {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        }, "store">>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
            store: {
                fetching: boolean;
                errorMsg: string;
                config: any;
                data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                config: import("mobx-state-tree").IType<any, any, any>;
                data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
            }, {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        }, "store">> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
            store: {
                fetching: boolean;
                errorMsg: string;
                config: any;
                data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                config: import("mobx-state-tree").IType<any, any, any>;
                data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
            }, {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        }, "store">>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
            store: {
                fetching: boolean;
                errorMsg: string;
                config: any;
                data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                config: import("mobx-state-tree").IType<any, any, any>;
                data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
            }, {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        }, "store">>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
            store: {
                fetching: boolean;
                errorMsg: string;
                config: any;
                data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                config: import("mobx-state-tree").IType<any, any, any>;
                data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
            }, {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        }, "store">>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
            store: {
                fetching: boolean;
                errorMsg: string;
                config: any;
                data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                config: import("mobx-state-tree").IType<any, any, any>;
                data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
            }, {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        }, "store">>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
            store: {
                fetching: boolean;
                errorMsg: string;
                config: any;
                data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                config: import("mobx-state-tree").IType<any, any, any>;
                data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
            }, {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        }, "store">>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
            store: {
                fetching: boolean;
                errorMsg: string;
                config: any;
                data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                config: import("mobx-state-tree").IType<any, any, any>;
                data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
            }, {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        }, "store">>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
            store: {
                fetching: boolean;
                errorMsg: string;
                config: any;
                data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                config: import("mobx-state-tree").IType<any, any, any>;
                data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
            }, {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        }, "store">>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    ComposedComponent: React.ComponentType<{
        new (props: Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
            store: {
                fetching: boolean;
                errorMsg: string;
                config: any;
                data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                config: import("mobx-state-tree").IType<any, any, any>;
                data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
            }, {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        }): {
            toDispose: (() => void)[];
            loadOptions: import("lodash").DebouncedFunc<any>;
            componentDidMount(): void;
            componentDidUpdate(prevProps: any): void;
            componentWillUnmount(): void;
            loadConfig(ctx?: any): Promise<void>;
            loadAutoComplete(input: string): Promise<any>;
            setConfig(value: any, ctx?: any): void;
            syncConfig(): void;
            deferLoadConfig(item: any): Promise<void>;
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
                store: {
                    fetching: boolean;
                    errorMsg: string;
                    config: any;
                    data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
                } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                    fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                    errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    config: import("mobx-state-tree").IType<any, any, any>;
                    data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
                }, {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
                store: {
                    fetching: boolean;
                    errorMsg: string;
                    config: any;
                    data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
                } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                    fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                    errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    config: import("mobx-state-tree").IType<any, any, any>;
                    data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
                }, {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
            }> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<{}>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            shouldComponentUpdate?(nextProps: Readonly<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
                store: {
                    fetching: boolean;
                    errorMsg: string;
                    config: any;
                    data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
                } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                    fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                    errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    config: import("mobx-state-tree").IType<any, any, any>;
                    data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
                }, {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
                store: {
                    fetching: boolean;
                    errorMsg: string;
                    config: any;
                    data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
                } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                    fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                    errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    config: import("mobx-state-tree").IType<any, any, any>;
                    data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
                }, {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
            }>, prevState: Readonly<{}>): any;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
                store: {
                    fetching: boolean;
                    errorMsg: string;
                    config: any;
                    data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
                } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                    fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                    errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    config: import("mobx-state-tree").IType<any, any, any>;
                    data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
                }, {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
                store: {
                    fetching: boolean;
                    errorMsg: string;
                    config: any;
                    data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
                } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                    fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                    errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    config: import("mobx-state-tree").IType<any, any, any>;
                    data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
                }, {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
                store: {
                    fetching: boolean;
                    errorMsg: string;
                    config: any;
                    data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
                } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                    fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                    errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    config: import("mobx-state-tree").IType<any, any, any>;
                    data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
                }, {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
                store: {
                    fetching: boolean;
                    errorMsg: string;
                    config: any;
                    data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
                } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                    fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                    errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    config: import("mobx-state-tree").IType<any, any, any>;
                    data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
                }, {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        ComposedComponent: React.ComponentType<{
            new (props: (RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>): {
                render(): JSX.Element;
                context: any;
                setState<K_2 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K_2> | null) | Pick<{}, K_2> | null, callback?: (() => void) | undefined): void;
                forceUpdate(callback?: (() => void) | undefined): void;
                readonly props: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
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
                shouldComponentUpdate?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
                componentWillUnmount?(): void;
                componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                getSnapshotBeforeUpdate?(prevProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
                componentDidUpdate?(prevProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
                componentWillMount?(): void;
                UNSAFE_componentWillMount?(): void;
                componentWillReceiveProps?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
                UNSAFE_componentWillReceiveProps?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
                componentWillUpdate?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
                UNSAFE_componentWillUpdate?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
            };
            new (props: RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
                render(): JSX.Element;
                context: any;
                setState<K_2 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K_2> | null) | Pick<{}, K_2> | null, callback?: (() => void) | undefined): void;
                forceUpdate(callback?: (() => void) | undefined): void;
                readonly props: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
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
                shouldComponentUpdate?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
                componentWillUnmount?(): void;
                componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                getSnapshotBeforeUpdate?(prevProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
                componentDidUpdate?(prevProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
                componentWillMount?(): void;
                UNSAFE_componentWillMount?(): void;
                componentWillReceiveProps?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
                UNSAFE_componentWillReceiveProps?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
                componentWillUpdate?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
                UNSAFE_componentWillUpdate?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
            };
            contextType?: React.Context<any> | undefined;
        }>;
        contextType: React.Context<void | import("../env").RendererEnv>;
    }>;
    contextType?: React.Context<any> | undefined;
} & import("hoist-non-react-statics").NonReactStatics<{
    new (props: Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
        multiple: boolean;
        clearable: boolean;
        creatable: boolean;
        createBtnLabel: string;
        searchPromptText: string;
        loadingPlaceholder: string;
        noResultsText: string;
        clearAllText: string;
        clearValueText: string;
        placeholder: string;
        valueField: string;
        labelField: string;
        resetValue: string;
        inline: boolean;
        disabled: boolean;
        checkAll: boolean;
        checkAllLabel: string;
        defaultCheckAll: boolean;
        overlayPlacement: string;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
        store: {
            fetching: boolean;
            errorMsg: string;
            config: any;
            data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
        } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
            setComponent(c: any): void;
            load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
            setData(data: any): void;
            setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
        } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
            fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
            config: import("mobx-state-tree").IType<any, any, any>;
            data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
        }, {
            setComponent(c: any): void;
            load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
            setData(data: any): void;
            setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
    }): {
        toDispose: (() => void)[];
        loadOptions: import("lodash").DebouncedFunc<any>;
        componentDidMount(): void;
        componentDidUpdate(prevProps: any): void;
        componentWillUnmount(): void;
        loadConfig(ctx?: any): Promise<void>;
        loadAutoComplete(input: string): Promise<any>;
        setConfig(value: any, ctx?: any): void;
        syncConfig(): void;
        deferLoadConfig(item: any): Promise<void>;
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
            store: {
                fetching: boolean;
                errorMsg: string;
                config: any;
                data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                config: import("mobx-state-tree").IType<any, any, any>;
                data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
            }, {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
            store: {
                fetching: boolean;
                errorMsg: string;
                config: any;
                data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                config: import("mobx-state-tree").IType<any, any, any>;
                data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
            }, {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        }> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        shouldComponentUpdate?(nextProps: Readonly<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
            store: {
                fetching: boolean;
                errorMsg: string;
                config: any;
                data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                config: import("mobx-state-tree").IType<any, any, any>;
                data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
            }, {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
            store: {
                fetching: boolean;
                errorMsg: string;
                config: any;
                data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                config: import("mobx-state-tree").IType<any, any, any>;
                data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
            }, {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        }>, prevState: Readonly<{}>): any;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
            store: {
                fetching: boolean;
                errorMsg: string;
                config: any;
                data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                config: import("mobx-state-tree").IType<any, any, any>;
                data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
            }, {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
            store: {
                fetching: boolean;
                errorMsg: string;
                config: any;
                data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                config: import("mobx-state-tree").IType<any, any, any>;
                data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
            }, {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
            store: {
                fetching: boolean;
                errorMsg: string;
                config: any;
                data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                config: import("mobx-state-tree").IType<any, any, any>;
                data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
            }, {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
            store: {
                fetching: boolean;
                errorMsg: string;
                config: any;
                data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                config: import("mobx-state-tree").IType<any, any, any>;
                data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
            }, {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    ComposedComponent: React.ComponentType<{
        new (props: (RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>): {
            render(): JSX.Element;
            context: any;
            setState<K_2 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K_2> | null) | Pick<{}, K_2> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
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
            shouldComponentUpdate?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_2 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K_2> | null) | Pick<{}, K_2> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
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
            shouldComponentUpdate?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        };
        contextType?: React.Context<any> | undefined;
    }>;
    contextType: React.Context<void | import("../env").RendererEnv>;
}, {}> & {
    ComposedComponent: {
        new (props: Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
            store: {
                fetching: boolean;
                errorMsg: string;
                config: any;
                data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                config: import("mobx-state-tree").IType<any, any, any>;
                data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
            }, {
                setComponent(c: any): void;
                load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                setData(data: any): void;
                setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        }): {
            toDispose: (() => void)[];
            loadOptions: import("lodash").DebouncedFunc<any>;
            componentDidMount(): void;
            componentDidUpdate(prevProps: any): void;
            componentWillUnmount(): void;
            loadConfig(ctx?: any): Promise<void>;
            loadAutoComplete(input: string): Promise<any>;
            setConfig(value: any, ctx?: any): void;
            syncConfig(): void;
            deferLoadConfig(item: any): Promise<void>;
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
                store: {
                    fetching: boolean;
                    errorMsg: string;
                    config: any;
                    data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
                } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                    fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                    errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    config: import("mobx-state-tree").IType<any, any, any>;
                    data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
                }, {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
                store: {
                    fetching: boolean;
                    errorMsg: string;
                    config: any;
                    data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
                } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                    fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                    errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    config: import("mobx-state-tree").IType<any, any, any>;
                    data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
                }, {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
            }> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<{}>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            shouldComponentUpdate?(nextProps: Readonly<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
                store: {
                    fetching: boolean;
                    errorMsg: string;
                    config: any;
                    data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
                } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                    fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                    errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    config: import("mobx-state-tree").IType<any, any, any>;
                    data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
                }, {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
                store: {
                    fetching: boolean;
                    errorMsg: string;
                    config: any;
                    data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
                } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                    fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                    errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    config: import("mobx-state-tree").IType<any, any, any>;
                    data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
                }, {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
            }>, prevState: Readonly<{}>): any;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
                store: {
                    fetching: boolean;
                    errorMsg: string;
                    config: any;
                    data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
                } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                    fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                    errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    config: import("mobx-state-tree").IType<any, any, any>;
                    data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
                }, {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
                store: {
                    fetching: boolean;
                    errorMsg: string;
                    config: any;
                    data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
                } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                    fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                    errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    config: import("mobx-state-tree").IType<any, any, any>;
                    data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
                }, {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
                store: {
                    fetching: boolean;
                    errorMsg: string;
                    config: any;
                    data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
                } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                    fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                    errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    config: import("mobx-state-tree").IType<any, any, any>;
                    data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
                }, {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps, keyof RemoteOptionsProps<P>> & import("./WithRemoteConfig").OutterProps & {
                store: {
                    fetching: boolean;
                    errorMsg: string;
                    config: any;
                    data: import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IType<{} | null | undefined, {}, {}>>;
                } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                    fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                    errorMsg: import("mobx-state-tree").IType<string | undefined, string, string>;
                    config: import("mobx-state-tree").IType<any, any, any>;
                    data: import("mobx-state-tree").IType<{} | null | undefined, {}, {}>;
                }, {
                    setComponent(c: any): void;
                    load: (env: import("../env").RendererEnv, api: Api, ctx: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings) => Promise<any>;
                    setData(data: any): void;
                    setConfig(options: any, config: import("./WithRemoteConfig").WithRemoteConfigSettings, motivation?: any): void;
                }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        ComposedComponent: React.ComponentType<{
            new (props: (RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>): {
                render(): JSX.Element;
                context: any;
                setState<K_2 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K_2> | null) | Pick<{}, K_2> | null, callback?: (() => void) | undefined): void;
                forceUpdate(callback?: (() => void) | undefined): void;
                readonly props: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
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
                shouldComponentUpdate?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
                componentWillUnmount?(): void;
                componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                getSnapshotBeforeUpdate?(prevProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
                componentDidUpdate?(prevProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
                componentWillMount?(): void;
                UNSAFE_componentWillMount?(): void;
                componentWillReceiveProps?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
                UNSAFE_componentWillReceiveProps?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
                componentWillUpdate?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
                UNSAFE_componentWillUpdate?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
            };
            new (props: RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
                render(): JSX.Element;
                context: any;
                setState<K_2 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K_2> | null) | Pick<{}, K_2> | null, callback?: (() => void) | undefined): void;
                forceUpdate(callback?: (() => void) | undefined): void;
                readonly props: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
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
                shouldComponentUpdate?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
                componentWillUnmount?(): void;
                componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                getSnapshotBeforeUpdate?(prevProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
                componentDidUpdate?(prevProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
                componentWillMount?(): void;
                UNSAFE_componentWillMount?(): void;
                componentWillReceiveProps?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
                UNSAFE_componentWillReceiveProps?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
                componentWillUpdate?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
                UNSAFE_componentWillUpdate?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                    multiple: boolean;
                    clearable: boolean;
                    creatable: boolean;
                    createBtnLabel: string;
                    searchPromptText: string;
                    loadingPlaceholder: string;
                    noResultsText: string;
                    clearAllText: string;
                    clearValueText: string;
                    placeholder: string;
                    valueField: string;
                    labelField: string;
                    resetValue: string;
                    inline: boolean;
                    disabled: boolean;
                    checkAll: boolean;
                    checkAllLabel: string;
                    defaultCheckAll: boolean;
                    overlayPlacement: string;
                }, never>> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
            };
            contextType?: React.Context<any> | undefined;
        }>;
        contextType: React.Context<void | import("../env").RendererEnv>;
    };
} & import("hoist-non-react-statics").NonReactStatics<{
    new (props: (RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
        multiple: boolean;
        clearable: boolean;
        creatable: boolean;
        createBtnLabel: string;
        searchPromptText: string;
        loadingPlaceholder: string;
        noResultsText: string;
        clearAllText: string;
        clearValueText: string;
        placeholder: string;
        valueField: string;
        labelField: string;
        resetValue: string;
        inline: boolean;
        disabled: boolean;
        checkAll: boolean;
        checkAllLabel: string;
        defaultCheckAll: boolean;
        overlayPlacement: string;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
        multiple: boolean;
        clearable: boolean;
        creatable: boolean;
        createBtnLabel: string;
        searchPromptText: string;
        loadingPlaceholder: string;
        noResultsText: string;
        clearAllText: string;
        clearValueText: string;
        placeholder: string;
        valueField: string;
        labelField: string;
        resetValue: string;
        inline: boolean;
        disabled: boolean;
        checkAll: boolean;
        checkAllLabel: string;
        defaultCheckAll: boolean;
        overlayPlacement: string;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K_2 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K_2> | null) | Pick<{}, K_2> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
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
        shouldComponentUpdate?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
        multiple: boolean;
        clearable: boolean;
        creatable: boolean;
        createBtnLabel: string;
        searchPromptText: string;
        loadingPlaceholder: string;
        noResultsText: string;
        clearAllText: string;
        clearValueText: string;
        placeholder: string;
        valueField: string;
        labelField: string;
        resetValue: string;
        inline: boolean;
        disabled: boolean;
        checkAll: boolean;
        checkAllLabel: string;
        defaultCheckAll: boolean;
        overlayPlacement: string;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K_2 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K_2> | null) | Pick<{}, K_2> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
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
        shouldComponentUpdate?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    contextType?: React.Context<any> | undefined;
}, {}> & {
    ComposedComponent: {
        new (props: (RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>): {
            render(): JSX.Element;
            context: any;
            setState<K_2 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K_2> | null) | Pick<{}, K_2> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
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
            shouldComponentUpdate?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
            multiple: boolean;
            clearable: boolean;
            creatable: boolean;
            createBtnLabel: string;
            searchPromptText: string;
            loadingPlaceholder: string;
            noResultsText: string;
            clearAllText: string;
            clearValueText: string;
            placeholder: string;
            valueField: string;
            labelField: string;
            resetValue: string;
            inline: boolean;
            disabled: boolean;
            checkAll: boolean;
            checkAllLabel: string;
            defaultCheckAll: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_2 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K_2> | null) | Pick<{}, K_2> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
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
            shouldComponentUpdate?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<RemoteOptionsProps<Options[]> & Omit<Pick<Omit<SelectProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "value" | "loading" | "delimiter" | "joinValues" | "extractValue" | "options" | "loadOptions" | "spinnerClassName" | "onFocus" | "onBlur" | "onChange" | "popoverClassName" | "popOverContainer" | "borderMode" | "multi" | "simpleValue" | "pathSeparator" | "onAdd" | "editable" | "onEdit" | "removable" | "onDelete" | "valuesNoWrap" | "renderMenu" | "searchable" | "checkAllBySearch" | "defaultOpen" | "hideSelected"> & Partial<Pick<Omit<SelectProps, keyof LocaleProps>, "disabled" | "multiple" | "labelField" | "valueField" | "resetValue" | "inline" | "placeholder" | "clearable" | "overlayPlacement" | "creatable" | "noResultsText" | "createBtnLabel" | "searchPromptText" | "loadingPlaceholder" | "clearAllText" | "clearValueText" | "checkAll" | "checkAllLabel" | "defaultCheckAll">> & Partial<Pick<{
                multiple: boolean;
                clearable: boolean;
                creatable: boolean;
                createBtnLabel: string;
                searchPromptText: string;
                loadingPlaceholder: string;
                noResultsText: string;
                clearAllText: string;
                clearValueText: string;
                placeholder: string;
                valueField: string;
                labelField: string;
                resetValue: string;
                inline: boolean;
                disabled: boolean;
                checkAll: boolean;
                checkAllLabel: string;
                defaultCheckAll: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        };
        contextType?: React.Context<any> | undefined;
    };
};
