export interface ValidateFn {
    (values: {
        [propsName: string]: any;
    }, value: any, arg1?: any, arg2?: any, arg3?: any): boolean;
}
export declare const validations: {
    [propsName: string]: ValidateFn;
};
export declare function addRule(ruleName: string, fn: ValidateFn, message?: string): void;
export declare const validateMessages: {
    [propName: string]: string;
};
export declare function validate(value: any, values: {
    [propName: string]: any;
}, rules: {
    [propName: string]: any;
}, messages?: {
    [propName: string]: string;
}, __?: (str: string) => string): Array<{
    rule: string;
    msg: string;
}>;
export declare function validateObject(values: {
    [propName: string]: any;
}, rules: {
    [propName: string]: any;
}, messages?: {
    [propName: string]: string;
}, __?: (str: string) => string): {
    [propName: string]: {
        rule: string;
        msg: string;
    }[];
};
export declare function str2rules(validations: string | {
    [propName: string]: any;
}): {
    [propName: string]: any;
};
