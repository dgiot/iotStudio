import React from 'react';
import { ClassNamesFn } from '../../theme';
import { IColumn, IRow } from '../../store/table';
import { SchemaNode, Action } from '../../types';
import { LocaleProps } from '../../locale';
import { ActionSchema } from '../Action';
export interface TableBodyProps extends LocaleProps {
    className?: string;
    rowsProps?: any;
    tableClassName?: string;
    classnames: ClassNamesFn;
    columns: Array<IColumn>;
    rows: Array<IRow>;
    render: (region: string, node: SchemaNode, props?: any) => JSX.Element;
    renderCell: (region: string, column: IColumn, item: IRow, props: any) => React.ReactNode;
    onCheck: (item: IRow, value: boolean, shift?: boolean) => void;
    onQuickChange?: (item: IRow, values: object, saveImmediately?: boolean | any, savePristine?: boolean) => void;
    footable?: boolean;
    ignoreFootableContent?: boolean;
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
export declare class TableBody extends React.Component<TableBodyProps> {
    renderRows(rows: Array<any>, columns?: ({
        label: any;
        type: string;
        name: string | undefined;
        value: any;
        groupName: string;
        toggled: boolean;
        toggable: boolean;
        expandable: boolean;
        checkdisable: boolean;
        isPrimary: boolean;
        searchable: any;
        sortable: boolean;
        filterable: any;
        fixed: string;
        index: number;
        rawIndex: number;
        breakpoint: any;
        pristine: any;
        remark: any;
        className: string;
    } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
        toggleToggle(): void;
        setToggled(value: boolean): void;
    } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
        label: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
        type: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").ISimpleType<string>, [undefined]>;
        name: import("mobx-state-tree").IMaybe<import("mobx-state-tree").ISimpleType<string>>;
        value: import("mobx-state-tree").IType<any, any, any>;
        groupName: import("mobx-state-tree").IType<string | undefined, string, string>;
        toggled: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
        toggable: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
        expandable: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
        checkdisable: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
        isPrimary: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
        searchable: import("mobx-state-tree").IMaybe<import("mobx-state-tree").IType<any, any, any>>;
        sortable: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
        filterable: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
        fixed: import("mobx-state-tree").IType<string | undefined, string, string>;
        index: import("mobx-state-tree").IType<number | undefined, number, number>;
        rawIndex: import("mobx-state-tree").IType<number | undefined, number, number>;
        breakpoint: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
        pristine: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
        remark: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
        className: import("mobx-state-tree").IType<string | undefined, string, string>;
    }, {
        toggleToggle(): void;
        setToggled(value: boolean): void;
    }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>)[], rowProps?: any): any;
    renderSummaryRow(position: 'prefix' | 'affix', items?: Array<any>, rowIndex?: number): JSX.Element | null;
    renderSummary(position: 'prefix' | 'affix', items?: Array<any>): JSX.Element | (JSX.Element | null)[] | null;
    render(): JSX.Element;
}
