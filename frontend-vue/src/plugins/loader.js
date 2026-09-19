/**
 * 插件加载器 — 动态加载插件 (PR0: 后端动态 manifest 优先, 构建期清单兜底)
 *
 * 优先级:
 *   1. GET /api/plugins → frontend 模块开关 (登录后可由 admin 动态启停)
 *   2. MANIFEST.js 构建期清单 (后端不可达 / 未登录时的离线兜底)
 * 两者同时生效时取交集: 构建期裁剪的模块, 后端开再多也不加载。
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

/** 拉取后端动态开关; 失败返回 null (走兜底) */
async function fetchBackendManifest() {
  try {
    const token = localStorage.getItem('dgiot_token') || localStorage.getItem('sessionToken')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const res = await fetch('/api/plugins', { headers, credentials: 'include' })
    if (!res.ok) return null
    const data = await res.json()
    return data && data.frontend ? data.frontend : null
  } catch (e) {
    console.warn('[plugin] 后端动态清单不可达, 使用构建期 MANIFEST:', e?.message || e)
    return null
  }
}

export async function loadPlugins() {
  const backendMap = await fetchBackendManifest()

  const tasks = []
  let loaded = 0
  for (const [name, loader] of Object.entries(PLUGIN_MODULES)) {
    // 构建期裁剪一票否决; 后端开关在无后端数据时退化为构建期清单
    const buildOn = isEnabled(name)
    const runtimeOn = backendMap ? backendMap[name] !== false : buildOn
    if (buildOn && runtimeOn) {
      loaded++
      tasks.push(
        loader().catch(e => console.warn(`[plugin] ${name} load failed:`, e))
      )
    } else if (backendMap && buildOn && !runtimeOn) {
      console.info(`[plugin] ${name} 已被后端停用, 跳过加载`)
    }
  }
  await Promise.all(tasks)
  console.log(`[plugin] ${tasks.length}/${Object.keys(PLUGIN_MODULES).length} plugins loaded` +
              (backendMap ? ' (动态清单)' : ' (构建期清单)'))
  return { loaded, total: Object.keys(PLUGIN_MODULES).length, dynamic: !!backendMap }
}
