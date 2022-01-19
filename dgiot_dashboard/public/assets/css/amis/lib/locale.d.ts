import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
export declare type TranslateFn<T = any> = (str: T, data?: object) => T;
interface LocaleConfig {
    [propsName: string]: string;
}
export declare function register(name: string, config: LocaleConfig): void;
export declare function makeTranslator(locale?: string): TranslateFn;
export declare function getDefaultLocale(): string;
export declare function setDefaultLocale(loacle: string): void;
export interface LocaleProps {
    locale: string;
    translate: TranslateFn;
}
export declare const LocaleContext: React.Context<string>;
export declare function localeable<T extends React.ComponentType<React.ComponentProps<T> & LocaleProps>>(ComposedComponent: T): {
    new (props: (JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof LocaleProps>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }) | Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof LocaleProps>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof LocaleProps>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof LocaleProps>> & {
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
        shouldComponentUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof LocaleProps>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof LocaleProps>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof LocaleProps>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof LocaleProps>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof LocaleProps>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof LocaleProps>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof LocaleProps>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof LocaleProps>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof LocaleProps>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof LocaleProps>> & {
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
        shouldComponentUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof LocaleProps>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof LocaleProps>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof LocaleProps>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof LocaleProps>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof LocaleProps>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof LocaleProps>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof LocaleProps>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<T>;
} & hoistNonReactStatic.NonReactStatics<T, {}> & {
    ComposedComponent: T;
};
export {};
