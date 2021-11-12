import path from 'path'
import { isExternal } from '@/utils/validate'
import { hasAccess } from '@/utils/hasAccess'
import { recordRoute } from '@/config'
import { json2params } from '@/utils/index'

/**
 * @description all模式渲染后端返回路由,支持包含views路径的所有页面
 * @param asyncRoutes
 * @returns {*}
 */
export function convertRouter(asyncRoutes) {
  return asyncRoutes.map((route) => {
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = (resolve) => require(['@/vab/layouts'], resolve)
      } else {
        const index = route.component.indexOf('views')
        const path =
          index > 0 ? route.component.slice(index) : `views/${route.component}`
        route.component = (resolve) => require([`@/${path}`], resolve)
      }
    }
    if (route.children && route.children.length) {
      route.children = convertRouter(route.children)
    }
    if (route.children && route.children.length === 0) delete route.children
    return route
  })
}

/**
 * @description 根据roles数组拦截路由
 * @param routes 路由
 * @param rolesControl 是否进行权限控制
 * @param baseUrl 基础路由
 * @returns {[]}
 */
export function filterRoutes(routes, rolesControl, baseUrl = '/') {
  return routes
    .filter((route) => {
      if (rolesControl && route.meta && route.meta.roles) {
        return hasAccess(route.meta.roles)
      } else {
        return true
      }
    })
    .map((route) => {
      if (route.path !== '*' && !isExternal(route.path)) {
        route.path = path.resolve(baseUrl, route.path)
      }
      if (route.children) {
        route.children = filterRoutes(route.children, rolesControl, route.path)
      }
      return route
    })
}

/**
 * 根据当前route获取激活菜单
 * @param route 当前路由
 * @param isTabsBar 是否是标签
 * @returns {string|*}
 */
export function handleActivePath(route, isTabsBar = false) {
  const {
    meta,
    path,
    fullPath,
  } = route
  const rawPath = route.matched
    ? route.matched[route.matched.length - 1].path
    : path
  if (isTabsBar) return meta.dynamicNewTab ? fullPath : rawPath
  if (meta.activeMenu) return meta.activeMenu
  return fullPath ? fullPath : rawPath
}

/**
 * 获取当前跳转登录页的Route
 * @param currentPath 当前页面地址
 */
export function toLoginRoute(currentPath) {
  const {
    path = '',
    params = {},
    query = {},
  } = currentPath
  if (recordRoute && currentPath !== '/') {
    return {
      path: '/login',
      query: { redirect: path + '?' + json2params(query) },
      replace: true,
    }
  } else {
    return {
      path: '/login',
      replace: true
    }
  }
}
