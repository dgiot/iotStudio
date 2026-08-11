import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../components/AppLayout.vue'),
    redirect: '/dashboard',
    children: [
      { path: '/dashboard', name: 'Dashboard', component: () => import('../views/Dashboard.vue'), meta: { title: '仪表盘', icon: 'Odometer' } },
      { path: '/force-graph', name: 'ForceGraph', component: () => import('../views/ForceGraph.vue'), meta: { title: '力导图', icon: 'Share' } },
      { path: '/entities', name: 'Entities', component: () => import('../views/Entities.vue'), meta: { title: '实体清单', icon: 'Grid' } },
      { path: '/relations', name: 'Relations', component: () => import('../views/Relations.vue'), meta: { title: '关系矩阵', icon: 'Connection' } },
      { path: '/constraints', name: 'Constraints', component: () => import('../views/Constraints.vue'), meta: { title: '约束规则', icon: 'Warning' } },
      { path: '/tags', name: 'Tags', component: () => import('../views/Tags.vue'), meta: { title: '标签数据', icon: 'Collection' } },
      { path: '/report', name: 'Report', component: () => import('../views/Report.vue'), meta: { title: '审核报告', icon: 'DocumentChecked' } },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
