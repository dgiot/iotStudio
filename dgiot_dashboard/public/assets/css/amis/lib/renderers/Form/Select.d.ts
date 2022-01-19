import React from 'react';
import { OptionsControlProps, Option, FormOptionsControl } from './Options';
import { Api } from '../../types';
import { SchemaApi } from '../../Schema';
/**
 * Select 下拉选择框。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/select
 */
export interface SelectControlSchema extends FormOptionsControl {
    type: 'select' | 'multi-select';
    /**
     * 自动完成 API，当输入部分文字的时候，会将这些文字通过 ${term} 可以取到，发送给接口。
     * 接口可以返回匹配到的选项，帮助用户输入。
     */
    autoComplete?: SchemaApi;
    /**
     * 是否可以搜索值
     */
    searchable?: boolean;
    /**
     * 可以自定义菜单展示。
     */
    menuTpl?: string;
    /**
     * 边框模式，全边框，还是半边框，或者没边框。
     */
    borderMode?: 'full' | 'half' | 'none';
}
export interface SelectProps extends OptionsControlProps {
    autoComplete?: Api;
    searchable?: boolean;
    defaultOpen?: boolean;
}
export default class SelectControl extends React.Component<SelectProps, any> {
    static defaultProps: Partial<SelectProps>;
    input: any;
    unHook: Function;
    lazyloadRemote: Function;
    constructor(props: SelectProps);
    componentWillUnmount(): void;
    inputRef(ref: any): void;
    foucs(): void;
    changeValue(value: Option | Array<Option> | void): void;
    loadRemote(input: string): Promise<(() => void) | {
        options: Option[];
    }>;
    mergeOptions(options: Array<object>): Option[];
    renderMenu(option: Option, state: any): JSX.Element;
    reload(): void;
    render(): JSX.Element;
}
export declare class SelectControlRenderer extends SelectControl {
}
export declare class MultiSelectControlRenderer extends SelectControl {
    static defaultProps: {
        multiple: boolean;
    };
}
