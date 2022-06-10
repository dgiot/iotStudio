import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
export declare type ClassValue = string | number | ClassDictionary | ClassArray | undefined | null | boolean;
interface ClassDictionary {
    [id: string]: any;
}
interface ClassArray extends Array<ClassValue> {
}
export declare type ClassNamesFn = (...classes: ClassValue[]) => string;
interface ThemeConfig {
    classPrefix?: string;
    renderers?: {
        [propName: string]: any;
    };
    components?: {
        [propName: string]: any;
    };
    [propsName: string]: any;
}
export declare function theme(name: string, config: Partial<ThemeConfig>): void;
export declare function makeClassnames(ns?: string): (...classes: ClassValue[]) => string;
export declare type ThemeInstance = ThemeConfig & {
    getRendererConfig: (name?: string) => any;
    getComponentConfig: (name?: string) => any;
    classnames: ClassNamesFn;
};
export declare function hasTheme(theme: string): boolean;
export declare function setDefaultTheme(theme: string): void;
export declare function classnames(...classes: ClassValue[]): any;
export declare function getClassPrefix(): string | undefined;
export declare function getTheme(theme: string): ThemeInstance;
export interface ThemeProps {
    className?: string;
    classPrefix: string;
    classnames: ClassNamesFn;
    theme?: string;
}
export interface ThemeOutterProps {
    theme?: string;
    className?: string;
    classPrefix?: string;
    classnames?: ClassNamesFn;
}
export declare let defaultTheme: string;
export declare const ThemeContext: React.Context<string>;
export declare function themeable<T extends React.ComponentType<React.ComponentProps<T> & ThemeProps> & {
    themeKey?: string;
}>(ComposedComponent: T): {
    new (props: (JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof ThemeProps>> & ThemeOutterProps) | Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof ThemeProps>> & ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof ThemeProps>> & ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof ThemeProps>> & ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof ThemeProps>> & ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof ThemeProps>> & ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof ThemeProps>> & ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof ThemeProps>> & ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof ThemeProps>> & ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof ThemeProps>> & ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof ThemeProps>> & ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof ThemeProps>> & ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof ThemeProps>> & ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof ThemeProps>> & ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof ThemeProps>> & ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof ThemeProps>> & ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof ThemeProps>> & ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof ThemeProps>> & ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof ThemeProps>> & ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof ThemeProps>> & ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<JSX.LibraryManagedAttributes<T, Omit<React.ComponentProps<T>, keyof ThemeProps>> & ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<T>;
} & hoistNonReactStatic.NonReactStatics<T, {}> & {
    ComposedComponent: T;
};
export {};
