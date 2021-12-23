/*
 * @Author: h7ml
 * @Date: 2021-03-11 12:41:30
 * @LastEditTime: 2021-03-25 20:46:08
 * @LastEditors: h7ml
 * @FilePath: \shuwa_dashboard\src\vab\plugins\permissions.js
 * @Description:
 */
/**
 * @description 路由守卫，目前两种模式：all模式与intelligence模式
 */
import router from '@/router'
import store from '@/store'
import VabProgress from 'nprogress'
// import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/vue/pageTitle'
import { toLoginRoute } from '@/utils/router/routes'
import {
  authentication,
  loginInterception,
  routesWhiteList,
  supportVisit,
} from '@/config'

VabProgress.configure({
  easing: 'ease',
  speed: 500,
  trickleSpeed: 200,
  showSpinner: false,
})
router.beforeEach(async (to, from, next) => {
  store.dispatch('routes/setRoutesOpenTime', {
    router: to.meta.component,
    timestamp: moment(new Date()).valueOf(),
  })
  // if (to.name == '404') {
  //   return false
  // }
  const { showProgressBar } = store.getters['settings/theme']
  if (showProgressBar) VabProgress.start()
  let hasToken = store.getters['user/token']

  if (!loginInterception) hasToken = true

  if (hasToken) {
    if (store.getters['routes/routes'].length) {
      // 这里判断下存储的路由表  并且过滤掉白名单
      // dgiotlog.log(store.getters['routes/routes'])
      // 禁止已登录用户返回登录页
      if (to.path === '/login') {
        next({
          path: '/dashboard',
        })
        if (showProgressBar) VabProgress.done()
      } else {
        next()
      }
    } else {
      try {
        if (loginInterception) {
          // await store.dispatch('user/getUserInfo')
          // await store.dispatch('user/getlicense')
          // await store.dispatch('user/getDefault')
        }
        // config/setting.config.js loginInterception为false(关闭登录拦截时)时，创建虚拟角色
        else {
          await store.dispatch('user/setVirtualRoles')
        }
        // 根据路由模式获取路由并根据权限过滤
        await store.dispatch('routes/setRoutes', authentication)
        next({
          ...to,
          replace: true,
        })
      } catch (err) {
        dgiotlog.warn('错误拦截:', err)
        await store.dispatch('user/resetAll')
        next(toLoginRoute(to))
      }
    }
  } else {
    if (routesWhiteList.includes(to.path)) {
      // 设置游客路由(不需要可以删除)
      if (supportVisit && !store.getters['routes/routes'].length) {
        await store.dispatch('routes/setRoutes', 'visit')
        next({
          ...to,
          replace: true,
        })
      } else {
        next()
      }
    } else {
      next(toLoginRoute(to))
    }
  }
})
router.afterEach((to) => {
  // 输出路由信息，方便找到点击的页面
  let routecInfo
  if (to.meta && to.meta.title) {
    routecInfo = to.meta.component
    document.title = getPageTitle(`${to.meta.title}`)
  } else {
    routecInfo = to
  }
  if (!_.isPlainObject(routecInfo))
    dgiotlog
      .getDgiotlog('src/dgiot/plugins/permissions.js')
      .info('router ->', routecInfo)
  dgiot.router = routecInfo
  if (VabProgress.status) VabProgress.done()
})
