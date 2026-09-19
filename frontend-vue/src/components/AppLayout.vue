<!--
  AppLayout — 对齐 iotView src/layout/index.vue
  组件: Sidebar / Navbar / TabsBar / AppMain / RightPanel
-->
<template>
  <el-container class="app-layout">
    <!-- 侧栏 -->
    <Sidebar :menu-groups="menuGroups" />

    <el-container>
      <!-- 顶栏 -->
      <Navbar
        :title="currentTitle"
        :user-name="userName"
        :user-role="userRole"
        :health-status="healthStatus"
        :online-devices="stats?.online_devices || 0"
        :tenants="tenants"
        :current-tenant="currentTenant"
        @switch-tenant="switchTenant"
        @logout="doLogout"
      />

      <!-- 多标签页 (iotView: TagsView) -->
      <div class="tabs-bar" v-if="showTabs">
        <div class="tabs-scroll">
          <div v-for="tab in tabsState.visitedRoutes" :key="tab.path"
            class="tab-item" :class="{active:tabsState.activeTab===tab.path}"
            @click="router.push(tab.path);tabsState.activeTab=tab.path"
            @contextmenu.prevent="showCtxMenu($event,tab)">
            <span>{{ tab.title }}</span>
            <span class="tab-close" @click.stop="tabsState.removeTab(tab.path)">×</span>
          </div>
        </div>
        <div class="tabs-actions">
          <el-dropdown trigger="click" @command="ctxCmd">
            <span class="tab-drop-btn">▾</span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="close-other">关闭其他</el-dropdown-item>
                <el-dropdown-item command="close-all">关闭全部</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!-- 主内容 (iotView: AppMain) -->
      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <keep-alive :include="cachedViews">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from './Sidebar/index.vue'
import Navbar from './Navbar/index.vue'
import { getHealth, getStats } from '../api'
import { getMenus } from '../api/admin'
import { MENU_GROUPS } from '../utils/constants'
import { tabsState } from '../stores/tabs'
import { watch } from 'vue'
import { useWebSocket } from '../composables/useWebSocket'
import { getToken, removeToken, removeLocalUser } from '../utils/auth'

const route = useRoute()
const router = useRouter()

// ── User session ──
const userName = ref('')
const userRole = ref('')

function restoreSession() {
  const username = localStorage.getItem('dgiot_username') || ''
  const nick = localStorage.getItem('dgiot_nick') || ''
  const role = localStorage.getItem('dgiot_deptName') || ''
  userName.value = nick || username || '未登录'
  if (role) {
    userRole.value = role
  } else {
    try {
      const u = JSON.parse(localStorage.getItem('dgiot_user') || '{}')
      userRole.value = u.role || ''
    } catch(e) {}
  }
  if (!getToken()) {
    router.push('/login')
  }
}

function doLogout() {
  removeToken()
  removeLocalUser()
  router.push('/login')
}

onMounted(() => restoreSession())

// ── 健康状态 ──
const healthStatus = ref('loading')
const stats = ref({ online_devices: 0, total_collects: 0, success_rate: 0 })
let timer = null

// ── 布局配置 ──
const showTabs = ref(window.$cfg?.showTabs ?? true)
const cachedViews = computed(() =>
  tabsState.visitedRoutes.map(t => t.path.split('/').pop()).filter(Boolean)
)

// ── 标签页右键菜单 ──
const ctxTab = ref(null)
function showCtxMenu(e, tab) { ctxTab.value = tab }
function ctxCmd(cmd) {
  if (cmd === 'close-other') ctxTab.value && tabsState.removeOther(ctxTab.value.path)
  if (cmd === 'close-all') tabsState.removeAll()
}
watch(() => route.path, (p) => {
  if (p !== '/login') tabsState.addTab(route)
}, { immediate: true })

// ── 多租户 ──
const tenants = ref([{ tenant_id: 'default', name: '默认租户' }])
const currentTenant = ref(localStorage.getItem('dgiot_tenant') || 'default')

async function fetchTenants() {
  try {
    const r = await fetch('/api/tenants/my')
    if (r.status === 401) return
    if (r.ok) {
      const d = await r.json()
      if (d.tenants?.length) {
        tenants.value = d.tenants
        const cur = d.current || 'default'
        if (!tenants.value.find(t => t.tenant_id === currentTenant.value)) {
          currentTenant.value = cur
        }
      }
    }
  } catch {}
}

function switchTenant(tid) {
  currentTenant.value = tid
  localStorage.setItem('dgiot_tenant', tid)
  window.location.reload()
}

// ── 动态菜单 — 从 Parse Navigation 加载 ──
const dynamicMenus = ref([])
async function loadMenus() {
  try {
    const r = await fetch('/api/classes/Navigation?limit=50&order=order')
    const d = await r.json()
    dynamicMenus.value = (d.results || []).sort((a, b) => (a.order || 99) - (b.order || 99))
  } catch { dynamicMenus.value = [] }
}

// ── 菜单覆写 — 菜单管理页写的那份 ──
// GET 只要求登录，不要求 admin（见 src/web/menu_api.py 顶部注释）。
// 拿不到就空数组，侧边栏退回纯静态路由，不影响进入系统。
const menuOverrides = ref([])
async function loadMenuOverrides() {
  try {
    const r = await getMenus()
    menuOverrides.value = r?.results || []
  } catch { menuOverrides.value = [] }
}

