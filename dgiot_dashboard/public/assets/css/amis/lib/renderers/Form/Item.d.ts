import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { IFormItemStore, IFormStore } from '../../store/form';
import { RendererProps, TestFunc, RendererConfig } from '../../factory';
import { FormHorizontal, FormSchema, FormSchemaHorizontal } from '.';
import { Schema } from '../../types';
import { SchemaRemark } from '../Remark';
import { BaseSchema, SchemaApi, SchemaClassName, SchemaObject, SchemaType } from '../../Schema';
export declare type FormControlSchemaAlias = SchemaObject;
export interface FormBaseControl extends Omit<BaseSchema, 'type'> {
    /**
     * 表单项类型
     */
    type: SchemaType;
    /**
     * 表单项大小
     */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
    /**
     * 描述标题
     */
    label?: string | false;
    /**
     * 配置 label className
     */
    labelClassName?: SchemaClassName;
    /**
     * 字段名，表单提交时的 key，支持多层级，用.连接，如： a.b.c
     */
    name?: string;
    /**
     * 显示一个小图标, 鼠标放上去的时候显示提示内容
     */
    remark?: SchemaRemark;
    /**
     * 显示一个小图标, 鼠标放上去的时候显示提示内容, 这个小图标跟 label 在一起
     */
    labelRemark?: SchemaRemark;
    /**
     * 输入提示，聚焦的时候显示
     */
    hint?: string;
    /**
     * 当修改完的时候是否提交表单。
     */
    submitOnChange?: boolean;
    /**
     * 是否只读
     */
    readOnly?: boolean;
    /**
     * 不设置时，当表单提交过后表单项每次修改都会触发重新验证，
     * 如果设置了，则由此配置项来决定要不要每次修改都触发验证。
     */
    validateOnChange?: boolean;
    /**
     * 描述内容，支持 Html 片段。
     */
    description?: string;
    /**
     * @deprecated 用 description 代替
     */
    desc?: string;
    /**
     * 配置描述上的 className
     */
    descriptionClassName?: SchemaClassName;
    /**
     * 配置当前表单项展示模式
     */
    mode?: 'normal' | 'inline' | 'horizontal';
    /**
     * 当配置为水平布局的时候，用来配置具体的左右分配。
     */
    horizontal?: FormSchemaHorizontal;
    /**
     * 表单 control 是否为 inline 模式。
     */
    inline?: boolean;
    /**
     * 配置 input className
     */
    inputClassName?: SchemaClassName;
    /**
     * 占位符
     */
    placeholder?: string;
    /**
     * 是否为必填
     */
    required?: boolean;
    /**
     * 验证失败的提示信息
     */
    validationErrors?: {
        isAlpha?: string;
        isAlphanumeric?: string;
        isEmail?: string;
        isFloat?: string;
        isInt?: string;
        isJson?: string;
        isLength?: string;
        isNumeric?: string;
        isRequired?: string;
        isUrl?: string;
        matchRegexp?: string;
        matchRegexp2?: string;
        matchRegexp3?: string;
        matchRegexp4?: string;
        matchRegexp5?: string;
        maxLength?: string;
        maximum?: string;
        minLength?: string;
        minimum?: string;
        [propName: string]: any;
    };
    validations?: string | {
        /**
         * 是否是字母
         */
        isAlpha?: boolean;
        /**
         * 是否为字母数字
         */
        isAlphanumeric?: boolean;
        /**
         * 是否为邮箱地址
         */
        isEmail?: boolean;
        /**
         * 是否为浮点型
         */
        isFloat?: boolean;
        /**
         * 是否为整型
         */
        isInt?: boolean;
        /**
         * 是否为 json
         */
        isJson?: boolean;
        /**
         * 长度等于指定值
         */
        isLength?: number;
        /**
         * 是否为数字
         */
        isNumeric?: boolean;
        /**
         * 是否为必填
         */
        isRequired?: boolean;
        /**
         * 是否为 URL 地址
         */
        isUrl?: boolean;
        /**
         * 内容命中指定正则
         */
        matchRegexp?: string;
        /**
         * 内容命中指定正则
         */
        matchRegexp1?: string;
        /**
         * 内容命中指定正则
         */
        matchRegexp2?: string;
        /**
         * 内容命中指定正则
         */
        matchRegexp3?: string;
        /**
         * 内容命中指定正则
         */
        matchRegexp4?: string;
        /**
         * 内容命中指定正则
         */
        matchRegexp5?: string;
        /**
         * 最大长度为指定值
         */
        maxLength?: number;
        /**
         * 最大值为指定值
         */
        maximum?: number;
        /**
         * 最小长度为指定值
         */
        minLength?: number;
        /**
         * 最小值为指定值
         */
        minimum?: number;
        [propName: string]: any;
    };
    /**
     * 默认值，切记只能是静态值，不支持取变量，跟数据关联是通过设置 name 属性来实现的。
     */
    value?: any;
    /**
     * 表单项隐藏时，是否在当前 Form 中删除掉该表单项值。注意同名的未隐藏的表单项值也会删掉
     */
    clearValueOnHidden?: boolean;
    /**
     * 远端校验表单项接口
     */
    validateApi?: SchemaApi;
}
export interface FormItemBasicConfig extends Partial<RendererConfig> {
    type?: string;
    wrap?: boolean;
    renderLabel?: boolean;
    renderDescription?: boolean;
    test?: RegExp | TestFunc;
    storeType?: string;
    validations?: string;
    strictMode?: boolean;
    descriptionClassName?: string;
    storeExtendsData?: boolean;
    sizeMutable?: boolean;
    weight?: number;
    extendsData?: boolean;
    showErrorMsg?: boolean;
    validate?: (values: any, value: any) => string | boolean;
}
export interface FormItemProps extends RendererProps {
    name?: string;
    formStore?: IFormStore;
    formItem?: IFormItemStore;
    formInited: boolean;
    formMode: 'normal' | 'horizontal' | 'inline' | 'row' | 'default';
    formHorizontal: FormHorizontal;
    defaultSize?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
    disabled?: boolean;
    btnDisabled: boolean;
    defaultValue: any;
    value?: any;
    prinstine: any;
    setPrinstineValue: (value: any) => void;
    onChange: (value: any, submitOnChange?: boolean, changeImmediately?: boolean) => void;
    onBulkChange: (values: {
        [propName: string]: any;
    }, submitOnChange?: boolean) => void;
    addHook: (fn: Function, mode?: 'validate' | 'init' | 'flush') => () => void;
    removeHook: (fn: Function, mode?: 'validate' | 'init' | 'flush') => void;
    renderFormItems: (schema: Partial<FormSchema>, region: string, props: any) => JSX.Element;
    onFocus: (e: any) => void;
    onBlur: (e: any) => void;
    formItemValue: any;
    getValue: () => any;
    setValue: (value: any, key: string) => void;
    inputClassName?: string;
    renderControl?: (props: FormControlProps) => JSX.Element;
    inputOnly?: boolean;
    renderLabel?: boolean;
    renderDescription?: boolean;
    sizeMutable?: boolean;
    wrap?: boolean;
    hint?: string;
    description?: string;
    descriptionClassName?: string;
    errors?: {
        [propName: string]: string;
    };
    error?: string;
    showErrorMsg?: boolean;
}
export declare type FormControlProps = RendererProps & {
    onOpenDialog: (schema: Schema, data: any) => Promise<any>;
} & Exclude<FormItemProps, 'inputClassName' | 'renderControl' | 'defaultSize' | 'size' | 'error' | 'errors' | 'hint' | 'descriptionClassName' | 'inputOnly' | 'renderLabel' | 'renderDescription' | 'sizeMutable' | 'wrap'>;
export declare type FormItemComponent = React.ComponentType<FormItemProps>;
export declare type FormControlComponent = React.ComponentType<FormControlProps>;
export interface FormItemConfig extends FormItemBasicConfig {
    component: FormControlComponent;
}
export declare class FormItemWrap extends React.Component<FormItemProps> {
    reaction: any;
    constructor(props: FormItemProps);
    componentWillUnmount(): void;
    handleFocus(e: any): void;
    handleBlur(e: any): void;
    handleOpenDialog(schema: Schema, data: any): Promise<unknown>;
    handleDialogConfirm([values]: Array<any>): void;
    handleDialogClose(): void;
    renderControl(): JSX.Element | null;
    /**
     * 布局扩充点，可以自己扩充表单项的布局方式
     */
    static layoutRenderers: {
        [propsName: string]: (props: FormItemProps, renderControl: () => JSX.Element | null) => JSX.Element;
    };
    render(): JSX.Element | null;
}
export declare const detectProps: string[];
export declare function asFormItem(config: Omit<FormItemConfig, 'component'>): (Control: FormControlComponent) => {
    new (props: Omit<any, "rootStore"> | Readonly<Omit<any, "rootStore">>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<any, "rootStore">>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<any, "rootStore">> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<any, "rootStore">>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<any, "rootStore">>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<any, "rootStore">>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<any, "rootStore">>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<any, "rootStore">>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<any, "rootStore">>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<any, "rootStore">>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Omit<any, "rootStore">, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<any, "rootStore">>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<any, "rootStore">> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<any, "rootStore">>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<any, "rootStore">>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<any, "rootStore">>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<any, "rootStore">>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<any, "rootStore">>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<any, "rootStore">>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<any, "rootStore">>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<{
        storeType: string;
    } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
        readonly fetcher: any;
        readonly notify: any; /**
         * 显示一个小图标, 鼠标放上去的时候显示提示内容, 这个小图标跟 label 在一起
         */
        readonly isCancel: (value: any) => boolean; /**
         * 输入提示，聚焦的时候显示
         */
        readonly __: import("../../locale").TranslateFn<any>;
        getStoreById(id: string): {
            id: string;
            path: string;
            storeType: string;
            disposed: boolean;
            parentId: string;
            childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
        } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[]): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
            id: import("mobx-state-tree").ISimpleType<string>;
            path: import("mobx-state-tree").IType<string | undefined, string, string>;
            storeType: import("mobx-state-tree").ISimpleType<string>;
            disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
            childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
        }, {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[]): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        readonly stores: {
            [propName: string]: {
                id: string;
                path: string;
                storeType: string;
                disposed: boolean;
                parentId: string;
                childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[]): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                id: import("mobx-state-tree").ISimpleType<string>;
                path: import("mobx-state-tree").IType<string | undefined, string, string>;
                storeType: import("mobx-state-tree").ISimpleType<string>;
                disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
                childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
            }, {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[]): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        };
    } & {
        addStore(store: {
            [propName: string]: any;
            storeType: string;
            id: string;
            path: string;
            parentId?: string | undefined;
        }): {
            id: string;
            path: string;
            storeType: string;
            disposed: boolean;
            parentId: string;
            childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
        } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[]): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
            id: import("mobx-state-tree").ISimpleType<string>;
            path: import("mobx-state-tree").IType<string | undefined, string, string>;
            storeType: import("mobx-state-tree").ISimpleType<string>;
            disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
            childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
        }, {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[]): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        removeStore(store: {
            id: string;
            path: string;
            storeType: string;
            disposed: boolean;
            parentId: string;
            childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
        } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[]): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
            id: import("mobx-state-tree").ISimpleType<string>;
            path: import("mobx-state-tree").IType<string | undefined, string, string>;
            storeType: import("mobx-state-tree").ISimpleType<string>;
            disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
            childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
        }, {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[]): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>): void;
    } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
        storeType: import("mobx-state-tree").IType<string | undefined, string, string>;
    }, {
        readonly fetcher: any;
        readonly notify: any; /**
         * 显示一个小图标, 鼠标放上去的时候显示提示内容, 这个小图标跟 label 在一起
         */
        readonly isCancel: (value: any) => boolean; /**
         * 输入提示，聚焦的时候显示
         */
        readonly __: import("../../locale").TranslateFn<any>;
        getStoreById(id: string): {
            id: string;
            path: string;
            storeType: string;
            disposed: boolean;
            parentId: string;
            childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
        } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[]): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
            id: import("mobx-state-tree").ISimpleType<string>;
            path: import("mobx-state-tree").IType<string | undefined, string, string>;
            storeType: import("mobx-state-tree").ISimpleType<string>;
            disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
            childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
        }, {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[]): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        readonly stores: {
            [propName: string]: {
                id: string;
                path: string;
                storeType: string;
                disposed: boolean;
                parentId: string;
                childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
            } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[]): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
                id: import("mobx-state-tree").ISimpleType<string>;
                path: import("mobx-state-tree").IType<string | undefined, string, string>;
                storeType: import("mobx-state-tree").ISimpleType<string>;
                disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
                childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
            }, {
                readonly parentStore: any;
                readonly __: any;
                readonly hasChildren: boolean;
                readonly children: any[];
            } & {
                onChildStoreDispose(child: any): void;
                syncProps(props: any, prevProps: any, list?: string[]): void;
                dispose: (callback?: (() => void) | undefined) => void;
                addChildId: (id: string) => void;
                removeChildId: (id: string) => void;
            }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        };
    } & {
        addStore(store: {
            [propName: string]: any;
            storeType: string;
            id: string;
            path: string;
            parentId?: string | undefined;
        }): {
            id: string;
            path: string;
            storeType: string;
            disposed: boolean;
            parentId: string;
            childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
        } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[]): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
            id: import("mobx-state-tree").ISimpleType<string>;
            path: import("mobx-state-tree").IType<string | undefined, string, string>;
            storeType: import("mobx-state-tree").ISimpleType<string>;
            disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
            childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
        }, {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[]): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        removeStore(store: {
            id: string;
            path: string;
            storeType: string;
            disposed: boolean;
            parentId: string;
            childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
        } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[]): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
            id: import("mobx-state-tree").ISimpleType<string>;
            path: import("mobx-state-tree").IType<string | undefined, string, string>;
            storeType: import("mobx-state-tree").ISimpleType<string>;
            disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
            parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
            childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
        }, {
            readonly parentStore: any;
            readonly __: any;
            readonly hasChildren: boolean;
            readonly children: any[];
        } & {
            onChildStoreDispose(child: any): void;
            syncProps(props: any, prevProps: any, list?: string[]): void;
            dispose: (callback?: (() => void) | undefined) => void;
            addChildId: (id: string) => void;
            removeChildId: (id: string) => void;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>): void;
    }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>>;
    ComposedComponent: React.ComponentType<any>;
} & hoistNonReactStatic.NonReactStatics<any, {}> & {
    ComposedComponent: any;
} & {
    ComposedComponent: any;
};
export declare function registerFormItem(config: FormItemConfig): RendererConfig;
export declare function FormItem(config: FormItemBasicConfig): (component: FormControlComponent) => any;
export default FormItem;
