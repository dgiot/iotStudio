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
const { language } = getLocalStorage('language')
async function queryAllMsg(commit, dispatch, data) {
  tickTime()
  const {
    sessionToken,
    nick,
    objectId,
    roles,
    tag = {},
    fileServer,
    expires_in = 86400,
  } = data

  Vue.prototype.$FileServe = Cookies.get('fileServer')
  // clientMqtt()
  // initDgiotMqtt(objectId)
  commit('setExpired', {
    time: (Date.parse(new Date()) / 1000 + expires_in) * 1000,
    expires_in: 7,
  })
  if (nick) commit('setUsername', nick)
  const page_title = getToken('title') || title
  const { title, Copyright, name, logo, _pcimg, _mimg } = tag.companyinfo
  const { avatar } = tag.userinfo
  commit('setAvatar', avatar)
  commit('setname', name)
  commit('setlogo', logo)
  dispatch('settings/setTitle', title, { root: true })
  dispatch('settings/saveTheme', tag.theme, { root: true })
  dispatch('settings/togglePicture', tag.theme.pictureSwitch, {
    root: true,
  })
  dispatch('dashboard/set_pcimg', _pcimg, { root: true })
  dispatch('dashboard/set_mimg', _mimg, { root: true })
  dispatch('acl/setRole', roles, { root: true })
  dispatch('settings/setTitle', title, { root: true })
  dispatch('acl/setCopyright', Copyright, { root: true })
  dispatch('settings/setTag', tag, { root: true })
  commit('setObejectId', objectId)
  await commit('_setToken', { sessionToken, expires_in })
  await commit('setDepartmentToken', { sessionToken, expires_in })
  const params = {
    count: 'objectId',
    order: '-updatedAt',
    // keys: 'name',
    where: {
      // category: 'IotHub',
    },
  }
  try {
    const res = await Promise.all([
      queryProduct(params),
      queryMenu({}),
      Permission(),
      Roletree(),
    ])
    const promiseRes = {
      Product: res?.[0]?.results
        ? res[0].results.unshift({
            name: language == 'zh' ? '全部产品' : 'All Products',
            objectId: '0',
          })
        : [],
      Menu: res?.[1]?.results ?? [],
      Permission: res?.[2]?.results ?? [],
      Tree: res?.[3]?.results ?? [],
    }
    commit('set_Product', promiseRes.Product)
    commit('setMenu', promiseRes.Menu)
    commit('setPermission', promiseRes.Permission)
    commit('setRoleTree', promiseRes.Tree)
    // 登录后设置当前部门
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
    console.groupCollapsed(
      '%c login promise.all log',
      'color:#009a61; font-size: 28px; font-weight: 300'
    )
    dgiotlog
      .getDgiotlog('src/store/modules/user.js')
      .info('login promise.all log ->', promiseRes)
    console.groupEnd()
  } catch (e) {
    dgiotlog.warn(`await Promise.all error ${e}`)
  }
}

import {
  columnStyle,
  fixedHeader,
  i18n,
  layout,
  logo,
  pictureSwitch,
  showFullScreen,
  showLanguage,
  showNotice,
  showProgressBar,
  showRefresh,
  showSearch,
  showTabs,
  showTabsBarIcon,
  showTheme,
  showThemeSetting,
  tabsBarStyle,
  themeName,
  title,
  tokenName,
} from '@/config'
import { getUserInfo, login, logout, socialLogin, jwtlogin } from '@/api/User'
import { queryMenu } from '@/api/Menu/index'
import { Permission } from '@/api/Permission/index'
import { clearCookie, getToken, removeToken, setToken } from '@/utils/vue/vuex'
import { resetRouter } from '@/router'
import { Roletree } from '@/api/Menu'
import { queryProduct } from '@/api/Product'
import { license } from '@/api/License'
import { isJson } from '@/utils/data/validate'
import { tickTime } from '@/utils/time/index'
const defaultTheme = {
  layout,
  themeName,
  columnStyle,
  fixedHeader,
  showProgressBar,
  showTabs,
  tabsBarStyle,
  showTabsBarIcon,
  showLanguage,
  showRefresh,
  showSearch,
  showTheme,
  showNotice,
  showFullScreen,
  showThemeSetting,
  pictureSwitch,
}

