/// <reference types="hoist-non-react-statics" />
import moment from 'moment';
import DaysView from 'react-datetime/src/DaysView';
import React from 'react';
import { LocaleProps } from '../../locale';
import { ClassNamesFn } from '../../theme';
interface CustomDaysViewProps extends LocaleProps {
    classPrefix?: string;
    prevIcon?: string;
    nextIcon?: string;
    viewDate: moment.Moment;
    selectedDate: moment.Moment;
    minDate: moment.Moment;
    timeFormat: string;
    requiredConfirm?: boolean;
    isEndDate?: boolean;
    renderDay?: Function;
    onClose?: () => void;
    onChange: (value: moment.Moment) => void;
    setDateTimeState: (state: any) => void;
    setTime: (type: string, amount: number) => void;
    subtractTime: (amount: number, type: string, toSelected?: moment.Moment) => () => void;
    addTime: (amount: number, type: string, toSelected?: moment.Moment) => () => void;
    isValidDate?: (currentDate: moment.Moment, selected?: moment.Moment) => boolean;
    showView: (view: string) => () => void;
    updateSelectedDate: (event: React.MouseEvent<any>, close?: boolean) => void;
    handleClickOutside: () => void;
    classnames: ClassNamesFn;
}
export declare class CustomDaysView extends DaysView {
    props: CustomDaysViewProps;
    getDaysOfWeek: (locale: any) => any;
    renderDays: () => JSX.Element;
    updateSelectedDate: (event: React.MouseEvent<any>) => void;
    setTime: (type: 'hours' | 'minutes' | 'seconds' | 'milliseconds', value: number) => void;
    confirm: () => void;
    cancel: () => void;
    renderDay: (props: any, currentDate: moment.Moment) => JSX.Element;
    computedTimeOptions(total: number): {
        label: string;
        value: string;
    }[];
    renderTimes: () => JSX.Element;
    renderFooter: () => JSX.Element | null;
    render(): JSX.Element;
}
declare const _default: {
    new (props: (Omit<CustomDaysViewProps, keyof LocaleProps> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }) | Readonly<Omit<CustomDaysViewProps, keyof LocaleProps> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<CustomDaysViewProps, keyof LocaleProps> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<CustomDaysViewProps, keyof LocaleProps> & {
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
        shouldComponentUpdate?(nextProps: Readonly<Omit<CustomDaysViewProps, keyof LocaleProps> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<CustomDaysViewProps, keyof LocaleProps> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<CustomDaysViewProps, keyof LocaleProps> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<CustomDaysViewProps, keyof LocaleProps> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<CustomDaysViewProps, keyof LocaleProps> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<CustomDaysViewProps, keyof LocaleProps> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<CustomDaysViewProps, keyof LocaleProps> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Omit<CustomDaysViewProps, keyof LocaleProps> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<CustomDaysViewProps, keyof LocaleProps> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<CustomDaysViewProps, keyof LocaleProps> & {
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
        shouldComponentUpdate?(nextProps: Readonly<Omit<CustomDaysViewProps, keyof LocaleProps> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<CustomDaysViewProps, keyof LocaleProps> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<CustomDaysViewProps, keyof LocaleProps> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<CustomDaysViewProps, keyof LocaleProps> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<CustomDaysViewProps, keyof LocaleProps> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<CustomDaysViewProps, keyof LocaleProps> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<CustomDaysViewProps, keyof LocaleProps> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<React.ComponentClass<CustomDaysViewProps, any>>;
} & import("hoist-non-react-statics").NonReactStatics<React.ComponentClass<CustomDaysViewProps, any>, {}> & {
    ComposedComponent: React.ComponentClass<CustomDaysViewProps, any>;
};
export default _default;
