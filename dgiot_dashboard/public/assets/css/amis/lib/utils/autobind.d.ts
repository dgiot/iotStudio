export declare function bind(fn: Function, context: any): any;
export declare function autobindMethod(target: Object, key: string, { value: fn, configurable, enumerable }: TypedPropertyDescriptor<Function>): {
    configurable: boolean | undefined;
    enumerable: boolean | undefined;
    get(): any;
    set: (this: any, newValue: any) => any;
};
