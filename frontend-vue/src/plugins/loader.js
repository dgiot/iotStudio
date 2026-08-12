/**
 * 插件加载器 — 根据 manifest 动态加载插件
 */
import { isEnabled } from './manifest.js'

const PLUGIN_MODULES = {
  device:  () => import('./device-plugin.js'),
  data:    () => import('./data-plugin.js'),
  hmi:     () => import('./hmi-plugin.js'),
  network: () => import('./network-plugin.js'),
  tool:    () => import('./tool-plugin.js'),
  system:  () => import('./system-plugin.js'),
  hub:     () => import('./hub-plugin.js'),
}

export async function loadPlugins() {
  const tasks = []
  for (const [name, loader] of Object.entries(PLUGIN_MODULES)) {
    if (isEnabled(name)) {
      tasks.push(
        loader().catch(e => console.warn(`[plugin] ${name} load failed:`, e))
      )
    }
  }
  await Promise.all(tasks)
  console.log(`[plugin] ${tasks.length}/${Object.keys(PLUGIN_MODULES).length} plugins loaded`)
}
