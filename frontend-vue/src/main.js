import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElIcons from '@element-plus/icons-vue'
import ECharts from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart, GaugeChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent, TitleComponent, DataZoomComponent } from 'echarts/components'
import App from './App.vue'
import router from './router'

use([CanvasRenderer, LineChart, BarChart, PieChart, GaugeChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent, DataZoomComponent])

const app = createApp(App)
app.use(ElementPlus, { locale: zhCn })
app.use(router)
app.component('v-chart', ECharts)

for (const [key, component] of Object.entries(ElIcons)) {
  app.component(key, component)
}

app.mount('#app')
