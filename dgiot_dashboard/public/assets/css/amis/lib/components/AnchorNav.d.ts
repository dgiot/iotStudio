/**
 * @file AnchorNav
 * @description 锚点导航
 * @author hsm-lv
 */
/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { Schema } from '../types';
import { ThemeProps } from '../theme';
import { PlainObject } from '../types';
export interface AnchorNavSectionProps extends ThemeProps {
    title?: string;
    name: string | number;
    body?: Schema;
    className?: string;
}
declare class AnchorNavSectionComponent extends React.PureComponent<AnchorNavSectionProps> {
    contentDom: any;
    contentRef: (ref: any) => any;
    render(): JSX.Element;
}
export declare const AnchorNavSection: {
    new (props: (Omit<AnchorNavSectionProps, keyof ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<AnchorNavSectionProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<AnchorNavSectionProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<AnchorNavSectionProps, keyof ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<AnchorNavSectionProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<AnchorNavSectionProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<AnchorNavSectionProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<AnchorNavSectionProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<AnchorNavSectionProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<AnchorNavSectionProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<AnchorNavSectionProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Omit<AnchorNavSectionProps, keyof ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<AnchorNavSectionProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<AnchorNavSectionProps, keyof ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<AnchorNavSectionProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<AnchorNavSectionProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<AnchorNavSectionProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<AnchorNavSectionProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<AnchorNavSectionProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<AnchorNavSectionProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<AnchorNavSectionProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof AnchorNavSectionComponent>;
} & import("hoist-non-react-statics").NonReactStatics<typeof AnchorNavSectionComponent, {}> & {
    ComposedComponent: typeof AnchorNavSectionComponent;
};
export interface AnchorNavProps extends ThemeProps {
    links?: Array<AnchorNavSectionProps>;
    active?: string | number;
    linkClassName?: string;
    sectionClassName?: string;
    sectionRender?: (section: AnchorNavSectionProps, props?: AnchorNavProps) => JSX.Element;
    onSelect?: (key: string | number) => void;
}
export interface AnchorNavState {
    offsetArr: PlainObject[];
    fromSelect: boolean;
}
export declare class AnchorNav extends React.Component<AnchorNavProps, AnchorNavState> {
    static defaultProps: Pick<AnchorNavProps, 'linkClassName' | 'sectionClassName'>;
    contentDom: React.RefObject<HTMLDivElement>;
    componentDidMount(): void;
    scrollToNav(e: Event): void;
    scrollToSection(key: string | number): void;
    handleSelect(key: string | number): void;
    fireSelect(key: string | number): void;
    renderLink(link: any, index: number): JSX.Element | undefined;
    renderSection(section: any, index: number): React.DetailedReactHTMLElement<any, HTMLElement> | undefined;
    render(): JSX.Element | null;
}
declare const _default: {
    new (props: (Pick<Omit<AnchorNavProps, keyof ThemeProps>, "active" | "links" | "onSelect" | "sectionRender"> & Partial<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "linkClassName" | "sectionClassName">> & Partial<Pick<Pick<AnchorNavProps, "linkClassName" | "sectionClassName">, never>> & import("../theme").ThemeOutterProps) | Readonly<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "active" | "links" | "onSelect" | "sectionRender"> & Partial<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "linkClassName" | "sectionClassName">> & Partial<Pick<Pick<AnchorNavProps, "linkClassName" | "sectionClassName">, never>> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "active" | "links" | "onSelect" | "sectionRender"> & Partial<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "linkClassName" | "sectionClassName">> & Partial<Pick<Pick<AnchorNavProps, "linkClassName" | "sectionClassName">, never>> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "active" | "links" | "onSelect" | "sectionRender"> & Partial<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "linkClassName" | "sectionClassName">> & Partial<Pick<Pick<AnchorNavProps, "linkClassName" | "sectionClassName">, never>> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "active" | "links" | "onSelect" | "sectionRender"> & Partial<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "linkClassName" | "sectionClassName">> & Partial<Pick<Pick<AnchorNavProps, "linkClassName" | "sectionClassName">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "active" | "links" | "onSelect" | "sectionRender"> & Partial<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "linkClassName" | "sectionClassName">> & Partial<Pick<Pick<AnchorNavProps, "linkClassName" | "sectionClassName">, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "active" | "links" | "onSelect" | "sectionRender"> & Partial<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "linkClassName" | "sectionClassName">> & Partial<Pick<Pick<AnchorNavProps, "linkClassName" | "sectionClassName">, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "active" | "links" | "onSelect" | "sectionRender"> & Partial<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "linkClassName" | "sectionClassName">> & Partial<Pick<Pick<AnchorNavProps, "linkClassName" | "sectionClassName">, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "active" | "links" | "onSelect" | "sectionRender"> & Partial<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "linkClassName" | "sectionClassName">> & Partial<Pick<Pick<AnchorNavProps, "linkClassName" | "sectionClassName">, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "active" | "links" | "onSelect" | "sectionRender"> & Partial<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "linkClassName" | "sectionClassName">> & Partial<Pick<Pick<AnchorNavProps, "linkClassName" | "sectionClassName">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "active" | "links" | "onSelect" | "sectionRender"> & Partial<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "linkClassName" | "sectionClassName">> & Partial<Pick<Pick<AnchorNavProps, "linkClassName" | "sectionClassName">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Pick<Omit<AnchorNavProps, keyof ThemeProps>, "active" | "links" | "onSelect" | "sectionRender"> & Partial<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "linkClassName" | "sectionClassName">> & Partial<Pick<Pick<AnchorNavProps, "linkClassName" | "sectionClassName">, never>> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "active" | "links" | "onSelect" | "sectionRender"> & Partial<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "linkClassName" | "sectionClassName">> & Partial<Pick<Pick<AnchorNavProps, "linkClassName" | "sectionClassName">, never>> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "active" | "links" | "onSelect" | "sectionRender"> & Partial<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "linkClassName" | "sectionClassName">> & Partial<Pick<Pick<AnchorNavProps, "linkClassName" | "sectionClassName">, never>> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "active" | "links" | "onSelect" | "sectionRender"> & Partial<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "linkClassName" | "sectionClassName">> & Partial<Pick<Pick<AnchorNavProps, "linkClassName" | "sectionClassName">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "active" | "links" | "onSelect" | "sectionRender"> & Partial<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "linkClassName" | "sectionClassName">> & Partial<Pick<Pick<AnchorNavProps, "linkClassName" | "sectionClassName">, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "active" | "links" | "onSelect" | "sectionRender"> & Partial<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "linkClassName" | "sectionClassName">> & Partial<Pick<Pick<AnchorNavProps, "linkClassName" | "sectionClassName">, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "active" | "links" | "onSelect" | "sectionRender"> & Partial<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "linkClassName" | "sectionClassName">> & Partial<Pick<Pick<AnchorNavProps, "linkClassName" | "sectionClassName">, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "active" | "links" | "onSelect" | "sectionRender"> & Partial<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "linkClassName" | "sectionClassName">> & Partial<Pick<Pick<AnchorNavProps, "linkClassName" | "sectionClassName">, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "active" | "links" | "onSelect" | "sectionRender"> & Partial<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "linkClassName" | "sectionClassName">> & Partial<Pick<Pick<AnchorNavProps, "linkClassName" | "sectionClassName">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "active" | "links" | "onSelect" | "sectionRender"> & Partial<Pick<Omit<AnchorNavProps, keyof ThemeProps>, "linkClassName" | "sectionClassName">> & Partial<Pick<Pick<AnchorNavProps, "linkClassName" | "sectionClassName">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof AnchorNav>;
} & import("hoist-non-react-statics").NonReactStatics<typeof AnchorNav, {}> & {
    ComposedComponent: typeof AnchorNav;
} & {
    AnchorNavSection: typeof AnchorNavSection;
};
export default _default;
