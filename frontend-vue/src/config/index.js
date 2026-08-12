/**
 * 配置合并网关 — 对齐 iotView src/settings.js + iotStudio 原有 config
 * 多配置文件合并 → window.$cfg 全局暴露
 */
import cliConfig from './cli.config'
import settingConfig from './setting.config'
import themeConfig from './theme.config'
import netConfig from './net.config'

const merged = {
  ...cliConfig,
  ...settingConfig,
  ...themeConfig,
  ...netConfig,
}

// 全局暴露 (iotView 兼容)
if (typeof window !== 'undefined') {
  window.$cfg = merged
}

// aligned default export (iotView settings.js 兼容)
export default {
  title: settingConfig.title,
  logo: settingConfig.logo,
  showSettings: settingConfig.showSettings,
  tagsView: settingConfig.tagsView,
  fixedHeader: settingConfig.fixedHeader,
  sidebarLogo: settingConfig.sidebarLogo,
  defUsername: settingConfig.defUsername,
  defPassword: settingConfig.defPassword,
  errorLog: settingConfig.errorLog,
  ...merged,
}

// 命名导出 (iotView 兼容)
export {
  title, logo, showSettings, tagsView, fixedHeader, sidebarLogo,
  defUsername, defPassword, errorLog,
  columnStyle, themeName, layout,
  showProgressBar, showTabs, tabsBarStyle, showTabsBarIcon,
  showLanguage, showRefresh, showSearch, showTheme, showNotice,
  showFullScreen, showThemeSetting, pictureSwitch,
  tokenName, tenantName, routesWhiteList, i18n,
} from './setting.config'

export { cliConfig, settingConfig, themeConfig, netConfig }
