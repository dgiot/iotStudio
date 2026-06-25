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
      { path: '/dashboard', name: 'Dashboard', component: () => import('../views/DashboardView.vue'), meta: { title: '仪表盘', icon: 'Odometer' } },
      { path: '/devices', name: 'Devices', component: () => import('../views/DeviceListView.vue'), meta: { title: '设备管理', icon: 'Monitor' } },
      { path: '/devices/:id', name: 'DeviceDetail', component: () => import('../views/DeviceDetailView.vue'), meta: { title: '设备详情', hidden: true } },
      { path: '/alarms', name: 'Alarms', component: () => import('../views/AlarmListView.vue'), meta: { title: '告警管理', icon: 'Bell' } },
      { path: '/scada', name: 'Scada', component: () => import('../views/ScadaView.vue'), meta: { title: '2D组态', icon: 'PictureFilled' } },
      { path: '/channels', name: 'Channels', component: () => import('../views/ChannelView.vue'), meta: { title: '通道管理', icon: 'Connection' } },
      { path: '/simulators', name: 'Simulators', component: () => import('../views/SimulatorView.vue'), meta: { title: '模拟器管理', icon: 'VideoCameraFilled' } },
      { path: '/telemetry', name: 'Telemetry', component: () => import('../views/TelemetryView.vue'), meta: { title: '数据查询', icon: 'Search' } },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('dgiot_token')
  if (to.meta.noAuth) {
    next() // 登录页不拦截
  } else if (!token) {
    next('/login') // 未登录跳转
  } else {
    next()
  }
})

export default router
