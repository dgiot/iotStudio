import React from 'react';
import { RendererConfig, RendererEnv, RendererProps } from './factory';
import { Schema, SchemaNode } from './types';
interface SchemaRendererProps extends Partial<RendererProps> {
    schema: Schema;
    $path: string;
    env: RendererEnv;
}
export declare class SchemaRenderer extends React.Component<SchemaRendererProps, any> {
    static displayName: string;
    rendererKey: string;
    renderer: RendererConfig | null;
    ref: any;
    schema: any;
    path: string;
    constructor(props: SchemaRendererProps);
    shouldComponentUpdate(nextProps: SchemaRendererProps): boolean;
    resolveRenderer(props: SchemaRendererProps, force?: boolean): any;
    getWrappedInstance(): any;
    refFn(ref: any): void;
    renderChild(region: string, node?: SchemaNode, subProps?: {
        data?: object;
        [propName: string]: any;
    }): import("./Root").ReactElement;
    reRender(): void;
    render(): JSX.Element | null;
}
export {};
