/** 工业组态插件 — HMI · SCADA · 拓扑 */
import { registerPlugin } from './registry.js'

registerPlugin({
  name: 'hmi',
  version: '1.0',
  description: '工业组态 — HMI视图、SCADA、拓扑图',

  routes: [
    { path: '/hmi', name: 'Hmi', component: () => import('../views/HmiView.vue'), meta: { title: '组态视图', icon: 'PictureFilled', group: 'hmi' } },
    { path: '/scada', name: 'Scada', component: () => import('../views/ScadaView.vue'), meta: { title: 'SCADA组态', icon: 'Platform', group: 'hmi' } },
    { path: '/topology', name: 'Topology', component: () => import('../views/TopologyView.vue'), meta: { title: '拓扑图', icon: 'Share', group: 'hmi' } },
  ],

  menu: {
    group: 'hmi',
    label: '工业组态',
    icon: 'PictureFilled',
    items: [
      { title: 'HMI视图', path: '/hmi', icon: 'PictureFilled' },
      { title: 'SCADA', path: '/scada', icon: 'Platform' },
      { title: '拓扑图', path: '/topology', icon: 'Share' },
    ]
  },
})
