/// <reference types="hoist-non-react-statics" />
import { ClassNamesFn } from '../theme';
import React from 'react';
interface ContextMenuProps {
    className?: string;
    classPrefix: string;
    classnames: ClassNamesFn;
    container?: HTMLElement | null | (() => HTMLElement);
}
export declare type MenuItem = {
    label: string;
    icon?: string;
    disabled?: boolean;
    children?: Array<MenuItem | MenuDivider>;
    data?: any;
    className?: string;
    onSelect?: (data: any) => void;
    onHighlight?: (isHiglight: boolean, data: any) => void;
};
export declare type MenuDivider = '|';
interface ContextMenuState {
    isOpened: boolean;
    menus: Array<MenuItem | MenuDivider>;
    x: number;
    y: number;
    align?: 'left' | 'right';
    onClose?: () => void;
}
export declare class ContextMenu extends React.Component<ContextMenuProps, ContextMenuState> {
    static instance: any;
    static getInstance(): any;
    state: ContextMenuState;
    menuRef: React.RefObject<HTMLDivElement>;
    originInstance: this | null;
    constructor(props: ContextMenuProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    openContextMenus(info: {
        x: number;
        y: number;
    }, menus: Array<MenuItem>, onClose?: () => void): void;
    close(): void;
    handleOutClick(e: Event): void;
    handleClick(item: MenuItem): void;
    handleKeyDown(e: KeyboardEvent): void;
    handleMouseEnter(item: MenuItem): void;
    handleMouseLeave(item: MenuItem): void;
    handleEnter(menu: HTMLElement): void;
    handleSelfContextMenu(e: React.MouseEvent): void;
    renderMenus(menus: Array<MenuItem | MenuDivider>): JSX.Element[];
    render(): JSX.Element;
}
export declare const ThemedContextMenu: {
    new (props: (Omit<ContextMenuProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<ContextMenuProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<ContextMenuProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<ContextMenuProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<ContextMenuProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<ContextMenuProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<ContextMenuProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<ContextMenuProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<ContextMenuProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<ContextMenuProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<ContextMenuProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Omit<ContextMenuProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<ContextMenuProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<ContextMenuProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<ContextMenuProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<ContextMenuProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<ContextMenuProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<ContextMenuProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<ContextMenuProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<ContextMenuProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<ContextMenuProps, keyof import("../theme").ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof ContextMenu>;
} & import("hoist-non-react-statics").NonReactStatics<typeof ContextMenu, {}> & {
    ComposedComponent: typeof ContextMenu;
};
export default ThemedContextMenu;
export declare function openContextMenus(info: Event | {
    x: number;
    y: number;
}, menus: Array<MenuItem | MenuDivider>, onClose?: () => void): any;
