<template>
  <el-card class="vch-card" :class="{active:expanded}" shadow="hover">
    <!-- 卡片头部 -->
    <div class="vch-header" @click="expanded=!expanded">
      <span class="vch-icon">{{ ch.icon }}</span>
      <div class="vch-main">
        <div class="vch-name">{{ ch.name }}</div>
        <div class="vch-source">{{ ch.source }}</div>
      </div>
      <el-tag :type="statusType" size="small" effect="dark">{{ ch.connected ? '已连接' : '待接入' }}</el-tag>
      <span class="vch-expand">{{ expanded ? '▲' : '▼' }}</span>
    </div>

    <!-- 卡片详情 -->
    <div v-if="expanded" class="vch-detail">
      <el-row :gutter="12" class="vch-kpi-row">
        <el-col :span="6">
          <div class="vch-kpi"><div class="vk-val" style="color:#67C23A">{{ ch.devices }}</div><div class="vk-lbl">接入设备</div></div>
        </el-col>
        <el-col :span="6">
          <div class="vch-kpi"><div class="vk-val" style="color:#409EFF">{{ ch.points }}</div><div class="vk-lbl">采集测点</div></div>
        </el-col>
        <el-col :span="6">
          <div class="vch-kpi"><div class="vk-val" style="color:#909399">{{ ch.lastSync || '—' }}</div><div class="vk-lbl">最后同步</div></div>
        </el-col>
        <el-col :span="6">
          <div class="vch-kpi"><div class="vk-val" style="color:#E6A23C">{{ ch.interval || '—' }}</div><div class="vk-lbl">采集间隔</div></div>
        </el-col>
      </el-row>

      <div class="vch-status-line">
        <span>状态：<b :style="{color:ch.connected?'#67C23A':'#F56C6C'}">{{ ch.connected ? '已同步' : '未同步' }}</b></span>
        <span style="margin-left:16px">{{ ch.desc }}</span>
      </div>

      <!-- 关联设备 -->
      <div class="vch-devices" v-if="ch.relatedDevices?.length">
        <div class="vch-section-title">关联设备</div>
        <div v-for="d in ch.relatedDevices" :key="d.id" class="vch-dev-row">
          <span>{{ d.name }}</span>
          <el-tag :type="d.status==='online'?'success':'info'" size="small">{{ d.status==='online'?'在线':'离线' }}</el-tag>
        </div>
      </div>

      <!-- 操作 -->
      <div class="vch-actions">
        <el-button size="small" @click="$emit('sync', ch.key)">🔄 同步</el-button>
        <el-button size="small" @click="$emit('config', ch.key)">⚙️ 配置</el-button>
        <el-button size="small" type="primary" @click="$emit('view', ch.key)">📋 查看数据</el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  ch: { type: Object, required: true }
})

defineEmits(['sync', 'config', 'view'])

const expanded = ref(false)

const statusType = computed(() => {
  if (props.ch.connected) return 'success'
  return 'warning'
})
</script>

<style scoped>
.vch-card { margin-bottom: 10px; cursor: pointer; border: 1px solid #2d2e3b; transition: all 0.2s }
.vch-card.active { border-color: #409EFF }
.vch-header { display: flex; align-items: center; gap: 12px }
.vch-icon { font-size: 24px; width: 36px; text-align: center }
.vch-main { flex: 1 }
.vch-name { font-size: 14px; font-weight: 600; color: #e0e0e0 }
.vch-source { font-size: 11px; color: #909399; margin-top: 2px }
.vch-expand { color: #909399; font-size: 12px }
.vch-detail { margin-top: 12px; padding-top: 12px; border-top: 1px solid #2d2e3b }
.vch-kpi-row { margin-bottom: 10px }
.vch-kpi { text-align: center; padding: 8px; background: #252636; border-radius: 6px }
.vk-val { font-size: 20px; font-weight: 700 }
.vk-lbl { font-size: 11px; color: #909399; margin-top: 2px }
.vch-status-line { font-size: 12px; color: #909399; padding: 6px 0; border-top: 1px solid #2d2e3b; border-bottom: 1px solid #2d2e3b; margin-bottom: 8px }
.vch-section-title { font-size: 12px; color: #909399; font-weight: 600; margin: 8px 0 4px }
.vch-dev-row { display: flex; justify-content: space-between; align-items: center; padding: 5px 8px; background: #252636; border-radius: 4px; margin: 4px 0; font-size: 12px; color: #c0c4cc }
.vch-actions { display: flex; gap: 8px; margin-top: 10px }
</style>
