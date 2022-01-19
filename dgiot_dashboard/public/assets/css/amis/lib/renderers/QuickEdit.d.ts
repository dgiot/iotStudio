/**
 * @file scoped.jsx.
 * @author fex
 */
import React from 'react';
import { RendererProps } from '../factory';
import { SchemaCollection, SchemaObject } from '../Schema';
export declare type SchemaQuickEditObject = 
/**
 * 直接就是个表单项
 */
({
    /**
     * 是否立即保存
     */
    saveImmediately?: boolean;
    /**
     * 接口保存失败后，是否重置组件编辑状态
     */
    resetOnFailed?: boolean;
    /**
     * 是否直接内嵌
     */
    mode?: 'inline';
} & SchemaObject)
/**
 * 表单项集合
 */
 | {
    /**
     * 是否立即保存
     */
    saveImmediately?: boolean;
    /**
     * 接口保存失败后，是否重置组件编辑状态
     */
    resetOnFailed?: boolean;
    /**
     * 是否直接内嵌
     */
    mode?: 'inline';
    body: SchemaCollection;
};
export declare type SchemaQuickEdit = boolean | SchemaQuickEditObject;
export interface QuickEditConfig {
    saveImmediately?: boolean;
    resetOnFailed?: boolean;
    mode?: 'inline' | 'dialog' | 'popOver' | 'append';
    type?: string;
    body?: any;
    focusable?: boolean;
    popOverClassName?: string;
    [propName: string]: any;
}
export interface QuickEditProps extends RendererProps {
    name?: string;
    label?: string;
    quickEdit: boolean | QuickEditConfig;
    quickEditEnabled?: boolean;
}
export interface QuickEditState {
    isOpened: boolean;
}
export declare const HocQuickEdit: (config?: Partial<QuickEditConfig>) => (Component: React.ComponentType<any>) => any;
export default HocQuickEdit;
