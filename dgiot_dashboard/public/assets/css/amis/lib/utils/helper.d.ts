/// <reference types="react" />
import { Schema, PlainObject, FunctionPropertyNames } from '../types';
import qs from 'qs';
import { IIRendererStore } from '../store';
import { autobindMethod } from './autobind';
export declare function createObject(superProps?: {
    [propName: string]: any;
}, props?: {
    [propName: string]: any;
}, properties?: any): object;
export declare function cloneObject(target: any, persistOwnProps?: boolean): any;
/**
 * 给目标对象添加其他属性，可读取但是不会被遍历。
 * @param target
 * @param props
 */
export declare function injectPropsToObject(target: any, props: any): any;
export declare function extendObject(target: any, src?: any, persistOwnProps?: boolean): any;
export declare function syncDataFromSuper(data: any, superObject: any, prevSuperObject: any, store: IIRendererStore, force: boolean): any;
/**
 * 生成 8 位随机数字。
 *
 * @return {string} 8位随机数字
 */
export declare function guid(): string;
export declare function findIndex(arr: Array<any>, detect: (item?: any, index?: number) => boolean): number;
export declare function getVariable(data: {
    [propName: string]: any;
}, key: string | undefined, canAccessSuper?: boolean): any;
export declare function setVariable(data: {
    [propName: string]: any;
}, key: string, value: any): void;
export declare function deleteVariable(data: {
    [propName: string]: any;
}, key: string): void;
export declare function hasOwnProperty(data: {
    [propName: string]: any;
}, key: string): boolean;
export declare function noop(): void;
export declare function anyChanged(attrs: string | Array<string>, from: {
    [propName: string]: any;
}, to: {
    [propName: string]: any;
}, strictMode?: boolean): boolean;
export declare function rmUndefined(obj: PlainObject): PlainObject;
export declare function isObjectShallowModified(prev: any, next: any, strictMode?: boolean, ignoreUndefined?: boolean, statck?: Array<any>): boolean;
export declare function isArrayChildrenModified(prev: Array<any>, next: Array<any>, strictMode?: boolean): boolean;
export declare function immutableExtends(to: any, from: any, deep?: boolean): any;
export declare function makeColumnClassBuild(steps: number, classNameTpl?: string): (schema: Schema) => any;
export declare function hasVisibleExpression(schema: {
    visibleOn?: string;
    hiddenOn?: string;
    visible?: boolean;
    hidden?: boolean;
}): string | undefined;
export declare function isVisible(schema: {
    visibleOn?: string;
    hiddenOn?: string;
    visible?: boolean;
    hidden?: boolean;
}, data?: object): boolean;
export declare function isUnfolded(node: any, config: {
    foldedField?: string;
    unfoldedField?: string;
}): boolean;
/**
 * 过滤掉被隐藏的数组元素
 */
export declare function visibilityFilter(items: any, data?: object): any;
export declare function isDisabled(schema: {
    disabledOn?: string;
    disabled?: boolean;
}, data?: object): boolean | "" | undefined;
export declare function hasAbility(schema: any, ability: string, data?: object, defaultValue?: boolean): boolean;
export declare function makeHorizontalDeeper(horizontal: {
    left: string;
    right: string;
    offset: string;
    leftFixed?: any;
}, count: number): {
    left: string | number;
    right: string | number;
    offset: string | number;
    leftFixed?: any;
};
export declare function promisify<T extends Function>(fn: T): (...args: Array<any>) => Promise<any> & {
    raw: T;
};
export declare function getScrollParent(node: HTMLElement): HTMLElement | null;
/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
export declare function difference<T extends {
    [propName: string]: any;
}, U extends {
    [propName: string]: any;
}>(object: T, base: U, keepProps?: Array<string>): {
    [propName: string]: any;
};
export declare const padArr: (arr: Array<any>, size?: number) => Array<Array<any>>;
export declare function __uri(id: string): string;
export declare function isObject(obj: any): any;
export declare function isBreakpoint(str: string): boolean;
export declare function until(fn: () => Promise<any>, when: (ret: any) => boolean, getCanceler: (fn: () => any) => void, interval?: number): Promise<unknown>;
export declare function omitControls(controls: Array<any>, omitItems: Array<string>): Array<any>;
export declare function isEmpty(thing: any): boolean;
/**
 * 基于时间戳的 uuid
 *
 * @returns uniqueId
 */
