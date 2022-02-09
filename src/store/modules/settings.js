/**
 * @description 所有全局配置的状态管理，如无必要请勿修改
 */
import { getToken, setToken } from '@/utils/vue'
import {
  columnStyle,
  fixedHeader,
  i18n,
  layout,
  logo,
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
} from '@/config'

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
}
const state = () => ({
  showThemeSetting: showThemeSetting,
  logo: getToken('logo'),
  title: getToken('title') || '物联网开发平台',
  device: 'desktop',
  collapse: getToken('collapse') || false,
  pictureSwitch:
    getToken('title') == 'DG-IOT' ? false : getToken('pictureSwitch'),
  language: getToken('language') || i18n,
  theme: getToken('theme') || { ...defaultTheme },
  tag: getToken('tag') || {},
  treeFlag: true,
  extra: {
    first: '',
    transferRouteName: '',
  },
})
const getters = {
  showThemeSetting: (state) => state.showThemeSetting,
  logo: (state) => state.logo,
  title: (state) => state.title,
  device: (state) => state.device,
  pictureSwitch: (state) => state.pictureSwitch,
  collapse: (state) => state.collapse,
  language: (state) => state.language,
  theme: (state) => state.theme,
  tag: (state) => state.tag,
  treeFlag: (state) => state.treeFlag,
  extra: (state) => state.extra,
}
const mutations = {
  setTreeFlag(state, flag) {
    state.treeFlag = flag
  },
  setshowThemeSetting(state, type) {
    state.showThemeSetting = type
  },
  setTitle(state, title) {
    state.title = title
    setToken('title', title)
  },
  setLogo(state, logo) {
    state.logo = logo
    setToken('logo', logo)
  },
  openSideBar(state) {
    state.collapse = false
  },
  foldSideBar(state) {
    state.collapse = true
  },
  toggleDevice(state, device) {
    state.device = device
  },
  toggleCollapse(state) {
    state.collapse = !state.collapse
    // setToken('collapse', `{"collapse":${state.collapse}}`)
  },
  togglePicture(state, flag) {
    state.pictureSwitch = flag
    setToken('pictureSwitch', flag)
  },
  changeLanguage(state, language) {
    state.language = language
    setToken('language', language)
  },
  setTag(state, tag) {
    state.tag = tag
    setToken('tag', tag)
  },
  saveTheme(state, theme) {
    state.theme = theme
    setToken('theme', theme)
  },
  setLayout(state, layout) {
    state.theme.layout = layout
  },
  resetTheme(state) {
    state.theme = { ...defaultTheme }
    localStorage.removeItem('theme')
    document.getElementsByTagName(
      'body'
    )[0].className = `vab-theme-${state.theme.themeName}`
  },
}
const actions = {
  setTreeFlag({ commit, dispatch }, type) {
    commit('setTreeFlag', type)
    dispatch('settings/setTreeKey', moment().format('x'), { root: true })
  },
  setshowThemeSetting({ commit }, type) {
    commit('setshowThemeSetting', type)
  },
  setLogo({ commit }, logo) {
    commit('setLogo', logo)
  },
  setLayout({ commit }, layout) {
    commit('setLayout', layout)
  },
  setTitle({ commit }, title) {
    commit('setTitle', title)
  },
  openSideBar({ commit }) {
    commit('openSideBar')
  },
  foldSideBar({ commit }) {
    commit('foldSideBar')
  },
  toggleDevice({ commit }, device) {
    commit('toggleDevice', device)
  },
  togglePicture({ commit }, flag) {
    commit('togglePicture', flag)
  },
  toggleCollapse({ commit }) {
    commit('toggleCollapse')
  },
  changeLanguage: ({ commit }, language) => {
    commit('changeLanguage', language)
  },
  saveTheme({ commit }, theme) {
    commit('saveTheme', theme)
  },
  setTag({ commit }, tag) {
    commit('setTag', tag)
  },
  resetTheme({ commit }) {
    commit('resetTheme')
  },
}
export default {
  state,
  getters,
  mutations,
  actions,
}
