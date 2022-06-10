import { Api, ApiObject, fetcherResult, Payload } from '../types';
import { fetcherConfig } from '../factory';
interface ApiCacheConfig extends ApiObject {
    cachedPromise: Promise<any>;
    requestTime: number;
}
export declare function normalizeApi(api: Api, defaultMethod?: string): ApiObject;
export declare function buildApi(api: Api, data?: object, options?: {
    autoAppend?: boolean;
    ignoreData?: boolean;
    [propName: string]: any;
}): ApiObject;
export declare function str2function(contents: string, ...args: Array<string>): Function | null;
export declare function str2AsyncFunction(contents: string, ...args: Array<string>): Function | null;
export declare function responseAdaptor(ret: fetcherResult, api: ApiObject): Payload;
export declare function wrapFetcher(fn: (config: fetcherConfig) => Promise<fetcherResult>): (api: Api, data: object, options?: object) => Promise<Payload | void>;
export declare function wrapAdaptor(promise: Promise<fetcherResult>, api: ApiObject): Promise<Payload>;
export declare function isApiOutdated(prevApi: Api | undefined, nextApi: Api | undefined, prevData: any, nextData: any): nextApi is Api;
export declare function isValidApi(api: string): boolean | "";
export declare function isEffectiveApi(api?: Api, data?: any, initFetch?: boolean, initFetchOn?: string): api is Api;
export declare function isSameApi(apiA: ApiObject | ApiCacheConfig, apiB: ApiObject | ApiCacheConfig): boolean;
export declare function getApiCache(api: ApiObject): ApiCacheConfig | undefined;
export declare function setApiCache(api: ApiObject, promise: Promise<any>): Promise<any>;
export declare function clearApiCache(): void;
export {};
