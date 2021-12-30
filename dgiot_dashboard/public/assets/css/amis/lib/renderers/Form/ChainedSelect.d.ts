import React from 'react';
import { OptionsControlProps, Option, FormOptionsControl } from './Options';
/**
 * 级联选择框
 * 文档：https://baidu.gitee.io/amis/docs/components/form/chained-select
 */
export interface ChainedSelectControlSchema extends FormOptionsControl {
    type: 'chained-select';
}
export interface ChainedSelectProps extends OptionsControlProps, Omit<ChainedSelectControlSchema, 'options' | 'type' | 'source' | 'className' | 'descriptionClassName' | 'inputClassName'> {
}
export interface SelectState {
    stack: Array<{
        options: Array<Option>;
        parentId: any;
        loading: boolean;
        visible?: boolean;
    }>;
}
export default class ChainedSelectControl extends React.Component<ChainedSelectProps, SelectState> {
    static defaultProps: Partial<ChainedSelectProps>;
    state: SelectState;
    constructor(props: ChainedSelectProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: ChainedSelectProps): void;
    loadMore(): void;
    handleChange(index: number, currentValue: any): void;
    reload(): void;
    render(): JSX.Element;
}
export declare class ChainedSelectControlRenderer extends ChainedSelectControl {
}
