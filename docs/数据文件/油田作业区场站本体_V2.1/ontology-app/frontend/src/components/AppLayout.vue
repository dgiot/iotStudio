<template>
  <el-container style="height:100vh">
    <!-- 侧边菜单 -->
    <el-aside width="220px" style="background:#1a1f36; overflow-y:auto">
      <div class="logo-box">
        <el-icon :size="28" color="#409EFF"><Platform /></el-icon>
        <span class="logo-text">DLAS 本体</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        background-color="#1a1f36"
        text-color="#a0aec0"
        active-text-color="#409EFF"
        style="border-right:none"
      >
        <el-menu-item v-for="r in menuRoutes" :key="r.path" :index="r.path">
          <el-icon><component :is="r.meta.icon" /></el-icon>
          <span>{{ r.meta.title }}</span>
        </el-menu-item>
      </el-menu>
      <div class="sidebar-footer">
        <el-divider style="border-color:rgba(255,255,255,0.08); margin:8px 0" />
        <div style="padding:8px 20px; font-size:11px; color:#666">
          v2.0 · DLAS Framework<br/>
          Data · Logic · Action · Security
        </div>
      </div>
    </el-aside>

    <!-- 主内容 -->
    <el-container>
      <el-header style="height:52px; background:#fff; border-bottom:1px solid #e8eaed; display:flex; align-items:center; padding:0 24px">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
        </el-breadcrumb>
        <div style="margin-left:auto; display:flex; align-items:center; gap:16px">
          <el-tag size="small" type="info">47,311 测点</el-tag>
          <el-tag size="small" type="success">52 实体</el-tag>
          <el-tag size="small" type="warning">23 规则</el-tag>
          <el-tag size="small" type="danger">13 安全</el-tag>
        </div>
      </el-header>
      <el-main style="background:#f5f7fa; padding:20px">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeMenu = computed(() => route.path)
const currentTitle = computed(() => route.meta?.title || '')

const menuRoutes = [
  { path: '/dashboard', meta: { title: '仪表盘', icon: 'Odometer' } },
  { path: '/force-graph', meta: { title: '力导图', icon: 'Share' } },
  { path: '/entities', meta: { title: '实体清单', icon: 'Grid' } },
  { path: '/relations', meta: { title: '关系矩阵', icon: 'Connection' } },
  { path: '/constraints', meta: { title: '约束规则', icon: 'Warning' } },
  { path: '/tags', meta: { title: '标签数据', icon: 'CollectionTag' } },
  { path: '/report', meta: { title: '审核报告', icon: 'DocumentChecked' } },
]
</script>

<style scoped>
.logo-box {
  display: flex; align-items: center; gap: 10px;
  padding: 18px 20px; color: #fff; font-size: 17px; font-weight: 700;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.logo-text { letter-spacing: 2px; }
.sidebar-footer { margin-top: auto; }
.el-menu-item { margin: 2px 8px; border-radius: 8px; }
.el-menu-item:hover { background: rgba(255,255,255,0.04) !important; }
</style>
