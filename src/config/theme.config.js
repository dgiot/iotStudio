/**
 * @description 导出主题配置，注意事项：此配置下的项修改后需清理浏览器缓存！！！
 */
module.exports = {
  // 布局种类：横向布局horizontal、纵向布局vertical、分栏布局column、综合布局comprehensive、常规布局common
  layout: 'column',
  // 主题名称：默认default、海洋之心ocean、绿荫草场green、碰触纯白white
  themeName: 'default',
  // 分栏风格(仅针对分栏布局column时生效)：横向风格horizontal、纵向风格vertical、卡片风格card
  columnStyle: 'vertical',
  // 是否固定头部固定
  fixedHeader: true,
  // 是否开启顶部进度条
  showProgressBar: true,
  // 是否开启标签页
  showTabs: true,
  // 显示标签页时标签页样式：卡片风格card、灵动风格smart、圆滑风格smooth
  tabsBarStyle: 'smooth',
  // 是否标签页图标
  showTabsBarIcon: true,
  // 是否开启语言选择组件
  showLanguage: true,
  // 是否开启刷新组件
  showRefresh: true,
  // 是否开启搜索组件
  showSearch: false,
  // 是否开启主题组件
  showTheme: true,
  // 是否开启通知组件
  showNotice: false,
  // 是否开启全屏组件
  showFullScreen: true,
  // 是否开启右侧悬浮窗
  showThemeSetting: false,
}
