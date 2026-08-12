/** 系统管理插件 — 系统概览 · 运维 · 用户 */
import { registerPlugin } from './registry.js'

registerPlugin({
  name: 'system',
  version: '1.0',
  description: '系统管理 — 概览、运维、用户管理',

  routes: [
    { path: '/system-overview', name: 'SystemOverview', component: () => import('../views/SystemOverview.vue'), meta: { title: '系统概览', icon: 'Monitor', group: 'system' } },
    { path: '/maintenance', name: 'Maintenance', component: () => import('../views/MaintenanceView.vue'), meta: { title: '运维管理', icon: 'Setting', group: 'system' } },
    { path: '/users', name: 'Users', component: () => import('../views/UsersView.vue'), meta: { title: '用户管理', icon: 'UserFilled', group: 'system' } },
  ],

  menu: {
    group: 'system',
    label: '系统管理',
    icon: 'Setting',
    items: [
      { title: '系统概览', path: '/system-overview', icon: 'Monitor' },
      { title: '运维管理', path: '/maintenance', icon: 'Setting' },
      { title: '用户管理', path: '/users', icon: 'UserFilled' },
    ]
  },
})
