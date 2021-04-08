/**
 * @description 登录、获取用户信息、退出登录、清除token逻辑，不建议修改
 */

import { getUserInfo, login, logout, socialLogin } from '@/api/User/index'
import { tokenTableName, storage, title, tokenName } from '@/config'
import { getToken, removeToken, setToken, clearCookie } from '@/utils/vuex'
import { resetRouter } from '@/router'
import { license, SiteDefault } from '@/api/License'
const state = () => ({
  token: getToken(tokenTableName, storage),
  username: getToken('username', storage),
  avatar: getToken('avatarimg', 'sessionStorage'),
  objectId: getToken('objectId', storage),
})
const getters = {
  token: (state) => state.token,
  username: (state) => state.username,
  avatar: (state) => state.avatar,
  objectId: (state) => state.objectId,
}
const mutations = {
  /**
   * @description 设置用户登录Id
   * @param {*} state
   * @param {*} objectId
   */
  setObejectId(state, objectId) {
    state.objectId = objectId
    setToken('objectId', objectId, storage)
  },
  /**
   * @description 设置token
   * @param {*} state
   * @param {*} token
   */
  setToken(state, token) {
    state.token = token
    setToken(tokenTableName, token, storage)
  },
  /**
   * @description 设置用户名
   * @param {*} state
   * @param {*} username
   */
  setUsername(state, username) {
    state.username = username
    setToken('username', username, storage)
  },
  /**
   * @description 设置头像
   * @param {*} state
   * @param {*} avatar
   */
  setAvatar(state, avatar) {
    state.avatar = avatar
    setToken('avatarimg', avatar, 'sessionStorage')
  },
}
const actions = {
  /**
   * @description 登录拦截放行时，设置虚拟角色
   * @param {*} { commit, dispatch }
   */
  setVirtualRoles({ commit, dispatch }) {
    dispatch('acl/setFull', true, { root: true })
    commit('setUsername', 'admin(未开启登录拦截)')
  },
  /**
   * @description 登录
   * @param {*} { commit }
   * @param {*} userInfo
   */
  async login({ commit }, userInfo) {
    const data = await login(userInfo)
    const token = data[tokenName]
    const { nick, objectId, roles } = data
    Cookies.set('roles', roles)
    if (nick) commit('setUsername', nick)
    if (objectId) commit('setObejectId', objectId)
    const page_title = getToken('title', 'sessionStorage') || title
    if (token) {
      commit('setToken', token)
      const hour = new Date().getHours()
      const thisTime =
        hour < 8
          ? '早上好'
          : hour <= 11
          ? '上午好'
          : hour <= 13
          ? '中午好'
          : hour < 18
          ? '下午好'
          : '晚上好'
      Vue.prototype.$baseNotify(
        `欢迎${nick}您登录${page_title}`,
        `${thisTime}！`
      )
    } else {
      Vue.prototype.$baseMessage(
        `登录接口异常，未正确返回${tokenName}...`,
        'error'
      )
      return Promise.reject()
    }
  },
  /**
   * @description 第三方登录
   * @param {*} {}
   * @param {*} tokenData
   */
  async socialLogin({}, tokenData) {
    const { data } = await socialLogin(tokenData)
    const token = data[tokenName]
    if (token) {
      const hour = new Date().getHours()
      const thisTime =
        hour < 8
          ? '早上好'
          : hour <= 11
          ? '上午好'
          : hour <= 13
          ? '中午好'
          : hour < 18
          ? '下午好'
          : '晚上好'
      Vue.prototype.$baseNotify(`欢迎登录${title}`, `${thisTime}！`)
    } else {
      Vue.prototype.$baseMessage(
        `login核心接口异常，请检查返回JSON格式是否正确，是否正确返回${tokenName}...`,
        'error'
      )
      return Promise.reject()
    }
  },
  /**
   * @description 获取用户信息接口 这个接口非常非常重要，如果没有明确底层前逻辑禁止修改此方法，错误的修改可能造成整个框架无法正常使用
   * @param {*} { commit, dispatch, state }
   * @returns
   */
  async getUserInfo({ commit, dispatch }) {
    const { results } = await getUserInfo({ limit: 40 })
    // if (
    //   results
    //   // (username && !isString(username)) ||
    //   // (avatar && !isString(avatar)) ||
    //   // (roles && !isArray(roles)) ||
    //   // (ability && !isArray(ability))
    // ) {
    //   Vue.prototype.$baseMessage(
    //     'getUserInfo核心接口异常，请检查返回JSON格式是否正确',
    //     'error'
    //   )
    //   return Promise.reject()
    // }

    // // 如不使用username用户名,可删除以下代码
    // if (username) commit('setUsername', username)
    // // 如不使用avatar头像,可删除以下代码
    // if (avatar) commit('setAvatar', avatar)
    // // 如不使用roles权限控制,可删除以下代码
    // if (roles) dispatch('acl/setRole', roles, { root: true })
    // // 如不使用ability权限控制,可删除以下代码
    // if (ability) dispatch('acl/setAbility', ability, { root: true })
  },
  async getlicense({ commit, dispatch }) {
    const { result } = await license()
    setToken('license', false, storage)
    if (result) dispatch('acl/setLicense', result, { root: true })
  },
  async getDefault({ commit, dispatch }) {
    const Default = await SiteDefault()
    // console.log(copyright, dashboard, logo, objectId, title)
    const { copyright, dashboard, logo, objectId, title } = Default
    if (title) dispatch('settings/setTitle', title, { root: true })
    if (logo) commit('setAvatar', logo)

    const res = { copyright, dashboard, logo, objectId, title }
    if (copyright) dispatch('acl/setCopyright', copyright, { root: true })
    if (Default) dispatch('acl/setDefault', res, { root: true })
  },
  /**
   * @description 退出登录
   * @param {*} { dispatch }
   */
  async logout({ dispatch }) {
    await logout()
    await dispatch('resetAll')
  },
  /**
   * @description 重置token、roles、ability、router、tabsBar等
   * @param {*} { commit, dispatch }
   */
  async resetAll({ commit, dispatch }) {
    commit('setUsername', '')
    commit('setObejectId', '')
    commit('setAvatar', '')
    commit('routes/setRoutes', [], { root: true })
    await dispatch('setToken', '')
    await dispatch('acl/setFull', false, { root: true })
    await dispatch('acl/setRole', [], { root: true })
    await dispatch('acl/setAbility', [], { root: true })
    await dispatch('tabs/delAllVisitedRoutes', [], { root: true })
    // await dispatch('acl/setLicense', false, { root: true })
    // await dispatch('acl/setDefault', {}, { root: true })
    // await dispatch('settings/setTitle', '', { root: true })
    // 退出后清理所有的cookie sessionStorage localStorage
    localStorage.clear()
    sessionStorage.clear()
    clearCookie()
    await resetRouter()
    removeToken(tokenTableName)
  },
  setObejectId({ commit }, objectId) {
    commit('setObejectId', objectId)
  },
  /**
   * @description 设置token
   * @param {*} { commit }
   * @param {*} token
   */
  setToken({ commit }, token) {
    commit('setToken', token)
  },
  setAvatar({ commit }, avatar) {
    commit('setAvatar', avatar)
  },
}
export default { state, getters, mutations, actions }
