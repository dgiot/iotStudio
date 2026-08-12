<!--
  Navbar — 对齐 iotView src/layout/components/Navbar.vue
  顶栏: 面包屑 + 租户选择 + 通知 + 健康状态 + 用户下拉
-->
<template>
  <el-header class="topbar">
    <div class="topbar-left">
      <span class="breadcrumb-title">{{ title }}</span>
    </div>
    <div class="topbar-right">
      <!-- 租户选择 -->
      <el-select
        v-if="tenants.length"
        :model-value="currentTenant"
        size="small"
        style="width:140px"
        @change="$emit('switch-tenant', $event)"
        popper-class="tenant-popper"
      >
        <el-option v-for="t in tenants" :key="t.tenant_id" :label="t.name" :value="t.tenant_id" />
      </el-select>

      <NotifyBell />

      <el-tag :type="healthStatus === 'ok' ? 'success' : 'danger'" size="small" effect="dark">
        {{ healthStatus === 'ok' ? '系统正常' : '异常' }}
      </el-tag>

      <span class="device-count">{{ onlineDevices }} 设备在线</span>

      <el-dropdown trigger="click" style="margin-left:12px">
        <span class="user-info">
          <el-icon><UserFilled /></el-icon> {{ userName }}
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item disabled>{{ userRole }}</el-dropdown-item>
            <el-dropdown-item divided @click="$emit('logout')">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup>
defineProps({
  title:       { type: String, default: '' },
  userName:    { type: String, default: '' },
  userRole:    { type: String, default: '' },
  healthStatus:{ type: String, default: 'loading' },
  onlineDevices:{ type: [String, Number], default: 0 },
  tenants:     { type: Array, default: () => [] },
  currentTenant:{ type: String, default: 'default' },
})

defineEmits(['switch-tenant', 'logout'])
</script>

<style scoped>
.topbar {
  background: #0f1d33;
  border-bottom: 1px solid #234060;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 20px;
}
.topbar-left {
  color: #d8e4f0;
  font-size: 16px;
  font-weight: bold;
}
.breadcrumb-title {
  color: #d8e4f0;
}
.topbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.device-count {
  margin-left: 4px;
  color: #b0c8d8;
  font-size: 13px;
}
.user-info {
  color: #66d9ff;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
