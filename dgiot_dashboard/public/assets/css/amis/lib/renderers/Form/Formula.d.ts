import React from 'react';
import { FormControlProps, FormBaseControl } from './Item';
/**
 * 公式功能控件。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/formula
 */
export interface FormulaControlSchema extends FormBaseControl {
    /**
     * 指定为公式功能控件。
     */
    type: 'formula';
    /**
     * 当某个按钮的目标指定为此值后，会触发一次公式应用。这个机制可以在 autoSet 为 false 时用来手动触发
     */
    id?: string;
    /**
     * 触发公式的作用条件，如 data.xxx == \"a\" 或者 ${xx}
     */
    condition?: string;
    /**
     * 是否自动应用
     */
    autoSet?: boolean;
    /**
     * 公式
     */
    formula?: string;
    /**
     * 是否初始应用
     */
    initSet?: boolean;
    /**
     * 字段名，公式结果将作用到此处指定的变量中去
     */
    name?: string;
}
export interface FormulaProps extends FormControlProps, Omit<FormulaControlSchema, 'type' | 'className' | 'descriptionClassName' | 'inputClassName'> {
}
export default class FormulaControl extends React.Component<FormControlProps, any> {
    inited: boolean;
    unHook?: () => void;
    componentDidMount(): void;
    componentDidUpdate(prevProps: FormControlProps): void;
    componentWillUnmount(): void;
    handleFormInit(data: any): void;
    initSet(): any;
    autoSet(prevProps: FormControlProps): void;
    doAction(): void;
    render(): null;
}
export declare class FormulaControlRenderer extends FormulaControl {
}