export declare const uuid: () => string;
export declare const uuidv4: () => string;
export interface TreeItem {
    children?: TreeArray;
    [propName: string]: any;
}
export interface TreeArray extends Array<TreeItem> {
}
/**
 * 类似于 arr.map 方法，此方法主要针对类似下面示例的树形结构。
 * [
 *     {
 *         children: []
 *     },
 *     // 其他成员
 * ]
 *
 * @param {Tree} tree 树形数据
 * @param {Function} iterator 处理函数，返回的数据会被替换成新的。
 * @return {Tree} 返回处理过的 tree
 */
export declare function mapTree<T extends TreeItem>(tree: Array<T>, iterator: (item: T, key: number, level: number, paths: Array<T>) => T, level?: number, depthFirst?: boolean, paths?: Array<T>): any[];
/**
 * 遍历树
 * @param tree
 * @param iterator
 */
export declare function eachTree<T extends TreeItem>(tree: Array<T>, iterator: (item: T, key: number, level: number) => any, level?: number): void;
/**
 * 在树中查找节点。
 * @param tree
 * @param iterator
 */
export declare function findTree<T extends TreeItem>(tree: Array<T>, iterator: (item: T, key: number, level: number, paths: Array<T>) => any): T | null;
/**
 * 在树中查找节点, 返回下标数组。
 * @param tree
 * @param iterator
 */
export declare function findTreeIndex<T extends TreeItem>(tree: Array<T>, iterator: (item: T, key: number, level: number, paths: Array<T>) => any): Array<number> | undefined;
export declare function getTree<T extends TreeItem>(tree: Array<T>, idx: Array<number> | number): T | undefined | null;
/**
 * 过滤树节点
 *
 * @param tree
 * @param iterator
 */
export declare function filterTree<T extends TreeItem>(tree: Array<T>, iterator: (item: T, key: number, level: number) => any, level?: number, depthFirst?: boolean): T[];
/**
 * 判断树中每个节点是否满足某个条件。
 * @param tree
 * @param iterator
 */
export declare function everyTree<T extends TreeItem>(tree: Array<T>, iterator: (item: T, key: number, level: number, paths: Array<T>, indexes: Array<number>) => boolean, level?: number, paths?: Array<T>, indexes?: Array<number>): boolean;
/**
 * 判断树中是否有某些节点满足某个条件。
 * @param tree
 * @param iterator
 */
export declare function someTree<T extends TreeItem>(tree: Array<T>, iterator: (item: T, key: number, level: number, paths: Array<T>) => boolean): boolean;
/**
 * 将树打平变成一维数组，可以传入第二个参数实现打平节点中的其他属性。
 *
 * 比如：
 *
 * flattenTree([
 *     {
 *         id: 1,
 *         children: [
 *              { id: 2 },
 *              { id: 3 },
 *         ]
 *     }
 * ], item => item.id); // 输出位 [1, 2, 3]
 *
 * @param tree
 * @param mapper
 */
export declare function flattenTree<T extends TreeItem>(tree: Array<T>): Array<T>;
export declare function flattenTree<T extends TreeItem, U>(tree: Array<T>, mapper: (value: T, index: number) => U): Array<U>;
/**
 * 操作树，遵循 imutable, 每次返回一个新的树。
 * 类似数组的 splice 不同的地方这个方法不修改原始数据，
 * 同时第二个参数不是下标，而是下标数组，分别代表每一层的下标。
 *
 * 至于如何获取下标数组，请查看 findTreeIndex
 *
 * @param tree
 * @param idx
 * @param deleteCount
 * @param ...items
 */
