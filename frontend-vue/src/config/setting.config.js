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

/** 默认帐号密码 (iotView 标准)
 *
 *  ⚠️ **不留源码字面量。** 本目录是公开提交副本，而 `LoginView.vue` 会把这两个值
 *  **直接显示在登录页上** —— 写进源码等于写进公开 git 历史，收不回来。
 *  经 Vite 环境给（照 `vite.config.js` 里 `VITE_ALLOWED_HOSTS` 的同一惯例）：
 *    VITE_DEF_USERNAME / VITE_DEF_PASSWORD
 *  不配则为空串 ⇒ 登录页那行提示**整行不渲染**（不是渲染成「默认: /」——
 *  半截的提示比没有更难看，且会让人以为默认值就是空的）。
 *
 *  ⚠️ `defUsername` 与 `defPassword` 一起改，虽然门禁只看得见后者 ——
 *  门禁的键名表是 `password|passwd|pwd|secret|api_key`，`username` 不在里面。
 *  「只修判据看得见的那半」与「脱敏只做一半」是同一件事。
 *
 *  `?.` 是防御：本文件只被 `src/config/*` 消费（都过 Vite），但若哪天真被
 *  Node 直接 require，`import.meta.env` 会是 undefined 而不是抛。
 */
export const defUsername = import.meta.env?.VITE_DEF_USERNAME || ''
export const defPassword = import.meta.env?.VITE_DEF_PASSWORD || ''

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
