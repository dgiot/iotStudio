import React from 'react';
import { RendererProps } from '../factory';
import { BaseSchema, SchemaClassName } from '../Schema';
export interface PaginationSchema extends BaseSchema {
    type: 'pagination';
    className?: SchemaClassName;
    /**
     * 是否显示快速跳转输入框
     */
    showPageInput?: boolean;
    /**
     * 模式，默认显示多个分页数字，如果只想简单显示可以配置成 `simple`。
     */
    mode?: 'simple' | 'normal';
    /**
     * 最多显示多少个分页按钮。
     *
     * @default 5
     */
    maxButtons?: number;
}
export interface PaginationProps extends RendererProps, Omit<PaginationSchema, 'type' | 'className'> {
    activePage: number;
    lastPage: number;
    hasNext: boolean;
    maxButtons: number;
    onPageChange: (page: number, perPage?: number) => void;
}
export interface PaginationState {
    pageNum: string;
}
export default class Pagination extends React.Component<PaginationProps, PaginationState> {
    static defaultProps: {
        activePage: number;
        lastPage: number;
        maxButtons: number;
        mode: string;
        hasNext: boolean;
        showPageInput: boolean;
    };
    state: {
        pageNum: string;
    };
    componentDidUpdate(prevProps: PaginationProps): void;
    renderSimple(): JSX.Element;
    handlePageChange(e: React.ChangeEvent<any>): void;
    renderNormal(): JSX.Element;
    render(): JSX.Element;
}
export declare class PaginationRenderer extends Pagination {
}
