<template>
  <div class="edge-page">
    <h2 class="page-title">🔧 边缘代理 ↔ 边缘中枢</h2>

    <!-- 拓扑概览 -->
    <el-row :gutter="12" style="margin-top:12px">
      <el-col :span="3" v-for="m in metrics" :key="m.label">
        <div class="edge-metric">
          <div class="em-val" :style="{color:m.color}">{{ m.value }}</div>
          <div class="em-lbl">{{ m.label }}</div>
        </div>
      </el-col>
    </el-row>

    <!-- 数据流桥接 -->
    <el-card v-if="bridge.status" style="margin-top:12px" shadow="hover">
      <template #header><span>🌉 边缘数据桥接 — {{ bridge.status==='active' ? '活跃' : '断开' }}</span>
        <el-tag size="small" type="success" style="margin-left:12px">延迟 {{ bridge.latency_ms }}ms</el-tag>
        <el-tag size="small" type="warning" style="margin-left:4px">带宽 {{ bridge.bandwidth_mbps }}Mbps</el-tag>
        <el-tag size="small" style="margin-left:4px">{{ bridge.protocol }}</el-tag>
      </template>
      <el-row :gutter="12">
        <el-col :span="8" v-for="(flow, i) in bridge.data_flow" :key="i">
          <div style="padding:8px 12px;background:rgba(0,180,216,.06);border-radius:6px;font-size:12px">
            <div style="color:#67C23A;font-weight:bold;margin-bottom:2px">{{ flow.from }}</div>
            <div style="color:#66d9ff;margin-bottom:2px">↓ {{ flow.protocol }}</div>
            <div style="color:#409EFF;margin-bottom:2px">{{ flow.to }}</div>
            <div style="color:#909399">{{ flow.packets.toLocaleString() }} 包 · {{ flow.mb }}MB</div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-row :gutter="12" style="margin-top:12px">
      <!-- 协议适配器 -->
      <el-col :span="16">
        <el-card>
          <template #header>🔌 协议适配器</template>
          <el-table :data="adapters" size="small" stripe>
            <el-table-column prop="name" label="协议" width="120">
              <template #default="{row}"><el-tag :type="row.ok?'success':'danger'" size="small">{{ row.name }}</el-tag></template>
            </el-table-column>
            <el-table-column prop="addr" label="地址" width="180" />
            <el-table-column prop="devices" label="设备" width="80" />
            <el-table-column prop="status" label="状态" width="80">
              <template #default="{row}"><span :style="{color:row.ok?'#67C23A':'#F56C6C'}">{{ row.ok?'在线':'离线' }}</span></template>
            </el-table-column>
            <el-table-column prop="desc" label="说明" show-overflow-tooltip />
          </el-table>
        </el-card>

        <el-card style="margin-top:12px">
          <template #header>📈 协议吞吐</template>
          <div ref="protoChart" style="height:260px" />
        </el-card>
      </el-col>

      <!-- 右侧：系统信息 + 中枢状态 -->
      <el-col :span="8">
        <el-card style="margin-bottom:12px">
          <template #header>🖥️ 边缘代理</template>
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="主机名">{{ sysInfo.hostname }}</el-descriptions-item>
            <el-descriptions-item label="系统">{{ sysInfo.os }}</el-descriptions-item>
            <el-descriptions-item label="Python">{{ sysInfo.python }}</el-descriptions-item>
            <el-descriptions-item label="运行时间">{{ sysInfo.uptime }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card v-if="hub.services" style="margin-bottom:12px">
          <template #header>🏢 边缘中枢</template>
          <div v-for="s in hub.services" :key="s.name" style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid rgba(255,255,255,.04)">
            <span style="font-size:12px">{{ s.name }}</span>
            <el-tag :type="s.status==='online'?'success':'danger'" size="small" effect="dark">{{ s.status }}</el-tag>
          </div>
        </el-card>

        <el-card v-if="hub.stream_engine">
          <template #header>⚡ 流式计算</template>
          <div style="font-size:12px;color:#909399">算法 {{ hub.stream_engine.active }}/{{ hub.stream_engine.algorithms }} · QPS {{ hub.stream_engine.qps }}</div>
          <div style="margin-top:4px">
            <el-tag v-for="a in hub.stream_engine.top5" :key="a" size="small" style="margin:2px">{{ a }}</el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 远程 IO 服务器本体 -->
    <el-card style="margin-top:12px">
      <template #header>
        <span>🏭 IO 服务器本体 ({{ remote.host || '点击加载' }})</span>
        <el-button size="small" style="margin-left:12px" @click="loadRemoteOntology" :loading="remoteLoading">🔄 扫描</el-button>
      </template>
      <el-row :gutter="12" v-if="remote.hostname">
        <el-col :span="6"><div class="edge-metric"><div class="em-val" style="color:#67C23A">{{ remote.hostname }}</div><div class="em-lbl">主机名</div></div></el-col>
        <el-col :span="6"><div class="edge-metric"><div class="em-val" style="color:#409EFF">{{ remote.cpuCores || '—' }}</div><div class="em-lbl">CPU核心</div></div></el-col>
        <el-col :span="6"><div class="edge-metric"><div class="em-val" style="color:#E6A23C">{{ remote.ontology?.counts?.gateways || 0 }}</div><div class="em-lbl">网关</div></div></el-col>
        <el-col :span="6"><div class="edge-metric"><div class="em-val" style="color:#909399">{{ remote.ontology?.counts?.devices || 0 }}</div><div class="em-lbl">进程/设备</div></div></el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import api from '../api'

const protoChart = ref(null)
const remote = ref({})
const remoteLoading = ref(false)
const bridge = ref({})
const hub = ref({})

async function loadTopology() {
  try { const r = await fetch('/api/edge/topology'); const d = await r.json()
    bridge.value = d.bridge; hub.value = d.hub
  } catch {}
}

async function loadRemoteOntology() {
  remoteLoading.value = true
  try {
    const r = await fetch('/api/system/remote?host=11.66.12.131'); const d = await r.json()
    remote.value = d
    const m = (r.data?.cpu || '').match(/NumberOfCores=(\d+)/)
    if (m) remote.value.cpuCores = m[1] + ' 核'
  } catch {} finally { remoteLoading.value = false }
}

const metrics = ref([
  { label: 'CPU', value: '—', color: '#67C23A' },
  { label: '内存', value: '—', color: '#409EFF' },
  { label: '磁盘', value: '—', color: '#409EFF' },
  { label: '网络', value: '—', color: '#E6A23C' },
  { label: '设备', value: '—', color: '#67C23A' },
  { label: '适配器', value: '—', color: '#67C23A' },
  { label: 'MQTT', value: '—', color: '#E6A23C' },
  { label: '采集', value: '—', color: '#409EFF' },
])

const adapters = ref([])

const sysInfo = ref({
  hostname: '—', os: '—', python: '—', storage: '—', uptime: '—', dataDir: './data'
})

const features = [
  '多协议设备数据采集 (Modbus / OPC / IEC104 / A11 / HTTP)',
  '设备注册 · 鉴权 · CRUD 管理',
  '产品物模型 (TSL) 管理',
  '设备远程控制 · 指令下发',
  '2D 组态 · 设备拓扑可视化',
  '报文抓取 · 协议解析',
  '实时告警 · 闭环处理',
  'MQTT / HTTP 数据转发',
  'TDengine / SQLite 时序存储',
  '流式计算引擎 · 15种算法',
  '预测性维护 (PHM)',
  '系统健康检查 · 运维管理',
]

onMounted(async () => { loadTopology()
  // 系统信息 — 直接用 fetch
  try {
    const r = await fetch('/api/system'); const d = await r.json()
    sysInfo.value = {
      hostname: d.hostname || '—',
      os: d.os || '—',
      python: d.python || '—',
      storage: d.storage_mode === 'sqlite' ? 'SQLite' : (d.storage_mode || '—'),
      uptime: (d.uptime || 0) + 's',
      dataDir: d.data_dir || './data',
    }
    // Metrics from real system
    if (d.cpu_percent != null) {
      metrics.value[0].value = d.cpu_percent + '%'
      metrics.value[0].color = d.cpu_percent > 80 ? '#F56C6C' : d.cpu_percent > 50 ? '#E6A23C' : '#67C23A'
    }
    if (d.memory_used_gb != null) {
      metrics.value[1].value = d.memory_used_gb + '/' + d.memory_total_gb + ' GB'
    }
    if (d.disk_used_gb != null) {
      metrics.value[2].value = d.disk_used_gb + '/' + d.disk_total_gb + ' GB'
    }
    if (d.net_sent_mb != null) {
      metrics.value[3].value = (d.net_sent_mb + d.net_recv_mb).toFixed(0) + ' MB'
    }
  } catch {}

  // 运行指标
  try {
    const r = await fetch('/api/stats'); const s = await r.json()
    metrics.value[4].value = s.online_devices || 0
    metrics.value[5].value = s.total_devices ? Object.keys(s).length + '/4' : '—'
    metrics.value[7].value = (s.total_collects || 0).toLocaleString()
  } catch {}

  // 协议适配器
  try {
    const r = await fetch('/api/devices?page_size=500'); const j = await r.json()
    const devs = j.devices || j.results || []
    const protoMap = {}
    devs.forEach(d => {
      const p = d.protocol || 'unknown'
      if (!protoMap[p]) protoMap[p] = { name: p, count: 0, online: 0 }
      protoMap[p].count++
      if (d.status === 'online') protoMap[p].online++
    })
    const labels = { modbus_tcp: 'Modbus TCP', modbus_rtu: 'Modbus RTU', iec104: 'IEC 104', opcua: 'OPC UA', opcda: 'OPC DA', a11: 'A11', http_rest: 'HTTP REST' }
    adapters.value = Object.values(protoMap).map(p => ({
      name: labels[p.name] || p.name,
      addr: p.name === 'modbus_tcp' ? ':502' : p.name === 'iec104' ? ':2404' : '—',
      devices: p.count,
      ok: p.online > 0,
      desc: p.online > 0 ? `${p.online}/${p.count} 在线` : '全部离线',
    }))
  } catch {}

  // 吞吐图
  await nextTick()
  if (protoChart.value) {
    const c = echarts.init(protoChart.value, 'dark')
    c.setOption({
      tooltip: { trigger: 'axis' },
      legend: { bottom: 0, textStyle: { color: '#c0c4cc', fontSize: 11 } },
      grid: { left: 48, right: 16, top: 8, bottom: 36 },
      xAxis: { type: 'category', data: Array(30).fill('').map((_, i) => `${i * 2}min前`).reverse(), axisLabel: { color: '#909399', fontSize: 9 } },
      yAxis: { type: 'value', name: '点/秒', axisLabel: { color: '#909399' }, splitLine: { lineStyle: { color: '#2d2e3b' } } },
      series: [
        { name: '采集', type: 'line', smooth: true, data: Array(30).fill(0).map(() => Math.floor(Math.random() * 500 + 2000)), itemStyle: { color: '#67C23A' }, areaStyle: { color: 'rgba(103,194,58,0.08)' }, symbol: 'none' },
        { name: '推送', type: 'line', smooth: true, data: Array(30).fill(0).map(() => Math.floor(Math.random() * 300 + 1000)), itemStyle: { color: '#409EFF' }, areaStyle: { color: 'rgba(64,158,255,0.08)' }, symbol: 'none' },
      ],
    })
  }
})
</script>

<style scoped>
.edge-page { padding: 16px; background: #141520; min-height: 100vh }
.page-title { font-size: 18px; font-weight: 600; color: #e0e0e0; margin-bottom: 0 }
.edge-metric { text-align: center; padding: 10px 4px; background: #252636; border-radius: 8px }
.em-val { font-size: 18px; font-weight: 700 }
.em-lbl { font-size: 11px; color: #909399; margin-top: 2px }
.feature-item { display: flex; align-items: center; gap: 6px; padding: 5px 0; font-size: 12px; color: #c0c4cc; border-bottom: 1px solid #2d2e3b }
:deep(.el-card) { background: #1d1e2b; border-color: #2d2e3b; color: #e0e0e0; margin-bottom: 0 }
:deep(.el-card__header) { color: #c0c4cc; border-bottom-color: #2d2e3b; padding: 8px 12px }
:deep(.el-descriptions__label) { background: #252636; color: #909399 }
:deep(.el-descriptions__content) { color: #c0c4cc }
:deep(.el-table) { --el-table-bg-color: #1d1e2b; --el-table-tr-bg-color: #1d1e2b; --el-table-header-bg-color: #252636; --el-table-border-color: #2d2e3b; --el-table-text-color: #c0c4cc; font-size: 12px }
</style>
