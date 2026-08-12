<!--
  Sidebar — 对齐 iotView src/layout/components/Sidebar/index.vue
-->
<template>
  <el-aside width="220px" class="sidebar">
    <div class="logo">
      <h2>⚡ DG-IoT</h2>
      <small>轻量级边缘代理</small>
    </div>
    <el-menu
      :default-active="activeMenu"
      router
      background-color="#0f1d33"
      text-color="#c0d5e8"
      active-text-color="#66d9ff"
    >
      <template v-for="(items, group) in menuGroups" :key="group">
        <div class="menu-group-label">{{ group }}</div>
        <el-menu-item v-for="item in items" :key="item.path" :index="item.path">
          <el-icon><component :is="item.meta?.icon" /></el-icon>
          <span>{{ item.meta?.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  menuGroups: { type: Object, default: () => ({}) },
})

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style scoped>
.sidebar {
  background: #0f1d33;
  overflow-y: auto;
}
.logo {
  padding: 20px 16px;
  text-align: center;
  border-bottom: 1px solid #234060;
}
.logo h2 {
  color: #66d9ff;
  font-size: 16px;
  margin: 0;
}
.logo small {
  color: #c0d5e8;
  font-size: 11px;
}
.el-menu {
  border-right: none !important;
}
.menu-group-label {
  font-size: 11px;
  color: #8aa0b4;
  padding: 12px 20px 4px;
  letter-spacing: 1px;
}
</style>
