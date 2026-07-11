import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { title: '登录', noAuth: true }
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

      // ===== 工具 =====
      { path: '/mqtt-tool', name: 'MqttTool', component: () => import('../views/MqttToolView.vue'), meta: { title: 'MQTT调试', icon: 'ChatDotRound', group: 'tool' } },
      { path: '/simulators', name: 'Simulators', component: () => import('../views/SimulatorView.vue'), meta: { title: '模拟器管理', icon: 'VideoCameraFilled', group: 'tool' } },

      // ===== 系统 =====
      { path: '/system-overview', name: 'SystemOverview', component: () => import('../views/SystemOverview.vue'), meta: { title: '系统概览', icon: 'Monitor', group: 'system' } },
      { path: '/maintenance', name: 'Maintenance', component: () => import('../views/MaintenanceView.vue'), meta: { title: '运维管理', icon: 'Setting', group: 'system' } },
      { path: '/users', name: 'Users', component: () => import('../views/UsersView.vue'), meta: { title: '用户管理', icon: 'UserFilled', group: 'system' } },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('dgiot_token')
  if (to.meta.noAuth) next()
  else if (!token) next('/login')
  else next()
})

export default router
