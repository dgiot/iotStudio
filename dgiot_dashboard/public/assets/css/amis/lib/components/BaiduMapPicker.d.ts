/// <reference types="lodash" />
/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { ClassNamesFn } from '../theme';
interface MapPickerProps {
    ak: string;
    coordinatesType: string;
    classnames: ClassNamesFn;
    classPrefix: string;
    value?: {
        address: string;
        lat: number;
        lng: number;
        city?: string;
    };
    onChange: (value: any) => void;
}
interface LocationItem {
    title?: string;
    address: string;
    lat: number;
    lng: number;
    city?: string;
}
interface MapPickerState {
    inputValue: string;
    locIndex?: number;
    locs: Array<LocationItem>;
    sugs: Array<string>;
}
export declare class BaiduMapPicker extends React.Component<MapPickerProps, MapPickerState> {
    state: MapPickerState;
    id: string;
    mapRef: React.RefObject<HTMLDivElement>;
    placeholderInput?: HTMLInputElement;
    map: any;
    ac: any;
    search: import("lodash").DebouncedFunc<() => void>;
    convertor: any;
    componentDidMount(): void;
    componentWillUnmount(): void;
    initMap(): Promise<void>;
    getLocations(point: any, select?: boolean): void;
    handleChange(e: React.ChangeEvent<HTMLInputElement>): void;
    handleSelect(e: React.MouseEvent<HTMLElement>): void;
    covertPoint(point: any, from: number, to: number): Promise<unknown>;
    triggerOnChange(loc: LocationItem): void;
    handleSugSelect(e: React.MouseEvent<HTMLDivElement>): void;
    render(): JSX.Element;
}
declare const _default: {
    new (props: (Omit<MapPickerProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<MapPickerProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<MapPickerProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<MapPickerProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<MapPickerProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<MapPickerProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<MapPickerProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<MapPickerProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<MapPickerProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<MapPickerProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<MapPickerProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Omit<MapPickerProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<MapPickerProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<MapPickerProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<MapPickerProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<MapPickerProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<MapPickerProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<MapPickerProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<MapPickerProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<MapPickerProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<MapPickerProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof BaiduMapPicker>;
} & import("hoist-non-react-statics").NonReactStatics<typeof BaiduMapPicker, {}> & {
    ComposedComponent: typeof BaiduMapPicker;
};
export default _default;
