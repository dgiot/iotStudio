import { Instance } from 'mobx-state-tree';
export declare const RootStore: import("mobx-state-tree").IModelType<{
    id: import("mobx-state-tree").ISimpleType<string>;
    path: import("mobx-state-tree").IType<string | undefined, string, string>;
    storeType: import("mobx-state-tree").ISimpleType<string>;
    disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
    childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
} & {
    hasRemoteData: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").ISimpleType<boolean>, [undefined]>;
    data: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
    initedAt: import("mobx-state-tree").IType<number | undefined, number, number>;
    updatedAt: import("mobx-state-tree").IType<number | undefined, number, number>;
    pristine: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
    action: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
    dialogOpen: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    dialogData: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
    drawerOpen: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    drawerData: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
} & {
    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
    error: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    saving: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    busying: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    checking: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    initializing: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    schema: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
    schemaKey: import("mobx-state-tree").IType<string | undefined, string, string>;
} & {
    runtimeError: import("mobx-state-tree").IType<any, any, any>;
    runtimeErrorStack: import("mobx-state-tree").IType<any, any, any>;
    query: import("mobx-state-tree").IType<any, any, any>;
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
    getValueByName(name: string, canAccessSuper?: boolean): any;
    getPristineValueByName(name: string): any;
} & {
    initData(data?: object, skipSetPristine?: boolean): void;
    reset(): void;
    updateData(data?: object, tag?: object | undefined, replace?: boolean | undefined): void;
    changeValue(name: string, value: any, changePristine?: boolean | undefined, force?: boolean | undefined, otherModifier?: ((data: Object) => void) | undefined): void;
    setCurrentAction(action: object): void;
    openDialog(ctx: any, additonal?: object | undefined, callback?: ((ret: any) => void) | undefined): void;
    closeDialog(result?: any): void;
    openDrawer(ctx: any, additonal?: object | undefined, callback?: ((ret: any) => void) | undefined): void;
    closeDrawer(result?: any): void;
} & {
    readonly loading: boolean;
} & {
    markFetching: (fetching?: boolean) => void;
    markSaving: (saving?: boolean) => void;
    markBusying: (busying?: boolean) => void;
    fetchInitData: (api: import("../types").Api, data?: object | undefined, options?: import("../types").fetchOptions | undefined) => Promise<any>;
    fetchData: (api: import("../types").Api, data?: object | undefined, options?: import("../types").fetchOptions | undefined) => Promise<any>;
    reInitData: (data: object | undefined, replace?: boolean) => void;
    updateMessage: (msg?: string | undefined, error?: boolean) => void;
    clearMessage: () => void;
    setHasRemoteData: () => void;
    saveRemote: (api: import("../types").Api, data?: object | undefined, options?: import("../types").fetchOptions | undefined) => Promise<any>;
    fetchSchema: (api: import("../types").Api, data?: object | undefined, options?: import("../types").fetchOptions | undefined) => Promise<any>;
    checkRemote: (api: import("../types").Api, data?: object | undefined, options?: import("../types").fetchOptions | undefined) => Promise<any>;
} & {
    readonly downStream: any;
} & {
    setRuntimeError(error: any, errorStack: any): void;
    updateLocation(location?: any): void;
}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>;
export declare type IRootStore = Instance<typeof RootStore>;
