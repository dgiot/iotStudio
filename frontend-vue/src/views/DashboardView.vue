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

    <!-- 图表区：采集趋势 + 设备在线率 -->
    <el-row :gutter="16" style="margin-bottom:16px">
      <el-col :span="16">
        <el-card shadow="never" class="chart-card">
          <template #header><span>📈 采集吞吐量趋势 (近1分钟)</span></template>
          <v-chart :option="trendOption" autoresize style="height:260px" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never" class="chart-card">
          <template #header><span>📊 设备协议分布</span></template>
          <v-chart :option="protocolPieOption" autoresize style="height:260px" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 实时采集日志 -->
    <el-card shadow="never" class="log-card">
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span>📋 实时采集日志</span>
          <el-tag size="small" effect="dark" type="success">WebSocket 实时</el-tag>
        </div>
      </template>
      <el-table :data="logs" size="small" max-height="240" stripe>
        <el-table-column prop="time" label="时间" width="140" />
        <el-table-column prop="device" label="设备" width="160" />
        <el-table-column prop="point" label="点位" min-width="140" />
        <el-table-column prop="value" label="值" width="140" />
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
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { getStats, getDevices, getAlarms } from '../api'

const kpiCards = ref([
  { label: '在线设备', value: '0', color: '#4fc3f7', key: 'online_devices' },
  { label: '采集成功率', value: '0%', color: '#66bb6a', key: 'success_rate' },
  { label: '总采集次数', value: '0', color: '#ffc107', key: 'total_collects' },
  { label: '活跃告警', value: '0', color: '#ef5350', key: 'alarms' },
])
const logs = ref([])

// 趋势图数据
const trendTimes = ref(Array.from({length: 30}, (_, i) => `${29-i}s`))
const trendSuccess = ref(Array(30).fill(0))
const trendFail = ref(Array(30).fill(0))

const trendOption = computed(() => ({
  backgroundColor: 'transparent',
  grid: { top: 10, right: 20, bottom: 20, left: 45 },
  tooltip: { trigger: 'axis' },
  legend: { data: ['成功', '失败'], textStyle: { color: '#8899aa' }, top: -5 },
  xAxis: { type: 'category', data: trendTimes.value, axisLine: { lineStyle: { color: '#1a3a5c' } }, axisLabel: { color: '#8899aa', fontSize: 10 } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: '#1a3a5c' } }, axisLabel: { color: '#8899aa' } },
  series: [
    { name: '成功', type: 'line', smooth: true, symbol: 'none', lineStyle: { color: '#66bb6a', width: 2 }, areaStyle: { color: 'rgba(102,187,106,0.1)' }, data: trendSuccess.value },
    { name: '失败', type: 'line', smooth: true, symbol: 'none', lineStyle: { color: '#ef5350', width: 1 }, data: trendFail.value },
  ]
}))

const protocolPieOption = ref({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, textStyle: { color: '#8899aa', fontSize: 11 } },
  series: [{
    type: 'pie', radius: ['55%', '75%'], center: ['50%', '43%'],
    label: { color: '#c0d5e8' },
    data: [
      { value: 0, name: 'Modbus TCP', itemStyle: { color: '#4fc3f7' } },
      { value: 0, name: 'Modbus RTU', itemStyle: { color: '#66bb6a' } },
      { value: 0, name: 'IEC 104', itemStyle: { color: '#ffc107' } },
      { value: 0, name: 'OPC UA', itemStyle: { color: '#ab47bc' } },
    ]
  }]
})

let ws = null, timer = null, trendIdx = 0

onMounted(async () => {
  try {
    const [stats, devices, alarms] = await Promise.all([getStats(), getDevices(), getAlarms({ status: 'active' })])
    const s = stats.data
    kpiCards.value[0].value = s?.online_devices || 0
    kpiCards.value[1].value = (s?.success_rate || 0) + '%'
    kpiCards.value[2].value = s?.total_collects || 0
    kpiCards.value[3].value = alarms.data?.total || 0
    // 协议分布
    const pMap = {}
    ;(devices.data?.devices || []).forEach(d => { pMap[d.protocol] = (pMap[d.protocol] || 0) + 1 })
    protocolPieOption.value.series[0].data.forEach(d => { d.value = pMap[d.name] || 0 })
  } catch {}

  const proto = location.protocol === 'https:' ? 'wss' : 'ws'
  ws = new WebSocket(`${proto}://${location.host}/ws`)
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data)
    if (msg.type === 'telemetry') {
      msg.data?.forEach(d => {
        logs.value.unshift({ time: new Date().toLocaleTimeString(), device: msg.device_id, point: d.point_name || d.point_id, value: `${d.value} ${d.unit||''}`, status: 'success' })
      })
      if (logs.value.length > 100) logs.value = logs.value.slice(0, 100)
      trendSuccess.value[trendIdx] = (trendSuccess.value[trendIdx] || 0) + (msg.data?.length || 0)
    }
  }

  timer = setInterval(async () => {
    try {
      const r = await getStats(); const s = r.data
      kpiCards.value[0].value = s.online_devices
      kpiCards.value[1].value = (s.success_rate||0)+'%'
      kpiCards.value[2].value = s.total_collects||0
      // 趋势滑动
      trendIdx = (trendIdx + 1) % 30
      trendSuccess.value[trendIdx] = Math.max(0, (s.total_collects||0) - (parseInt(kpiCards.value[2].value) || 0))
      trendFail.value[trendIdx] = 0
    } catch {}
  }, 3000)
})

onUnmounted(() => { ws?.close(); clearInterval(timer) })
</script>

<script>
import { computed } from 'vue'
</script>

<style scoped>
.dashboard { color: #c0d5e8; }
.kpi-card { background: #0f1f3a; border: 1px solid #1a3a5c; }
.kpi-label { font-size: 13px; color: #8899aa; margin-bottom: 6px; }
.kpi-value { font-size: 28px; font-weight: bold; }
.chart-card { background: #0f1f3a; border: 1px solid #1a3a5c; }
.chart-card :deep(.el-card__header) { color: #c0d5e8; border-bottom: 1px solid #1a3a5c; padding: 10px 16px; font-size: 13px; }
.log-card { background: #0f1f3a; border: 1px solid #1a3a5c; }
.log-card :deep(.el-card__header) { color: #c0d5e8; border-bottom: 1px solid #1a3a5c; padding: 10px 16px; }
.el-table { background: transparent; --el-table-tr-bg-color: #0d1b30; --el-table-header-bg-color: #122540; }
</style>
