/**
 * @description 路由拦截状态管理，目前两种模式：all模式与intelligence模式，其中partialRoutes是菜单暂未使用
 */
import { asyncRoutes, constantRoutes, resetRouter } from '@/router'
import { defaultRoutes, errorRoutes } from '@/config/router.config'
import { getRouterList } from '@/api/User'
import { convertRouter, filterRoutes } from '@/utils/router/routes'
import { getToken } from '@/utils/vue'
import router from '@/utils/router/utils'
const utilsRouter = new router()
const state = () => ({
  routes: [],
  cachedRoutes: [],
  routerOpenTime: getToken('routerOpenTime', localStorage, []),
})
const getters = {
  routes: (state) => state.routes,
  cachedRoutes: (state) => state.cachedRoutes,
  routerOpenTime: (state) => state.routerOpenTime,
}
const mutations = {
  setRoutesOpenTime(state, info) {
    state.routerOpenTime = _.merge(state.routerOpenTime, info)
  },
  /**
   * @description 多模式设置路由
   * @param {*} state
   * @param {*} routes
   */
  setRoutes(state, routes) {
    state.routes = routes
  },
  /**
   * @description 设置缓存Name数组
   * @param {*} state
   * @param {*} routes
   */
  setCachedRoutes(state, routes) {
    state.cachedRoutes = routes
  },
  /**
   * @description 修改Meta
   * @param {*} state
   * @param options
   */
  changeMenuMeta(state, options) {
    function handleRoutes(routes) {
      return routes.map((route) => {
        if (route.name === options.name) Object.assign(route.meta, options.meta)
        if (route.children && route.children.length) {
          route.children = handleRoutes(route.children)
        }
        return route
      })
    }

    state.routes = handleRoutes(state.routes)
  },
}
const actions = {
  /**
   * @description 多模式设置路由
   * @param {*} { commit }
   * @param mode
   * @returns
   */
  async setRoutes({ commit }, mode = 'none') {
    // 默认前端路由
    let _defaultRoutes = []
    _defaultRoutes.push(defaultRoutes)
    let routes = [...asyncRoutes]
    // 设置后端路由(不需要可以删除)
    const { results } = await getRouterList()
    const cookie = Cookies.get('dgiot_auth_token') !== 'undefined'
    if (!results && cookie) {
      // Vue.prototype.$baseMessage(
      //   '路由未正常返回！',
      //   'error',
      //   false,
      //   'dgiot-hey-message-error'
      // )
      return false
    }
    /**
     * 处理路由
     */
    let data = _.merge(utilsRouter.compute(results, errorRoutes))
    console.log(data)
    if (data[data.length - 1].path !== '*') {
      routes = convertRouter(data)
    }

    // 根据权限和rolesControl过滤路由
    const finallyRoutes = filterRoutes([...constantRoutes, ...routes])
    // 设置菜单所需路由
    commit('setRoutes', finallyRoutes)
    // 根据可访问路由重置Vue Router
    await resetRouter(finallyRoutes)
  },
  /**
   * @description 设置缓存Name数组
   * @param {*} { commit }
   * @param {*} routes
   */
  setCachedRoutes({ commit }, routes) {
    commit('setCachedRoutes', routes)
  },
  setRoutesOpenTime({ commit }, info) {
    commit('setRoutesOpenTime', info)
  },
  /**
   * @description 修改Route Meta
   * @param {*} { commit }
   * @param options
   */
  changeMenuMeta({ commit }, options = {}) {
    commit('changeMenuMeta', options)
  },
}
export default {
  state,
  getters,
  mutations,
  actions,
}