export declare function spliceTree<T extends TreeItem>(tree: Array<T>, idx: Array<number> | number, deleteCount?: number, ...items: Array<T>): Array<T>;
/**
 * 计算树的深度
 * @param tree
 */
export declare function getTreeDepth<T extends TreeItem>(tree: Array<T>): number;
/**
 * 从树中获取某个值的所有祖先
 * @param tree
 * @param value
 */
export declare function getTreeAncestors<T extends TreeItem>(tree: Array<T>, value: T, includeSelf?: boolean): Array<T> | null;
/**
 * 从树中获取某个值的上级
 * @param tree
 * @param value
 */
export declare function getTreeParent<T extends TreeItem>(tree: Array<T>, value: T): T | null;
export declare function ucFirst(str?: string): string | undefined;
export declare function lcFirst(str?: string): string;
export declare function camel(str?: string): string;
export declare function getWidthRate(value: any, strictMode?: boolean): number;
export declare function getLevelFromClassName(value: string, defaultValue?: string): string;
export declare function string2regExp(value: string, caseSensitive?: boolean): RegExp;
export declare function pickEventsProps(props: any): any;
export declare const autobind: typeof autobindMethod;
export declare const bulkBindFunctions: <T extends {
    [propName: string]: any;
}>(context: T, funNames: FunctionPropertyNames<T>[]) => void;
export declare function sortArray<T extends any>(items: Array<T>, field: string, dir: -1 | 1): Array<T>;
export declare function hasFile(object: any): boolean;
export declare function qsstringify(data: any, options?: any, keepEmptyArray?: boolean): string;
export declare function qsparse(data: string, options?: any): qs.ParsedQs;
export declare function object2formData(data: any, options?: any, fd?: FormData): any;
export declare function chainFunctions(...fns: Array<(...args: Array<any>) => void>): (...args: Array<any>) => void;
export declare function chainEvents(props: any, schema: any): any;
export declare function mapObject(value: any, fn: Function): any;
export declare function loadScript(src: string): Promise<void>;
export declare class SkipOperation extends Error {
}
/**
 * 将例如像 a.b.c 或 a[1].b 的字符串转换为路径数组
 *
 * @param string 要转换的字符串
 */
export declare const keyToPath: (string: string) => string[];
/**
 * 深度查找具有某个 key 名字段的对象，实际实现是 internalFindObjectsWithKey，这里包一层是为了做循环引用检测
 * @param obj
 * @param key
 */
export declare function findObjectsWithKey(obj: any, key: string): any[];
/**
 * 获取浏览器滚动条宽度 https://stackoverflow.com/a/13382873
 */
export declare function getScrollbarWidth(): number;
export declare function getPropValue<T extends {
    value?: any;
    name?: string;
    data?: any;
    defaultValue?: any;
}>(props: T, getter?: (props: T) => any): any;
export declare function detectPropValueChanged<T extends {
    value?: any;
    name?: string;
    data?: any;
    defaultValue?: any;
}>(props: T, prevProps: T, onChange: (value: any) => void, getter?: (props: T) => any): void;
export declare function removeHTMLTag(str: string): string;
/**
 * 将路径格式的value转换成普通格式的value值
 *
 * @example
 *
 * 'a/b/c' => 'c';
 * {label: 'A/B/C', value: 'a/b/c'} => {label: 'C', value: 'c'};
 * 'a/b/c,a/d' => 'c,d';
 * ['a/b/c', 'a/d'] => ['c', 'd'];
 * [{label: 'A/B/C', value: 'a/b/c'},{label: 'A/D', value: 'a/d'}] => [{label: 'C', value: 'c'},{label: 'D', value: 'd'}]
 */
export declare function normalizeNodePath(value: any, enableNodePath: boolean, labelField?: string, valueField?: string, pathSeparator?: string, delimiter?: string): {
    nodeValueArray: any[];
    nodePathArray: any[];
};
export declare function isClickOnInput(e: React.MouseEvent<HTMLElement>): boolean;
