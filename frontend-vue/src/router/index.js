/**
 * 路由 — 对齐 iotView src/router + src/permission.js
 *
 * 权限守卫:
 *   1. whiteList 放行 (/login)
 *   2. hasToken → 已登录: getInfo → generateRoutes → addRoutes
 *   3. noToken  → 未登录: whiteList 放行, 其他跳 /login
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import { getToken } from '../utils/auth'
import { title } from '../config'

// ═══════════════════════════════════════════════════════════
// 静态路由 (对齐 iotView constantRoutes)
// ═══════════════════════════════════════════════════════════

export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { title: '登录', hidden: true },
  },
  {
    path: '/',
    component: () => import('../components/AppLayout.vue'),
    redirect: '/dashboard',
    children: [
      // ===== 监控 =====
      { path: '/dashboard', name: 'Dashboard', component: () => import('../views/DashboardView.vue'), meta: { title: '仪表盘', icon: 'Odometer', group: 'monitor' } },

      // ===== 设备 =====
      { path: '/devices', name: 'Devices', component: () => import('../views/DeviceListView.vue'), meta: { title: '设备管理', icon: 'Monitor', group: 'device' } },
      { path: '/devices/:id', name: 'DeviceDetail', component: () => import('../views/DeviceDetailView.vue'), meta: { title: '设备详情', hidden: true } },
      { path: '/products', name: 'Products', component: () => import('../views/ProductsView.vue'), meta: { title: '产品管理', icon: 'Goods', group: 'device' } },

      // ===== 组态 =====
      { path: '/hmi', name: 'Hmi', component: () => import('../views/HmiView.vue'), meta: { title: '组态视图', icon: 'PictureFilled', group: 'hmi' } },

      // ===== 数据 =====
      { path: '/telemetry', name: 'Telemetry', component: () => import('../views/TelemetryView.vue'), meta: { title: '数据分析', icon: 'Search', group: 'data' } },
      { path: '/alarms', name: 'Alarms', component: () => import('../views/AlarmListView.vue'), meta: { title: '告警管理', icon: 'Bell', group: 'data' } },
      { path: '/stream', name: 'Stream', component: () => import('../views/StreamView.vue'), meta: { title: '流计算引擎', icon: 'MagicStick', group: 'data' } },
      { path: '/phm', name: 'Phm', component: () => import('../views/PhmView.vue'), meta: { title: '预测性维护', icon: 'Cpu', group: 'data' } },

      // ===== 网络诊断 =====
      { path: '/packet-analysis', name: 'PacketAnalysis', component: () => import('../views/A11AnalysisView.vue'), meta: { title: '报文解析', icon: 'DataAnalysis', group: 'network' } },
      { path: '/channels', name: 'Channels', component: () => import('../views/ChannelView.vue'), meta: { title: '通道管理', icon: 'Connection', group: 'network' } },
      { path: '/edge-proxy', name: 'EdgeProxy', component: () => import('../views/EdgeProxyView.vue'), meta: { title: '边缘代理', icon: 'Platform', group: 'network' } },
      { path: '/amis-test', name: 'AmisTest', component: () => import('../views/AmisTestView.vue'), meta: { title: 'AMIS低代码', icon: 'Platform', group: 'network' } },

      // ===== 工具 =====
      { path: '/mqtt-tool', name: 'MqttTool', component: () => import('../views/MqttToolView.vue'), meta: { title: 'MQTT调试', icon: 'ChatDotRound', group: 'tool' } },
      { path: '/io-clone', name: 'IOClone', component: () => import('../views/IOCloneView.vue'), meta: { title: 'IO网关克隆', icon: 'CopyDocument', group: 'tool' } },
      { path: '/simulators', name: 'Simulators', component: () => import('../views/SimulatorView.vue'), meta: { title: '模拟器管理', icon: 'VideoCameraFilled', group: 'tool' } },
      { path: '/fde', name: 'FdeWizard', component: () => import('../views/FdeWizardView.vue'), meta: { title: 'FDE六步工作法', icon: 'MagicStick', group: 'tool' } },
      { path: '/graphrag', name: 'GraphRag', component: () => import('../views/GraphRagView.vue'), meta: { title: '知识图谱问答', icon: 'Search', group: 'tool' } },

      // ===== IOT 底座（合并自 plugins-base，/api/iot/* 轻量契约）=====
      { path: '/iot/devices', name: 'IotDevices', component: () => import('../views/iot/DeviceView.vue'), meta: { title: '设备台账', icon: 'Monitor', group: 'base' } },
      { path: '/iot/products', name: 'IotProducts', component: () => import('../views/iot/ProductView.vue'), meta: { title: '产品台账', icon: 'Goods', group: 'base' } },
      { path: '/iot/channels', name: 'IotChannels', component: () => import('../views/iot/ChannelView.vue'), meta: { title: '通道台账', icon: 'Connection', group: 'base' } },
      { path: '/ontology-graph', name: 'OntologyGraph', component: () => import('../views/OntologyGraphView.vue'), meta: { title: '本体图谱', icon: 'Share', group: 'base' } },
      // url 型外链（底座服务，新窗口打开，见 Sidebar external 分支）
      { path: '/dsh-mobile', name: 'DshMobile', component: () => import('../views/EmptyView.vue'), meta: { title: 'DSH 移动端', icon: 'Iphone', group: 'base', external: 'https://dsh.dgiotcloud.cn:48758/' } },

      // ===== 系统 =====
      { path: '/system-overview', name: 'SystemOverview', component: () => import('../views/SystemOverview.vue'), meta: { title: '系统概览', icon: 'Monitor', group: 'system' } },
      { path: '/maintenance', name: 'Maintenance', component: () => import('../views/MaintenanceView.vue'), meta: { title: '运维管理', icon: 'Setting', group: 'system' } },
      { path: '/users', name: 'Users', component: () => import('../views/UsersView.vue'), meta: { title: '用户管理', icon: 'UserFilled', group: 'system' } },
    ]
  }
]

// ═══════════════════════════════════════════════════════════
// 动态路由 (从 Navigation 加载，addRoute 追加)
// ═══════════════════════════════════════════════════════════

export const asyncRoutes = []

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
})

// ═══════════════════════════════════════════════════════════
// 权限守卫 — 对齐 iotView src/permission.js
// ═══════════════════════════════════════════════════════════

// 无需登录的白名单
const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - ${title}`
  }

  // 检查登录状态
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 已登录 → 去首页
      next({ path: '/' })
    } else {
      // 有 token，检查是否已加载动态路由
      // iotView: getInfo → generateRoutes → addRoutes
      // iotStudio 简化版: 直接放行 (后续可接入 Navigation 动态路由)
      const hasRoles = localStorage.getItem('dgiot_userid') != null
      if (hasRoles) {
        next()
      } else {
        try {
          // 恢复 session: 从 localStorage 重建用户状态
          const user = JSON.parse(localStorage.getItem('dgiot_user') || '{}')
          if (user.username) {
            localStorage.setItem('dgiot_username', user.username)
            localStorage.setItem('dgiot_nick', user.nick || user.username)
            next()
          } else {
            // session 丢失 → 清 token → 去登录
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
    // 无 token
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

/**
 * 重置路由 (logout 时调用)
 */
export function resetRouter() {
  const newRouter = createRouter({
    history: createWebHashHistory(),
    routes: constantRoutes,
  })
  // 用 matcher 替换实现 reset (对齐 iotView)
  router.matcher = newRouter.matcher
}

export default router
