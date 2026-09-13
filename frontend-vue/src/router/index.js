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
      { path: '/topology', name: 'Topology', component: () => import('../views/TopologyView.vue'), meta: { title: '设备拓扑', icon: 'Share', group: 'device' } },

      // ===== 组态 =====
      { path: '/hmi', name: 'Hmi', component: () => import('../views/HmiView.vue'), meta: { title: '组态视图', icon: 'PictureFilled', group: 'hmi' } },
      { path: '/scada', name: 'Scada', component: () => import('../views/ScadaView.vue'), meta: { title: '2D 组态', icon: 'Grid', group: 'hmi' } },
      { path: '/reports', name: 'Reports', component: () => import('../views/ReportsView.vue'), meta: { title: '数据报表', icon: 'Document', group: 'hmi' } },

      // ===== 数据 =====
      { path: '/telemetry', name: 'Telemetry', component: () => import('../views/TelemetryView.vue'), meta: { title: '数据分析', icon: 'Search', group: 'data' } },
      { path: '/alarms', name: 'Alarms', component: () => import('../views/AlarmListView.vue'), meta: { title: '告警管理', icon: 'Bell', group: 'data' } },
      { path: '/stream', name: 'Stream', component: () => import('../views/StreamView.vue'), meta: { title: '流计算引擎', icon: 'MagicStick', group: 'data' } },
      { path: '/phm', name: 'Phm', component: () => import('../views/PhmView.vue'), meta: { title: '预测性维护', icon: 'Cpu', group: 'data' } },
      { path: '/bi', name: 'BiDashboard', component: () => import('../views/BiEmbedView.vue'), meta: { title: 'BI 看板', icon: 'DataBoard', group: 'data' } },

      // ===== 图谱（本体主题归一，原先散在 数据/底座/工具 三组）=====
      { path: '/graph-analysis', name: 'GraphAnalysis', component: () => import('../views/GraphAnalysisView.vue'), meta: { title: '图谱分析', icon: 'Share', group: 'graph' } },
      { path: '/ontology-manage', name: 'OntologyManage', component: () => import('../views/OntologyManageView.vue'), meta: { title: '本体管理', icon: 'Collection', group: 'graph' } },
      { path: '/ontology-graph', name: 'OntologyGraph', component: () => import('../views/OntologyGraphView.vue'), meta: { title: '本体图谱', icon: 'Connection', group: 'graph' } },
      { path: '/graphrag', name: 'GraphRag', component: () => import('../views/GraphRagView.vue'), meta: { title: '知识图谱问答', icon: 'ChatLineSquare', group: 'graph' } },

      // ===== 接入（原「网络诊断」，去掉杂物）=====
      { path: '/channels', name: 'Channels', component: () => import('../views/ChannelView.vue'), meta: { title: '通道管理', icon: 'Connection', group: 'network' } },
      { path: '/packet-analysis', name: 'PacketAnalysis', component: () => import('../views/A11AnalysisView.vue'), meta: { title: '报文解析', icon: 'DataAnalysis', group: 'network' } },
      { path: '/edge-proxy', name: 'EdgeProxy', component: () => import('../views/EdgeProxyView.vue'), meta: { title: '边缘代理', icon: 'Platform', group: 'network' } },
      { path: '/mqtt-tool', name: 'MqttTool', component: () => import('../views/MqttToolView.vue'), meta: { title: 'MQTT 调试', icon: 'ChatDotRound', group: 'network' } },
      { path: '/simulators', name: 'Simulators', component: () => import('../views/SimulatorView.vue'), meta: { title: '模拟器管理', icon: 'VideoCameraFilled', group: 'network' } },

      // ===== 底座 =====
      { path: '/amis-test', name: 'AmisTest', component: () => import('../views/AmisTestView.vue'), meta: { title: 'AMIS 低代码', icon: 'Platform', group: 'base' } },
      { path: '/fde', name: 'FdeWizard', component: () => import('../views/FdeWizardView.vue'), meta: { title: 'FDE 六步工作法', icon: 'MagicStick', group: 'base' } },
      // url 型外链（底座服务，新窗口打开，见 Sidebar external 分支）
      { path: '/dsh-mobile', name: 'DshMobile', component: () => import('../views/EmptyView.vue'), meta: { title: 'DSH 移动端', icon: 'Iphone', group: 'base', external: 'https://dsh.dgiotcloud.cn:48758/' } },

      // IOT 轻量台账 —— 路由保留（底座服务直连 / 旧链接不 404），菜单隐藏。
      // 与 /devices /products /channels 功能重复，菜单里只留主功能那套。
      { path: '/iot/devices', name: 'IotDevices', component: () => import('../views/iot/DeviceView.vue'), meta: { title: '设备台账', icon: 'Monitor', group: 'base', hidden: true } },
      { path: '/iot/products', name: 'IotProducts', component: () => import('../views/iot/ProductView.vue'), meta: { title: '产品台账', icon: 'Goods', group: 'base', hidden: true } },
      { path: '/iot/channels', name: 'IotChannels', component: () => import('../views/iot/ChannelView.vue'), meta: { title: '通道台账', icon: 'Connection', group: 'base', hidden: true } },
      { path: '/io-clone', name: 'IOClone', component: () => import('../views/IOCloneView.vue'), meta: { title: 'IO 网关克隆', icon: 'CopyDocument', group: 'base', hidden: true } },

      // ===== 系统 =====
      { path: '/system-overview', name: 'SystemOverview', component: () => import('../views/SystemOverview.vue'), meta: { title: '系统概览', icon: 'Monitor', group: 'system' } },
      { path: '/users', name: 'Users', component: () => import('../views/UsersView.vue'), meta: { title: '用户管理', icon: 'UserFilled', group: 'system' } },
      { path: '/roles', name: 'Roles', component: () => import('../views/RolesView.vue'), meta: { title: '角色管理', icon: 'Avatar', group: 'system' } },
      { path: '/menus', name: 'Menus', component: () => import('../views/MenusView.vue'), meta: { title: '菜单管理', icon: 'Menu', group: 'system' } },
      { path: '/views', name: 'Views', component: () => import('../views/ViewsView.vue'), meta: { title: '视图管理', icon: 'Files', group: 'system' } },
      { path: '/agent-audit', name: 'AgentAudit', component: () => import('../views/AgentAuditView.vue'), meta: { title: '质量审计', icon: 'Finished', group: 'system' } },
      { path: '/maintenance', name: 'Maintenance', component: () => import('../views/MaintenanceView.vue'), meta: { title: '运维管理', icon: 'Setting', group: 'system' } },

      // ===== 插件应用（仓外插件）=====
      // 通用宿主：把插件自己服务的前端页嵌进底座布局内打开。
      // 菜单覆写里 `embed:true` 的项走这条路由（Sidebar 的 external 分支会放行），
      // 没有 embed 的仍走老路子（<a target="_blank"> 新窗口）。
      // 约定：embed 型插件的菜单 path 用 `/plugin/<包名>`。
      // hidden:true —— 它不出现在菜单里，菜单项由覆写数据带进来。
      { path: '/plugin/:name', name: 'PluginFrame', component: () => import('../views/PluginFrameView.vue'), meta: { title: '插件应用', icon: 'Grid', group: 'base', hidden: true } },
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
