import React from 'react';
import { OptionsControlProps, Option, FormOptionsControl } from './Options';
import { Api } from '../../types';
/**
 * Tree 下拉选择框。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/tree
 */
export interface TreeSelectControlSchema extends FormOptionsControl {
    type: 'tree-select';
    /**
     * 是否隐藏顶级
     */
    hideRoot?: boolean;
    /**
     * 顶级选项的名称
     */
    rootLabel?: string;
    /**
     * 顶级选项的值
     */
    rootValue?: any;
    /**
     * 显示图标
     */
    showIcon?: boolean;
    /**
     * 父子之间是否完全独立。
     */
    cascade?: boolean;
    /**
     * 选父级的时候是否把子节点的值也包含在内。
     */
    withChildren?: boolean;
    /**
     * 选父级的时候，是否只把子节点的值包含在内
     */
    onlyChildren?: boolean;
    /**
     * 顶级节点是否可以创建子节点
     */
    rootCreatable?: boolean;
    /**
     * 是否隐藏选择框中已选中节点的祖先节点的文本信息
     */
    hideNodePathLabel?: boolean;
    /**
     * 是否开启节点路径模式
     */
    enableNodePath?: boolean;
    /**
     * 开启节点路径模式后，节点路径的分隔符
     */
    pathSeparator?: string;
}
export interface TreeSelectProps extends OptionsControlProps {
    placeholder?: any;
    autoComplete?: Api;
    hideNodePathLabel?: boolean;
    enableNodePath?: boolean;
    pathSeparator?: string;
}
export interface TreeSelectState {
    isOpened: boolean;
    isFocused: boolean;
    inputValue: string;
}
export default class TreeSelectControl extends React.Component<TreeSelectProps, TreeSelectState> {
    static defaultProps: {
        placeholder: string;
        optionsPlaceholder: string;
        multiple: boolean;
        clearable: boolean;
        rootLabel: string;
        rootValue: string;
        showIcon: boolean;
        joinValues: boolean;
        extractValue: boolean;
        delimiter: string;
        resetValue: string;
        hideNodePathLabel: boolean;
        enableNodePath: boolean;
        pathSeparator: string;
    };
    container: React.RefObject<HTMLDivElement>;
    input: React.RefObject<any>;
    cache: {
        [propName: string]: any;
    };
    target: HTMLElement | null;
    targetRef: (ref: any) => HTMLElement | null;
    constructor(props: TreeSelectProps);
    componentDidMount(): void;
    open(fn?: () => void): void;
    close(): void;
    handleFocus(): void;
    handleBlur(): void;
    handleKeyPress(e: React.KeyboardEvent): void;
    validate(): any;
    removeItem(index: number, e?: React.MouseEvent<HTMLElement>): void;
    handleChange(value: any): void;
    handleInputChange(value: string): void;
    handleInputKeyDown(event: React.KeyboardEvent): void;
    clearValue(): void;
    filterOptions(options: Array<Option>, keywords: string): Array<Option>;
    loadRemote(input: string): Promise<{
        options: Option[];
    } | undefined>;
    mergeOptions(options: Array<object>): Option[];
    reload(): void;
    handleOutClick(e: React.MouseEvent<any>): void;
    handleResultChange(value: Array<Option>): void;
    renderItem(item: Option): any;
    renderOuter(): JSX.Element;
    render(): JSX.Element;
}
export declare class TreeSelectControlRenderer extends TreeSelectControl {
}
