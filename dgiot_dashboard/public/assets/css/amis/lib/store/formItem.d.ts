import { SnapshotIn, Instance } from 'mobx-state-tree';
import { Api, Payload, fetchOptions } from '../types';
export declare const FormItemStore: import("mobx-state-tree").IModelType<{
    id: import("mobx-state-tree").ISimpleType<string>;
    path: import("mobx-state-tree").IType<string | undefined, string, string>;
    storeType: import("mobx-state-tree").ISimpleType<string>;
    disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
    childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
} & {
    isFocused: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    type: import("mobx-state-tree").IType<string | undefined, string, string>;
    unique: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    loading: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    required: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    tmpValue: import("mobx-state-tree").IType<any, any, any>;
    emitedValue: import("mobx-state-tree").IType<any, any, any>;
    rules: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
    messages: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
    errorData: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
        msg: import("mobx-state-tree").IType<string | undefined, string, string>;
        tag: import("mobx-state-tree").IType<string | undefined, string, string>;
        rule: import("mobx-state-tree").IType<string | undefined, string, string>;
    }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>, [undefined]>;
    name: import("mobx-state-tree").ISimpleType<string>;
    itemId: import("mobx-state-tree").IType<string | undefined, string, string>;
    unsetValueOnInvisible: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    itemsRef: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
    validated: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    validating: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    multiple: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    delimiter: import("mobx-state-tree").IType<string | undefined, string, string>;
    valueField: import("mobx-state-tree").IType<string | undefined, string, string>;
    labelField: import("mobx-state-tree").IType<string | undefined, string, string>;
    joinValues: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    extractValue: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    options: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any[], any[], any[]>, [undefined]>;
    expressionsInOptions: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    selectFirst: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    autoFill: import("mobx-state-tree").IType<any, any, any>;
    clearValueOnHidden: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    validateApi: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
    selectedOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
    filteredOptions: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
    dialogSchema: import("mobx-state-tree").IType<any, any, any>;
    dialogOpen: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    dialogData: import("mobx-state-tree").IType<any, any, any>;
    resetValue: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
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
} & {
    readonly subFormItems: any;
    readonly form: any;
    readonly value: any;
    readonly prinstine: any;
    readonly errors: string[];
    readonly valid: boolean;
    readonly errClassNames: string;
    readonly lastSelectValue: string;
    getSelectedOptions: (value?: any, nodeValueArray?: any[] | undefined) => any[];
} & {
    focus: () => void;
    blur: () => void;
    config: ({ required, unique, value, rules, messages, delimiter, multiple, valueField, labelField, joinValues, extractValue, type, id, selectFirst, autoFill, clearValueOnHidden, validateApi, maxLength, minLength }: {
        required?: boolean | undefined;
        unique?: boolean | undefined;
        value?: any;
        rules?: string | {
            [propName: string]: any;
        } | undefined;
        messages?: {
            [propName: string]: string;
        } | undefined;
        multiple?: boolean | undefined;
        delimiter?: string | undefined;
        valueField?: string | undefined;
        labelField?: string | undefined;
        joinValues?: boolean | undefined;
        extractValue?: boolean | undefined;
        type?: string | undefined;
        id?: string | undefined;
        selectFirst?: boolean | undefined;
        autoFill?: any;
        clearValueOnHidden?: boolean | undefined;
        validateApi?: boolean | undefined;
        minLength?: number | undefined;
        maxLength?: number | undefined;
    }) => void;
    validate: (data: Object, hook?: any) => Promise<boolean>;
    setError: (msg: string | Array<string>, tag?: string) => void;
    addError: (msg: string | (string | {
        msg: string;
        rule: string;
    })[], tag?: string) => void;
    clearError: (tag?: string | undefined) => void;
    setOptions: (options: Array<object>, onChange?: ((value: any) => void) | undefined, data?: Object | undefined) => void;
    loadOptions: (api: Api, data?: object | undefined, config?: (fetchOptions & {
        extendsOptions?: boolean | undefined;
    }) | undefined, clearValue?: boolean | undefined, onChange?: ((value: any) => void) | undefined, setErrorFlag?: boolean | undefined) => Promise<Payload | null>;
    deferLoadOptions: (option: any, api: Api, data?: object | undefined, config?: fetchOptions | undefined) => Promise<Payload | null>;
    expandTreeOptions: (nodePathArr: any[], api: Api, data?: object | undefined, config?: fetchOptions | undefined) => Promise<Payload | null | void>;
    syncOptions: (originOptions?: any[] | undefined, data?: Object | undefined) => void;
    setLoading: (value: boolean) => void;
    setSubStore: (store: any) => void;
    getSubStore: () => any;
    reset: () => void;
    openDialog: (schema: any, data: any, callback?: ((ret?: any) => void) | undefined) => void;
    closeDialog: (result?: any) => void;
    changeTmpValue: (value: any) => void;
    changeEmitedValue: (value: any) => void;
    addSubFormItem: (item: IFormItemStore) => void;
    removeSubFormItem: (item: IFormItemStore) => void;
}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>;
export declare type IFormItemStore = Instance<typeof FormItemStore>;
export declare type SFormItemStore = SnapshotIn<typeof FormItemStore>;
