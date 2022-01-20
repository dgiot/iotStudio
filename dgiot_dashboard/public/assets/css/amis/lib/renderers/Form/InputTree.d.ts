import React from 'react';
import { FormOptionsControl, OptionsControlProps } from './Options';
import { SchemaApi } from '../../Schema';
/**
 * Tree 下拉选择框。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/tree
 */
export interface TreeControlSchema extends FormOptionsControl {
    type: 'input-tree';
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
     * 是否开启节点路径模式
     */
    enableNodePath?: boolean;
    /**
     * 开启节点路径模式后，节点路径的分隔符
     */
    pathSeparator?: string;
    /**
     * 是否显示展开线
     */
    showOutline?: boolean;
    deferApi?: SchemaApi;
}
export interface TreeProps extends OptionsControlProps, Omit<TreeControlSchema, 'type' | 'options' | 'className' | 'inputClassName' | 'descriptionClassName'> {
    enableNodePath?: boolean;
    pathSeparator?: string;
}
export default class TreeControl extends React.Component<TreeProps> {
    static defaultProps: Partial<TreeProps>;
    reload(): void;
    render(): JSX.Element;
}
export declare class TreeControlRenderer extends TreeControl {
}
