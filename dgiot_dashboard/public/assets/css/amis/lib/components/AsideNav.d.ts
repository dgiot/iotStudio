/**
 * @file AsideNav
 * @description 左侧导航。
 * @author fex
 */
/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { ClassNamesFn } from '../theme';
export declare type LinkItem = LinkItemProps;
interface LinkItemProps {
    id?: number;
    label: string;
    hidden?: boolean;
    open?: boolean;
    active?: boolean;
    className?: string;
    children?: Array<LinkItem>;
    path?: string;
    icon?: string;
    component?: React.ReactType;
}
export interface Navigation {
    label: string;
    children: Array<LinkItem>;
    prefix?: JSX.Element;
    affix?: JSX.Element;
    className?: string;
    [propName: string]: any;
}
export interface AsideNavProps {
    id?: string;
    className?: string;
    classPrefix: string;
    classnames: ClassNamesFn;
    renderLink: Function;
    isActive: Function;
    isOpen: (link: LinkItemProps) => boolean;
    navigations: Array<Navigation>;
    renderSubLinks: (link: LinkItemProps, renderLink: Function, depth: number, props: AsideNavProps) => React.ReactNode;
}
interface AsideNavState {
    navigations: Array<Navigation>;
}
export declare class AsideNav extends React.Component<AsideNavProps, AsideNavState> {
    static defaultProps: {
        renderLink: (item: LinkItemProps) => JSX.Element;
        renderSubLinks: (link: LinkItemProps, renderLink: Function, depth: number, { classnames: cx }: AsideNavProps) => JSX.Element | null;
        isActive: (link: LinkItem) => boolean | undefined;
        isOpen: (item: LinkItemProps) => boolean;
    };
    constructor(props: AsideNavProps);
    componentDidUpdate(prevProps: AsideNavProps): void;
    toggleExpand(link: LinkItemProps, e?: React.MouseEvent<HTMLElement>): void;
    renderLink(link: LinkItemProps, key: any, props?: Partial<AsideNavProps>, depth?: number): React.ReactNode;
    render(): JSX.Element;
}
declare const _default: {
    new (props: (Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "id" | "navigations"> & Partial<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "renderLink" | "isActive" | "isOpen" | "renderSubLinks">> & Partial<Pick<{
        renderLink: (item: LinkItemProps) => JSX.Element;
        renderSubLinks: (link: LinkItemProps, renderLink: Function, depth: number, { classnames: cx }: AsideNavProps) => JSX.Element | null;
        isActive: (link: LinkItemProps) => boolean | undefined;
        isOpen: (item: LinkItemProps) => boolean;
    }, never>> & import("../theme").ThemeOutterProps) | Readonly<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "id" | "navigations"> & Partial<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "renderLink" | "isActive" | "isOpen" | "renderSubLinks">> & Partial<Pick<{
        renderLink: (item: LinkItemProps) => JSX.Element;
        renderSubLinks: (link: LinkItemProps, renderLink: Function, depth: number, { classnames: cx }: AsideNavProps) => JSX.Element | null;
        isActive: (link: LinkItemProps) => boolean | undefined;
        isOpen: (item: LinkItemProps) => boolean;
    }, never>> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "id" | "navigations"> & Partial<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "renderLink" | "isActive" | "isOpen" | "renderSubLinks">> & Partial<Pick<{
            renderLink: (item: LinkItemProps) => JSX.Element;
            renderSubLinks: (link: LinkItemProps, renderLink: Function, depth: number, { classnames: cx }: AsideNavProps) => JSX.Element | null;
            isActive: (link: LinkItemProps) => boolean | undefined;
            isOpen: (item: LinkItemProps) => boolean;
        }, never>> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "id" | "navigations"> & Partial<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "renderLink" | "isActive" | "isOpen" | "renderSubLinks">> & Partial<Pick<{
            renderLink: (item: LinkItemProps) => JSX.Element;
            renderSubLinks: (link: LinkItemProps, renderLink: Function, depth: number, { classnames: cx }: AsideNavProps) => JSX.Element | null;
            isActive: (link: LinkItemProps) => boolean | undefined;
            isOpen: (item: LinkItemProps) => boolean;
        }, never>> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "id" | "navigations"> & Partial<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "renderLink" | "isActive" | "isOpen" | "renderSubLinks">> & Partial<Pick<{
            renderLink: (item: LinkItemProps) => JSX.Element;
            renderSubLinks: (link: LinkItemProps, renderLink: Function, depth: number, { classnames: cx }: AsideNavProps) => JSX.Element | null;
            isActive: (link: LinkItemProps) => boolean | undefined;
            isOpen: (item: LinkItemProps) => boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "id" | "navigations"> & Partial<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "renderLink" | "isActive" | "isOpen" | "renderSubLinks">> & Partial<Pick<{
            renderLink: (item: LinkItemProps) => JSX.Element;
            renderSubLinks: (link: LinkItemProps, renderLink: Function, depth: number, { classnames: cx }: AsideNavProps) => JSX.Element | null;
            isActive: (link: LinkItemProps) => boolean | undefined;
            isOpen: (item: LinkItemProps) => boolean;
        }, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "id" | "navigations"> & Partial<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "renderLink" | "isActive" | "isOpen" | "renderSubLinks">> & Partial<Pick<{
            renderLink: (item: LinkItemProps) => JSX.Element;
            renderSubLinks: (link: LinkItemProps, renderLink: Function, depth: number, { classnames: cx }: AsideNavProps) => JSX.Element | null;
            isActive: (link: LinkItemProps) => boolean | undefined;
            isOpen: (item: LinkItemProps) => boolean;
        }, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "id" | "navigations"> & Partial<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "renderLink" | "isActive" | "isOpen" | "renderSubLinks">> & Partial<Pick<{
            renderLink: (item: LinkItemProps) => JSX.Element;
            renderSubLinks: (link: LinkItemProps, renderLink: Function, depth: number, { classnames: cx }: AsideNavProps) => JSX.Element | null;
            isActive: (link: LinkItemProps) => boolean | undefined;
            isOpen: (item: LinkItemProps) => boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "id" | "navigations"> & Partial<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "renderLink" | "isActive" | "isOpen" | "renderSubLinks">> & Partial<Pick<{
            renderLink: (item: LinkItemProps) => JSX.Element;
            renderSubLinks: (link: LinkItemProps, renderLink: Function, depth: number, { classnames: cx }: AsideNavProps) => JSX.Element | null;
            isActive: (link: LinkItemProps) => boolean | undefined;
            isOpen: (item: LinkItemProps) => boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "id" | "navigations"> & Partial<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "renderLink" | "isActive" | "isOpen" | "renderSubLinks">> & Partial<Pick<{
            renderLink: (item: LinkItemProps) => JSX.Element;
            renderSubLinks: (link: LinkItemProps, renderLink: Function, depth: number, { classnames: cx }: AsideNavProps) => JSX.Element | null;
            isActive: (link: LinkItemProps) => boolean | undefined;
            isOpen: (item: LinkItemProps) => boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "id" | "navigations"> & Partial<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "renderLink" | "isActive" | "isOpen" | "renderSubLinks">> & Partial<Pick<{
            renderLink: (item: LinkItemProps) => JSX.Element;
            renderSubLinks: (link: LinkItemProps, renderLink: Function, depth: number, { classnames: cx }: AsideNavProps) => JSX.Element | null;
            isActive: (link: LinkItemProps) => boolean | undefined;
            isOpen: (item: LinkItemProps) => boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "id" | "navigations"> & Partial<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "renderLink" | "isActive" | "isOpen" | "renderSubLinks">> & Partial<Pick<{
        renderLink: (item: LinkItemProps) => JSX.Element;
        renderSubLinks: (link: LinkItemProps, renderLink: Function, depth: number, { classnames: cx }: AsideNavProps) => JSX.Element | null;
        isActive: (link: LinkItemProps) => boolean | undefined;
        isOpen: (item: LinkItemProps) => boolean;
    }, never>> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "id" | "navigations"> & Partial<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "renderLink" | "isActive" | "isOpen" | "renderSubLinks">> & Partial<Pick<{
            renderLink: (item: LinkItemProps) => JSX.Element;
            renderSubLinks: (link: LinkItemProps, renderLink: Function, depth: number, { classnames: cx }: AsideNavProps) => JSX.Element | null;
            isActive: (link: LinkItemProps) => boolean | undefined;
            isOpen: (item: LinkItemProps) => boolean;
        }, never>> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "id" | "navigations"> & Partial<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "renderLink" | "isActive" | "isOpen" | "renderSubLinks">> & Partial<Pick<{
            renderLink: (item: LinkItemProps) => JSX.Element;
            renderSubLinks: (link: LinkItemProps, renderLink: Function, depth: number, { classnames: cx }: AsideNavProps) => JSX.Element | null;
            isActive: (link: LinkItemProps) => boolean | undefined;
            isOpen: (item: LinkItemProps) => boolean;
        }, never>> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "id" | "navigations"> & Partial<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "renderLink" | "isActive" | "isOpen" | "renderSubLinks">> & Partial<Pick<{
            renderLink: (item: LinkItemProps) => JSX.Element;
            renderSubLinks: (link: LinkItemProps, renderLink: Function, depth: number, { classnames: cx }: AsideNavProps) => JSX.Element | null;
            isActive: (link: LinkItemProps) => boolean | undefined;
            isOpen: (item: LinkItemProps) => boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "id" | "navigations"> & Partial<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "renderLink" | "isActive" | "isOpen" | "renderSubLinks">> & Partial<Pick<{
            renderLink: (item: LinkItemProps) => JSX.Element;
            renderSubLinks: (link: LinkItemProps, renderLink: Function, depth: number, { classnames: cx }: AsideNavProps) => JSX.Element | null;
            isActive: (link: LinkItemProps) => boolean | undefined;
            isOpen: (item: LinkItemProps) => boolean;
        }, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "id" | "navigations"> & Partial<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "renderLink" | "isActive" | "isOpen" | "renderSubLinks">> & Partial<Pick<{
            renderLink: (item: LinkItemProps) => JSX.Element;
            renderSubLinks: (link: LinkItemProps, renderLink: Function, depth: number, { classnames: cx }: AsideNavProps) => JSX.Element | null;
            isActive: (link: LinkItemProps) => boolean | undefined;
            isOpen: (item: LinkItemProps) => boolean;
        }, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "id" | "navigations"> & Partial<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "renderLink" | "isActive" | "isOpen" | "renderSubLinks">> & Partial<Pick<{
            renderLink: (item: LinkItemProps) => JSX.Element;
            renderSubLinks: (link: LinkItemProps, renderLink: Function, depth: number, { classnames: cx }: AsideNavProps) => JSX.Element | null;
            isActive: (link: LinkItemProps) => boolean | undefined;
            isOpen: (item: LinkItemProps) => boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "id" | "navigations"> & Partial<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "renderLink" | "isActive" | "isOpen" | "renderSubLinks">> & Partial<Pick<{
            renderLink: (item: LinkItemProps) => JSX.Element;
            renderSubLinks: (link: LinkItemProps, renderLink: Function, depth: number, { classnames: cx }: AsideNavProps) => JSX.Element | null;
            isActive: (link: LinkItemProps) => boolean | undefined;
            isOpen: (item: LinkItemProps) => boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "id" | "navigations"> & Partial<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "renderLink" | "isActive" | "isOpen" | "renderSubLinks">> & Partial<Pick<{
            renderLink: (item: LinkItemProps) => JSX.Element;
            renderSubLinks: (link: LinkItemProps, renderLink: Function, depth: number, { classnames: cx }: AsideNavProps) => JSX.Element | null;
            isActive: (link: LinkItemProps) => boolean | undefined;
            isOpen: (item: LinkItemProps) => boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "id" | "navigations"> & Partial<Pick<Omit<AsideNavProps, keyof import("../theme").ThemeProps>, "renderLink" | "isActive" | "isOpen" | "renderSubLinks">> & Partial<Pick<{
            renderLink: (item: LinkItemProps) => JSX.Element;
            renderSubLinks: (link: LinkItemProps, renderLink: Function, depth: number, { classnames: cx }: AsideNavProps) => JSX.Element | null;
            isActive: (link: LinkItemProps) => boolean | undefined;
            isOpen: (item: LinkItemProps) => boolean;
        }, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof AsideNav>;
} & import("hoist-non-react-statics").NonReactStatics<typeof AsideNav, {}> & {
    ComposedComponent: typeof AsideNav;
};
export default _default;
