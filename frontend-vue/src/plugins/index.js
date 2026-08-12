/**
 * 插件系统统一入口
 *
 * 用法 in main.js:
 *   import { loadPlugins } from './plugins/loader.js'
 *   import { getAllRoutes, installAll } from './plugins'
 *   await loadPlugins()
 *   const router = createRouter({ routes: [...coreRoutes, ...getAllRoutes()] })
 *   installAll(app)
 */
export { registerPlugin, getAllPlugins, getAllRoutes, getAllMenus, installAll } from './registry.js'
