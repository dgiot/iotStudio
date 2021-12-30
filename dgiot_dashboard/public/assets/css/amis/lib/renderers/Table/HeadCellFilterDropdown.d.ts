import React from 'react';
import { Api } from '../../types';
import { RendererProps } from '../../factory';
export interface QuickFilterConfig {
    options: Array<any>;
    source: Api;
    multiple: boolean;
    [propName: string]: any;
}
export interface HeadCellFilterProps extends RendererProps {
    data: any;
    name: string;
    filterable: QuickFilterConfig;
    onQuery: (values: object) => void;
}
export declare class HeadCellFilterDropDown extends React.Component<HeadCellFilterProps, any> {
    state: {
        isOpened: boolean;
        filterOptions: never[];
    };
    sourceInvalid: boolean;
    constructor(props: HeadCellFilterProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: HeadCellFilterProps, prevState: any): void;
    fetchOptions(): void;
    alterOptions(options: Array<any>): any[];
    handleClickOutside(): void;
    open(): void;
    close(): void;
    handleClick(value: string): void;
    handleCheck(value: string): void;
    handleReset(): void;
    render(): JSX.Element;
}
