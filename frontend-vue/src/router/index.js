import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
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
      { path: '/simulators', name: 'Simulators', component: () => import('../views/SimulatorView.vue'), meta: { title: '模拟器管理', icon: 'VideoCameraFilled' } },
      { path: '/telemetry', name: 'Telemetry', component: () => import('../views/TelemetryView.vue'), meta: { title: '数据查询', icon: 'Search' } },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
