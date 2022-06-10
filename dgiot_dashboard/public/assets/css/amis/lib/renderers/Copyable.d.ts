/**
 * @file scoped.jsx.
 * @author fex
 */
import React from 'react';
import { RendererProps } from '../factory';
import { SchemaIcon, SchemaTpl } from '../Schema';
export interface SchemaCopyableObject {
    /**
     * 可以配置图标
     */
    icon?: SchemaIcon;
    /**
     * 配置复制时的内容模板。
     */
    content?: SchemaTpl;
}
export declare type SchemaCopyable = boolean | SchemaCopyableObject;
export interface CopyableProps extends RendererProps {
    name?: string;
    label?: string;
    copyable: SchemaCopyable;
}
export declare const HocCopyable: () => (Component: React.ComponentType<any>) => any;
export default HocCopyable;
