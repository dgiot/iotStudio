<template>
  <el-container class="app-layout">
    <!-- 侧栏 -->
    <el-aside width="220px" class="sidebar">
      <div class="logo">
        <h2>⚡ iotStudio</h2>
        <small>轻量级工业物联网平台</small>
      </div>
      <el-menu :default-active="route.path" router background-color="#0f1d33" text-color="#c0d5e8" active-text-color="#66d9ff">
        <template v-for="(items, group) in menuGroups" :key="group">
          <div class="menu-group-label">{{ group }}</div>
          <el-menu-item v-for="item in items" :key="item.path" :index="item.path">
            <el-icon><component :is="item.meta?.icon" /></el-icon>
            <span>{{ item.meta?.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 顶栏 -->
      <el-header class="topbar">
        <div class="topbar-left">{{ currentTitle }}</div>
        <div class="topbar-right">
          <!-- 租户选择 -->
          <el-select v-model="currentTenant" size="small" style="width:140px" @change="switchTenant" popper-class="tenant-popper">
            <el-option v-for="t in tenants" :key="t.tenant_id" :label="t.name" :value="t.tenant_id" />
          </el-select>
          <NotifyBell />
          <el-tag :type="healthStatus === 'ok' ? 'success' : 'danger'" size="small" effect="dark">
            {{ healthStatus === 'ok' ? '系统正常' : '异常' }}
          </el-tag>
          <span style="margin-left:8px;color:#b0c8d8;font-size:13px">{{ stats?.online_devices || 0 }} 设备在线</span>
        </div>
      </el-header>

      <!-- 主内容 -->
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getHealth, getStats } from '../api'
import NotifyBell from './NotifyBell.vue'
import { MENU_GROUPS } from '../utils/constants'

const route = useRoute()
const router = useRouter()

const healthStatus = ref('loading')
const stats = ref({ online_devices: 0, total_collects: 0, success_rate: 0 })

// 多租户
const tenants = ref([{ tenant_id: 'default', name: '默认租户' }])
const currentTenant = ref(localStorage.getItem('dgiot_tenant') || 'default')

async function fetchTenants() {
  try {
    const r = await fetch('/api/tenants/my')
    const d = await r.json()
    if (d.tenants?.length) {
      tenants.value = d.tenants
      const cur = d.current || 'default'
      if (!tenants.value.find(t => t.tenant_id === currentTenant.value)) {
        currentTenant.value = cur
      }
    }
  } catch {}
}

function switchTenant(tid) {
  currentTenant.value = tid
  localStorage.setItem('dgiot_tenant', tid)
  window.location.reload()  // 切换租户后刷新整个应用
}

const allItems = router.options.routes.find(r => r.path === '/')?.children || []
const menuGroups = computed(() => {
  const groups = {}
  allItems.filter(i => !i.meta?.hidden).forEach(item => {
    const g = item.meta?.group || 'other'
    const label = (MENU_GROUPS[g] || { label: g }).label
    if (!groups[label]) groups[label] = []
    groups[label].push(item)
  })
  // 按 MENU_GROUPS.order 排序（预计算 lookup 避免 O(n*m)）
  const groupOrder = Object.fromEntries(
    Object.entries(MENU_GROUPS).map(([, v]) => [v.label, v.order])
  )
  return Object.fromEntries(
    Object.entries(groups).sort(([a], [b]) => (groupOrder[a] ?? 99) - (groupOrder[b] ?? 99))
  )
})

const currentTitle = computed(() => route.meta?.title || '仪表盘')

let timer = null
onMounted(async () => {
  await fetchTenants()
  try { const r = await getHealth(); healthStatus.value = r.data.status } catch { healthStatus.value = 'error' }
  try { const r = await getStats(); stats.value = r.data } catch {}
  timer = setInterval(async () => {
    try { const r = await getStats(); stats.value = r.data } catch {}
  }, 10000)
})
onUnmounted(() => clearInterval(timer))
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Microsoft YaHei', sans-serif; background: #0c1c30; color: #c0d5e8; }
.app-layout { height: 100vh; }
.sidebar { background: #0f1d33; overflow-y: auto; }
.logo { padding: 20px 16px; text-align: center; border-bottom: 1px solid #234060; }
.logo h2 { color: #66d9ff; font-size: 16px; }
.logo small { color: #c0d5e8; font-size: 11px; }
.el-menu { border-right: none !important; }
.topbar { background: #0f1d33; border-bottom: 1px solid #234060; display: flex; align-items: center; justify-content: space-between; height: 50px; }
.topbar-left { color: #d8e4f0; font-size: 16px; font-weight: bold; }
.menu-group-label { font-size: 11px; color: #8aa0b4; padding: 12px 20px 4px; letter-spacing: 1px; }
.main-content { background: #0c1c30; padding: 20px; min-height: calc(100vh - 50px); }
</style>
