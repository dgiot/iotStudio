/**
 * 多标签页导航 — 对标 iotStudio store/modules/tabs.js
 * 双层持久化: mutation 层自动写 localStorage
 */
import { reactive } from 'vue'

const STORAGE_KEY = 'dgiot_tabs'

function loadTabs() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] }
  catch { return [] }
}

function saveTabs(tabs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs.slice(-20)))
}

export const tabsState = reactive({
  visitedRoutes: loadTabs(),
  activeTab: '',

  addTab(route) {
    if (!route.path || route.path === '/login' || route.meta?.hidden) return
    const exist = this.visitedRoutes.find(t => t.path === route.path)
    if (!exist) {
      this.visitedRoutes.push({
        path: route.path, title: route.meta?.title || route.path,
        icon: route.meta?.icon || '', query: route.query || {},
      })
    }
    this.activeTab = route.path
    saveTabs(this.visitedRoutes)
  },

  removeTab(path) {
    const idx = this.visitedRoutes.findIndex(t => t.path === path)
    if (idx < 0) return
    this.visitedRoutes.splice(idx, 1)
    if (this.activeTab === path) {
      this.activeTab = this.visitedRoutes[Math.min(idx, this.visitedRoutes.length - 1)]?.path || ''
    }
    saveTabs(this.visitedRoutes)
  },

  removeOther(path) {
    this.visitedRoutes = this.visitedRoutes.filter(t => t.path === path)
    this.activeTab = path
    saveTabs(this.visitedRoutes)
  },

  removeAll() {
    this.visitedRoutes = []
    this.activeTab = ''
    saveTabs(this.visitedRoutes)
  },
})
