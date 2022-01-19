/**
 * @file 用来创建一个域，在这个域里面会把里面的运行时实例注册进来，方便组件之间的通信。
 * @author fex
 */
import React from 'react';
import { RendererEnv, RendererProps } from './factory';
import { RendererData, Action } from './types';
export interface ScopedComponentType extends React.Component<RendererProps> {
    focus?: () => void;
    doAction?: (action: Action, data: RendererData, throwErrors?: boolean) => void;
    receive?: (values: RendererData, subPath?: string) => void;
    reload?: (subPath?: string, query?: RendererData | null, ctx?: RendererData) => void;
    context: any;
}
export interface IScopedContext {
    parent?: AliasIScopedContext;
    registerComponent: (component: ScopedComponentType) => void;
    unRegisterComponent: (component: ScopedComponentType) => void;
    getComponentByName: (name: string) => ScopedComponentType;
    getComponents: () => Array<ScopedComponentType>;
    reload: (target: string, ctx: RendererData) => void;
    send: (target: string, ctx: RendererData) => void;
    close: (target: string) => void;
}
declare type AliasIScopedContext = IScopedContext;
export declare const ScopedContext: React.Context<IScopedContext>;
export declare function HocScoped<T extends {
    $path?: string;
    env: RendererEnv;
}>(ComposedComponent: React.ComponentType<T>): React.ComponentType<T & {
    scopeRef?: (ref: any) => void;
}> & {
    ComposedComponent: React.ComponentType<T>;
};
export default HocScoped;
