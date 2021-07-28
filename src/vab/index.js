import '@/icon'
import VabIcon from 'vab-icons'
import 'vab-icons/lib/vab-icons.css'
Vue.component('VabIcon', VabIcon)
// 加载主题
const requireTheme = require.context('./styles/themes', false, /\.scss$/)
requireTheme.keys().forEach((fileName) => {
  requireTheme(fileName)
})

// 加载全局样式样式（务必在加载主题后加载全局样式）
require('./styles/vab.scss')

// 加载插件
const requirePlugin = require.context('./plugins', true, /\.js$/)
requirePlugin.keys().forEach((fileName) => {
  requirePlugin(fileName)
})

// 加载布局
const requireLayout = require.context('./layouts', true, /\.vue$/)
requireLayout.keys().forEach((fileName) => {
  const componentConfig = requireLayout(fileName)
  const componentName = componentConfig.default.name
  Vue.component(componentName, componentConfig.default || componentConfig)
})

// 加载组件
const requireComponent = require.context('./components', true, /\.vue$/)
requireComponent.keys().forEach((fileName) => {
  const componentConfig = requireComponent(fileName)
  const componentName = componentConfig.default.name
  Vue.component(componentName, componentConfig.default || componentConfig)
})
