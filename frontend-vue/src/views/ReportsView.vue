<template>
  <div class="report-page">
    <h2 class="page-title">📋 数据报表</h2>

    <div class="toolbar">
      <el-radio-group v-model="period" size="small" @change="loadRank">
        <el-radio-button value="daily">日</el-radio-button>
        <el-radio-button value="weekly">周</el-radio-button>
        <el-radio-button value="monthly">月</el-radio-button>
      </el-radio-group>
      <el-select v-model="source" size="small" style="width:160px;margin-left:12px" @change="loadRank">
        <el-option label="全部数据源" value="all" />
        <el-option label="A11 生产网" value="a11" />
        <el-option label="Modbus TCP" value="modbus" />
        <el-option label="OPC DA" value="opc" />
      </el-select>
    </div>

    <el-row :gutter="16" class="cards">
      <el-col :span="6" v-for="c in cards" :key="c.label">
        <div class="r-card">
          <div class="r-val" :style="{color:c.color}">{{ c.value }}</div>
          <div class="r-lbl">{{ c.label }}</div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :span="14">
        <el-card>
          <template #header><span>📈 采集趋势 (近14{{ period==='daily'?'日':period==='weekly'?'周':'月' }})</span></template>
          <div ref="barChart" style="height:300px"></div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card>
          <template #header><span>📊 {{ periodLabel }}</span></template>
          <el-table :data="pagedRank" size="small" stripe>
            <el-table-column type="index" label="#" width="40" />
            <el-table-column prop="device" label="设备" min-width="140" show-overflow-tooltip />
            <el-table-column prop="proto" label="协议" width="80">
              <template #default="{row}">
                <el-tag :type="protoColor(row.proto)" size="small">{{ row.proto }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="采集量" width="130">
              <template #default="{row}">
                <el-progress :percentage="rankMax>0 ? rowVal(row)/rankMax*100 : 0" :stroke-width="12" :show-text="false" />
                <span style="font-size:11px;color:#909399;">{{ rowVal(row).toLocaleString() }} 点</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :page-sizes="[5,10,20]" :total="rankData.length" layout="total,sizes,prev,pager,next" size="small" style="margin-top:8px;justify-content:flex-end" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const period = ref('monthly')
const source = ref('all')
const rankData = ref([])
const barChart = ref(null)
const page = ref(1); const pageSize = ref(10)

const pagedRank = computed(() => {
  const s = (page.value - 1) * pageSize.value
  return rankData.value.slice(s, s + pageSize.value)
})

const cards = ref([
  { label: '累计采集点', value: '8,234,567', color: '#409EFF' },
  { label: '今日采集', value: '45,233', color: '#E6A23C' },
  { label: '活跃设备', value: '271', color: '#67C23A' },
  { label: '存储占用', value: '3.2 GB', color: '#909399' },
])

const periodLabel = computed(() => ({ daily: '今日排行', weekly: '本周排行', monthly: '本月排行' }[period.value]))
const rankMax = computed(() => Math.max(...rankData.value.map(d => rowVal(d)), 1))
const rowVal = (r) => (period.value === 'weekly' ? r.weekly : period.value === 'monthly' ? r.monthly : r.daily) || 0

function protoColor(p) {
  return { A11: 'success', Modbus: 'warning', OPC: '', IEC104: 'danger' }[p] || 'info'
}

const loadRank = () => {
  // 模拟排行数据 — 后续接真实 API
  const base = [
    { device: '\\CY1C8K\\Z611SYWS\\压缩机V301', proto: 'A11', daily: 12500, weekly: 87500, monthly: 375000 },
    { device: '\\CY1C8K\\Z611SYWS\\阀门VC#', proto: 'A11', daily: 10200, weekly: 71400, monthly: 306000 },
    { device: '11.249.61.243 电力仪表#3', proto: 'Modbus', daily: 8900, weekly: 62300, monthly: 267000 },
    { device: '11.248.203.74 RTU-02', proto: 'Modbus', daily: 7600, weekly: 53200, monthly: 228000 },
    { device: '172.23.9.3 RSLinx OPC', proto: 'OPC', daily: 14500, weekly: 101500, monthly: 435000 },
    { device: '172.23.18.194 PLC-S7', proto: 'OPC', daily: 11200, weekly: 78400, monthly: 336000 },
    { device: '\\CY1C8K\\Z612XYGS\\压缩机#1', proto: 'A11', daily: 9800, weekly: 68600, monthly: 294000 },
    { device: '11.249.61.243 电力仪表#7', proto: 'Modbus', daily: 6500, weekly: 45500, monthly: 195000 },
    { device: 'IEC104-RTU-北区', proto: 'IEC104', daily: 4200, weekly: 29400, monthly: 126000 },
    { device: '\\CY1C8K\\Z613FQ\\流量计#2', proto: 'A11', daily: 5500, weekly: 38500, monthly: 165000 },
    { device: '11.248.198.45 RTU-05', proto: 'Modbus', daily: 3800, weekly: 26600, monthly: 114000 },
    { device: 'IEC104-RTU-南区', proto: 'IEC104', daily: 3100, weekly: 21700, monthly: 93000 },
  ]
  rankData.value = base.filter(r => source.value === 'all' || r.proto === ({ a11: 'A11', modbus: 'Modbus', opc: 'OPC' }[source.value]))
  page.value = 1
}

onMounted(async () => {
  loadRank()
  await nextTick()
  if (barChart.value) {
    const c = echarts.init(barChart.value, 'dark')
    c.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['采集点数(万)', '活跃设备'], bottom: 0, textStyle: { color: '#c0c4cc' } },
      grid: { left: 50, right: 50, top: 8, bottom: 40 },
      xAxis: { type: 'category', data: ['06/28', '06/29', '06/30', '07/01', '07/02', '07/03', '07/04', '07/05', '07/06', '07/07', '07/08', '07/09', '07/10', '07/11'], axisLabel: { fontSize: 9, color: '#909399' } },
      yAxis: [
        { type: 'value', name: '万点', axisLabel: { color: '#909399' }, splitLine: { lineStyle: { color: '#2d2e3b' } } },
        { type: 'value', name: '台', axisLabel: { color: '#909399' } },
      ],
      series: [
        { name: '采集点数(万)', type: 'bar', data: [38, 40, 42, 43, 41, 44, 45, 46, 43, 47, 48, 45, 44, 45], itemStyle: { color: '#409EFF', borderRadius: [3, 3, 0, 0] }, barMaxWidth: 16 },
        { name: '活跃设备', type: 'line', yAxisIndex: 1, data: [265, 268, 270, 272, 269, 271, 273, 275, 270, 274, 276, 271, 268, 271], lineStyle: { color: '#67C23A', width: 2 }, itemStyle: { color: '#67C23A' }, symbol: 'circle', symbolSize: 4 },
      ],
    })
  }
})
</script>

