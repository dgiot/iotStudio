<template>
  <el-container class="app-layout">
    <!-- 侧栏 -->
    <el-aside width="220px" class="sidebar">
      <div class="logo">
        <h2>⚡ 光储充物联网</h2>
        <small>pythonIot V1.0</small>
      </div>
      <el-menu :default-active="route.path" router background-color="#0d1b30" text-color="#c0d5e8" active-text-color="#4fc3f7">
        <template v-for="item in menuItems" :key="item.path">
          <el-menu-item v-if="!item.meta?.hidden" :index="item.path">
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
          <el-tag :type="healthStatus === 'ok' ? 'success' : 'danger'" size="small" effect="dark">
            {{ healthStatus === 'ok' ? '系统正常' : '异常' }}
          </el-tag>
          <span style="margin-left:12px;color:#8899aa;font-size:13px">{{ stats?.online_devices || 0 }} 设备在线</span>
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

const route = useRoute()
const router = useRouter()

const healthStatus = ref('loading')
const stats = ref({ online_devices: 0, total_collects: 0, success_rate: 0 })

const menuItems = router.options.routes
  .find(r => r.path === '/')?.children || []

const currentTitle = computed(() => route.meta?.title || '仪表盘')

let timer = null
onMounted(async () => {
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
body { font-family: 'Microsoft YaHei', sans-serif; background: #0a1628; }
.app-layout { height: 100vh; }
.sidebar { background: #0d1b30; overflow-y: auto; }
.logo { padding: 20px 16px; text-align: center; border-bottom: 1px solid #1a3a5c; }
.logo h2 { color: #4fc3f7; font-size: 16px; }
.logo small { color: #8899aa; font-size: 11px; }
.el-menu { border-right: none !important; }
.topbar { background: #0f1f3a; border-bottom: 1px solid #1a3a5c; display: flex; align-items: center; justify-content: space-between; height: 50px; }
.topbar-left { color: #c0d5e8; font-size: 16px; font-weight: bold; }
.main-content { background: #0a1628; padding: 20px; min-height: calc(100vh - 50px); }
</style>
