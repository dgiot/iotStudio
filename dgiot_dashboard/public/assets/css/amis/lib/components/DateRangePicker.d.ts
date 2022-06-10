/**
 * @file DateRangePicker
 * @description 自定义日期范围时间选择器组件
 * @author fex
 */
/// <reference types="hoist-non-react-statics" />
import React from 'react';
import moment from 'moment';
import { ShortCuts } from './DatePicker';
import { ThemeProps } from '../theme';
import { PlainObject } from '../types';
import { LocaleProps } from '../locale';
export interface DateRangePickerProps extends ThemeProps, LocaleProps {
    className?: string;
    popoverClassName?: string;
    placeholder?: string;
    theme?: any;
    format: string;
    utc?: boolean;
    inputFormat?: string;
    ranges?: string | Array<ShortCuts>;
    clearable?: boolean;
    minDate?: moment.Moment;
    maxDate?: moment.Moment;
    minDuration?: moment.Duration;
    maxDuration?: moment.Duration;
    joinValues: boolean;
    delimiter: string;
    value?: any;
    onChange: (value: any) => void;
    data?: any;
    disabled?: boolean;
    closeOnSelect?: boolean;
    overlayPlacement: string;
    timeFormat?: string;
    resetValue?: any;
    popOverContainer?: any;
    dateFormat?: string;
    embed?: boolean;
    viewMode?: 'days' | 'months' | 'years' | 'time' | 'quarters';
    borderMode?: 'full' | 'half' | 'none';
}
export interface DateRangePickerState {
    isOpened: boolean;
    isFocused: boolean;
    startDate?: moment.Moment;
    endDate?: moment.Moment;
}
export declare const availableRanges: {
    [propName: string]: any;
};
export declare class DateRangePicker extends React.Component<DateRangePickerProps, DateRangePickerState> {
    static defaultProps: {
        placeholder: string;
        format: string;
        inputFormat: string;
        joinValues: boolean;
        clearable: boolean;
        delimiter: string;
        ranges: string;
        resetValue: string;
        closeOnSelect: boolean;
        overlayPlacement: string;
    };
    innerDom: any;
    popover: any;
    input?: HTMLInputElement;
    static formatValue(newValue: any, format: string, joinValues: boolean, delimiter: string, utc?: boolean): any;
    static unFormatValue(value: any, format: string, joinValues: boolean, delimiter: string): {
        startDate: moment.Moment | undefined;
        endDate: moment.Moment | undefined;
    };
    dom: React.RefObject<HTMLDivElement>;
    nextMonth: moment.Moment;
    constructor(props: DateRangePickerProps);
    componentDidUpdate(prevProps: DateRangePickerProps): void;
    focus(): void;
    blur(): void;
    handleFocus(): void;
    handleBlur(): void;
    open(): void;
    close(): void;
    handleClick(): void;
    handlePopOverClick(e: React.MouseEvent<any>): void;
    handleKeyPress(e: React.KeyboardEvent): void;
    confirm(): void;
    filterDate(date: moment.Moment, originValue?: moment.Moment, timeFormat?: string, type?: 'start' | 'end'): moment.Moment;
    handleStartChange(newValue: moment.Moment): void;
    handleEndChange(newValue: moment.Moment): void;
    selectRannge(range: PlainObject): void;
    renderRanges(ranges: string | Array<ShortCuts> | undefined): JSX.Element | null;
    clearValue(e: React.MouseEvent<any>): void;
    checkStartIsValidDate(currentDate: moment.Moment): boolean;
    checkEndIsValidDate(currentDate: moment.Moment): boolean;
    renderDay(props: any, currentDate: moment.Moment): JSX.Element;
    renderQuarter(props: any, quarter: number, year: number): JSX.Element;
    renderCalendar(): JSX.Element;
    render(): JSX.Element;
}
declare const _default: {
    new (props: (Omit<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
        placeholder: string;
        format: string;
        inputFormat: string;
        joinValues: boolean;
        clearable: boolean;
        delimiter: string;
        ranges: string;
        resetValue: string;
        closeOnSelect: boolean;
        overlayPlacement: string;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
        placeholder: string;
        format: string;
        inputFormat: string;
        joinValues: boolean;
        clearable: boolean;
        delimiter: string;
        ranges: string;
        resetValue: string;
        closeOnSelect: boolean;
        overlayPlacement: string;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
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
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Omit<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
        placeholder: string;
        format: string;
        inputFormat: string;
        joinValues: boolean;
        clearable: boolean;
        delimiter: string;
        ranges: string;
        resetValue: string;
        closeOnSelect: boolean;
        overlayPlacement: string;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
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
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<{
        new (props: (Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof DateRangePicker>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof DateRangePicker, {}> & {
        ComposedComponent: typeof DateRangePicker;
    }>;
} & import("hoist-non-react-statics").NonReactStatics<{
    new (props: (Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
        placeholder: string;
        format: string;
        inputFormat: string;
        joinValues: boolean;
        clearable: boolean;
        delimiter: string;
        ranges: string;
        resetValue: string;
        closeOnSelect: boolean;
        overlayPlacement: string;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }) | Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
        placeholder: string;
        format: string;
        inputFormat: string;
        joinValues: boolean;
        clearable: boolean;
        delimiter: string;
        ranges: string;
        resetValue: string;
        closeOnSelect: boolean;
        overlayPlacement: string;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }>): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
        placeholder: string;
        format: string;
        inputFormat: string;
        joinValues: boolean;
        clearable: boolean;
        delimiter: string;
        ranges: string;
        resetValue: string;
        closeOnSelect: boolean;
        overlayPlacement: string;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof DateRangePicker>;
} & import("hoist-non-react-statics").NonReactStatics<typeof DateRangePicker, {}> & {
    ComposedComponent: typeof DateRangePicker;
}, {}> & {
    ComposedComponent: {
        new (props: (Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
            placeholder: string;
            format: string;
            inputFormat: string;
            joinValues: boolean;
            clearable: boolean;
            delimiter: string;
            ranges: string;
            resetValue: string;
            closeOnSelect: boolean;
            overlayPlacement: string;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "classPrefix" | "classnames" | "data" | "embed" | "className" | "theme" | "value" | "disabled" | "onChange" | "timeFormat" | "viewMode" | "dateFormat" | "utc" | "minDate" | "popoverClassName" | "maxDate" | "popOverContainer" | "borderMode" | "minDuration" | "maxDuration"> & Partial<Pick<Omit<DateRangePickerProps, keyof LocaleProps>, "delimiter" | "joinValues" | "resetValue" | "placeholder" | "inputFormat" | "closeOnSelect" | "format" | "clearable" | "overlayPlacement" | "ranges">> & Partial<Pick<{
                placeholder: string;
                format: string;
                inputFormat: string;
                joinValues: boolean;
                clearable: boolean;
                delimiter: string;
                ranges: string;
                resetValue: string;
                closeOnSelect: boolean;
                overlayPlacement: string;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof DateRangePicker>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof DateRangePicker, {}> & {
        ComposedComponent: typeof DateRangePicker;
    };
};
export default _default;
