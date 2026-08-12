import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
import './styles/variables.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElIcons from '@element-plus/icons-vue'
import ECharts from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart, GaugeChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent, TitleComponent, DataZoomComponent } from 'echarts/components'
import App from './App.vue'
import router from './router'

// ── iotStudio 模式升级 ──
import './config/index.js'                           // 1. 配置合并网关
import $dg, { install as installGlobals } from './setup/globals.js'  // 7. 全局 API 挂载
import { autoRegisterComponents, autoRegisterDirectives } from './setup/auto-register.js' // 1. 自动注册
import { tabsState } from './stores/tabs.js'        // 4. 多标签页

use([CanvasRenderer, LineChart, BarChart, PieChart, GaugeChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent, DataZoomComponent])

const app = createApp(App)
app.use(ElementPlus, { locale: zhCn })
app.use(router)
app.component('v-chart', ECharts)

// 7. 全局 API 挂载
installGlobals(app)
app.provide('tabs', tabsState)

// 8. 自定义指令
import './directives/permission.js'  // v-permission
import './directives/debounce.js'    // v-debounce

// 1. 自动注册组件 (扫描 src/components/**/index.vue)
autoRegisterComponents(app)

for (const [key, component] of Object.entries(ElIcons)) {
  app.component(key, component)
}

// 6. 双层持久化 — 页面关闭前保存
window.addEventListener('beforeunload', () => {
  localStorage.setItem('dgiot_tabs', JSON.stringify(tabsState.visitedRoutes.slice(-20)))
})

app.mount('#app')
