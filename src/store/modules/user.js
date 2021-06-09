/**
 * @description 登录、获取用户信息、退出登录、清除token逻辑，不建议修改
 */
const getLocalStorage = (key) => {
  const value = localStorage.getItem(key)
  if (isJson(value)) {
    return JSON.parse(value)
  } else {
    return false
  }
}
import { getUserInfo, login, logout, socialLogin } from '@/api/User/index'
import { tokenTableName, storage, title, tokenName, i18n } from '@/config'
import { getToken, removeToken, setToken, clearCookie } from '@/utils/vuex'
import { resetRouter } from '@/router'
import { Roletree } from '@/api/Menu'
import { queryProduct } from '@/api/Product'
import { license, SiteDefault } from '@/api/License'
import { isJson } from '@/utils/validate'
const { language } = getLocalStorage('language')
const state = () => ({
  language: language || i18n,
  roleTree: getToken('roleTree', 'sessionStorage'), // 处理数据类型不匹配
  _Product: getToken('Product', 'sessionStorage'),
  token: getToken(tokenTableName, storage),
  name: getToken('name', 'sessionStorage'),
  username: getToken('username', 'sessionStorage'),
  setlogo: getToken('logo', 'sessionStorage'),
  setBackgroundimage: getToken('backgroundimage', 'sessionStorage'),
  avatar: getToken('avatar', 'sessionStorage'),
  Copyright: getToken('Copyright', 'sessionStorage'),
  logo:
    getToken('logo', 'sessionStorage') ||
    'http://www.iotn2n.com/favicon.ico?1558342112',
  backgroundimage:
    getToken('backgroundimage', 'sessionStorage') ||
    'http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/platform/assets/login_images/background.jpg',
  objectId: getToken('objectId', 'sessionStorage'),
})
const getters = {
  language: (state) => state.language,
  roleTree: (state) => state.roleTree,
  _Product: (state) => state._Product,
  token: (state) => state.token,
  username: (state) => state.username,
  avatar: (state) => state.avatar,
  logo: (state) => state.logo,
  backgroundimage: (state) => state.backgroundimage,
  objectId: (state) => state.objectId,
  Copyright: (state) => state.Copyright,
  name: (state) => state.name,
}
const mutations = {
  setRoleTree(state, tree) {
    state.roleTree = tree
    setToken('roleTree', tree, 'sessionStorage') // 解决数据持久化问题
  },
  set_Product(state, Product) {
    state._Product = Product
    setToken('Product', Product, 'sessionStorage') // 解决数据持久化问题
  },
  setname(state, name) {
    state.name = name
    setToken('name', name, 'sessionStorage')
  },
  setCopyright(state, Copyright) {
    state.Copyright = Copyright
    setToken('logo', Copyright, 'storagesessionStorage')
  },
  setlogo(state, url) {
    state.logo = url
    setToken('logo', url, 'sessionStorage')
  },
  setBackgroundimage(state, url) {
    state.backgroundimage = url
    setToken('backgroundimage', url, 'sessionStorage')
  },
  /**
   * @description 设置用户登录Id
   * @param {*} state
   * @param {*} objectId
   */
  setObejectId(state, objectId) {
    state.objectId = objectId
    setToken('objectId', objectId, 'sessionStorage')
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
    setToken('username', username, 'sessionStorage')
  },
  /**
   * @description 设置头像
   * @param {*} state
   * @param {*} avatar
   */
  setAvatar(state, avatar) {
    state.avatar = avatar
    setToken('avatar', avatar, 'sessionStorage')
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
    const data = (await login(userInfo)) || {}
    const { sessionToken = '' } = data
    let token = sessionToken
    if (token) {
      commit('setToken', token)
      const { nick } = data
      if (nick) commit('setUsername', nick)
      const page_title = getToken('title', 'sessionStorage') || title
      const {
        objectId,
        roles,
        tag = {
          companyinfo: {
            title: `欢迎${nick}您登录${page_title}`,
            Copyright: '© 2017-2021 数蛙科技 Corporation, All Rights Reserved',
            name: 'dg-iot',
            logo: 'http://www.iotn2n.com/favicon.ico?1558342112',
          },
          userinfo: {
            avatar:
              'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3290107827,2759304074&fm=26&gp=0.jpg',
          },
        },
      } = data
      console.log(tag.companyinfo.title, 'tag info')
      const { title, Copyright, name, logo } = tag.companyinfo
      const { avatar } = tag.userinfo
      setToken('setAvatar', avatar, 'sessionStorage')
      setToken('roles', roles, 'sessionStorage')
      setToken('title', title, 'sessionStorage')
      setToken('copyright', Copyright, 'sessionStorage')
      setToken('title', title, 'sessionStorage')
      setToken('name', name, 'sessionStorage')
      setToken('logo', logo, 'sessionStorage')
      setToken('avatar', avatar, 'sessionStorage')
      if (objectId) commit('setObejectId', objectId)
      // 登录成功后,需要将以下参数存入vuex

      Roletree()
        .then((res) => {
          commit('setRoleTree', res.results)
        })
        .catch((e) => {
          console.log(`get role error ${e}`)
          commit('setRoleTree', [])
        })
      const params = {
        count: 'objectId',
        order: '-updatedAt',
        keys: 'name',
        where: {
          category: 'IotHub',
        },
      }
      queryProduct(params)
        .then((res) => {
          let results = res.results
          results.unshift({
            name: language == 'zh' ? '全部产品' : 'All Products',
            objectId: '0',
          })
          commit('set_Product', results)
        })
        .catch((e) => {
          console.log(`query role error ${e}`)
          commit('set_Product', [])
        })
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
      Vue.prototype.$baseNotify(title, `${thisTime}！`)
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
    setToken('license', false)
    if (result) dispatch('acl/setLicense', result, { root: true })
  },
  async getDefault({ commit, dispatch }) {
    const Default = await SiteDefault()
    // console.log(copyright, dashboard, logo, objectId, title)
    const { copyright, logo, objectId, title } = Default
    if (title) dispatch('settings/setTitle', title, { root: true })
    const res = { copyright, logo, objectId, title }
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
  setname({ commit }, name) {
    commit('setname', name)
  },
}
export default { state, getters, mutations, actions }
