/**
 * base 插件 — IOT 底座双类插件（合并自 plugins-base/vue-shell/basePlugins.js）
 *
 * 双类语义:
 *   tab 型 = 工程内通用视图（走 /api/iot/* 轻量契约，后端实现标准接口即可复用）
 *   url 型 = 底座服务外链（本体图谱 Force 图 / DSH 移动端，新窗口打开）
 *
 * 与既有 7 插件（device/data/hmi/network/tool/system/hub）同格式注册；
 * 菜单经 registry → loader → manifest 汇总，部署时按需裁剪。
 * 注意: 本插件路由与 constantRoutes 中 /iot/* 视图一致，接线后即生效。
 */
import { registerPlugin } from './registry.js'

registerPlugin({
  name: 'base',
  version: '1.0',
  description: 'IOT 底座 — 轻量契约视图 + 底座服务外链',

  routes: [
    { path: '/iot/devices', name: 'IotDevices', component: () => import('../views/iot/DeviceView.vue'), meta: { title: '设备台账', icon: 'Monitor', group: 'base' } },
    { path: '/iot/products', name: 'IotProducts', component: () => import('../views/iot/ProductView.vue'), meta: { title: '产品台账', icon: 'Goods', group: 'base' } },
    { path: '/iot/channels', name: 'IotChannels', component: () => import('../views/iot/ChannelView.vue'), meta: { title: '通道台账', icon: 'Connection', group: 'base' } },
    { path: '/ontology-graph', name: 'OntologyGraph', component: () => import('../views/OntologyGraphView.vue'), meta: { title: '本体图谱', icon: 'Share', group: 'base' } },
  ],

  menu: {
    group: 'base',
    label: 'IOT 底座',
    icon: 'Menu',
    items: [
      { title: '设备台账', path: '/iot/devices', icon: 'Monitor' },
      { title: '产品台账', path: '/iot/products', icon: 'Goods' },
      { title: '通道台账', path: '/iot/channels', icon: 'Connection' },
      { title: '本体图谱', path: '/ontology-graph', icon: 'Share' },
    ],
  },
})
