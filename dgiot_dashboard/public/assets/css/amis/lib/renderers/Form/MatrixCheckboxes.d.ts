/**
 * @file filter
 * @author fex
 */
import React from 'react';
import { FormBaseControl, FormControlProps } from './Item';
import { SchemaApi } from '../../Schema';
/**
 * Matrix 选择控件。适合做权限勾选。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/matrix
 */
export interface MatrixControlSchema extends FormBaseControl {
    type: 'matrix-checkboxes';
    /**
     * 配置singleSelectMode时设置为false
     */
    multiple?: boolean;
    /**
     * 设置单选模式，multiple为false时有效
     */
    singleSelectMode?: boolean;
    /**
     * 可用来通过 API 拉取 options。
     */
    source?: SchemaApi;
    columns?: Array<{
        label: string;
        [propName: string]: any;
    }>;
    rows?: Array<{
        label: string;
        [propName: string]: any;
    }>;
    /**
     * 行标题说明
     */
    rowLabel?: string;
}
export interface Column {
    label: string;
    [propName: string]: any;
}
export interface Row {
    label: string;
    [propName: string]: any;
}
export interface ValueItem extends Column, Row {
    checked: boolean;
}
export interface MatrixProps extends FormControlProps {
    columns: Array<Column>;
    rows: Array<Row>;
    multiple: boolean;
}
export interface MatrixState {
    columns: Array<Column>;
    rows: Array<Row>;
    loading: boolean;
    error?: string;
    singleSelectMode?: 'cell' | 'row' | 'column';
}
export default class MatrixCheckbox extends React.Component<MatrixProps, MatrixState> {
    static defaultProps: Partial<MatrixProps>;
    state: MatrixState;
    mounted: boolean;
    constructor(props: MatrixProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: MatrixProps): void;
    componentWillUnmount(): void;
    initOptions(data: any): Promise<void>;
    reload(): Promise<void>;
    toggleItem(checked: boolean, x: number, y: number): void;
    renderInput(): JSX.Element;
    render(): JSX.Element;
}
export declare class MatrixRenderer extends MatrixCheckbox {
}
