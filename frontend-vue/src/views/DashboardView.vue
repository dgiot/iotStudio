<template>
  <div class="dashboard">
    <!-- 顶部告警条 -->
    <el-alert v-if="activeAlarms" :title="`${activeAlarms} 条活跃告警`" type="warning" show-icon :closable="false" style="margin-bottom:12px" />

    <!-- KPI 卡片 -->
    <el-row :gutter="12">
      <el-col :span="4" v-for="card in kpiCards" :key="card.label">
        <el-card shadow="hover" class="kpi-card">
          <div class="kpi-icon">{{ card.icon }}</div>
          <div class="kpi-value" :style="{color:card.color}">{{ card.value }}</div>
          <div class="kpi-label">{{ card.label }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表行1 -->
    <el-row :gutter="12" style="margin-top:12px">
      <el-col :span="12">
        <el-card class="chart-card"><template #header>📈 采集趋势 (近1小时)</template><div ref="trendChart" style="height:250px" /></el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="chart-card"><template #header>🥧 协议分布</template><div ref="protoChart" style="height:250px" /></el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="chart-card"><template #header>⚠️ 告警等级</template><div ref="alarmChart" style="height:250px" /></el-card>
      </el-col>
    </el-row>

    <!-- 图表行2 -->
    <el-row :gutter="12" style="margin-top:12px">
      <el-col :span="12">
        <el-card class="chart-card"><template #header>📋 实时采集日志</template>
          <el-table :data="logs" size="small" max-height="240" stripe>
            <el-table-column prop="time" label="时间" width="90" />
            <el-table-column prop="device" label="设备" width="120" show-overflow-tooltip />
            <el-table-column prop="point" label="测点" width="100" />
            <el-table-column prop="value" label="值" width="80" align="right"><template #default="{row}"><b :style="{color:row.color}">{{ row.value }}</b></template></el-table-column>
            <el-table-column prop="protocol" label="协议" width="90" />
            <el-table-column prop="status" label="状态" width="70"><template #default="{row}"><el-tag :type="row.ok?'success':'danger'" size="small" effect="dark">{{ row.ok?'成功':'失败' }}</el-tag></template></el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card"><template #header>⚠️ 最近告警</template>
          <el-table :data="recentAlarms" size="small" max-height="240">
            <el-table-column prop="level" label="级别" width="70"><template #default="{row}"><el-tag :type="row.level==='P0'?'danger':row.level==='P1'?'warning':'info'" size="small" effect="dark">{{ row.level }}</el-tag></template></el-table-column>
            <el-table-column prop="device" label="设备" width="100" show-overflow-tooltip />
            <el-table-column prop="msg" label="告警内容" min-width="200" show-overflow-tooltip />
            <el-table-column prop="time" label="时间" width="90" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import api from '../api'
import { PROTOCOL_COLORS } from '../utils/constants'

const kpiCards = ref([
  { icon:'🟢', label:'在线设备', value:'0', color:'#66bb6a', key:'online' },
  { icon:'📤', label:'总采集次数', value:'0', color:'#66d9ff', key:'collects' },
  { icon:'✅', label:'成功率', value:'0%', color:'#ffa726', key:'rate' },
  { icon:'⚠️', label:'活跃告警', value:'0', color:'#ef5350', key:'alarms' },
  { icon:'📡', label:'MQTT状态', value:'运行中', color:'#66bb6a', key:'mqtt' },
  { icon:'⏱️', label:'运行时间', value:'0s', color:'#ab47bc', key:'uptime' },
])
const logs = ref([])
const recentAlarms = ref([])
const activeAlarms = ref(0)
const trendChart=ref(null), protoChart=ref(null), alarmChart=ref(null)
let charts=[], timer=null, trendData=[[],[]], trendTimes=[]

// 从遥测数据拉实时日志
async function fetchLogs() {
  const devices = [
    { did:'oilwell_0001', pid:'oil_pressure', name:'葡2-27向2油压', proto:'modbus_tcp' },
    { did:'comp_01', pid:'vibration', name:'压缩机-1振动', proto:'modbus_tcp' },
    { did:'inv_01', pid:'power_output', name:'逆变器-1功率', proto:'modbus_tcp' },
    { did:'pcs_01', pid:'soc', name:'PCS-1荷电', proto:'modbus_tcp' },
  ]
  const items = []
  for (const d of devices) {
    try {
      const r = await api.get(`/telemetry/${d.did}/${d.pid}`, { params: { limit: 1 } })
      const row = r.data?.data?.[0]
      if (row) items.push({ time: (row.ts||'').slice(11,19), device: d.name, point: d.name.slice(-4), value: row.value?.toFixed(1)||'—', protocol: d.proto, ok: true, color: '#66bb6a' })
    } catch {}
  }
  logs.value = items
}

async function refresh() {
  try {
    const [sr, dr, ar] = await Promise.all([api.get('/stats'), api.get('/devices',{params:{page_size:200}}), api.get('/alarms',{params:{status:'active'}})])
    const s=sr.data, devs=dr.data.results||dr.data.devices||[], alarms=ar.data.alarms||ar.data.results||[]
    const kpiMap = {
      online:   s.online_devices||s.total_devices||devs.filter(d=>d.status==='online').length||0,
      collects: s.total_collects||s.pipeline_points||0,
      rate:     (s.success_rate||100)+'%',
      alarms:   alarms.length,
      mqtt:     s.pipeline_running?'运行中':'等待',
      uptime:   (s.uptime_seconds||0)+'s',
    }
    kpiCards.value.forEach(card => { if (card.key in kpiMap) card.value = kpiMap[card.key] })
    activeAlarms.value = alarms.length
    recentAlarms.value = alarms.slice(0,8).map(a=>({level:a.alarm_level||a.severity,device:a.device_id||a.device_type,msg:a.alarm_msg||a.message,time:(a.created_at||a.createdAt||'').slice(11,19)}))

    updateProtoChart(devs)
    updateAlarmChart(alarms)
    updateTrendFromStats(s)
    fetchLogs()
  } catch {}
}

function initCharts() {
  if (trendChart.value) {
    const c=echarts.init(trendChart.value); charts.push(c)
    c.setOption({tooltip:{trigger:'axis'},legend:{data:['成功','失败'],bottom:0,textStyle:{color:'#c0d5e8'}},xAxis:{type:'category',data:Array(60).fill(''),axisLabel:{color:'#8aa0b4',fontSize:9}},yAxis:{type:'value',splitLine:{lineStyle:{color:'#234060'}}},series:[{name:'成功',type:'line',smooth:true,symbol:'none',lineStyle:{color:'#66bb6a',width:2},areaStyle:{color:'rgba(102,187,106,0.1)'},data:Array(60).fill(0)},{name:'失败',type:'line',smooth:true,symbol:'none',lineStyle:{color:'#ef5350',width:1},data:Array(60).fill(0)}]})
  }
  if (protoChart.value) {
    const c=echarts.init(protoChart.value); charts.push(c)
    c.setOption({tooltip:{trigger:'item'},series:[{type:'pie',radius:['45%','75%'],label:{color:'#c0d5e8',fontSize:10},data:[]}]})
  }
  if (alarmChart.value) {
    const c=echarts.init(alarmChart.value); charts.push(c)
    c.setOption({tooltip:{trigger:'item'},series:[{type:'pie',radius:'60%',label:{color:'#c0d5e8'},data:[]}]})
  }
}

function updateProtoChart(devs) {
  const c = charts[1]; if (!c) return
  const counts = {}
  devs.forEach(d => { const p = d.protocol || '其他'; counts[p] = (counts[p] || 0) + 1 })
  c.setOption({series:[{data:Object.entries(counts).map(([k,v])=>({name:k,value:v,itemStyle:{color:PROTOCOL_COLORS[k]||'#8aa0b4'}}))}]})
}

function updateAlarmChart(alarms) {
  const c = charts[2]; if (!c) return
  const dist = {}
  alarms.forEach(a => { const l = a.alarm_level || 'P2'; dist[l] = (dist[l] || 0) + 1 })
  c.setOption({series:[{data:Object.entries(dist).map(([k,v]) => ({name:k,value:v,itemStyle:{color:k==='P0'?'#ef5350':k==='P1'?'#ff9800':'#409eff'}}))}]})
}

function updateTrendFromStats(s) {
  const c = charts[0]; if (!c) return
  const t = new Date().toLocaleTimeString()
  trendTimes.push(t); if (trendTimes.length > 60) trendTimes.shift()
  const succ = s.total_success || 0, fail = s.total_fail || 0
  trendData[0].push(succ); trendData[1].push(fail)
  if (trendData[0].length > 60) { trendData[0].shift(); trendData[1].shift() }
  c.setOption({xAxis:{data:trendTimes},series:[{data:trendData[0]},{data:trendData[1]}]})
}

onMounted(async ()=>{ await nextTick(); initCharts(); refresh(); timer=setInterval(refresh,10000) })
onUnmounted(()=>{ clearInterval(timer); charts.forEach(c=>c.dispose()) })
</script>

<style scoped>
.dashboard { color: #c0d5e8; }
.kpi-card { text-align: center; padding: 4px 0; }
.kpi-icon { font-size: 28px; margin-bottom: 2px; }
.kpi-value { font-size: 28px; font-weight: bold; }
.kpi-label { font-size: 12px; color: #8aa0b4; margin-top: 2px; }
.chart-card { margin-bottom: 0; }
</style>
