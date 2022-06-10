import React from 'react';
import { BaseSchema } from '../../Schema';
import { ActionSchema } from '../Action';
import { FormControlProps } from './Item';
/**
 * Button Toolar 渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/button-toolbar
 */
export interface ButtonToolbarSchema extends BaseSchema {
    /**
     * 指定为按钮工具集合类型
     */
    type: 'button-toolbar';
    buttons: Array<ActionSchema>;
}
export interface ButtonToolbarProps extends FormControlProps, Omit<ButtonToolbarSchema, 'className'> {
}
export default class ButtonToolbar extends React.Component<ButtonToolbarProps, object> {
    static propsList: Array<string>;
    /**
     * 这个方法editor里要用作hack，所以不能删掉这个方法
     * @returns
     */
    renderButtons(): JSX.Element[] | null;
    render(): JSX.Element;
}
export declare class ButtonToolbarRenderer extends ButtonToolbar {
}
