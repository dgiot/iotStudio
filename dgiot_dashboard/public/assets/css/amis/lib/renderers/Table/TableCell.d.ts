import React from 'react';
import { RendererProps } from '../../factory';
export interface TableCellProps extends RendererProps {
    wrapperComponent?: React.ReactType;
    column: object;
}
export declare class TableCell extends React.Component<RendererProps> {
    static defaultProps: {
        wrapperComponent: string;
    };
    static propsList: Array<string>;
    render(): JSX.Element;
}
export declare class TableCellRenderer extends TableCell {
    static propsList: string[];
}
export declare class FieldRenderer extends TableCell {
    static defaultProps: {
        wrapperComponent: string;
    };
}