<style scoped>
.report-page { padding: 16px; background: #141520; min-height: 100vh }
.page-title { font-size: 18px; font-weight: 600; color: #e0e0e0; margin-bottom: 12px }
.toolbar { display: flex; align-items: center; margin-bottom: 12px }
.cards { margin-bottom: 12px }
.r-card { background: #1d1e2b; border: 1px solid #2d2e3b; border-radius: 8px; padding: 16px; text-align: center }
.r-val { font-size: 24px; font-weight: 700 }
.r-lbl { font-size: 12px; color: #909399; margin-top: 4px }
:deep(.el-card) { background: #1d1e2b; border-color: #2d2e3b; color: #e0e0e0; margin-bottom: 0 }
:deep(.el-card__header) { color: #c0c4cc; border-bottom-color: #2d2e3b; padding: 8px 12px }
:deep(.el-table) { --el-table-bg-color: #1d1e2b; --el-table-tr-bg-color: #1d1e2b; --el-table-header-bg-color: #252636; --el-table-border-color: #2d2e3b; --el-table-text-color: #c0c4cc; font-size: 12px }
:deep(.el-radio-button__inner) { background: #1d1e2b; border-color: #2d2e3b; color: #c0c4cc }
:deep(.el-pagination) { --el-pagination-bg-color: transparent; --el-pagination-text-color: #c0c4cc }
</style>
