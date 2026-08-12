/**
 * 导航 API — 对齐 iotView src/api/navigation.js
 *
 *   getNavigationList() → GET /classes/Navigation
 *   返回 Parse Navigation 表记录，用于动态菜单生成
 */
import Parse from './parse'

const baseUrl = '/classes/Navigation'

/**
 * 获取导航列表
 */
export function getNavigationList() {
  return Parse.queryObject(baseUrl, {})
}

/**
 * 获取指定分组的导航
 */
export function getNavigationByGroup(group) {
  return Parse.queryObject(baseUrl, {
    where: JSON.stringify({ group }),
    order: 'order',
  })
}

export default { getNavigationList, getNavigationByGroup }
