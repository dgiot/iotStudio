/** 调试工具插件 — MQTT调试 · 模拟器 */
import { registerPlugin } from './registry.js'

registerPlugin({
  name: 'tool',
  version: '1.0',
  description: '调试工具 — MQTT客户端、模拟器管理',

  routes: [
    { path: '/mqtt-tool', name: 'MqttTool', component: () => import('../views/MqttToolView.vue'), meta: { title: 'MQTT调试', icon: 'ChatDotRound', group: 'tool' } },
    { path: '/simulators', name: 'Simulators', component: () => import('../views/SimulatorView.vue'), meta: { title: '模拟器管理', icon: 'VideoCameraFilled', group: 'tool' } },
  ],

  menu: {
    group: 'tool',
    label: '调试工具',
    icon: 'Setting',
    items: [
      { title: 'MQTT调试', path: '/mqtt-tool', icon: 'ChatDotRound' },
      { title: '模拟器', path: '/simulators', icon: 'VideoCameraFilled' },
    ]
  },
})
