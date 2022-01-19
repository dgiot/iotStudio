import React from 'react';
import { RendererProps } from '../../factory';
import { Action } from '../../types';
export interface QuickSearchConfig {
    type?: string;
    controls?: any;
    tabs?: any;
    fieldSet?: any;
    [propName: string]: any;
}
export interface HeadCellSearchProps extends RendererProps {
    name: string;
    searchable: boolean | QuickSearchConfig;
    classPrefix: string;
    onQuery: (values: object) => void;
}
export declare class HeadCellSearchDropDown extends React.Component<HeadCellSearchProps, any> {
    state: {
        isOpened: boolean;
    };
    formItems: Array<string>;
    constructor(props: HeadCellSearchProps);
    buildSchema(): any;
    handleClickOutside(): void;
    open(): void;
    close(): void;
    handleAction(e: any, action: Action, ctx: object): void;
    handleReset(): void;
    handleSubmit(values: any): void;
    isActive(): boolean;
    render(): JSX.Element;
}
