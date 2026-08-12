/**
 * 全局设置 — 对齐 iotView src/settings.js + 原有 setting.config.js
 *
 * title/logo/tokenName 来自 settings.js
 * tokenName/tenantName/routesWhiteList 是 iotStudio 原有
 */

// ── iotView settings.js 对齐 ──
export const title = 'DG-IoT'                       // 对标 '迪格云'
export const logo = '/static/img/logo.png'           // 对标 logo.png

/** @type {boolean} 是否显示右侧设置面板 */
export const showSettings = false                     // 对标 true

/** @type {boolean} 是否需要 tagsView (多标签页) */
export const tagsView = false                         // 对标 false

/** @type {boolean} 是否固定 header */
export const fixedHeader = false                      // 对标 false

/** @type {boolean} 侧栏是否显示 logo */
export const sidebarLogo = true                       // 对标 true

/** 默认帐号密码 (iotView 标准) */
export const defUsername = 'dgiot_dev'
export const defPassword = 'dgiot_dev'

/** @type {string | array} 错误日志环境: 'production' | ['production', 'development'] */
export const errorLog = 'production'

// ── theme 相关 ──
export const columnStyle = 'dgiot-column'
export const themeName = 'dgiot-dark'
export const layout = 'dgiot'
export const showProgressBar = true
export const showTabs = true
export const tabsBarStyle = 'dgiot-tabs'
export const showTabsBarIcon = false
export const showLanguage = false
export const showRefresh = true
export const showSearch = true
export const showTheme = false
export const showNotice = false
export const showFullScreen = true
export const showThemeSetting = false
export const pictureSwitch = false

// ── 原有 iotStudio 配置 ──
export const tokenName = 'dgiot_token'
export const tenantName = 'dgiot_tenant'
export const routesWhiteList = ['/login']
export const recordRoute = true
export const i18n = 'zh_CN'

// default export 兼容原有导入
export default {
  title,
  logo,
  showSettings,
  tagsView,
  fixedHeader,
  sidebarLogo,
  defUsername,
  defPassword,
  errorLog,
  columnStyle,
  themeName,
  layout,
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
  tokenName,
  tenantName,
  routesWhiteList,
  recordRoute,
  i18n,
}
