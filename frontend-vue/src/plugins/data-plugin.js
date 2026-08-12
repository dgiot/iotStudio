/** 数据分析插件 — 仪表盘 · 遥测 · 告警 · 流计算 · PHM */
import { registerPlugin } from './registry.js'

registerPlugin({
  name: 'data',
  version: '1.0',
  description: '数据分析 — 仪表盘、遥测、告警、流计算、预测维护',

  routes: [
    { path: '/dashboard', name: 'Dashboard', component: () => import('../views/DashboardView.vue'), meta: { title: '仪表盘', icon: 'Odometer', group: 'data' } },
    { path: '/telemetry', name: 'Telemetry', component: () => import('../views/TelemetryView.vue'), meta: { title: '数据分析', icon: 'Search', group: 'data' } },
    { path: '/alarms', name: 'Alarms', component: () => import('../views/AlarmListView.vue'), meta: { title: '告警管理', icon: 'Bell', group: 'data' } },
    { path: '/stream', name: 'Stream', component: () => import('../views/StreamView.vue'), meta: { title: '流计算引擎', icon: 'MagicStick', group: 'data' } },
    { path: '/phm', name: 'Phm', component: () => import('../views/PhmView.vue'), meta: { title: '预测性维护', icon: 'Cpu', group: 'data' } },
  ],

  menu: {
    group: 'data',
    label: '数据分析',
    icon: 'DataAnalysis',
    items: [
      { title: '仪表盘', path: '/dashboard', icon: 'Odometer' },
      { title: '数据分析', path: '/telemetry', icon: 'Search' },
      { title: '告警管理', path: '/alarms', icon: 'Bell' },
      { title: '流计算', path: '/stream', icon: 'MagicStick' },
      { title: '预测维护', path: '/phm', icon: 'Cpu' },
    ]
  },
})
