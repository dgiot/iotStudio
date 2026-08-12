/** 边缘中枢联调插件 — 桥接 · 数据推送 · 联调监控 */
import { registerPlugin } from './registry.js'

registerPlugin({
  name: 'hub',
  version: '1.0',
  description: '边缘中枢 — DG-IOT 联调监控、MQTT桥接、数据推送状态',

  routes: [
    { path: '/capture', name: 'CaptureDashboard', component: () => import('../views/CaptureDashboard.vue'), meta: { title: '抓包仪表盘', icon: 'DataBoard', group: 'hub' } },
    { path: '/device-cmd', name: 'DeviceCmd', component: () => import('../views/DeviceCmdView.vue'), meta: { title: '设备指令', icon: 'Promotion', group: 'hub' } },
    { path: '/reports', name: 'Reports', component: () => import('../views/ReportsView.vue'), meta: { title: '联调报告', icon: 'Document', group: 'hub' } },
  ],

  menu: {
    group: 'hub',
    label: '边缘中枢',
    icon: 'Platform',
    items: [
      { title: '抓包仪表', path: '/capture', icon: 'DataBoard' },
      { title: '设备指令', path: '/device-cmd', icon: 'Promotion' },
      { title: '联调报告', path: '/reports', icon: 'Document' },
    ]
  },

  onInstall(app) {
    // 中枢桥接状态
    app.provide('hubConfig', {
      mqttBroker: '127.0.0.1:1883',
      parseAPI: 'http://127.0.0.1:1337/parse',
      dashboardURL: 'http://localhost:18083',
    })
  }
})
