/** 网络诊断插件 — 报文解析 · 通道管理 · 边缘代理 */
import { registerPlugin } from './registry.js'

registerPlugin({
  name: 'network',
  version: '1.0',
  description: '网络诊断 — A11报文解析、通道管理、边缘代理',

  routes: [
    { path: '/packet-analysis', name: 'PacketAnalysis', component: () => import('../views/A11AnalysisView.vue'), meta: { title: '报文解析', icon: 'DataAnalysis', group: 'network' } },
    { path: '/channels', name: 'Channels', component: () => import('../views/ChannelView.vue'), meta: { title: '通道管理', icon: 'Connection', group: 'network' } },
    { path: '/edge-proxy', name: 'EdgeProxy', component: () => import('../views/EdgeProxyView.vue'), meta: { title: '边缘代理', icon: 'Platform', group: 'network' } },
  ],

  menu: {
    group: 'network',
    label: '网络诊断',
    icon: 'Connection',
    items: [
      { title: '报文解析', path: '/packet-analysis', icon: 'DataAnalysis' },
      { title: '通道管理', path: '/channels', icon: 'Connection' },
      { title: '边缘代理', path: '/edge-proxy', icon: 'Platform' },
    ]
  },
})
