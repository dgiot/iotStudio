<template>
  <div class="maint-page">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h3 style="color:#c0d5e8;margin:0">🔧 运维监控</h3>
      <div style="display:flex;gap:8px;align-items:center">
        <el-select v-model="deviceFilter" size="small" style="width:160px" clearable placeholder="筛选设备">
          <el-option v-for="d in devices" :key="d.device_id" :label="d.device_name" :value="d.device_id"/>
        </el-select>
        <el-button size="small" :type="autoRefresh?'success':'info'" @click="autoRefresh=!autoRefresh">{{ autoRefresh?'🔄 自动':'▶️ 手动' }}</el-button>
        <span style="font-size:13px;color:#c0d5e8">
          正常: <b style="color:#66bb6a">{{ normalCount }}</b>
          告警: <b style="color:#ef5350">{{ alarmCount }}</b>
        </span>
      </div>
    </div>

    <!-- KPI 卡片 -->
    <el-row :gutter="12" style="margin-bottom:12px">
      <el-col :span="6" v-for="c in statusCards" :key="c.label">
        <el-card shadow="hover" class="st-card">
          <div class="st-label">{{ c.label }}</div>
          <div class="st-val" :style="{color:c.color}">{{ c.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 趋势图 -->
    <el-card shadow="never" class="sec-card" style="margin-bottom:12px" v-if="trendData.length">
      <template #header><span>📈 采集趋势 (最近30点)</span></template>
      <div ref="chartDom" style="height:240px"></div>
    </el-card>

    <el-row :gutter="12">
      <!-- 参数表格 -->
      <el-col :span="14">
        <el-card shadow="never" class="sec-card">
          <template #header><span>📋 实时参数 · {{ filteredParams.length }} 条</span></template>
          <el-table :data="filteredParams" size="small" max-height="400" stripe>
            <el-table-column prop="device_name" label="设备" width="120" />
            <el-table-column prop="point_name" label="参数" min-width="100" />
            <el-table-column prop="value" label="当前值" width="90" align="right">
              <template #default="{row}">
                <span :style="{color: inRange(row)?'#66bb6a':'#ef5350',fontWeight:600}">{{ row.value }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="unit" label="单位" width="60" />
            <el-table-column label="阈值范围" width="140">
              <template #default="{row}">
                <span v-if="row.alarm_low || row.alarm_high">{{ row.alarm_low || '--' }} ~ {{ row.alarm_high || '--' }}</span>
                <span v-else style="color:#c0d5e8">未设置</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="80" align="center">
              <template #default="{row}">
                <el-tag v-if="!row.alarm_high && !row.alarm_low" size="small" type="info">--</el-tag>
                <el-tag v-else :type="inRange(row)?'success':'danger'" size="small">{{ inRange(row)?'正常':'⚠ 偏离' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="ts" label="时间" width="100" />
          </el-table>
        </el-card>
      </el-col>

      <!-- 服务状态 + 日志 -->
      <el-col :span="10">
        <el-card shadow="never" class="sec-card" style="margin-bottom:12px">
          <template #header><span>服务状态</span></template>
          <div v-for="s in services" :key="s.name" class="svc-row">
            <span :style="{color:s.online?'#66bb6a':'#ef5350'}">●</span>
            <span class="svc-name">{{ s.name }}</span>
            <span class="svc-host">{{ s.host }}</span>
            <el-tag :type="s.online?'success':'danger'" size="small">{{ s.online?'运行':'离线' }}</el-tag>
          </div>
        </el-card>

        <el-card shadow="never" class="sec-card">
          <template #header><span>数据库</span></template>
          <el-descriptions :column="1" size="small" border>
            <el-descriptions-item label="SQLite">{{ sqliteStatus }}</el-descriptions-item>
            <el-descriptions-item label="遥测记录">{{ telemetryRows }} 条</el-descriptions-item>
            <el-descriptions-item label="PostgreSQL">未连接 (SQLite 降级)</el-descriptions-item>
            <el-descriptions-item label="TDengine">未连接 (无可用驱动)</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import axios from 'axios'
import * as echarts from 'echarts'

const statusCards = ref([
  { label:'在线设备', value:'0', color:'#66d9ff' },
  { label:'采集成功率', value:'0%', color:'#66bb6a' },
  { label:'总采集次数', value:'0', color:'#ffc107' },
  { label:'活跃告警', value:'0', color:'#ef5350' },
])

const devices = ref([])
const deviceFilter = ref('')
const autoRefresh = ref(true)
const params = ref([])
const trendData = ref([])
const chartDom = ref(null)
const services = ref([
  { name:'Modbus TCP 逆变器', host:'127.0.0.1:502', online:false },
  { name:'Modbus TCP 储能', host:'127.0.0.1:1502', online:false },
  { name:'Modbus TCP 充电桩', host:'127.0.0.1:2502', online:false },
  { name:'Modbus 电表', host:'127.0.0.1:503', online:false },
  { name:'IEC 104', host:'127.0.0.1:2404', online:false },
  { name:'OPC UA', host:'127.0.0.1:4840', online:false },
  { name:'OPC DA', host:'127.0.0.1:9090', online:false },
])
const sqliteStatus = ref('正常 (data/telemetry.db)')
const telemetryRows = ref(0)
let timer = null, chart = null

const filteredParams = computed(() => {
  let data = params.value
  if (deviceFilter.value) data = data.filter(p => p.device_id === deviceFilter.value)
  return data
})
const normalCount = computed(() => filteredParams.value.filter(p => inRange(p)).length)
const alarmCount = computed(() => filteredParams.value.filter(p => !inRange(p) && (p.alarm_high||p.alarm_low)).length)

function inRange(p) {
  if (!p.alarm_high && !p.alarm_low) return true
  if (p.alarm_high && p.value > p.alarm_high) return false
  if (p.alarm_low && p.value < p.alarm_low) return false
  return true
}

async function loadAll() {
  try {
    const [stats, alarms, sims, devs] = await Promise.all([
      axios.get('/api/stats'), axios.get('/api/alarms?status=active'),
      axios.get('/api/simulators/status'), axios.get('/api/devices')
    ])
    const s = stats.data
    statusCards.value[0].value = s.online_devices||0
    statusCards.value[1].value = (s.success_rate||0)+'%'
    statusCards.value[2].value = s.total_collects||0
    statusCards.value[3].value = alarms.data.total||0

    // 更新服务状态
    ;(sims.data.simulators||[]).forEach(s => {
      const svc = services.value.find(v => v.host.endsWith(':'+s.port))
      if (svc) svc.online = s.status === 'running'
    })

    devices.value = devs.data.devices || []

    // 加载最新遥测数据
    const paramList = []
    for (const d of devices.value.slice(0,6)) {
      try {
        const r = await axios.get(`/api/telemetry/${d.device_id}/latest`)
        const pts = r.data.data || []
        // 同时获取点位阈值
        const r2 = await axios.get(`/api/devices/${d.device_id}/points`)
        const pMap = {}; (r2.data.points||[]).forEach(p => pMap[p.point_id] = p)
        pts.forEach(pt => {
          const cfg = pMap[pt.point_id] || {}
          paramList.push({
            device_id: d.device_id, device_name: d.device_name,
            point_name: pt.point_id, value: pt.value,
            unit: cfg.unit || '', alarm_high: cfg.alarm_high, alarm_low: cfg.alarm_low,
            ts: pt.ts ? new Date(pt.ts).toLocaleTimeString() : '--'
          })
        })
      } catch {}
    }
    params.value = paramList
    if (paramList.length) trendData.value = paramList
  } catch {}
}

function renderChart() {
  if (!chartDom.value || !trendData.value.length) return
  if (!chart) chart = echarts.init(chartDom.value)
  const times = trendData.value.map((_,i) => `-${trendData.value.length-i}`)
  const groups = {}
  trendData.value.forEach(p => {
    const key = `${p.device_name}.${p.point_name}`
    if (!groups[key]) groups[key] = { name: key, data: [] }
    groups[key].data.push(p.value)
  })
  chart.setOption({
    tooltip:{trigger:'axis'}, legend:{data:Object.keys(groups).slice(0,6), textStyle:{color:'#c0d5e8',fontSize:10}, bottom:0},
    grid:{top:10,right:20,bottom:30,left:45},
    xAxis:{type:'category',data:times,axisLabel:{color:'#c0d5e8',fontSize:9}},
    yAxis:{type:'value',splitLine:{lineStyle:{color:'#2a4870'}}},
    series: Object.values(groups).slice(0,6).map(g => ({name:g.name,type:'line',smooth:true,symbol:'none',data:g.data,lineStyle:{width:2}}))
  })
}

watch(trendData, () => nextTick(renderChart))
onMounted(() => { loadAll(); nextTick(renderChart); timer = setInterval(loadAll, autoRefresh?8000:60000) })
onUnmounted(() => { clearInterval(timer); chart?.dispose() })
</script>

<style scoped>
.maint-page { color: #c0d5e8; }
.st-card { background: #162844; border: 1px solid #234060; }
.st-label { font-size: 12px; color: #c0d5e8; margin-bottom: 4px; }
.st-val { font-size: 24px; font-weight: bold; }
.sec-card { background: #162844; border: 1px solid #234060; }
.sec-card :deep(.el-card__header) { color: #c0d5e8; border-bottom: 1px solid #234060; padding: 8px 14px; font-size: 13px; }
.el-table { background: transparent !important; --el-table-tr-bg-color: #162844; --el-table-header-bg-color: #1a3050; }
.svc-row { display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid #234060; font-size: 13px; }
.svc-name { flex: 1; }
.svc-host { color: #c0d5e8; font-size: 11px; font-family: monospace; }
.el-descriptions { --el-descriptions-item-bordered-label-background: rgba(255,255,255,0.03); }
</style>
