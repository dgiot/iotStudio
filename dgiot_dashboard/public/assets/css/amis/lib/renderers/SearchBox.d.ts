import { RendererProps } from '../factory';
import React from 'react';
import { BaseSchema, SchemaClassName } from '../Schema';
/**
 * 搜索框渲染器
 */
export interface SearchBoxSchema extends BaseSchema {
    /**
     * 指定为搜索框。
     *
     * 文档：https://baidu.gitee.io/amis/docs/components/search-box
     */
    type: 'search-box';
    /**
     * 外层 css 类名
     */
    className?: SchemaClassName;
    /**
     * 关键字名字。
     *
     * @default keywords
     */
    name?: string;
    /**
     * 占位符
     */
    placeholder?: string;
    /**
     * 是否为 Mini 样式。
     */
    mini?: boolean;
    /**
     * 是否立马搜索。
     */
    searchImediately?: boolean;
}
interface SearchBoxProps extends RendererProps, Omit<SearchBoxSchema, 'type' | 'className'> {
    name: string;
    onQuery?: (query: {
        [propName: string]: string;
    }) => void;
}
export declare class SearchBoxRenderer extends React.Component<SearchBoxProps> {
    static defaultProps: {
        name: string;
        mini: boolean;
        searchImediately: boolean;
    };
    static propsList: Array<string>;
    handleCancel(): void;
    handleSearch(text: string): void;
    render(): JSX.Element;
}
export {};
