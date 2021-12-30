import moment from 'moment';
import { PlainObject } from '../types';
import { Enginer } from './tpl';
export declare const prettyBytes: (num: number) => string;
export declare const escapeHtml: (str: string) => string;
export declare function formatDuration(value: number): string;
export declare const relativeValueRe: RegExp;
export declare const filterDate: (value: string, data?: object, format?: string, utc?: boolean) => moment.Moment;
export declare function parseDuration(str: string): moment.Duration | undefined;
export declare function stripNumber(number: number): number;
export declare const filters: {
    [propName: string]: (input: any, ...args: any[]) => any;
};
export declare function registerFilter(name: string, fn: (input: any, ...args: any[]) => any): void;
export declare function getFilters(): {
    [propName: string]: (input: any, ...args: any[]) => any;
};
export declare function pickValues(names: string, data: object): any;
export declare const resolveVariable: (path?: string | undefined, data?: any) => any;
export declare function isPureVariable(path?: any): path is string;
export declare const resolveVariableAndFilter: (path?: string | undefined, data?: object, defaultFilter?: string, fallbackValue?: (value: any) => any) => any;
export declare const tokenize: (str: string, data: object, defaultFilter?: string) => string;
export declare function resolveMapping(value: any, data: PlainObject, defaultFilter?: string): any;
export declare function dataMapping(to: any, from?: PlainObject, ignoreFunction?: boolean | ((key: string, value: any) => boolean)): any;
export declare function register(): Enginer & {
    name: string;
};