// 菜单管理页改完即时刷新侧边栏。
// 覆写只在挂载时读一次，否则管理员在 /menus 存完得刷新整页才看得到效果。
// 用 window 事件而不是 pinia：这里只有一个消费者，不值得再拉一个 store。
function onMenuChanged() { loadMenuOverrides() }
onMounted(() => window.addEventListener('dgiot:menus-changed', onMenuChanged))
onUnmounted(() => window.removeEventListener('dgiot:menus-changed', onMenuChanged))

const menuGroups = computed(() => {
  const groups = {}
  if (dynamicMenus.value.length) {
    dynamicMenus.value.forEach(m => {
      const g = m.group || '其他'
      if (!groups[g]) groups[g] = []
      groups[g].push({ path: m.path, meta: { title: m.name, icon: m.icon || 'Menu' } })
    })
    return groups
  }
  // Fallback: 静态路由菜单 + 菜单管理里的覆写
  // 静态路由定「有哪些页面」，覆写定「怎么展示」（标题/图标/分组/排序/显隐/外链）。
  const allItems = router.options.routes.find(r => r.path === '/')?.children || []
  const ovMap = Object.fromEntries(menuOverrides.value.map(o => [o.path, o]))

  const push = (item) => {
    const g = item.meta?.group || 'other'
    const label = (MENU_GROUPS[g] || { label: g }).label
    if (!groups[label]) groups[label] = []
    groups[label].push(item)
  }

  allItems.forEach(item => {
    const o = ovMap[item.path]
    let meta = item.meta || {}
    if (o) {
      meta = { ...meta }
      if (o.title) meta.title = o.title
      if (o.icon) meta.icon = o.icon
      if (o.group) meta.group = o.group
      if (o.external) meta.external = o.external
      // embed 型 = 底座内嵌打开（PluginFrameView），不是新窗口
      if (o.embed) meta.embed = true
      if (o.order != null) meta.order = o.order
      if (o.visible === false) meta.hidden = true
      else if (o.visible === true) meta.hidden = false
      delete ovMap[item.path]
    }
    if (meta.hidden) return
    push({ ...item, meta })
  })

  // 覆写里有、静态路由里没有的 —— 外链菜单就靠这条加进来（不需要组件）
  // ⚠️ 仓外插件（含 embed 型）**全部**走这条：它们没有静态路由。
  //    所以 embed 必须在这里透传，否则插件菜单会退化成新窗口。
  Object.values(ovMap).forEach(o => {
    if (o.visible === false) return
    push({
      path: o.path,
      meta: { title: o.title || o.path, icon: o.icon || 'Link', order: o.order,
              group: o.group || 'base', external: o.external || '',
              embed: !!o.embed },
    })
  })

  // 组内排序：覆写给过 order 的按 order 排，没给的排在后面、保持路由声明顺序
  Object.values(groups).forEach(items => {
    items.sort((a, b) => (a.meta?.order ?? 99) - (b.meta?.order ?? 99))
  })

  const groupOrder = Object.fromEntries(
    Object.entries(MENU_GROUPS).map(([, v]) => [v.label, v.order])
  )
  return Object.fromEntries(
    Object.entries(groups).sort(([a], [b]) => (groupOrder[a] ?? 99) - (groupOrder[b] ?? 99))
  )
})

const currentTitle = computed(() => route.meta?.title || '仪表盘')

// ── WebSocket ──
const ws = useWebSocket()
ws.on('pipeline', () => {
  if (stats.value) {
    stats.value.total_collects = (stats.value.total_collects || 0) + 1
    stats.value.pipeline_points = (stats.value.pipeline_points || 0) + 1
  }
})

// ── 生命周期 ──
onMounted(async () => {
  await fetchTenants()
  await loadMenus()
  await loadMenuOverrides()
  await restoreSession()
  try { const r = await getHealth(); healthStatus.value = r?.data?.status || r?.status || 'ok' } catch { healthStatus.value = 'error' }
  try { const r = await getStats(); stats.value = r?.data || r } catch {}
  timer = setInterval(async () => {
    try { const r = await getStats(); stats.value = r?.data || r } catch {}
  }, 30000)
})

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.app-layout { height: 100vh; display: flex; }
.app-layout > .el-container { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.main-content { background: #0c1c30; padding: 20px; min-height: calc(100vh - 50px - 36px); flex: 1; overflow-y: auto; }

/* 多标签页 */
.tabs-bar { display: flex; align-items: center; height: 36px; background: #0a1628; border-bottom: 1px solid #1e3a5f; padding: 0 8px; }
.tabs-scroll { flex: 1; display: flex; overflow-x: auto; gap: 2px; white-space: nowrap; }
.tabs-scroll::-webkit-scrollbar { height: 2px; }
.tab-item { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; font-size: 12px; color: #8aa0b4; background: #0d1f33; border-radius: 4px 4px 0 0; cursor: pointer; user-select: none; border: 1px solid transparent; }
.tab-item.active { color: #66d9ff; background: #152a40; border-color: #1e3a5f; border-bottom-color: #152a40; }
.tab-item:hover { color: #c0d5e8; }
.tab-close { font-size: 14px; opacity: 0.5; padding: 0 2px; }
.tab-close:hover { opacity: 1; color: #ef5350; }
.tab-drop-btn { font-size: 12px; color: #6a8aaa; cursor: pointer; padding: 4px 8px; display: block; }
.tabs-actions { flex-shrink: 0; }
</style>

