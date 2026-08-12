/**
 * 导航工具 — 对齐 iotView src/utils/menu/navigation.js
 *
 * filterMenu(results) → 将 Parse Navigation 列表转为 Vue Router routes
 */

import { isArray, isExternal } from '../validate'

/**
 * 将 Navigation 列表递归过滤为路由格式
 * @param {Array} nodes — Parse Navigation 查询结果
 * @returns {Array} — Vue Router route 对象数组
 */
export function filterMenu(nodes) {
  if (!nodes || !isArray(nodes)) return []

  return nodes
    .filter(node => {
      // 过滤隐藏项
      if (node.hidden || node.status === 'hidden') return false
      return true
    })
    .map(node => {
      const route = {
        path: node.path || node.url || '',
        name: node.name || node.path?.replace(/\//g, '_'),
        component: resolveComponent(node.component || node.view),
        meta: {
          title: node.title || node.name || '',
          icon: node.icon || '',
          group: node.group || 'other',
          hidden: node.hidden || false,
          noCache: node.noCache || false,
          breadcrumb: node.breadcrumb !== false,
          activeMenu: node.activeMenu || '',
        },
      }

      // 子菜单递归
      if (node.children && isArray(node.children) && node.children.length > 0) {
        route.children = filterMenu(node.children)
      }

      // 外链
      if (isExternal(route.path)) {
        route.meta.target = '_blank'
      }

      return route
    })
}

/**
 * 根据 component 名称解析为懒加载组件
 * 对齐 iotView: 从 views/ 目录动态导入
 */
function resolveComponent(name) {
  if (!name) return null

  // 内置视图映射
  const viewMap = {
    'Dashboard': () => import('../../views/DashboardView.vue'),
    'DeviceList': () => import('../../views/DeviceListView.vue'),
    'DeviceDetail': () => import('../../views/DeviceDetailView.vue'),
    'Products': () => import('../../views/ProductsView.vue'),
    'Channel': () => import('../../views/ChannelView.vue'),
    'Alarm': () => import('../../views/AlarmListView.vue'),
    'Telemetry': () => import('../../views/TelemetryView.vue'),
    'Stream': () => import('../../views/StreamView.vue'),
    'Phm': () => import('../../views/PhmView.vue'),
    'Hmi': () => import('../../views/HmiView.vue'),
    'MqttTool': () => import('../../views/MqttToolView.vue'),
    'Simulator': () => import('../../views/SimulatorView.vue'),
    'SystemOverview': () => import('../../views/SystemOverview.vue'),
    'Maintenance': () => import('../../views/MaintenanceView.vue'),
    'Users': () => import('../../views/UsersView.vue'),
    'EdgeProxy': () => import('../../views/EdgeProxyView.vue'),
    'AmisTest': () => import('../../views/AmisTestView.vue'),
    'PacketAnalysis': () => import('../../views/A11AnalysisView.vue'),
  }

  return viewMap[name] || null
}

export default { filterMenu }
