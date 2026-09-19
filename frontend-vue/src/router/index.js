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
    name: 'Layout',   // 具名是为了让插件路由能挂进来 (setupPluginRoutes 用 addRoute('Layout', …))
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
  // ★ 换 matcher = 换掉整张路由表，插件路由一并没了。
  //   不补回来的话，「登出再登录」会让插件页静默变 404，
  //   而静态路由一切正常 —— 这类只在二次登录才出现的缺陷最难查。
  for (const r of _pluginRoutes) {
    try {
      router.addRoute('Layout', r)
    } catch (e) {
      console.warn(`[plugin] 重置后补挂路由失败 ${r.path}:`, e)
    }
  }
}

export default router


// ═══════════════════════════════════════════════════════════
// 插件路由接线
// ═══════════════════════════════════════════════════════════
//
// 说明书在 src/plugins/INTEGRATION.md（85 行，写好了从未执行）。
//
// ★ 说明书那版**不能照抄**。它的做法是
//     coreRoutes[1].children = getAllRoutes()
//   —— 把核心 children **整体替换**成插件路由。实测：8 个前端插件共声明
//   21 条路由，其中 20 条的核心页在 constantRoutes 里已有；而 constantRoutes
//   里另有 13 条**没有任何插件声明**（/amis-test /fde /dsh-mobile /io-clone
//   /roles /menus /views /agent-audit /graph-analysis /ontology-manage
//   /graphrag /bi /plugin/:name）。整体替换 ⇒ 这 13 个页面当场全部 404，
//   而且不报错 —— 路由表短了不会有人吭声。
//
// 所以改用**增量合并**：核心优先，重复的报出来，不静默丢。
// 这样做的第二个好处是 router 实例只有一个、且在 import 时就建好了 ——
// `api/request.js` 的拦截器和 `resetRouter()` 拿到的仍是同一个实例。

/** 插件声明的路由，模块级留存 —— resetRouter 换完 matcher 要按这份补挂回来 */
const _pluginRoutes = []

/**
 * 把插件声明的路由并进已有 router（**在 app.mount 之前 await**）。
 *
 * 全程不回滚路由器：插件层整段失败时，核心路由必须照常可用。
 * 这不是「容错」—— 这是 driver 型插槽的必备项，插件的缺席不能让宿主残废。
 *
 * @returns {Promise<{added:Array, duplicated:Array, conflicting:Array, failed:string|null}>}
 */
export async function setupPluginRoutes(router) {
  const report = { added: [], duplicated: [], conflicting: [], failed: null }
  try {
    const [{ loadPlugins }, { getAllRoutes }] = await Promise.all([
      import('../plugins/loader.js'),
      import('../plugins/index.js'),
    ])
    await loadPlugins()          // 插件模块 import 时自调 registerPlugin()
    const declared = getAllRoutes()

    const seen = new Map()
    for (const r of constantRoutes[1].children || []) seen.set(r.path, r)

    for (const r of declared) {
      const hit = seen.get(r.path)
      if (hit) {
        // 同名同路径 = 同一页面的两份声明，核心优先，记下来备查。
        // 但**名字不同就是真冲突** —— 同一 path 两个 name，谁赢都会让
        // 另一边的 <router-link :to="{name}"> 静默失效。必须响亮报出。
        if (hit.name !== r.name) {
          report.conflicting.push({ path: r.path, core: hit.name, plugin: r.name })
        }
        report.duplicated.push({ path: r.path, name: r.name })
        continue
      }
      router.addRoute('Layout', r)
      seen.set(r.path, r)
      _pluginRoutes.push(r)
      report.added.push({ path: r.path, name: r.name })
    }
  } catch (e) {
    report.failed = String(e?.message || e)
    console.error('[plugin] 插件路由装载失败，退回纯静态路由:', e)
  }

  if (report.duplicated.length) {
    // 不是错误，但必须看得见：重复项意味着这份声明在当前路由表下不生效
    console.info(`[plugin] ${report.duplicated.length} 条插件路由与核心路由同路径，`
                 + `核心优先: ${report.duplicated.map(d => d.path).join(', ')}`)
  }
  if (report.conflicting.length) {
    console.error('[plugin] 路由名冲突（同路径不同 name，会静默失效）:',
                  report.conflicting)
  }
  console.info(`[plugin] 路由接线: 新增 ${report.added.length} 条, `
               + `重复 ${report.duplicated.length} 条, 冲突 ${report.conflicting.length} 条`
               + (report.failed ? ` (失败: ${report.failed})` : ''))
  return report
}
