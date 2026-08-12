# 插件系统集成指南

## 修改 router/index.js

```js
// 旧: 硬编码 21 条路由
// 新: 从插件系统动态组装
import { createRouter, createWebHashHistory } from 'vue-router'
import { loadPlugins } from '../plugins/loader.js'
import { getAllRoutes } from '../plugins/index.js'

// 核心路由 (插件无关)
const coreRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { title: '登录', noAuth: true }
  },
  {
    path: '/',
    component: () => import('../components/AppLayout.vue'),
    redirect: '/dashboard',
    children: []  // 动态填充
  }
]

export async function createAppRouter() {
  await loadPlugins()

  // 注入插件路由
  coreRoutes[1].children = getAllRoutes()

  const router = createRouter({
    history: createWebHashHistory(),
    routes: coreRoutes,
  })

  router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('dgiot_token')
    if (to.meta.noAuth) next()
    else if (!token) next('/login')
    else next()
  })

  return router
}
```

## 修改 main.js

```js
import { createApp } from 'vue'
import App from './App.vue'
import { createAppRouter } from './router'
import { installAll } from './plugins'

async function bootstrap() {
  const router = await createAppRouter()
  const app = createApp(App)
  app.use(router)
  await installAll(app)   // 插件安装钩子
  app.mount('#app')
}

bootstrap()
```

## 部署裁剪

```js
// plugins/manifest.js
export const MANIFEST = {
  device:  true,   // ✅
  data:    true,   // ✅
  hmi:     true,   // ✅
  network: true,   // ✅
  tool:    false,  // ❌ 不要调试工具
  system:  false,  // ❌ 不要系统管理
  hub:     true,   // ✅ 需要边缘中枢联调
}

// 打包: npm run build
// Vite 自动 tree-shake, 只有 5 个插件的代码进 bundle
```
