/**
 * @file scoped.jsx.
 * @author fex
 */
import React from 'react';
import { RendererProps } from '../factory';
import { SchemaCollection, SchemaExpression } from '../Schema';
export interface SchemaPopOverObject {
    /**
     * 类名
     */
    className?: string;
    /**
     * 弹框外层类名
     */
    popOverClassName?: string;
    /**
     * 配置当前行是否启动，要用表达式
     */
    popOverEnableOn?: SchemaExpression;
    /**
     * 弹出模式
     */
    mode?: 'dialog' | 'drawer' | 'popOver';
    /**
     * 是弹窗形式的时候有用。
     */
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /**
     * 弹出位置
     */
    position?: 'center' | 'left-top' | 'left-top-left-top' | 'left-top-left-center' | 'left-top-left-bottom' | 'left-top-center-top' | 'left-top-center-center' | 'left-top-center-bottom' | 'left-top-right-top' | 'left-top-right-center' | 'left-top-right-bottom' | 'right-top' | 'right-top-left-top' | 'right-top-left-center' | 'right-top-left-bottom' | 'right-top-center-top' | 'right-top-center-center' | 'right-top-center-bottom' | 'right-top-right-top' | 'right-top-right-center' | 'right-top-right-bottom' | 'left-bottom' | 'left-bottom-left-top' | 'left-bottom-left-center' | 'left-bottom-left-bottom' | 'left-bottom-center-top' | 'left-bottom-center-center' | 'left-bottom-center-bottom' | 'left-bottom-right-top' | 'left-bottom-right-center' | 'left-bottom-right-bottom' | 'right-bottom' | 'right-bottom-left-top' | 'right-bottom-left-center' | 'right-bottom-left-bottom' | 'right-bottom-center-top' | 'right-bottom-center-center' | 'right-bottom-center-bottom' | 'right-bottom-right-top' | 'right-bottom-right-center' | 'right-bottom-right-bottom' | 'fixed-center' | 'fixed-left-top' | 'fixed-right-top' | 'fixed-left-bottom' | 'fixed-right-bottom';
    /**
     * 触发条件，默认是 click
     */
    trigger?: 'click' | 'hover';
    /**
     * 是否显示查看更多的 icon，通常是放大图标。
     */
    showIcon?: boolean;
    /**
     * 偏移量
     */
    offset?: {
        top?: number;
        left?: number;
    };
    /**
     * 标题
     */
    title?: string;
    body?: SchemaCollection;
}
export declare type SchemaPopOver = boolean | SchemaPopOverObject;
export interface PopOverProps extends RendererProps {
    name?: string;
    label?: string;
    popOver: boolean | SchemaPopOverObject;
    onPopOverOpened: (popover: any) => void;
    onPopOverClosed: (popover: any) => void;
}
export interface PopOverState {
    isOpened: boolean;
}
export declare const HocPopOver: (config?: {
    targetOutter?: boolean;
    position?: string;
}) => (Component: React.ComponentType<any>) => any;
export default HocPopOver;
