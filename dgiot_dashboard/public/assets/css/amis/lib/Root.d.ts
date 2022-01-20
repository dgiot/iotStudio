import React from 'react';
import { RendererEnv } from './env';
import { RendererProps } from './factory';
import { TranslateFn } from './locale';
import { IRendererStore } from './store';
import { SchemaNode } from './types';
export interface RootRenderProps {
    location?: Location;
    theme?: string;
    [propName: string]: any;
}
export interface RootProps {
    schema: SchemaNode;
    rootStore: IRendererStore;
    env: RendererEnv;
    theme: string;
    pathPrefix?: string;
    locale?: string;
    translate?: TranslateFn;
    [propName: string]: any;
}
export declare class Root extends React.Component<RootProps> {
    resolveDefinitions(name: string): {} | undefined;
    render(): JSX.Element;
}
export interface renderChildProps extends Partial<RendererProps> {
    env: RendererEnv;
}
export declare type ReactElement = React.ReactNode[] | JSX.Element | null | false;
export declare function renderChildren(prefix: string, node: SchemaNode, props: renderChildProps): ReactElement;
export declare function renderChild(prefix: string, node: SchemaNode, props: renderChildProps): ReactElement;
declare const _default: React.ComponentType<RootProps & {
    scopeRef?: ((ref: any) => void) | undefined;
}> & {
    ComposedComponent: React.ComponentType<RootProps>;
};
export default _default;
