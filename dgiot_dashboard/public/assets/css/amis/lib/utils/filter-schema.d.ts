import { PlainObject } from '../types';
/**
 * 处理 Props 数据，所有带 On 结束的做一次
 *
 * xxxOn
 * xxxExpr
 *
 *
 * @param schema
 * @param data
 */
export default function getExprProperties(schema: PlainObject, data?: object, blackList?: Array<string>, props?: any): PlainObject;
