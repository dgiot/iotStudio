/**
 * @description 所有全局配置的状态管理，如无必要请勿修改
 */
import { isJson } from '@/utils/validate'
import { getToken, removeToken, setToken } from '@/utils/vuex'
import { storage } from '@/config'
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
const getLocalStorage = (key) => {
  const value = localStorage.getItem(key)
  if (isJson(value)) {
    return JSON.parse(value)
  } else {
    return false
  }
}
const { collapse } = getLocalStorage('collapse')
const { language } = getLocalStorage('language')
const state = () => ({
  showThemeSetting: showThemeSetting,
  logo: getToken('logo', storage),
  title: getToken('title', 'sessionStorage') || '物联网开发平台',
  device: 'desktop',
  collapse: collapse || false,
  language: language || i18n,
  theme: getLocalStorage('theme') || { ...defaultTheme },
  extra: { first: '', transferRouteName: '' },
})
const getters = {
  showThemeSetting: (state) => state.showThemeSetting,
  logo: (state) => state.logo,
  title: (state) => state.title,
  device: (state) => state.device,
  collapse: (state) => state.collapse,
  language: (state) => state.language,
  theme: (state) => state.theme,
  extra: (state) => state.extra,
}
const mutations = {
  setshowThemeSetting(state, type) {
    state.showThemeSetting = type
  },
  setTitle(state, title) {
    state.title = title
    setToken('title', title, 'sessionStorage')
  },
  setLogo(state, logo) {
    state.logo = logo
    setToken('logo', logo, 'sessionStorage')
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
    localStorage.setItem('collapse', `{"collapse":${state.collapse}}`)
  },
  changeLanguage(state, language) {
    state.language = language
    localStorage.setItem('language', `{"language":"${language}"}`)
  },
  saveTheme(state) {
    localStorage.setItem('theme', JSON.stringify(state.theme))
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
  setshowThemeSetting({ commit }, type) {
    commit('setshowThemeSetting', type)
  },
  setLogo({ commit }, logo) {
    commit('setLogo', logo)
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
  toggleCollapse({ commit }) {
    commit('toggleCollapse')
  },
  changeLanguage: ({ commit }, language) => {
    commit('changeLanguage', language)
  },
  saveTheme({ commit }) {
    commit('saveTheme')
  },
  resetTheme({ commit }) {
    commit('resetTheme')
  },
}
export default { state, getters, mutations, actions }
