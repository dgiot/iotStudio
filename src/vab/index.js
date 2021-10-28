import '@/icon'
import VabIcon from 'vab-icons'
import 'vab-icons/lib/vab-icons.css'
import utilwen from '@/utils/utilwen'
import Directives from './directives/index.js'
// https://frontend-infra.deepexi.com/#/material/el-data-table
// import ElDataTable from '@femessage/el-data-table'
// import ElFormRenderer from '@femessage/el-form-renderer'
// import {
//   Button,
//   Dialog,
//   Form,
//   FormItem,
//   Loading,
//   Pagination,
//   Table,
//   TableColumn,
//   Message,
//   MessageBox,
// } from 'element-ui'
//
// Vue.use(Button)
// Vue.use(Dialog)
// Vue.use(Form)
// Vue.use(FormItem)
// Vue.use(Loading.directive)
// Vue.use(Pagination)
// Vue.use(Table)
// Vue.use(TableColumn)
// Vue.component('ElFormRenderer', ElFormRenderer)
// Vue.component('ElDataTable', ElDataTable)
// Vue.prototype.$confirm = MessageBox.confirm
// Vue.prototype.$message = Message
// Vue.prototype.$axios = axios
import VueContextMenu from 'vue-contextmenu'
Vue.component('VabIcon', VabIcon)
Vue.use(Directives)
Vue.use(utilwen)
Vue.use(VueContextMenu)

// 加载主题
const requireTheme = require.context('./styles/themes', false, /\.scss$/)
requireTheme.keys()
  .forEach((fileName) => {
    requireTheme(fileName)
  })

// 加载全局样式样式（务必在加载主题后加载全局样式）
require('./styles/vab.scss')

// 加载插件
const requirePlugin = require.context('./plugins', true, /\.js$/)
requirePlugin.keys()
  .forEach((fileName) => {
    requirePlugin(fileName)
  })

// 加载布局
const requireLayout = require.context('./layouts', true, /\.vue$/)
requireLayout.keys()
  .forEach((fileName) => {
    const componentConfig = requireLayout(fileName)
    const componentName = componentConfig.default.name
    Vue.component(componentName, componentConfig.default || componentConfig)
  })

let components = []
// 加载组件
const requireComponent = require.context('./components', true, /\.vue$/)
requireComponent.keys()
  .forEach((fileName) => {
    const componentConfig = requireComponent(fileName)
    const componentName = componentConfig.default.name
    if (componentName) {
      Vue.component(componentName, componentConfig.default || componentConfig)
      components.push({
        name: componentName,
        config: componentConfig.default,
      })
    }
  })
console.log(components)
