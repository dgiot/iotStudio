import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as Icons from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(Icons)) {
  app.component(key, component)
}

app.use(ElementPlus, { locale: undefined })
app.use(router)
app.mount('#app')
