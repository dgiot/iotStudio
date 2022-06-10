import React from 'react';
import { ClassNamesFn } from '../../theme';
import { IColumn, IRow } from '../../store/table';
import { SchemaNode, Action } from '../../types';
import { LocaleProps } from '../../locale';
import { ActionSchema } from '../Action';
export interface TableContentProps extends LocaleProps {
    className?: string;
    tableClassName?: string;
    classnames: ClassNamesFn;
    columns: Array<IColumn>;
    columnsGroup: Array<{
        label: string;
        index: number;
        colSpan: number;
        rowSpan: number;
        has: Array<any>;
    }>;
    rows: Array<IRow>;
    placeholder?: string;
    render: (region: string, node: SchemaNode, props?: any) => JSX.Element;
    onMouseMove: (event: React.MouseEvent) => void;
    onScroll: (event: React.UIEvent) => void;
    tableRef: (table?: HTMLTableElement | null) => void;
    renderHeadCell: (column: IColumn, props?: any) => JSX.Element;
    renderCell: (region: string, column: IColumn, item: IRow, props: any) => React.ReactNode;
    onCheck: (item: IRow, value: boolean, shift?: boolean) => void;
    onQuickChange?: (item: IRow, values: object, saveImmediately?: boolean | any, savePristine?: boolean) => void;
    footable?: boolean;
    footableColumns: Array<IColumn>;
    checkOnItemClick?: boolean;
    buildItemProps?: (item: IRow, index: number) => any;
    onAction?: (e: React.UIEvent<any>, action: Action, ctx: object) => void;
    rowClassNameExpr?: string;
    rowClassName?: string;
    data?: any;
    prefixRow?: Array<any>;
    affixRow?: Array<any>;
    itemAction?: ActionSchema;
}
export declare class TableContent extends React.Component<TableContentProps> {
    render(): JSX.Element;
}
