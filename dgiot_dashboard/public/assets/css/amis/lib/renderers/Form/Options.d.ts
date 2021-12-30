/**
 * @file 所有列表选择类控件的父级，比如 Select、Radios、Checkboxes、
 * List、ButtonGroup 等等
 */
import { Api, PlainObject } from '../../types';
import { FormControlProps, FormItemBasicConfig, FormBaseControl } from './Item';
export declare type OptionsControlComponent = React.ComponentType<FormControlProps>;
import React from 'react';
import { Option, OptionProps } from '../../components/Select';
import { SchemaApi, SchemaExpression, SchemaObject, SchemaTokenizeableString } from '../../Schema';
export { Option };
export interface FormOptionsControl extends FormBaseControl {
    /**
     * 选项集合
     */
    options?: Array<Option> | string[] | PlainObject;
    /**
     * 可用来通过 API 拉取 options。
     */
    source?: SchemaApi | SchemaTokenizeableString;
    /**
     * 默认选择选项第一个值。
     */
    selectFirst?: boolean;
    /**
     * 用表达式来配置 source 接口初始要不要拉取
     *
     * @deprecated 建议用 source 接口的 sendOn
     */
    initFetchOn?: SchemaExpression;
    /**
     * 配置 source 接口初始拉不拉取。
     *
     * @deprecated 建议用 source 接口的 sendOn
     */
    initFetch?: boolean;
    /**
     * 是否为多选模式
     */
    multiple?: boolean;
    /**
     * 单选模式：当用户选中某个选项时，选项中的 value 将被作为该表单项的值提交，否则，整个选项对象都会作为该表单项的值提交。
     * 多选模式：选中的多个选项的 `value` 会通过 `delimiter` 连接起来，否则直接将以数组的形式提交值。
     */
    joinValues?: boolean;
    /**
     * 分割符
     */
    delimiter?: string;
    /**
     * 开启后将选中的选项 value 的值封装为数组，作为当前表单项的值。
     */
    extractValue?: boolean;
    /**
     * 是否可清除。
     */
    clearable?: boolean;
    /**
     * 点清除按钮时，将表单项设置成当前配置的值。
     *
     * @default ''
     */
    resetValue?: string;
    /**
     * 延时加载的 API，当选项中有 defer: true 的选项时，点开会通过此接口扩充。
     */
    deferApi?: SchemaApi;
    /**
     * 添加时调用的接口
     */
    addApi?: SchemaApi;
    /**
     * 新增时的表单项。
     */
    addControls?: Array<SchemaObject>;
    /**
     * 是否可以新增
     */
    creatable?: boolean;
    /**
     * 新增文字
     */
    createBtnLabel?: string;
    /**
     * 是否可以编辑
     */
    editable?: boolean;
    /**
     * 编辑时调用的 API
     */
    editApi?: SchemaApi;
    /**
     * 选项修改的表单项
     */
    editControls?: Array<SchemaObject>;
    /**
     * 是否可删除
     */
    removable?: boolean;
    /**
     * 选项删除 API
     */
    deleteApi?: SchemaApi;
    /**
     * 选项删除提示文字。
     */
    deleteConfirmText?: string;
    /**
     * 自动填充，当选项被选择的时候，将选项中的其他值同步设置到表单内。
     */
    autoFill?: {
        [propName: string]: SchemaTokenizeableString;
    };
}
export interface OptionsBasicConfig extends FormItemBasicConfig {
    autoLoadOptionsFromSource?: boolean;
}
export interface OptionsConfig extends OptionsBasicConfig {
    component: React.ComponentType<OptionsControlProps>;
}
export interface OptionsControlProps extends FormControlProps, Omit<FormOptionsControl, 'type' | 'className' | 'descriptionClassName' | 'inputClassName'> {
    options: Array<Option>;
    onToggle: (option: Option, submitOnChange?: boolean, changeImmediately?: boolean) => void;
    onToggleAll: () => void;
    selectedOptions: Array<Option>;
    setOptions: (value: Array<any>, skipNormalize?: boolean) => void;
    setLoading: (value: boolean) => void;
    reloadOptions: (setError?: boolean) => void;
    deferLoad: (option: Option) => void;
    expandTreeOptions: (nodePathArr: any[]) => void;
    onAdd?: (idx?: number | Array<number>, value?: any, skipForm?: boolean) => void;
    onEdit?: (value: Option, origin?: Option, skipForm?: boolean) => void;
    onDelete?: (value: Option) => void;
}
export interface OptionsProps extends FormControlProps, Omit<OptionProps, 'className'> {
    source?: Api;
    deferApi?: Api;
    creatable?: boolean;
    addApi?: Api;
    addControls?: Array<any>;
    editApi?: Api;
    editControls?: Array<any>;
    deleteApi?: Api;
    deleteConfirmText?: string;
    optionLabel?: string;
}
export declare const detectProps: string[];
export declare function registerOptionsControl(config: OptionsConfig): import("../../factory").RendererConfig;
export declare function OptionsControl(config: OptionsBasicConfig): <T extends React.ComponentType<OptionsControlProps>>(component: T) => T;
export declare function highlight(text: string, input?: string, hlClassName?: string): string | any[];
