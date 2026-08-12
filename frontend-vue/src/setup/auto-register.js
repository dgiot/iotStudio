/**
 * 自动注册系统 — 对标 iotStudio require.context 模式
 * Vite 使用 import.meta.glob 替代
 *
 * 约定:
 *   src/components/** /index.vue  → 自动注册为全局组件
 *   src/directives/*.js           → 自动注册为全局指令
 */
import { defineAsyncComponent } from 'vue'

export function autoRegisterComponents(app) {
  // Vite glob: 扫描所有 index.vue 组件
  const modules = import.meta.glob('../components/**/index.vue')
  for (const [path, loader] of Object.entries(modules)) {
    // 从路径提取组件名: DgiotSideBar/index.vue → DgiotSideBar
    const parts = path.split('/')
    const dirName = parts[parts.length - 2]
    if (!dirName) continue

    // PascalCase → kebab-case
    const kebab = dirName.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')
    const componentName = 'dgiot-' + kebab

    app.component(componentName, defineAsyncComponent(loader))
  }
}

export function autoRegisterDirectives(app) {
  const modules = import.meta.glob('../directives/*.js')
  for (const [path, loader] of Object.entries(modules)) {
    const name = path.split('/').pop().replace('.js', '')
    loader().then(mod => {
      app.directive(name, mod.default || mod)
    })
  }
}
