/**
 * 设置 Store — 对齐 iotView src/store/modules/settings.js
 *
 * 管理全局 UI 配置: 布局/主题/语言/标签页开关等
 * iotView 从 settings.js + Cookie 读取默认值，这里从 config 读取
 */
import { reactive, computed } from 'vue'
import {
  title, logo, showSettings, tagsView, fixedHeader, sidebarLogo,
  themeName, layout, columnStyle, showProgressBar, showTabs,
  tabsBarStyle, showTabsBarIcon, showLanguage, showRefresh,
  showSearch, showTheme, showNotice, showFullScreen, showThemeSetting,
  pictureSwitch, i18n,
} from '../../config'

// ═══════════════════════════════════════════
// 本地持久化辅助
// ═══════════════════════════════════════════

function loadFromStorage(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v !== null ? JSON.parse(v) : fallback
  } catch { return fallback }
}

function saveToStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* quota exceeded */ }
}

// ═══════════════════════════════════════════
// State (iotView shape)
// ═══════════════════════════════════════════

export const state = reactive({
  // iotView settings.js defaults
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  title: loadFromStorage('dgiot_platform_title', title),
  logo: logo,
  errorLog: 'production',

  // iotStudio 扩展
  device: 'desktop',
  collapse: loadFromStorage('dgiot_sidebar_collapse', false),
  language: loadFromStorage('dgiot_language', i18n),
  pictureSwitch: loadFromStorage('dgiot_picture_switch', pictureSwitch),

  // 主题 (iotView: theme object from tag.userinfo.theme)
  theme: loadFromStorage('dgiot_theme', {
    layout, themeName, columnStyle,
    fixedHeader, showProgressBar, showTabs, tabsBarStyle,
    showTabsBarIcon, showLanguage, showRefresh, showSearch,
    showTheme, showNotice, showFullScreen, showThemeSetting,
    pictureSwitch,
  }),

  // 公司/用户标签
  tag: loadFromStorage('dgiot_tag', {}),

  // 树刷新 key
  treeFlag: false,

  // 额外状态
  extra: { first: '', transferRouteName: '' },
})

// ═══════════════════════════════════════════
// Getters (computed)
// ═══════════════════════════════════════════

export const platformTitle     = computed(() => state.title)
export const platformLogo      = computed(() => state.logo)
export const isCollapse        = computed(() => state.collapse)
export const currentTheme      = computed(() => state.theme)
export const currentLanguage   = computed(() => state.language)
export const isMobile          = computed(() => state.device === 'mobile')
export const isFixedHeader     = computed(() => state.theme.fixedHeader ?? state.fixedHeader)
export const needTagsView      = computed(() => state.theme.showTabs ?? state.tagsView)
export const showRightPanel    = computed(() => state.showSettings)

// ═══════════════════════════════════════════
// Mutations (setter actions)
// ═══════════════════════════════════════════

export function setTitle(t) {
  state.title = t
  saveToStorage('dgiot_platform_title', t)
  document.title = t
}

export function setLogo(url) {
  state.logo = url
}

export function toggleCollapse() {
  state.collapse = !state.collapse
  saveToStorage('dgiot_sidebar_collapse', state.collapse)
}

export function openSideBar() { state.collapse = false }
export function foldSideBar() { state.collapse = true }

export function toggleDevice(device) { state.device = device }

export function changeLanguage(lang) {
  state.language = lang
  saveToStorage('dgiot_language', lang)
}

export function setTag(tag) {
  state.tag = tag
  saveToStorage('dgiot_tag', tag)
}

export function saveTheme(theme) {
  state.theme = { ...state.theme, ...theme }
  saveToStorage('dgiot_theme', state.theme)
}

export function setLayout(layout) {
  state.theme.layout = layout
  saveToStorage('dgiot_theme', state.theme)
}

export function togglePicture(flag) {
  state.pictureSwitch = flag
  saveToStorage('dgiot_picture_switch', flag)
}

export function setTreeFlag(flag) { state.treeFlag = flag }

export function resetTheme() {
  state.theme = {
    layout, themeName, columnStyle,
    fixedHeader, showProgressBar, showTabs, tabsBarStyle,
    showTabsBarIcon, showLanguage, showRefresh, showSearch,
    showTheme, showNotice, showFullScreen, showThemeSetting,
    pictureSwitch,
  }
  localStorage.removeItem('dgiot_theme')
}

// ═══════════════════════════════════════════
// 默认导出
// ═══════════════════════════════════════════

export default {
  state,
  platformTitle, platformLogo, isCollapse, currentTheme,
  currentLanguage, isMobile, isFixedHeader, needTagsView, showRightPanel,
  setTitle, setLogo, toggleCollapse, openSideBar, foldSideBar,
  toggleDevice, changeLanguage, setTag, saveTheme, setLayout,
  togglePicture, setTreeFlag, resetTheme,
}
