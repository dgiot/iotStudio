/**
 * iotStudio 插件注册中心
 *
 * 每个插件 = { name, routes[], menuItems[], store?, onInstall() }
 * 部署时只启需要的插件，裁剪包体
 */
const plugins = {}

export function registerPlugin(plugin) {
  if (plugins[plugin.name]) {
    console.warn(`[plugin] ${plugin.name} already registered, skipping`)
    return
  }
  plugins[plugin.name] = plugin
  console.log(`[plugin] ${plugin.name} v${plugin.version || '1.0'} registered`)
}

export function getPlugin(name) {
  return plugins[name]
}

export function getAllPlugins() {
  return Object.values(plugins)
}

/** 合并所有插件的路由 */
export function getAllRoutes() {
  const routes = []
  for (const p of Object.values(plugins)) {
    if (p.routes) routes.push(...p.routes)
  }
  return routes
}

/** 合并所有插件的菜单项 */
export function getAllMenus() {
  const menus = []
  for (const p of Object.values(plugins)) {
    if (p.menu) menus.push(p.menu)
  }
  return menus
}

/** 调用所有插件的 onInstall */
export async function installAll(app) {
  for (const p of Object.values(plugins)) {
    if (p.onInstall) {
      try {
        await p.onInstall(app)
        console.log(`[plugin] ${p.name} installed`)
      } catch (e) {
        console.error(`[plugin] ${p.name} install failed:`, e)
      }
    }
  }
}

export default { registerPlugin, getPlugin, getAllPlugins, getAllRoutes, getAllMenus, installAll }
