import React from 'react';
import { RendererProps } from '../factory';
import type { TooltipObject, Trigger } from '../components/TooltipWrapper';
import { BaseSchema, SchemaClassName } from '../Schema';
import { ActionSchema } from './Action';
import { DividerSchema } from './Divider';
/**
 * 下拉按钮渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/dropdown-button
 */
export interface DropdownButtonSchema extends BaseSchema {
    /**
     * 指定为 DropDown Button 类型
     */
    type: 'dropdown-button';
    /**
     * 是否独占一行 `display: block`
     */
    block?: boolean;
    /**
     * 给 Button 配置 className。
     */
    btnClassName?: SchemaClassName;
    /**
     * 按钮集合
     */
    buttons?: Array<ActionSchema | DividerSchema | 'divider'>;
    /**
     * 按钮文字
     */
    label?: string;
    /**
     * 按钮级别，样式
     */
    level?: 'info' | 'success' | 'danger' | 'warning' | 'primary' | 'link';
    /**
     * 按钮提示文字，hover 时显示
     */
    /**
     * 点击外部是否关闭
     */
    closeOnOutside?: boolean;
    /**
     * 点击内容是否关闭
     */
    closeOnClick?: boolean;
    /**
     * 按钮大小
     */
    size?: 'xs' | 'sm' | 'md' | 'lg';
    /**
     * 对齐方式
     */
    align?: 'left' | 'right';
    /**
     * 是否只显示图标。
     */
    iconOnly?: boolean;
    /**
     * 触发条件，默认是 click
     */
    trigger?: 'click' | 'hover';
    /**
     * 是否显示下拉按钮
     */
    hideCaret?: boolean;
}
export interface DropDownButtonProps extends RendererProps, Omit<DropdownButtonSchema, 'type' | 'className'> {
    disabledTip?: string | TooltipObject;
    /**
     * 按钮提示文字，hover focus 时显示
     */
    tooltip?: string | TooltipObject;
    placement?: 'top' | 'right' | 'bottom' | 'left';
    tooltipContainer?: any;
    tooltipTrigger?: Trigger | Array<Trigger>;
    tooltipRootClose?: boolean;
    defaultIsOpened?: boolean;
    label?: any;
    isActived?: boolean;
}
export interface DropDownButtonState {
    isOpened: boolean;
}
export default class DropDownButton extends React.Component<DropDownButtonProps, DropDownButtonState> {
    state: DropDownButtonState;
    static defaultProps: Pick<DropDownButtonProps, 'placement' | 'tooltipTrigger' | 'tooltipRootClose'>;
    target: any;
    constructor(props: DropDownButtonProps);
    componentDidMount(): void;
    domRef(ref: any): void;
    toogle(e: React.MouseEvent<any>): void;
    open(): void;
    close(): void;
    renderOuter(): JSX.Element;
    render(): JSX.Element;
}
export declare class DropDownButtonRenderer extends DropDownButton {
}
