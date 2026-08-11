/**
 * 路由 — 9 模块 IoT 平台标准结构
 *
 * 模块对应:
 *   ① 驾驶舱  ② 设备管理  ③ 设备接入  ④ 算法管理
 *   ⑤ 告警中心  ⑥ 数据服务  ⑦ 可视化   ⑧ 自动化
 *   ⑨ 系统管理
 *
 * 权限守卫:
 *   1. whiteList 放行 (/login)
 *   2. hasToken → 恢复 session → 放行
 *   3. noToken  → whiteList 放行, 其他跳 /login
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import { getToken } from '../utils/auth'
import { title } from '../config'

// ═══════════════════════════════════════════════════════════
// 静态路由 — 9 模块分组
// ═══════════════════════════════════════════════════════════

const V = (path) => () => import(`../views/${path}.vue`)
const meta = (title, icon, group, extra = {}) => ({ title, icon, group, ...extra })

export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: V('LoginView'),
    meta: { title: '登录', hidden: true },
  },
  {
    path: '/',
    component: () => import('../components/AppLayout.vue'),
    redirect: '/dashboard',
    children: [

      // ===== ① 驾驶舱 =====
      { path: '/dashboard',       name: 'Dashboard',       component: V('DashboardView'),    meta: meta('数字大屏',   'Odometer',    'dashboard') },
      { path: '/system-overview', name: 'SystemOverview',  component: V('SystemOverview'), meta: meta('系统概览',   'Monitor',     'dashboard') },

      // ===== ② 设备管理 =====
      { path: '/devices',         name: 'Devices',         component: V('DeviceListView'),   meta: meta('设备管理',   'Monitor',     'device') },
      { path: '/devices/:id',     name: 'DeviceDetail',    component: V('DeviceDetailView'), meta: { title: '设备详情', hidden: true } },
      { path: '/products',        name: 'Products',        component: V('ProductsView'),     meta: meta('产品管理',   'Goods',       'device') },
      { path: '/channels',        name: 'Channels',        component: V('ChannelView'),      meta: meta('通道管理',   'Connection',  'protocol') },

      // ===== 设备 =====
      { path: '/edge-proxy',      name: 'EdgeProxy',       component: V('EdgeProxyView'),    meta: meta('边缘代理',   'Platform',    'protocol') },
      { path: '/simulators',      name: 'Simulators',      component: V('SimulatorView'),    meta: meta('设备模拟',   'VideoCamera', 'protocol') },
      { path: '/shadow',          name: 'Shadow',          component: V('ShadowView'),       meta: meta('设备影子',   'Cloudy',      'device') },
      { path: '/live',            name: 'LiveTelemetry',   component: V('LiveTelemetry'),  meta: meta('实时遥测',   'DataLine',    'dashboard') },

      // ===== 计算 =====
      { path: '/stream',          name: 'Stream',          component: V('StreamView'),       meta: meta('流式计算',   'MagicStick',  'compute') },
      { path: '/fde',             name: 'FdeWizard',       component: V('FdeWizardView'),    meta: meta('规则编排',   'MagicStick',  'compute') },
      { path: '/maintenance',     name: 'Maintenance',     component: V('MaintenanceView'),  meta: meta('运维任务',   'Setting',     'system') },

      // ===== 告警 =====
      { path: '/alarms',          name: 'Alarms',          component: V('AlarmListView'),    meta: meta('告警中心',   'Bell',        'dashboard') },

      // ===== 数据 =====
      { path: '/scenes',          name: 'Scenes',          component: V('SceneView'),        meta: meta('采集场景',   'Setting',     'zone') },
      { path: '/reports',         name: 'Reports',         component: V('ReportsView'),      meta: meta('数据报表',   'DataLine',    'data') },
      { path: '/telemetry',       name: 'Telemetry',       component: V('TelemetryView'),    meta: meta('时序分析',   'Search',      'data') },
      { path: '/topology',        name: 'Topology',        component: V('TopologyView'),     meta: meta('链路拓扑',   'Share',       'data') },
      { path: '/gis',             name: 'Gis',            component: V('TopologyView'),     meta: { title: 'GIS地图', hidden: true } },
      { path: '/hmi',             name: 'Hmi',             component: V('HmiView'),          meta: { title: '组态视图', hidden: true } },

      // ===== 以下隐藏（URL直达） =====
      { path: '/phm',             name: 'Phm',             component: V('PhmView'),          meta: { title: '预测维护', hidden: true } },
      { path: '/graphrag',        name: 'GraphRag',        component: V('GraphRagView'),     meta: { title: '知识图谱', hidden: true } },
      { path: '/scada',           name: 'Scada',           component: V('ScadaView'),        meta: { title: 'SCADA', hidden: true } },
      { path: '/amis-test',       name: 'AmisTest',        component: V('AmisTestView'),     meta: { title: '低代码表单', hidden: true } },
      { path: '/mqtt-tool',       name: 'MqttTool',        component: V('MqttToolView'),     meta: { title: 'MQTT调试', hidden: true } },
      { path: '/packet-analysis', name: 'PacketAnalysis',  component: V('A11AnalysisView'),  meta: { title: '报文解析', hidden: true } },

      // ===== ⑨ 系统管理 =====
      { path: '/reports-center',  name: 'ReportCenter',  component: V('ReportCenterView'),   meta: meta('报表中心',   'DataAnalysis', 'dashboard') },
      { path: '/gateway-map',     name: 'GatewayMap',     component: V('GatewayMapView'),     meta: meta('网关地图',   'Location',     'protocol') },
      { path: '/algorithm-market',name: 'AlgorithmMarket',component: V('AlgorithmMarketView'),meta: meta('算法市场',   'Collection',    'compute') },
      { path: '/security-audit',  name: 'SecurityAudit',  component: V('SecurityAuditView'),  meta: meta('安全审计',   'Lock',          'system') },
      { path: '/users',           name: 'Users',           component: V('UsersView'),        meta: meta('用户管理',   'UserFilled',  'system') },
    ]
  }
]

// ═══════════════════════════════════════════════════════════
// 动态路由 (从 Navigation 表加载)
// ═══════════════════════════════════════════════════════════

export const asyncRoutes = []

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
})

// ═══════════════════════════════════════════════════════════
// 权限守卫
// ═══════════════════════════════════════════════════════════

const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  if (to.meta?.title) {
    document.title = `${to.meta.title} - ${title}`
  }

  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      const hasRoles = localStorage.getItem('dgiot_userid') != null
      if (hasRoles) {
        next()
      } else {
        try {
          const user = JSON.parse(localStorage.getItem('dgiot_user') || '{}')
          if (user.username) {
            localStorage.setItem('dgiot_username', user.username)
            localStorage.setItem('dgiot_nick', user.nick || user.username)
            next()
          } else {
            throw new Error('Session expired')
          }
        } catch (error) {
          await import('../utils/auth').then(m => {
            m.removeToken()
            m.removeLocalUser()
          })
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

export function resetRouter() {
  const newRouter = createRouter({
    history: createWebHashHistory(),
    routes: constantRoutes,
  })
  router.matcher = newRouter.matcher
}

export default router
