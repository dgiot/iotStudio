/**
 * @file Rating
 * @description
 * @author fex
 */
/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { ClassNamesFn } from '../theme';
interface RatingProps {
    id?: string;
    key?: string | number;
    style?: React.CSSProperties;
    count: number;
    half: boolean;
    char: string;
    size: number;
    className?: string;
    onChange?: (value: any) => void;
    value: number;
    containerClass: string;
    readOnly: boolean;
    classPrefix: string;
    disabled?: boolean;
    allowClear?: boolean;
    classnames: ClassNamesFn;
}
export declare class Rating extends React.Component<RatingProps, any> {
    static defaultProps: {
        containerClass: string;
        readOnly: boolean;
        half: boolean;
        allowClear: boolean;
        value: number;
        count: number;
        char: string;
        size: number;
    };
    constructor(props: RatingProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: RatingProps): void;
    getRate(): number;
    getStars(activeCount?: number): {
        active: boolean;
    }[];
    mouseOver(event: React.ChangeEvent<any>): void;
    moreThanHalf(event: any, size: number): boolean;
    mouseLeave(): void;
    handleClick(event: React.ChangeEvent<any>): void;
    renderStars(): any;
    render(): JSX.Element;
}
declare const _default: {
    new (props: (Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "style" | "key" | "disabled" | "id" | "onChange"> & Partial<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "value" | "char" | "count" | "size" | "readOnly" | "half" | "containerClass" | "allowClear">> & Partial<Pick<{
        containerClass: string;
        readOnly: boolean;
        half: boolean;
        allowClear: boolean;
        value: number;
        count: number;
        char: string;
        size: number;
    }, never>> & import("../theme").ThemeOutterProps) | Readonly<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "style" | "key" | "disabled" | "id" | "onChange"> & Partial<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "value" | "char" | "count" | "size" | "readOnly" | "half" | "containerClass" | "allowClear">> & Partial<Pick<{
        containerClass: string;
        readOnly: boolean;
        half: boolean;
        allowClear: boolean;
        value: number;
        count: number;
        char: string;
        size: number;
    }, never>> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "style" | "key" | "disabled" | "id" | "onChange"> & Partial<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "value" | "char" | "count" | "size" | "readOnly" | "half" | "containerClass" | "allowClear">> & Partial<Pick<{
            containerClass: string;
            readOnly: boolean;
            half: boolean;
            allowClear: boolean;
            value: number;
            count: number;
            char: string;
            size: number;
        }, never>> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "style" | "key" | "disabled" | "id" | "onChange"> & Partial<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "value" | "char" | "count" | "size" | "readOnly" | "half" | "containerClass" | "allowClear">> & Partial<Pick<{
            containerClass: string;
            readOnly: boolean;
            half: boolean;
            allowClear: boolean;
            value: number;
            count: number;
            char: string;
            size: number;
        }, never>> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "style" | "key" | "disabled" | "id" | "onChange"> & Partial<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "value" | "char" | "count" | "size" | "readOnly" | "half" | "containerClass" | "allowClear">> & Partial<Pick<{
            containerClass: string;
            readOnly: boolean;
            half: boolean;
            allowClear: boolean;
            value: number;
            count: number;
            char: string;
            size: number;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "style" | "key" | "disabled" | "id" | "onChange"> & Partial<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "value" | "char" | "count" | "size" | "readOnly" | "half" | "containerClass" | "allowClear">> & Partial<Pick<{
            containerClass: string;
            readOnly: boolean;
            half: boolean;
            allowClear: boolean;
            value: number;
            count: number;
            char: string;
            size: number;
        }, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "style" | "key" | "disabled" | "id" | "onChange"> & Partial<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "value" | "char" | "count" | "size" | "readOnly" | "half" | "containerClass" | "allowClear">> & Partial<Pick<{
            containerClass: string;
            readOnly: boolean;
            half: boolean;
            allowClear: boolean;
            value: number;
            count: number;
            char: string;
            size: number;
        }, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "style" | "key" | "disabled" | "id" | "onChange"> & Partial<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "value" | "char" | "count" | "size" | "readOnly" | "half" | "containerClass" | "allowClear">> & Partial<Pick<{
            containerClass: string;
            readOnly: boolean;
            half: boolean;
            allowClear: boolean;
            value: number;
            count: number;
            char: string;
            size: number;
        }, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "style" | "key" | "disabled" | "id" | "onChange"> & Partial<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "value" | "char" | "count" | "size" | "readOnly" | "half" | "containerClass" | "allowClear">> & Partial<Pick<{
            containerClass: string;
            readOnly: boolean;
            half: boolean;
            allowClear: boolean;
            value: number;
            count: number;
            char: string;
            size: number;
        }, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "style" | "key" | "disabled" | "id" | "onChange"> & Partial<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "value" | "char" | "count" | "size" | "readOnly" | "half" | "containerClass" | "allowClear">> & Partial<Pick<{
            containerClass: string;
            readOnly: boolean;
            half: boolean;
            allowClear: boolean;
            value: number;
            count: number;
            char: string;
            size: number;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "style" | "key" | "disabled" | "id" | "onChange"> & Partial<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "value" | "char" | "count" | "size" | "readOnly" | "half" | "containerClass" | "allowClear">> & Partial<Pick<{
            containerClass: string;
            readOnly: boolean;
            half: boolean;
            allowClear: boolean;
            value: number;
            count: number;
            char: string;
            size: number;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "style" | "key" | "disabled" | "id" | "onChange"> & Partial<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "value" | "char" | "count" | "size" | "readOnly" | "half" | "containerClass" | "allowClear">> & Partial<Pick<{
        containerClass: string;
        readOnly: boolean;
        half: boolean;
        allowClear: boolean;
        value: number;
        count: number;
        char: string;
        size: number;
    }, never>> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "style" | "key" | "disabled" | "id" | "onChange"> & Partial<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "value" | "char" | "count" | "size" | "readOnly" | "half" | "containerClass" | "allowClear">> & Partial<Pick<{
            containerClass: string;
            readOnly: boolean;
            half: boolean;
            allowClear: boolean;
            value: number;
            count: number;
            char: string;
            size: number;
        }, never>> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "style" | "key" | "disabled" | "id" | "onChange"> & Partial<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "value" | "char" | "count" | "size" | "readOnly" | "half" | "containerClass" | "allowClear">> & Partial<Pick<{
            containerClass: string;
            readOnly: boolean;
            half: boolean;
            allowClear: boolean;
            value: number;
            count: number;
            char: string;
            size: number;
        }, never>> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "style" | "key" | "disabled" | "id" | "onChange"> & Partial<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "value" | "char" | "count" | "size" | "readOnly" | "half" | "containerClass" | "allowClear">> & Partial<Pick<{
            containerClass: string;
            readOnly: boolean;
            half: boolean;
            allowClear: boolean;
            value: number;
            count: number;
            char: string;
            size: number;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "style" | "key" | "disabled" | "id" | "onChange"> & Partial<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "value" | "char" | "count" | "size" | "readOnly" | "half" | "containerClass" | "allowClear">> & Partial<Pick<{
            containerClass: string;
            readOnly: boolean;
            half: boolean;
            allowClear: boolean;
            value: number;
            count: number;
            char: string;
            size: number;
        }, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "style" | "key" | "disabled" | "id" | "onChange"> & Partial<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "value" | "char" | "count" | "size" | "readOnly" | "half" | "containerClass" | "allowClear">> & Partial<Pick<{
            containerClass: string;
            readOnly: boolean;
            half: boolean;
            allowClear: boolean;
            value: number;
            count: number;
            char: string;
            size: number;
        }, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "style" | "key" | "disabled" | "id" | "onChange"> & Partial<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "value" | "char" | "count" | "size" | "readOnly" | "half" | "containerClass" | "allowClear">> & Partial<Pick<{
            containerClass: string;
            readOnly: boolean;
            half: boolean;
            allowClear: boolean;
            value: number;
            count: number;
            char: string;
            size: number;
        }, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "style" | "key" | "disabled" | "id" | "onChange"> & Partial<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "value" | "char" | "count" | "size" | "readOnly" | "half" | "containerClass" | "allowClear">> & Partial<Pick<{
            containerClass: string;
            readOnly: boolean;
            half: boolean;
            allowClear: boolean;
            value: number;
            count: number;
            char: string;
            size: number;
        }, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "style" | "key" | "disabled" | "id" | "onChange"> & Partial<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "value" | "char" | "count" | "size" | "readOnly" | "half" | "containerClass" | "allowClear">> & Partial<Pick<{
            containerClass: string;
            readOnly: boolean;
            half: boolean;
            allowClear: boolean;
            value: number;
            count: number;
            char: string;
            size: number;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "style" | "key" | "disabled" | "id" | "onChange"> & Partial<Pick<Omit<RatingProps, keyof import("../theme").ThemeProps>, "value" | "char" | "count" | "size" | "readOnly" | "half" | "containerClass" | "allowClear">> & Partial<Pick<{
            containerClass: string;
            readOnly: boolean;
            half: boolean;
            allowClear: boolean;
            value: number;
            count: number;
            char: string;
            size: number;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof Rating>;
} & import("hoist-non-react-statics").NonReactStatics<typeof Rating, {}> & {
    ComposedComponent: typeof Rating;
};
export default _default;
