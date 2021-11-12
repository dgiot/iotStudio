/**
 * @description tabsBar标签页逻辑，如无必要请勿修改
 */
const state = () => ({
  visitedRoutes: [],
})
const getters = {
  visitedRoutes: (state) => state.visitedRoutes,
}
const mutations = {
  /**
   * @description 添加标签页
   * @param {*} state
   * @param {*} route
   * @returns
   */
  addVisitedRoute(state, route) {
    const target = state.visitedRoutes.find((item) => item.path === route.path)
    if (target && !route.meta.dynamicNewTab) {
      Object.assign(target, route)
    } else if (!target) state.visitedRoutes.push(Object.assign({}, route))
  },
  /**
   * @description 删除当前标签页
   * @param {*} state
   * @param {*} path
   * @returns
   */
  delVisitedRoute(state, path) {
    state.visitedRoutes.forEach((item, index) => {
      if (item.path === path) state.visitedRoutes.splice(index, 1)
    })
  },
  /**
   * @description 删除当前标签页以外其它全部标签页
   * @param {*} state
   * @param {*} path
   * @returns
   */
  delOthersVisitedRoutes(state, path) {
    state.visitedRoutes = state.visitedRoutes.filter(
      (item) => item.meta.noClosable || item.path === path,
    )
  },
  /**
   * @description 删除当前标签页左边全部标签页
   * @param {*} state
   * @param {*} path
   * @returns
   */
  delLeftVisitedRoutes(state, path) {
    const idx = state.visitedRoutes.indexOf(
      state.visitedRoutes.find((item) => item.path === path),
    )
    state.visitedRoutes = state.visitedRoutes.filter((item, index) => {
      return item.meta.noClosable || index >= idx
    })
  },
  /**
   * @description 删除当前标签页右边全部标签页
   * @param {*} state
   * @param {*} path
   * @returns
   */
  delRightVisitedRoutes(state, path) {
    const idx = state.visitedRoutes.indexOf(
      state.visitedRoutes.find((item) => item.path === path),
    )
    state.visitedRoutes = state.visitedRoutes.filter((item, index) => {
      return item.meta.noClosable || index <= idx
    })
  },
  /**
   * @description 删除全部标签页
   * @param {*} state
   * @returns
   */
  delAllVisitedRoutes(state) {
    state.visitedRoutes = state.visitedRoutes.filter(
      (item) => item.meta.noClosable,
    )
  },
  /**
   * @description 修改标题
   * @param {*} state
   * @param options
   */
  changeTabsMeta(state, options) {
    function handleVisitedRoutes(visitedRoutes) {
      return visitedRoutes.map((route) => {
        if (route.name === options.name || route.meta.title === options.title) {
          Object.assign(route.meta, options.meta)
        }
        if (route.children && route.children.length) {
          route.children = handleVisitedRoutes(route.children)
        }
        return route
      })
    }

    state.visitedRoutes = handleVisitedRoutes(state.visitedRoutes)
  },
}
const actions = {
  /**
   * @description 添加标签页
   * @param {*} { commit }
   * @param {*} route
   */
  addVisitedRoute({ commit }, route) {
    commit('addVisitedRoute', route)
  },
  /**
   * @description 删除当前标签页
   * @param {*} { commit }
   * @param {*} route
   */
  delVisitedRoute({ commit }, path) {
    commit('delVisitedRoute', path)
  },
  /**
   * @description 删除当前标签页以外其它全部标签页
   * @param {*} { commit }
   * @param {*} path
   */
  delOthersVisitedRoutes({ commit }, path) {
    commit('delOthersVisitedRoutes', path)
  },
  /**
   * @description 删除当前标签页左边全部标签页
   * @param {*} { commit }
   * @param {*} path
   */
  delLeftVisitedRoutes({ commit }, path) {
    commit('delLeftVisitedRoutes', path)
  },
  /**
   * @description 删除当前标签页右边全部标签页
   * @param {*} { commit }
   * @param {*} path
   */
  delRightVisitedRoutes({ commit }, path) {
    commit('delRightVisitedRoutes', path)
  },
  /**
   * @description 删除全部标签页
   * @param {*} { commit }
   */
  delAllVisitedRoutes({ commit }) {
    commit('delAllVisitedRoutes')
  },
  /**
   * @description 修改Route Meta
   * @param {*} { commit }
   * @param options
   */
  changeTabsMeta({ commit }, options = {}) {
    commit('changeTabsMeta', options)
  },
}
export default {
  state,
  getters,
  mutations,
  actions
}
