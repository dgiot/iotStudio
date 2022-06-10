/**
 * @file Tabs
 * @description 选项卡
 * @author fex
 */
/// <reference types="hoist-non-react-statics" />
/// <reference types="lodash" />
import React from 'react';
import { Schema } from '../types';
import { ThemeProps } from '../theme';
import { SchemaClassName } from '../Schema';
export interface TabProps extends ThemeProps {
    title?: string | React.ReactNode;
    icon?: string;
    iconPosition?: 'left' | 'right';
    disabled?: boolean | string;
    eventKey: string | number;
    tab?: Schema;
    className?: string;
    activeKey?: string | number;
    reload?: boolean;
    mountOnEnter?: boolean;
    unmountOnExit?: boolean;
    toolbar?: React.ReactNode;
}
declare class TabComponent extends React.PureComponent<TabProps> {
    contentDom: any;
    contentRef: (ref: any) => any;
    render(): JSX.Element;
}
export declare const Tab: {
    new (props: (Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof TabComponent>;
} & import("hoist-non-react-statics").NonReactStatics<typeof TabComponent, {}> & {
    ComposedComponent: typeof TabComponent;
};
export interface TabsProps extends ThemeProps {
    mode: '' | 'line' | 'card' | 'radio' | 'vertical' | 'chrome';
    tabsMode?: '' | 'line' | 'card' | 'radio' | 'vertical' | 'chrome';
    additionBtns?: React.ReactNode;
    onSelect?: (key: string | number) => void;
    activeKey?: string | number;
    contentClassName: string;
    linksClassName?: SchemaClassName;
    className?: string;
    tabs?: Array<TabProps>;
    tabRender?: (tab: TabProps, props?: TabsProps) => JSX.Element;
    toolbar?: React.ReactNode;
    scrollable?: boolean;
}
export declare class Tabs extends React.Component<TabsProps, any> {
    static defaultProps: Pick<TabsProps, 'mode' | 'contentClassName'>;
    static Tab: {
        new (props: (Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>): {
            render(): JSX.Element;
            context: any;
            setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<{}>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<{}>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<TabProps, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof TabComponent>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof TabComponent, {}> & {
        ComposedComponent: typeof TabComponent;
    };
    navMain: React.RefObject<HTMLDivElement>;
    scroll: boolean;
    checkArrowStatus: import("lodash").DebouncedFunc<() => void>;
    constructor(props: TabsProps);
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    /**
     * 处理内容与容器之间的位置关系
     */
    computedWidth(): void;
    /**
     * 保证选中的tab始终显示在可视区域
     */
    showSelected(key?: string | number): void;
    handleSelect(key: string | number): void;
    handleArrow(type: 'left' | 'right'): void;
    /**
     * 监听导航上的滚动事件
     */
    handleWheel(e: WheelEvent): void;
    renderNav(child: any, index: number): JSX.Element | undefined;
    renderTab(child: any, index: number): React.DetailedReactHTMLElement<any, HTMLElement> | undefined;
    renderArrow(type: 'left' | 'right'): JSX.Element | null | undefined;
    render(): JSX.Element | null;
}
declare const _default: {
    new (props: (Pick<Omit<TabsProps, keyof ThemeProps>, "toolbar" | "onSelect" | "tabs" | "activeKey" | "tabsMode" | "additionBtns" | "linksClassName" | "tabRender" | "scrollable"> & Partial<Pick<Omit<TabsProps, keyof ThemeProps>, "mode" | "contentClassName">> & Partial<Pick<Pick<TabsProps, "mode" | "contentClassName">, never>> & import("../theme").ThemeOutterProps) | Readonly<Pick<Omit<TabsProps, keyof ThemeProps>, "toolbar" | "onSelect" | "tabs" | "activeKey" | "tabsMode" | "additionBtns" | "linksClassName" | "tabRender" | "scrollable"> & Partial<Pick<Omit<TabsProps, keyof ThemeProps>, "mode" | "contentClassName">> & Partial<Pick<Pick<TabsProps, "mode" | "contentClassName">, never>> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<TabsProps, keyof ThemeProps>, "toolbar" | "onSelect" | "tabs" | "activeKey" | "tabsMode" | "additionBtns" | "linksClassName" | "tabRender" | "scrollable"> & Partial<Pick<Omit<TabsProps, keyof ThemeProps>, "mode" | "contentClassName">> & Partial<Pick<Pick<TabsProps, "mode" | "contentClassName">, never>> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<TabsProps, keyof ThemeProps>, "toolbar" | "onSelect" | "tabs" | "activeKey" | "tabsMode" | "additionBtns" | "linksClassName" | "tabRender" | "scrollable"> & Partial<Pick<Omit<TabsProps, keyof ThemeProps>, "mode" | "contentClassName">> & Partial<Pick<Pick<TabsProps, "mode" | "contentClassName">, never>> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<TabsProps, keyof ThemeProps>, "toolbar" | "onSelect" | "tabs" | "activeKey" | "tabsMode" | "additionBtns" | "linksClassName" | "tabRender" | "scrollable"> & Partial<Pick<Omit<TabsProps, keyof ThemeProps>, "mode" | "contentClassName">> & Partial<Pick<Pick<TabsProps, "mode" | "contentClassName">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<TabsProps, keyof ThemeProps>, "toolbar" | "onSelect" | "tabs" | "activeKey" | "tabsMode" | "additionBtns" | "linksClassName" | "tabRender" | "scrollable"> & Partial<Pick<Omit<TabsProps, keyof ThemeProps>, "mode" | "contentClassName">> & Partial<Pick<Pick<TabsProps, "mode" | "contentClassName">, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<TabsProps, keyof ThemeProps>, "toolbar" | "onSelect" | "tabs" | "activeKey" | "tabsMode" | "additionBtns" | "linksClassName" | "tabRender" | "scrollable"> & Partial<Pick<Omit<TabsProps, keyof ThemeProps>, "mode" | "contentClassName">> & Partial<Pick<Pick<TabsProps, "mode" | "contentClassName">, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TabsProps, keyof ThemeProps>, "toolbar" | "onSelect" | "tabs" | "activeKey" | "tabsMode" | "additionBtns" | "linksClassName" | "tabRender" | "scrollable"> & Partial<Pick<Omit<TabsProps, keyof ThemeProps>, "mode" | "contentClassName">> & Partial<Pick<Pick<TabsProps, "mode" | "contentClassName">, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TabsProps, keyof ThemeProps>, "toolbar" | "onSelect" | "tabs" | "activeKey" | "tabsMode" | "additionBtns" | "linksClassName" | "tabRender" | "scrollable"> & Partial<Pick<Omit<TabsProps, keyof ThemeProps>, "mode" | "contentClassName">> & Partial<Pick<Pick<TabsProps, "mode" | "contentClassName">, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<TabsProps, keyof ThemeProps>, "toolbar" | "onSelect" | "tabs" | "activeKey" | "tabsMode" | "additionBtns" | "linksClassName" | "tabRender" | "scrollable"> & Partial<Pick<Omit<TabsProps, keyof ThemeProps>, "mode" | "contentClassName">> & Partial<Pick<Pick<TabsProps, "mode" | "contentClassName">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<TabsProps, keyof ThemeProps>, "toolbar" | "onSelect" | "tabs" | "activeKey" | "tabsMode" | "additionBtns" | "linksClassName" | "tabRender" | "scrollable"> & Partial<Pick<Omit<TabsProps, keyof ThemeProps>, "mode" | "contentClassName">> & Partial<Pick<Pick<TabsProps, "mode" | "contentClassName">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Pick<Omit<TabsProps, keyof ThemeProps>, "toolbar" | "onSelect" | "tabs" | "activeKey" | "tabsMode" | "additionBtns" | "linksClassName" | "tabRender" | "scrollable"> & Partial<Pick<Omit<TabsProps, keyof ThemeProps>, "mode" | "contentClassName">> & Partial<Pick<Pick<TabsProps, "mode" | "contentClassName">, never>> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<TabsProps, keyof ThemeProps>, "toolbar" | "onSelect" | "tabs" | "activeKey" | "tabsMode" | "additionBtns" | "linksClassName" | "tabRender" | "scrollable"> & Partial<Pick<Omit<TabsProps, keyof ThemeProps>, "mode" | "contentClassName">> & Partial<Pick<Pick<TabsProps, "mode" | "contentClassName">, never>> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<TabsProps, keyof ThemeProps>, "toolbar" | "onSelect" | "tabs" | "activeKey" | "tabsMode" | "additionBtns" | "linksClassName" | "tabRender" | "scrollable"> & Partial<Pick<Omit<TabsProps, keyof ThemeProps>, "mode" | "contentClassName">> & Partial<Pick<Pick<TabsProps, "mode" | "contentClassName">, never>> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<TabsProps, keyof ThemeProps>, "toolbar" | "onSelect" | "tabs" | "activeKey" | "tabsMode" | "additionBtns" | "linksClassName" | "tabRender" | "scrollable"> & Partial<Pick<Omit<TabsProps, keyof ThemeProps>, "mode" | "contentClassName">> & Partial<Pick<Pick<TabsProps, "mode" | "contentClassName">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<TabsProps, keyof ThemeProps>, "toolbar" | "onSelect" | "tabs" | "activeKey" | "tabsMode" | "additionBtns" | "linksClassName" | "tabRender" | "scrollable"> & Partial<Pick<Omit<TabsProps, keyof ThemeProps>, "mode" | "contentClassName">> & Partial<Pick<Pick<TabsProps, "mode" | "contentClassName">, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<TabsProps, keyof ThemeProps>, "toolbar" | "onSelect" | "tabs" | "activeKey" | "tabsMode" | "additionBtns" | "linksClassName" | "tabRender" | "scrollable"> & Partial<Pick<Omit<TabsProps, keyof ThemeProps>, "mode" | "contentClassName">> & Partial<Pick<Pick<TabsProps, "mode" | "contentClassName">, never>> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TabsProps, keyof ThemeProps>, "toolbar" | "onSelect" | "tabs" | "activeKey" | "tabsMode" | "additionBtns" | "linksClassName" | "tabRender" | "scrollable"> & Partial<Pick<Omit<TabsProps, keyof ThemeProps>, "mode" | "contentClassName">> & Partial<Pick<Pick<TabsProps, "mode" | "contentClassName">, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<TabsProps, keyof ThemeProps>, "toolbar" | "onSelect" | "tabs" | "activeKey" | "tabsMode" | "additionBtns" | "linksClassName" | "tabRender" | "scrollable"> & Partial<Pick<Omit<TabsProps, keyof ThemeProps>, "mode" | "contentClassName">> & Partial<Pick<Pick<TabsProps, "mode" | "contentClassName">, never>> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<TabsProps, keyof ThemeProps>, "toolbar" | "onSelect" | "tabs" | "activeKey" | "tabsMode" | "additionBtns" | "linksClassName" | "tabRender" | "scrollable"> & Partial<Pick<Omit<TabsProps, keyof ThemeProps>, "mode" | "contentClassName">> & Partial<Pick<Pick<TabsProps, "mode" | "contentClassName">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<TabsProps, keyof ThemeProps>, "toolbar" | "onSelect" | "tabs" | "activeKey" | "tabsMode" | "additionBtns" | "linksClassName" | "tabRender" | "scrollable"> & Partial<Pick<Omit<TabsProps, keyof ThemeProps>, "mode" | "contentClassName">> & Partial<Pick<Pick<TabsProps, "mode" | "contentClassName">, never>> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof Tabs>;
} & import("hoist-non-react-statics").NonReactStatics<typeof Tabs, {}> & {
    ComposedComponent: typeof Tabs;
} & {
    Tab: typeof Tab;
};
export default _default;
