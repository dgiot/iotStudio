import React from 'react';
import { IRow, IColumn } from '../../store/table';
import { RendererProps } from '../../factory';
import { Action } from '../Action';
interface TableRowProps extends Pick<RendererProps, 'render'> {
    onCheck: (item: IRow) => void;
    classPrefix: string;
    renderCell: (region: string, column: IColumn, item: IRow, props: any) => React.ReactNode;
    columns: Array<IColumn>;
    item: IRow;
    parent?: IRow;
    itemClassName?: string;
    itemIndex: number;
    regionPrefix?: string;
    checkOnItemClick?: boolean;
    ignoreFootableContent?: boolean;
    [propName: string]: any;
}
export declare class TableRow extends React.Component<TableRowProps> {
    constructor(props: TableRowProps);
    handleItemClick(e: React.MouseEvent<HTMLTableRowElement>): void;
    handleAction(e: React.UIEvent<any>, action: Action, ctx: any): void;
    handleQuickChange(values: object, saveImmediately?: boolean, savePristine?: boolean, resetOnFailed?: boolean): void;
    handleChange(value: any, name: string, submit?: boolean, changePristine?: boolean): void;
    render(): JSX.Element | null;
}
export {};
