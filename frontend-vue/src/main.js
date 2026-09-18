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
import router, { setupPluginRoutes } from './router'

// ── iotStudio 模式升级 ──
import './config/index.js'                           // 1. 配置合并网关
import $dg, { install as installGlobals } from './setup/globals.js'  // 7. 全局 API 挂载
import { autoRegisterComponents, autoRegisterDirectives } from './setup/auto-register.js' // 1. 自动注册
import { tabsState } from './stores/tabs.js'        // 4. 多标签页

use([CanvasRenderer, LineChart, BarChart, PieChart, GaugeChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent, DataZoomComponent])

const app = createApp(App)
app.use(ElementPlus, { locale: zhCn })
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

// ═══════════════════════════════════════════════════════════
// 启动 — 路由要先齐再挂载
// ═══════════════════════════════════════════════════════════
// 用 bootstrap() 而非顶层 await：顶层 await 受 build.target 限制，
// 换 target 就静默变成构建期语法错误。
async function bootstrap() {
  try {
    await setupPluginRoutes(router)
  } catch (e) {
    // setupPluginRoutes 内部已兜一层；这里再兜是为了「任何装载失败都不阻断启动」
    console.error('[plugin] 路由接线异常，继续以静态路由启动:', e)
  }
  app.use(router)
  app.mount('#app')
}

bootstrap()
