/**
 * @file Editor
 * @description
 * @author fex
 */
/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { ClassNamesFn } from '../theme';
import { LocaleProps } from '../locale';
export declare function monacoFactory(containerElement: HTMLElement, monaco: any, options: any): any;
export interface EditorProps extends LocaleProps {
    value?: string;
    defaultValue?: string;
    width?: number | string;
    height?: number | string;
    onChange?: (value: string, event: any) => void;
    language?: string;
    editorTheme?: string;
    allowFullscreen?: boolean;
    options: {
        [propName: string]: any;
    };
    classPrefix: string;
    className?: string;
    classnames: ClassNamesFn;
    context?: any;
    style?: any;
    isDiffEditor?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
    editorDidMount?: (editor: any, monaco: any) => void;
    editorWillMount?: (monaco: any) => void;
    editorWillUnmount?: (editor: any, monaco: any) => void;
    editorFactory?: (conatainer: HTMLElement, monaco: any, options: any) => any;
}
export declare class Editor extends React.Component<EditorProps, any> {
    static defaultProps: {
        language: string;
        editorTheme: string;
        width: string;
        height: string;
        allowFullscreen: boolean;
        options: {};
    };
    state: {
        isFullscreen: boolean;
        innerWidth: string;
        innerHeight: string;
    };
    editor: any;
    container: any;
    currentValue: any;
    preventTriggerChangeEvent: boolean;
    disposes: Array<{
        dispose: () => void;
    }>;
    constructor(props: EditorProps);
    componentDidUpdate(prevProps: EditorProps): void;
    componentWillUnmount(): void;
    wrapperRef(ref: any): void;
    loadMonaco(): void;
    initMonaco(monaco: any): void;
    editorWillMount(monaco: any): void;
    editorDidMount(editor: any, monaco: any): void;
    handleFullscreenModeChange(): void;
    render(): JSX.Element;
}
declare const _default: {
    new (props: (Omit<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
        language: string;
        editorTheme: string;
        width: string;
        height: string;
        allowFullscreen: boolean;
        options: {};
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
        language: string;
        editorTheme: string;
        width: string;
        height: string;
        allowFullscreen: boolean;
        options: {};
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
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
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Omit<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
        language: string;
        editorTheme: string;
        width: string;
        height: string;
        allowFullscreen: boolean;
        options: {};
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
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
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<{
        new (props: (Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof Editor>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof Editor, {}> & {
        ComposedComponent: typeof Editor;
    }>;
} & import("hoist-non-react-statics").NonReactStatics<{
    new (props: (Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
        language: string;
        editorTheme: string;
        width: string;
        height: string;
        allowFullscreen: boolean;
        options: {};
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }) | Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
        language: string;
        editorTheme: string;
        width: string;
        height: string;
        allowFullscreen: boolean;
        options: {};
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }>): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
        language: string;
        editorTheme: string;
        width: string;
        height: string;
        allowFullscreen: boolean;
        options: {};
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
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
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof Editor>;
} & import("hoist-non-react-statics").NonReactStatics<typeof Editor, {}> & {
    ComposedComponent: typeof Editor;
}, {}> & {
    ComposedComponent: {
        new (props: (Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
            language: string;
            editorTheme: string;
            width: string;
            height: string;
            allowFullscreen: boolean;
            options: {};
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
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
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<EditorProps, keyof LocaleProps>, "classPrefix" | "classnames" | "style" | "className" | "value" | "defaultValue" | "onFocus" | "onBlur" | "onChange" | "context" | "isDiffEditor" | "editorDidMount" | "editorWillMount" | "editorWillUnmount" | "editorFactory"> & Partial<Pick<Omit<EditorProps, keyof LocaleProps>, "options" | "height" | "width" | "language" | "editorTheme" | "allowFullscreen">> & Partial<Pick<{
                language: string;
                editorTheme: string;
                width: string;
                height: string;
                allowFullscreen: boolean;
                options: {};
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof Editor>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof Editor, {}> & {
        ComposedComponent: typeof Editor;
    };
};
export default _default;
