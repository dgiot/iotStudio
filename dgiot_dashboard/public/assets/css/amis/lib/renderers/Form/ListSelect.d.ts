import React from 'react';
import { OptionsControlProps, Option, FormOptionsControl } from './Options';
import { SchemaClassName, SchemaCollection } from '../../Schema';
/**
 * List 复选框
 * 文档：https://baidu.gitee.io/amis/docs/components/form/list
 */
export interface ListControlSchema extends FormOptionsControl {
    type: 'list-select';
    /**
     * 开启双击点选并提交。
     */
    submitOnDBClick?: boolean;
    /**
     * 图片div类名
     */
    imageClassName?: string;
    /**
     * 可以自定义展示模板。
     */
    itemSchema?: SchemaCollection;
    /**
     * 支持配置 list div 的 css 类名。
     * 比如：flex justify-between
     */
    listClassName?: SchemaClassName;
}
export interface ListProps extends OptionsControlProps, Omit<ListControlSchema, 'type' | 'options' | 'className' | 'descriptionClassName' | 'inputClassName'> {
}
export default class ListControl extends React.Component<ListProps, any> {
    static propsList: string[];
    static defaultProps: {
        clearable: boolean;
        imageClassName: string;
        submitOnDBClick: boolean;
    };
    handleDBClick(option: Option, e: React.MouseEvent<HTMLElement>): void;
    handleClick(option: Option, e: React.MouseEvent<HTMLElement>): void;
    reload(): void;
    render(): JSX.Element;
}
export declare class ListControlRenderer extends ListControl {
}
