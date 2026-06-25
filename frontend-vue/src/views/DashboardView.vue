<template>
  <div class="dashboard">
    <!-- KPI 卡片 -->
    <el-row :gutter="16" style="margin-bottom:16px">
      <el-col :span="6" v-for="card in kpiCards" :key="card.label">
        <el-card shadow="hover" class="kpi-card">
          <div class="kpi-label">{{ card.label }}</div>
          <div class="kpi-value" :style="{color: card.color}">{{ card.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 实时日志 -->
    <el-card shadow="never" header="实时采集日志" class="log-card">
      <el-table :data="logs" size="small" max-height="280" stripe>
        <el-table-column prop="time" label="时间" width="160" />
        <el-table-column prop="device" label="设备" width="140" />
        <el-table-column prop="point" label="点位" />
        <el-table-column prop="value" label="值" width="120" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{row}">
            <el-tag :type="row.status==='success'?'success':'danger'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getStats, getDevices, getAlarms } from '../api'

const kpiCards = ref([
  { label: '在线设备', value: '0', color: '#4fc3f7', key: 'online_devices' },
  { label: '采集成功率', value: '0%', color: '#66bb6a', key: 'success_rate' },
  { label: '总采集次数', value: '0', color: '#ffc107', key: 'total_collects' },
  { label: '活跃告警', value: '0', color: '#ef5350', key: 'alarms' },
])
const logs = ref([])

let ws = null, timer = null

onMounted(async () => {
  try {
    const [stats, devices, alarms] = await Promise.all([getStats(), getDevices(), getAlarms({ status: 'active' })])
    const s = stats.data
    kpiCards.value[0].value = s?.online_devices || 0
    kpiCards.value[1].value = (s?.success_rate || 0) + '%'
    kpiCards.value[2].value = s?.total_collects || 0
    kpiCards.value[3].value = alarms.data?.total || 0
  } catch {}

  // WebSocket 实时数据
  const proto = location.protocol === 'https:' ? 'wss' : 'ws'
  ws = new WebSocket(`${proto}://${location.host}/ws`)
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data)
    if (msg.type === 'telemetry') {
      msg.data?.forEach(d => {
        logs.value.unshift({ time: new Date().toLocaleTimeString(), device: msg.device_id, point: d.point_name || d.point_id, value: `${d.value} ${d.unit||''}`, status: 'success' })
      })
      if (logs.value.length > 100) logs.value = logs.value.slice(0, 100)
    }
  }

  timer = setInterval(async () => {
    try { const r = await getStats(); const s = r.data; kpiCards.value[0].value = s.online_devices; kpiCards.value[1].value = (s.success_rate||0)+'%'; kpiCards.value[2].value = s.total_collects||0 } catch {}
  }, 5000)
})

onUnmounted(() => { ws?.close(); clearInterval(timer) })
</script>

<style scoped>
.dashboard { color: #c0d5e8; }
.kpi-card { background: #0f1f3a; border: 1px solid #1a3a5c; }
.kpi-label { font-size: 13px; color: #8899aa; margin-bottom: 6px; }
.kpi-value { font-size: 28px; font-weight: bold; }
.log-card { background: #0f1f3a; border: 1px solid #1a3a5c; }
.log-card :deep(.el-card__header) { color: #c0d5e8; border-bottom: 1px solid #1a3a5c; }
.el-table { background: transparent; --el-table-tr-bg-color: #0d1b30; --el-table-header-bg-color: #122540; }
</style>
