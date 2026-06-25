import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElIcons from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(ElementPlus, { locale: zhCn })
app.use(router)

for (const [key, component] of Object.entries(ElIcons)) {
  app.component(key, component)
}

app.mount('#app')
