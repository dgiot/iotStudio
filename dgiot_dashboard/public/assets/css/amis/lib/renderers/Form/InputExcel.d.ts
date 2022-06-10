import React from 'react';
import { FormControlProps, FormBaseControl } from './Item';
/**
 * Excel 解析
 * 文档：https://baidu.gitee.io/amis/docs/components/form/input-excel
 */
export interface InputExcelControlSchema extends FormBaseControl {
    /**
     * 指定为 Excel 解析
     */
    type: 'input-excel';
    /**
     * 是否解析所有 sheet，默认情况下只解析第一个
     */
    allSheets: boolean;
    /**
     * 解析模式，array 是解析成二维数组，object 是将第一列作为字段名，解析为对象数组
     */
    parseMode: 'array' | 'object';
    /**
     * 是否包含空内容，主要用于二维数组模式
     */
    includeEmpty: boolean;
    /**
     * 纯文本模式
     */
    plainText: boolean;
}
export interface ExcelProps extends FormControlProps, Omit<InputExcelControlSchema, 'type' | 'className' | 'descriptionClassName' | 'inputClassName'> {
}
export interface ExcelControlState {
    open: boolean;
}
export default class ExcelControl extends React.PureComponent<ExcelProps, ExcelControlState> {
    static defaultProps: Partial<ExcelProps>;
    state: ExcelControlState;
    ExcelJS: any;
    handleDrop(files: File[]): void;
    /**
     * 读取单个 sheet 的内容
     */
    readWorksheet(worksheet: any): any[];
    render(): JSX.Element;
}
export declare class ExcelControlRenderer extends ExcelControl {
}
