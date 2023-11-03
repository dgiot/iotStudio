/*
 * @Author: h7ml
 * @Date: 2021-03-11 12:41:30
 * @LastEditTime: 2021-03-25 20:46:08
 * @LastEditors: h7ml
 * @FilePath: \shuwa_dashboard\src\dgiot\plugins\permissions.js
 * @Description:
 */
/**
 * @description 路由守卫，目前两种模式：all模式与intelligence模式
 */
import router from '@/router'
import store from '@/store'
import DgiotProgress from 'nprogress'
// import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/vue/pageTitle'
import { toLoginRoute } from '@/utils/router/routes'
import { checkoutToken, login } from '@/api/User'

import {
  authentication,
  loginInterception,
  routesWhiteList,
  supportVisit,
} from '@/config'

DgiotProgress.configure({
  easing: 'ease',
  speed: 500,
  trickleSpeed: 200,
  showSpinner: false,
})

router.beforeEach(async (to, from, next) => {
  window.errRoute = null
  store.dispatch('routes/setRoutesOpenTime', {
    router: to.meta.component,
    timestamp: moment(new Date()).valueOf(),
  })
  if (to.name == '404') {
    window.errRoute = to
   
    return false
  }
  if (to.query.tempToken) {
    let checkoutflag = false
    await checkoutToken(to.query.tempToken).then((res) => {
      if (res.code == 200) {
        checkoutflag = true
      }
    })
    if (checkoutflag) {
      Vue.prototype.$baseMessage(
        Vue.prototype.$translateTitle(`token有效,登录跳转中`),
        'success'
      )
      await store.dispatch('user/login', {
        username: 'dgiot',
        password: 'w9943535dsgfgdsgdsertet',
      })
    } else {
      Vue.prototype.$baseMessage(
        Vue.prototype.$translateTitle(`token已失效。`),
        'error'
      )
    }
  }
  const { showProgressBar } = store.getters['settings/theme']
  if (showProgressBar) DgiotProgress.start()
  // let hasToken = store.getters['user/token']
  let hasToken = localStorage.getItem('sessionToken')
  if (!loginInterception) hasToken = true
  if (hasToken) {
    if (store.getters['routes/routes'].length) {
      // 禁止已登录用户返回登录页
      if (to.path === '/login') {
        next({
          path: '/dashboard',
        })
        if (showProgressBar) DgiotProgress.done()
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
      next()
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
  window.router = dgiot.router = routecInfo
  window.routerConfig = to
  if (DgiotProgress.status) DgiotProgress.done()
})
