/** 边缘中枢联调插件 — 桥接 · 数据推送 · 联调监控 */
import { registerPlugin } from './registry.js'

registerPlugin({
  name: 'hub',
  version: '1.0',
  description: '边缘中枢 — DG-IOT 联调监控、MQTT桥接、数据推送状态',

  // ★ 声明必须能实现：下面两条原本指向 `../views/CaptureDashboard.vue` 与
  //   `../views/DeviceCmdView.vue`，**这两个文件全树不存在**（只有本文件引用过）。
  //   路由的 component 是静态可分析的 `import('...')`，Vite 构建期解析不到就
  //   直接失败 —— 所以接线时它不是「运行时 404」而是「构建起不来」。
  //   保留在此是为了留住意图；补上对应视图文件后把这两条移回 routes 即可。
  //
  //   { path: '/capture',    name: 'CaptureDashboard', component: () => import('../views/CaptureDashboard.vue'), meta: { title: '抓包仪表盘', icon: 'DataBoard', group: 'hub' } },
  //   { path: '/device-cmd', name: 'DeviceCmd',        component: () => import('../views/DeviceCmdView.vue'),   meta: { title: '设备指令',   icon: 'Promotion', group: 'hub' } },
  routes: [
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