const state = () => ({
  loginInfo: getToken('loginInfo'),
  Menu: getToken('Menu'),
  Permission: getToken('Permission'),
  language: language || i18n,
  roleTree: getToken('roleTree') || [], // 处理数据类型不匹配
  _Product: getToken('Product'),
  token: Cookies.get('dgiot_auth_token') || '',
  departmentToken: Cookies.get('departmentToken') || '',
  name: getToken('name'),
  username: getToken('username'),
  setlogo: getToken('logo'),
  setBackgroundimage: getToken('backgroundimage'),
  avatar: getToken('avatar'),
  Copyright: getToken('Copyright'),
  // logo: getToken('logo') ||
  logo: `./favicon.ico?t=${new Date().getTime()}`,
  // backgroundimage:
  //   getToken('backgroundimage') ||
  backgroundimage:
    '//prod.iotn2n.com/dgiot_dashboard/public/assets/images/platform/assets/login_images/background.jpg',
  objectId: getToken('objectId'),
  treeKey: moment().format('x'),
  currentDepartment:
    JSON.parse(localStorage.getItem('currentDepartment')) || {},
  expired_timestamp: Cookies.get('expired_timestamp') || '',
})
const getters = {
  currentDepartment: (state) => state.currentDepartment,
  loginInfo: (state) => state.loginInfo,
  Menu: (state) => state.Menu,
  Permission: (state) => state.Permission,
  language: (state) => state.language,
  roleTree: (state) => state.roleTree,
  _Product: (state) => state._Product,
  token: (state) => state.token,
  departmentToken: (state) => state.departmentToken,
  expired_timestamp: (state) => state.expired_timestamp,
  username: (state) => state.username,
  avatar: (state) => state.avatar,
  logo: (state) => state.logo,
  backgroundimage: (state) => state.backgroundimage,
  objectId: (state) => state.objectId,
  Copyright: (state) => state.Copyright,
  name: (state) => state.name,
  treeKey: (state) => state.treeKey,
}
const mutations = {
  setCurrentDepartment(state, department) {
    state.currentDepartment = department
    localStorage.setItem('currentDepartment', JSON.stringify(department))
  },
  setTreeKey(state, key) {
    state.treeKey = key
  },
  setLoginInfo(state, loginInfo) {
    state.loginInfo = loginInfo
    setToken('loginInfo', loginInfo)
  },
  setMenu(state, Menu) {
    state.Menu = Menu
    setToken('Menu', Menu)
  },
  setPermission(state, Permission) {
    state.Permission = Permission
    setToken('Permission', Permission)
  },
  setRoleTree(state, tree) {
    state.roleTree = tree
    state.setTreeKey = moment().format('x')
    setToken('roleTree', tree) // 解决数据持久化问题
  },
  set_Product(state, Product) {
    state._Product = Product
    setToken('Product', Product) // 解决数据持久化问题
  },
  setname(state, name) {
    state.name = name
    setToken('name', name)
  },
  setCopyright(state, Copyright) {
    state.Copyright = Copyright
    setToken('copyright', Copyright)
  },
  setlogo(state, url) {
    state.logo = url
    setToken('logo', url)
  },
  setBackgroundimage(state, url) {
    state.backgroundimage = url
    setToken('backgroundimage', url)
  },
  /**
   * @description 设置用户登录Id
   * @param {*} state
   * @param {*} objectId
   */
  setObejectId(state, objectId) {
    state.objectId = objectId
    setToken('objectId', objectId)
  },
  /**
   * @description 设置token
   * @param {*} state
   * @param {*} token
   */
  _setToken(state, { sessionToken, expires_in = 86400 }) {
    state.token = sessionToken
    // setToken(tokenTableName, token, storage)
    Cookies.set('dgiot_auth_token', sessionToken, {
      expires: new Date((Date.parse(new Date()) / 1000 + expires_in) * 1000),
    })
  },
  /**
   * @description 设置登录过去时间
   * @param state
   * @param time
   * @param expires_in
   */
  setExpired(state, { time, expires_in = 86400 }) {
    state.expired_timestamp = time
    Cookies.set('expired_timestamp', time, {
      expires: expires_in,
    })
  },
  /**
   * @description 设置部门token
   * @param state
   * @param token
   */
  setDepartmentToken(state, { sessionToken, expires_in = 86400 }) {
    state.departmentToken = sessionToken
    Cookies.set('departmentToken', sessionToken, {
      expires: new Date((Date.parse(new Date()) / 1000 + expires_in) * 1000),
    })
  },
  /**
   * @description 设置用户名
   * @param {*} state
   * @param {*} username
   */
  setUsername(state, username) {
    state.username = username
    setToken('username', username)
  },
  /**
   * @description 设置头像
   * @param {*} state
   * @param {*} avatar
   */
  setAvatar(state, avatar) {
    state.avatar = avatar
    setToken('avatar', avatar)
  },
}
const actions = {
  setExpired({ commit }, { time, expires_in }) {
    commit('setExpired', { time, expires_in })
  },
  setDepartmentToken({ commit }, { sessionToken, expires_in }) {
    commit('setDepartmentToken', { sessionToken, expires_in })
  },
  setCurrentDepartment({ commit, department }) {
    commit('setCurrentDepartment', department)
  },
  setTreeKey({ commit, key }) {
    commit('setTreeKey', key)
  },
  /**
   * @description 登录拦截放行时，设置虚拟角色
   * @param {*} { commit, dispatch }
   */
  setVirtualRoles({ commit, dispatch }) {
    dispatch('acl/setFull', true, { root: true })
    commit('setUsername', 'admin(未开启登录拦截)')
  },
  /**
   * @description jwtlogin登录
   * @param {*} { commit }
   * @param {*} userInfo
   */
  async jwtlogin({ commit, dispatch }, token) {
    const userInfo = await jwtlogin(token)
    if (Number(userInfo.code) != 200) {
      Vue.prototype.$baseMessage(
        `jwt登录失败,\n${userInfo.msg}`,
        `jwt登录失败,\n${userInfo.msg}`,
        'error'
      )
      // Cookies.remove('id_token')
      return false
    }
    const { state = {} } = userInfo
    Cookies.set('companyName', '迪格（杭州）物联科技有限公司', {
      expires: 1,
    })
    Cookies.set('userId', state.externalId, { expires: 1 })
    Cookies.set('jwtInfo', state, { expires: 1 })
    let data = _.merge(
      {
        tag: {
          companyinfo: {
            title: ``,
            Copyright: '',
            name: '',
            logo: '',
            _pcimg: '',
            _mimg: '',
          },
          userinfo: {
            avatar: '',
          },
          theme: { ...defaultTheme },
        },
      },
      userInfo
    )
    const { sessionToken = '' } = data
    if (sessionToken) {
      await queryAllMsg(commit, dispatch, data)
    } else {
      Cookies.remove('id_token')
      return Promise.reject()
    }
  },

  /**
   * @description 登录
   * @param {*} { commit }
   * @param {*} userInfo
   */
  async login({ commit, dispatch }, userInfo) {
    const _userInfo = (await login(userInfo)) || {}
    let data = _.merge(
      {
        tag: {
          companyinfo: {
            title: ``,
            Copyright: '',
            name: '',
            logo: '',
            _pcimg: '',
            _mimg: '',
          },
          userinfo: {
            avatar: '',
          },
          theme: { ...defaultTheme },
        },
      },
      _userInfo
    )
    const { sessionToken = '' } = data
    if (sessionToken) {
      await queryAllMsg(commit, dispatch, data)
      commit('setLoginInfo', userInfo)
    } else {
      Vue.prototype.$baseMessage(
        `登录失败，可能是密码错误或者账号被禁用！请与平台管理员联系。`,
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
  // eslint-disable-next-line no-empty-pattern
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
    if (result) dispatch('acl/setLicense', result, { root: true })
  },
  // async getDefault({ commit, dispatch }) {
  //   const Default = await SiteDefault()
  //   // // dgiotlog.log(copyright, dashboard, logo, objectId, title)
  //   // const { copyright, logo, objectId, title } = Default
  //   // if (title) dispatch('settings/setTitle', title, { root: true })
  //   // if (copyright) dispatch('acl/setCopyright', copyright, { root: true })
  //   // if (Default) dispatch('acl/setDefault', Default, { root: true })
  // },
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
    // commit('setAvatar', '')
    commit('routes/setRoutes', [], { root: true })
    await dispatch('_setToken', {})
    await dispatch('acl/setFull', false, { root: true })
    await dispatch('acl/setRole', [], { root: true })
    await dispatch('acl/setAbility', [], { root: true })
    await dispatch('tabs/delAllVisitedRoutes', [], { root: true })
    // await dispatch('acl/setLicense', false, { root: true })
    // await dispatch('acl/setDefault', {}, { root: true })
    // await dispatch('settings/setTitle', '', { root: true })
    // 退出后清理所有的cookie sessionStorage localStorage
    // localStorage.clear()
    // sessionStorage.clear()
    clearCookie()
    await resetRouter()
    removeToken()
  },
  setObejectId({ commit }, objectId) {
    commit('setObejectId', objectId)
  },
  /**
   * @description 设置token
   * @param {*} { commit }
   * @param {*} token
   */
  _setToken({ commit }, { sessionToken, expires_in }) {
    commit('_setToken', { sessionToken, expires_in })
  },
  setAvatar({ commit }, avatar) {
    commit('setAvatar', avatar)
  },
  seMenu({ commit }, Menu) {
    commit('seMenu', Menu)
  },
  setPermission({ commit }, Permission) {
    commit('setPermission', Permission)
  },
  setLoginInfo({ commit }, loginInfo) {
    commit('setLoginInfo', loginInfo)
  },
}
export default {
  state,
  getters,
  mutations,
  actions,
}
