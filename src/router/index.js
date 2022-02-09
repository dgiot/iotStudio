/*
 * @Author: h7ml
 * @Date: 2021-03-17 10:37:21
 * @LastEditTime: 2021-03-17 19:55:31
 * @LastEditors: h7ml
 * @FilePath: \dgiot-dashboard\src\router\index.js
 * @Description:
 */
/**
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，pro版只支持remixIcon图标，具体配置请查看vip群文档
 */

/* 多级路由不需要缓存时可放开注释直接引入 用法component:VabEmptyLayout*/
/* import VabEmptyLayout from '@/vab/layouts/VabEmptyLayout' */
import { publicPath, routerMode } from '@/config'

export const constantRoutes = [
  {
    path: '/quick',
    component: () => import('@/views/MultiTenant/user/quick'),
    hidden: true,
  },
  {
    path: '/admin',
    component: () => import('@/views/MultiTenant/user/admin'),
    hidden: true,
  },
  {
    path: '/dev',
    component: () => import('@/views/MultiTenant/user/dev'),
    hidden: true,
  },
  {
    path: '/datav',
    component: () => import('@/components/datav/index'),
    hidden: true,
  },
  {
    path: '/login',
    component: () => import('@/views/MultiTenant/user/login'),
    hidden: true,
  },
  {
    path: '/jwtLogin',
    component: () => import('@/views/MultiTenant/user/jwtlogin'),
    hidden: true,
  },
  {
    path: '/register',
    component: () => import('@/views/MultiTenant/user/register'),
    hidden: true,
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/403'),
    hidden: true,
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    hidden: true,
  },
]

export const asyncRoutes = []

const router = createRouter()

export function resetRouter(routes = constantRoutes) {
  router.matcher = createRouter(routes).matcher
}

function createRouter(routes = constantRoutes) {
  return new VueRouter({
    base: publicPath,
    mode: routerMode,
    scrollBehavior: () => ({
      y: 0,
    }),
    routes: routes,
  })
}

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject)
  }
  return originalPush.call(this, location).catch((err) => err)
}

export default router
