<!--
  GraphAnalysisView — 图谱分析 (R3: 最短路径 / 影响半径 blast-radius / 中心性)
  后端: /api/graphrag/aip/graph/{path,impact,centrality}
-->
<template>
  <div class="gav">
    <div class="topbar">
      <h3 class="title">🕸️ 图谱分析</h3>
      <div class="topbar-right">
        <el-select v-model="activeTab" size="small" style="width:130px" @change="onTab">
          <el-option label="最短路径" value="path" />
          <el-option label="影响半径" value="impact" />
          <el-option label="中心性" value="centrality" />
        </el-select>
        <el-tag size="small" effect="plain">{{ entityTotal }} 实体</el-tag>
      </div>
    </div>

    <!-- ═══ 路径 ═══ -->
    <el-card v-show="activeTab === 'path'" shadow="never" class="panel">
      <div class="form-row">
        <el-select v-model="pathFrom" filterable placeholder="起点实体" class="ent-select">
          <el-option v-for="e in entities" :key="e.id" :label="`${e.name} (${e.id})`" :value="e.id" />
        </el-select>
        <span class="arrow">→</span>
        <el-select v-model="pathTo" filterable placeholder="终点实体" class="ent-select">
          <el-option v-for="e in entities" :key="e.id" :label="`${e.name} (${e.id})`" :value="e.id" />
        </el-select>
        <el-button type="primary" :loading="pathLoading" @click="runPath">查询路径</el-button>
      </div>

      <el-alert v-if="pathResult && !pathResult.found" type="warning" :closable="false"
                :title="pathResult.message || '不连通'" style="margin-top:12px" />

      <div v-if="pathResult && pathResult.found" class="path-result">
        <div class="path-meta">
          长度 <b>{{ pathResult.length }}</b> 跳 · 共 {{ pathResult.paths.length }} 条等长路径
          <el-select v-model="pathIdx" size="small" style="width:110px;margin-left:12px"
                     @change="drawPathGraph">
            <el-option v-for="(p, i) in pathResult.paths" :key="i" :label="`路径 ${i + 1}`" :value="i" />
          </el-select>
        </div>
        <div ref="pathChartEl" class="chart chart-graph" />
        <div class="hop-legend">
          <span v-for="(h, i) in currentPath" :key="i" class="hop">
            <b>{{ h.from }}</b>
            <el-tag size="small" :type="h.kind === 'link' ? 'warning' : 'info'" effect="plain">
              {{ h.relation || '层级' }}
            </el-tag>
          </span>
          <span class="hop"><b>{{ pathResult.to }}</b></span>
        </div>
      </div>
    </el-card>

    <!-- ═══ 影响半径 ═══ -->
    <el-card v-show="activeTab === 'impact'" shadow="never" class="panel">
      <div class="form-row">
        <el-select v-model="impactRoot" filterable placeholder="失效实体" class="ent-select">
          <el-option v-for="e in entities" :key="e.id" :label="`${e.name} (${e.id})`" :value="e.id" />
        </el-select>
        <span class="lbl">衰减</span>
        <el-slider v-model="decay" :min="0.1" :max="0.9" :step="0.1" style="width:140px" />
        <span class="lbl">半径</span>
        <el-input-number v-model="maxRadius" :min="1" :max="8" size="small" style="width:100px" />
        <el-button type="danger" plain :loading="impactLoading" @click="runImpact">计算打击面</el-button>
      </div>

      <div v-if="impactResult" class="impact-result">
        <div class="sev-cards">
          <div v-for="(v, k) in impactResult.summary" :key="k" :class="['sev-card', k]">
            <div class="sv">{{ v }}</div><div class="sl">{{ sevLabel[k] }}</div>
          </div>
          <div class="sev-card total"><div class="sv">{{ impactResult.count }}</div><div class="sl">波及总数</div></div>
        </div>
        <div ref="impactChartEl" class="chart chart-bar" />
        <el-table :data="impactResult.affected" size="small" max-height="360" stripe>
          <el-table-column label="严重度" width="90">
            <template #default="{ row }">
              <el-tag size="small" :type="sevType[row.severity]" effect="dark">{{ row.severity }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="confidence" label="置信" width="80" />
          <el-table-column prop="hops" label="跳数" width="70" />
          <el-table-column prop="id" label="实体" width="160" show-overflow-tooltip />
          <el-table-column prop="name" label="名称" width="140" show-overflow-tooltip />
          <el-table-column label="传播链">
            <template #default="{ row }">
              <span class="chain">{{ row.path.map(p => p.relation || '层级').join(' → ') }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- ═══ 中心性 ═══ -->
    <el-card v-show="activeTab === 'centrality'" shadow="never" class="panel">
      <div class="form-row">
        <el-radio-group v-model="centMode" size="small" @change="runCentrality">
          <el-radio-button value="degree">度中心性</el-radio-button>
          <el-radio-button value="betweenness">介数中心性 (Brandes)</el-radio-button>
        </el-radio-group>
        <el-button :loading="centLoading" @click="runCentrality">刷新</el-button>
      </div>
      <div ref="centChartEl" class="chart chart-bar" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import api from '../api/graphrag'

const activeTab = ref('path')
const entities = ref([])
const entityTotal = ref(0)

// 路径
const pathFrom = ref('dev_well_DEV_A')
const pathTo = ref('ds_oracle')
const pathLoading = ref(false)
const pathResult = ref(null)
const pathIdx = ref(0)
const pathChartEl = ref(null)
let pathChart = null

// 影响半径
const impactRoot = ref('dev_relay_00')
const decay = ref(0.5)
const maxRadius = ref(4)
const impactLoading = ref(false)
const impactResult = ref(null)
const impactChartEl = ref(null)
let impactChart = null
const sevLabel = { critical: '严重', high: '高', medium: '中', low: '低' }
const sevType = { critical: 'danger', high: 'warning', medium: 'primary', low: 'info' }

// 中心性
const centMode = ref('degree')
const centLoading = ref(false)
const centChartEl = ref(null)
let centChart = null

const currentPath = () => pathResult.value?.paths?.[pathIdx.value] || []

async function loadEntities() {
  try {
    const r = await api.aipObjects({ limit: 200 })
    entities.value = (r.objects || []).filter(e => e.layer !== 'constraint')
    entityTotal.value = r.total ?? entities.value.length
  } catch { ElMessage.error('实体清单加载失败') }
}

function renderGraph(el, chartRef, nodes, edges, highlight) {
  if (!chartRef.value) return null
  const chart = chartRef.value && (chartRef.value.__chart || echarts.init(chartRef.value))
  chartRef.value.__chart = chart
  chart.setOption({
    tooltip: {},
    series: [{
      type: 'graph', layout: 'force', roam: true,
      force: { repulsion: 320, edgeLength: 90 },
      label: { show: true, fontSize: 11, color: '#dfe7ee' },
      data: nodes.map(n => ({
        id: n.id, name: n.name || n.id,
        symbolSize: n.size || 34,
        itemStyle: highlight && highlight.nodes?.includes(n.id)
          ? { color: '#f56c6c', borderColor: '#fff', borderWidth: 2 }
          : { color: n.color || '#4a7fb5' },
      })),
      links: edges.map(e => ({
        source: e.from, target: e.to,
        lineStyle: {
          color: highlight && highlight.edgeIdx === e.idx ? '#ffb02e' : '#5a708a',
          width: highlight && highlight.edgeIdx === e.idx ? 3.5 : 1.5,
        },
        label: { show: !!highlight, formatter: e.label || '', fontSize: 10, color: '#ffb02e' },
      })),
    }],
  }, true)
  return chart
}

async function runPath() {
  if (!pathFrom.value || !pathTo.value) return ElMessage.warning('选择起终点')
  pathLoading.value = true
  try {
    const r = await api.graphPath(pathFrom.value, pathTo.value)
    pathResult.value = r
    pathIdx.value = 0
    if (r.found) {
      await nextTick()
      drawPathGraph()
    }
  } catch (e) {
    ElMessage.error(e.response?.data?.detail || '路径查询失败')
  } finally { pathLoading.value = false }
}

function drawPathGraph() {
  const p = pathResult.value.paths[pathIdx.value] || []
  const nodeIds = [pathResult.value.from, ...p.map(h => h.to)]
  const nodes = nodeIds.map((id, i) => ({
    id, name: id, size: i === 0 || i === nodeIds.length - 1 ? 44 : 34,
    color: i === 0 ? '#67c23a' : i === nodeIds.length - 1 ? '#e6a23c' : undefined,
  }))
  const edges = p.map(h => ({ from: h.from, to: h.to, label: h.relation || '层级' }))
  renderGraph(pathChartEl, { value: pathChartEl.value }, nodes, edges, { nodes: nodeIds })
}

async function runImpact() {
  if (!impactRoot.value) return ElMessage.warning('选择失效实体')
  impactLoading.value = true
  try {
    const r = await api.graphImpact(impactRoot.value, { decay: decay.value, maxRadius: maxRadius.value })
    impactResult.value = r
    await nextTick()
    drawImpactChart()
  } catch (e) {
    ElMessage.error(e.response?.data?.detail || '影响计算失败')
  } finally { impactLoading.value = false }
}

function drawImpactChart() {
  if (!impactChartEl.value) return
  if (!impactChartEl.value.__chart) impactChartEl.value.__chart = echarts.init(impactChartEl.value)
  const chart = impactChartEl.value.__chart
  const top = impactResult.value.affected.slice(0, 12).reverse()
  const colorOf = s => ({ critical: '#f56c6c', high: '#e6a23c', medium: '#409eff', low: '#909399' }[s])
  chart.setOption({
    grid: { left: 130, right: 40, top: 10, bottom: 24 },
    xAxis: { type: 'value', max: 1, axisLabel: { color: '#8aa0b4' } },
    yAxis: { type: 'category', data: top.map(a => a.id), axisLabel: { color: '#dfe7ee', fontSize: 11 } },
    series: [{
      type: 'bar', barWidth: 14,
      data: top.map(a => ({ value: a.confidence, itemStyle: { color: colorOf(a.severity) } })),
      label: { show: true, position: 'right', formatter: p => p.value.toFixed(2), color: '#dfe7ee' },
    }],
  }, true)
}

async function runCentrality() {
  centLoading.value = true
  try {
    const r = await api.graphCentrality(centMode.value, 12)
    await nextTick()
    if (!centChartEl.value.__chart) centChartEl.value.__chart = echarts.init(centChartEl.value)
    const chart = centChartEl.value.__chart
    const top = [...r.top].reverse()
    chart.setOption({
      title: { text: `${centMode.value === 'degree' ? '度' : '介数'}中心性 Top${r.top.length}`,
               textStyle: { color: '#dfe7ee', fontSize: 13 }, left: 10, top: 4 },
      grid: { left: 140, right: 60, top: 34, bottom: 24 },
      xAxis: { type: 'value', axisLabel: { color: '#8aa0b4' } },
      yAxis: { type: 'category', data: top.map(t => `${t.id} (${t.name})`),
               axisLabel: { color: '#dfe7ee', fontSize: 11 } },
      series: [{ type: 'bar', barWidth: 14, itemStyle: { color: '#4a7fb5' },
                 data: top.map(t => t.score),
                 label: { show: true, position: 'right', color: '#dfe7ee' } }],
    }, true)
  } catch (e) {
    ElMessage.error(e.response?.data?.detail || '中心性查询失败')
  } finally { centLoading.value = false }
}

function onTab(t) {
  nextTick(() => {
    if (t === 'centrality' && !centChartEl.value.__chart) runCentrality()
    if (t === 'path' && pathResult.value?.found) drawPathGraph()
    if (t === 'impact' && impactResult.value) drawImpactChart()
  })
}

onMounted(loadEntities)
</script>

<style scoped>
.gav { padding: 16px; }
.topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.title { margin: 0; font-size: 16px; color: #dfe7ee; }
.topbar-right { display: flex; gap: 10px; align-items: center; }
.panel { background: #16222e; border: 1px solid #24384a; }
.panel :deep(.el-card__body) { padding: 16px; }
.form-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.ent-select { width: 260px; }
.arrow { color: #8aa0b4; font-weight: bold; }
.lbl { color: #8aa0b4; font-size: 12px; }
.chart { width: 100%; height: 340px; margin-top: 12px; }
.chart-graph { background: #0f1720; border-radius: 6px; }
.path-meta { color: #8aa0b4; font-size: 13px; margin-top: 10px; }
.hop-legend { margin-top: 10px; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.hop { color: #dfe7ee; font-size: 13px; display: inline-flex; gap: 4px; align-items: center; }
.sev-cards { display: flex; gap: 10px; margin: 14px 0; }
.sev-card { flex: 1; text-align: center; padding: 10px 0; border-radius: 6px; background: #1d2c3a; }
.sev-card .sv { font-size: 22px; font-weight: bold; }
.sev-card .sl { font-size: 12px; color: #8aa0b4; }
.sev-card.critical .sv { color: #f56c6c; }
.sev-card.high .sv { color: #e6a23c; }
.sev-card.medium .sv { color: #409eff; }
.sev-card.low .sv { color: #909399; }
.sev-card.total { background: #24384a; }
.sev-card.total .sv { color: #dfe7ee; }
.chain { color: #8aa0b4; font-size: 12px; }
</style>
