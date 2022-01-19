export interface Enginer {
    test: (tpl: string) => boolean;
    removeEscapeToken?: (tpl: string) => string;
    compile: (tpl: string, data: object, ...rest: Array<any>) => string;
}
export declare function registerTplEnginer(name: string, enginer: Enginer): void;
export declare function filter(tpl?: any, data?: object, ...rest: Array<any>): string;
export declare function setCustomEvalExpression(fn: (expression: string, data?: any) => boolean): void;
export declare function evalExpression(expression: string, data?: object): boolean;
export declare function setCustomEvalJs(fn: (expression: string, data?: any) => any): void;
export declare function evalJS(js: string, data: object): any;
