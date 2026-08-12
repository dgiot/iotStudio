/**
 * 设备管理插件
 * 功能: 设备列表 / 设备详情 / 产品管理
 */
import { registerPlugin } from './registry.js'

registerPlugin({
  name: 'device',
  version: '1.0',
  description: '设备管理 — 设备列表、详情、产品定义',

  // Vue Router 路由
  routes: [
    {
      path: '/devices',
      name: 'Devices',
      component: () => import('../views/DeviceListView.vue'),
      meta: { title: '设备管理', icon: 'Monitor', group: 'device' }
    },
    {
      path: '/devices/:id',
      name: 'DeviceDetail',
      component: () => import('../views/DeviceDetailView.vue'),
      meta: { title: '设备详情', hidden: true }
    },
    {
      path: '/products',
      name: 'Products',
      component: () => import('../views/ProductsView.vue'),
      meta: { title: '产品管理', icon: 'Goods', group: 'device' }
    },
  ],

  // 侧边栏菜单
  menu: {
    group: 'device',
    label: '设备管理',
    icon: 'Monitor',
    items: [
      { title: '设备列表', path: '/devices', icon: 'Monitor' },
      { title: '产品管理', path: '/products', icon: 'Goods' },
    ]
  },

  // 插件安装钩子
  onInstall(app) {
    // 注册全局组件、store 等
    // app.component('DeviceStatusBadge', DeviceStatusBadge)
  }
})
