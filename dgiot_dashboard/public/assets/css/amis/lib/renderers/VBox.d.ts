import React from 'react';
import { RendererProps } from '../factory';
import { Schema } from '../types';
import { BaseSchema, SchemaObject } from '../Schema';
export declare type HboxRow = SchemaObject & {
    rowClassName?: string;
    cellClassName?: string;
};
/**
 * 垂直布局控件
 * 文档：https://baidu.gitee.io/amis/docs/components/vbox
 */
export interface VBoxSchema extends BaseSchema {
    type: 'vbox';
    /**
     * 行集合
     */
    rows?: Array<HboxRow>;
}
export interface HBoxProps extends RendererProps, Omit<VBoxSchema, 'className'> {
}
export default class VBox extends React.Component<HBoxProps, object> {
    static propsList: Array<string>;
    static defaultProps: Partial<HBoxProps>;
    renderChild(region: string, node: Schema): JSX.Element;
    renderCell(row: HboxRow, key: any): JSX.Element;
    render(): JSX.Element;
}
export declare class VBoxRenderer extends VBox {
}
