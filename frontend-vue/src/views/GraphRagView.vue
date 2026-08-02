<template>
  <div class="graphrag-page">
    <!-- ===== 顶部工具栏 ===== -->
    <div class="topbar">
      <h3 class="title">🧠 GraphRAG 知识图谱问答</h3>
      <div class="topbar-right">
        <el-select v-model="mode" size="small" style="width:110px">
          <el-option label="自动路由" value="auto" />
          <el-option label="实体查询" value="entity" />
          <el-option label="社区汇总" value="community" />
        </el-select>
        <el-select v-if="mode === 'community'" v-model="level" size="small" style="width:90px">
          <el-option label="站点" value="site" />
          <el-option label="网关" value="gateway" />
          <el-option label="通道" value="channel" />
        </el-select>
        <el-tag v-if="llmReady" type="success" size="small" effect="dark">🤖 LLM</el-tag>
        <el-tag v-else type="info" size="small" effect="dark">📋 仅上下文</el-tag>
        <span class="stat-txt">实体 {{ entityCount }}</span>
      </div>
    </div>

    <!-- ===== 主内容区 ===== -->
    <div class="main-area">
      <!-- 左侧: 聊天面板 -->
      <div class="chat-panel">
        <div class="messages" ref="msgBox">
          <div v-if="messages.length === 0" class="welcome">
            <div class="welcome-icon">🧠</div>
            <p>基于 5 层本体模型的智能问答</p>
            <div class="hints">
              <span class="hint" @click="quickAsk('K1_51 井的套压安全吗？')">🛢️ K1_51 井的套压安全吗？</span>
              <span class="hint" @click="quickAsk('DSL-31A 的电流正常吗？')">⚡ DSL-31A 的电流正常吗？</span>
              <span class="hint" @click="quickAsk('整体运行态势怎么样？')">📊 整体运行态势怎么样？</span>
              <span class="hint" @click="quickAsk('Modbus TCP 通道下有哪些设备？')">🔌 Modbus TCP 通道下有哪些设备？</span>
            </div>
          </div>

          <div v-for="(m, i) in messages" :key="i" :class="['msg', m.role]">
            <div class="msg-avatar">{{ m.role === 'user' ? '👤' : '🧠' }}</div>
            <div class="msg-body">
              <div class="msg-text">{{ m.text }}</div>

              <!-- 实体卡片 (点击跳转上下文) -->
              <div v-if="m.entity && m.role === 'assistant'" class="entity-card" @click="showContext(m.entity.id)">
                📍 {{ m.entity.name || m.entity.id }}
                <span class="layer-tag">{{ m.entity.layer }}</span>
              </div>

              <!-- 关联实体列表 -->
              <div v-if="m.matched && m.matched.length" class="matched-list">
                <span class="matched-item" v-for="e in m.matched.slice(0, 5)" :key="e.id"
                      @click="showContext(e.id)">{{ e.name }} [{{ e.layer }}]</span>
              </div>

              <div class="msg-time">{{ m.time }}</div>
            </div>
          </div>

          <div v-if="loading" class="msg assistant">
            <div class="msg-avatar">🧠</div>
            <div class="msg-body"><div class="typing"><span></span><span></span><span></span></div></div>
          </div>
        </div>

        <!-- 输入区 -->
        <div class="input-area">
          <el-input v-model="question" placeholder="输入问题，例如：K1_51 井运行正常吗？"
                    @keydown.enter.exact="send" :disabled="loading" clearable size="default">
            <template #append>
              <el-button @click="send" :loading="loading" :icon="Promotion">发送</el-button>
            </template>
          </el-input>
        </div>
      </div>

      <!-- 右侧: 上下文面板 -->
      <div class="context-panel">
        <!-- 实体上下文 -->
        <div v-if="contextEntity" class="ctx-card">
          <div class="ctx-header">
            <span>📍 {{ contextLayer.toUpperCase() }} 上下文</span>
            <el-button link size="small" @click="contextEntity=null">✕</el-button>
          </div>
          <div class="ctx-body">
            <!-- 父链 -->
            <div class="path-chain" v-if="contextData.parent_chain">
              <div class="chain-node" v-for="(p, i) in contextData.parent_chain" :key="i"
                   @click="showContext(p.id)">
                <span class="chain-layer">{{ p.layer }}</span>
                <span class="chain-name">{{ p.name }}</span>
                <span v-if="i < contextData.parent_chain.length-1" class="chain-arrow">▸</span>
              </div>
            </div>

            <!-- 实时数值 -->
            <div v-if="contextData._live" class="ctx-section live-block">
              <div class="ctx-label">📡 实时数据</div>
              <div v-if="contextData._live.value !== undefined" class="live-value-row">
                <span class="live-value" :class="contextData._live.alarm_status">
                  {{ contextData._live.value }} {{ contextData._live.unit || '' }}
                </span>
                <el-tag size="small" :type="alarmTagType(contextData._live.alarm_status)">
                  {{ contextData._live.alarm_status || 'unknown' }}
                </el-tag>
                <span class="live-ts">{{ contextData._live.ts?.slice(0,19) || '' }}</span>
              </div>
              <div v-else-if="contextData._live.points?.length" class="live-points">
                <div v-for="p in contextData._live.points.slice(0,8)" :key="p.point_id" class="live-pt-row">
                  <span class="lp-name">{{ p.point_name }}</span>
                  <span class="lp-val" :class="p.alarm_status">{{ p.value }} {{ p.unit }}</span>
                  <el-tag size="small" :type="alarmTagType(p.alarm_status)">{{ p.alarm_status }}</el-tag>
                </div>
              </div>
            </div>

            <!-- 子节点 -->
            <div v-if="contextData.children?.length" class="ctx-section">
              <div class="ctx-label">子节点 ({{ contextData.children.length }})</div>
              <div class="chip-list">
                <span class="chip" v-for="c in contextData.children" :key="c.id"
                      @click="showContext(c.id)">{{ c.name || c.id }}</span>
              </div>
            </div>

            <!-- 同级 -->
            <div v-if="contextData.siblings?.length" class="ctx-section">
              <div class="ctx-label">同级节点 ({{ contextData.siblings.length }})</div>
              <div class="chip-list">
                <span class="chip" v-for="s in contextData.siblings" :key="s.id"
                      @click="showContext(s.id)">{{ s.name || s.id }}</span>
              </div>
            </div>

            <!-- 约束 -->
            <div v-if="contextData.constraints?.length" class="ctx-section">
              <div class="ctx-label">关联规则 ({{ contextData.constraints.length }})</div>
              <div class="rule-item" v-for="c in contextData.constraints" :key="c.id">
                <el-tag :type="severityColor(c.severity)" size="small" effect="dark">{{ c.severity || 'info' }}</el-tag>
                <span class="rule-name">{{ c.name }}</span>
                <div class="rule-desc">{{ c.rule }}</div>
              </div>
            </div>

            <!-- 趋势图 (point 层) -->
            <div v-if="contextLayer === 'point' && trendData" class="ctx-section">
              <div class="ctx-label">📈 历史趋势 ({{ trendData.hours }}h)
                <span class="trend-dir" :class="trendData.stats?.direction">
                  {{ trendData.stats?.direction === 'up' ? '↑' : trendData.stats?.direction === 'down' ? '↓' : '→' }}
                  {{ trendData.stats?.change_rate ? (trendData.stats.change_rate*100).toFixed(1)+'%' : '' }}
                </span>
                <el-button link size="small" @click="trendData=null">收起</el-button>
              </div>
              <div ref="trendDom" class="trend-svg"></div>
              <div class="trend-stats">
                <span>min:{{ trendData.stats?.min }}</span>
                <span>avg:{{ trendData.stats?.avg }}</span>
                <span>max:{{ trendData.stats?.max }}</span>
                <span v-if="trendData.has_anomaly" style="color:#ef5350">⚠{{ trendData.anomalies.length }}异常</span>
              </div>
            </div>

            <!-- 子图 -->
            <div v-if="subgraphData" class="ctx-section">
              <div class="ctx-label">
                子图 ({{ subgraphData.node_count }} 节点, {{ subgraphData.edge_count }} 边)
                <el-button link size="small" @click="subgraphData=null">收起</el-button>
              </div>
              <div ref="graphDom" class="graph-svg"></div>
            </div>
          </div>
        </div>

        <!-- 社区摘要 -->
        <div v-if="summaryData" class="ctx-card">
          <div class="ctx-header">
            <span>📊 社区摘要</span>
            <el-button link size="small" @click="summaryData=null">✕</el-button>
          </div>
          <div class="ctx-body">
            <div class="summary-text">{{ summaryData.text_summary }}</div>
            <div v-if="summaryData.stats" class="stats-grid">
              <div class="stat-item" v-for="(v, k) in summaryData.stats" :key="k">
                <div class="stat-v">{{ v }}</div>
                <div class="stat-k">{{ k }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="!contextEntity && !summaryData" class="empty-ctx">
          <div class="empty-icon">🔍</div>
          <p>点击回答中的实体卡片<br/>或输入问题开始探索</p>
          <el-divider />
          <div class="mini-stats">
            <div class="ms-item">站点 {{ health?.counts?.sites || 0 }}</div>
            <div class="ms-item">网关 {{ health?.counts?.gateways || 0 }}</div>
            <div class="ms-item">通道 {{ health?.counts?.channels || 0 }}</div>
            <div class="ms-item">设备 {{ health?.counts?.devices || 0 }}</div>
            <div class="ms-item">测点 {{ health?.counts?.points || 0 }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { Promotion } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import graphragApi from '../api/graphrag/index.js'

// ═══════════════════════════════════════════
// 状态
// ═══════════════════════════════════════════
const mode = ref('auto')
const level = ref('site')
const question = ref('')
const messages = ref([])
const loading = ref(false)
const msgBox = ref(null)

// 右侧面板
const contextEntity = ref(null)
const contextLayer = ref('')
const contextData = ref({})
const subgraphData = ref(null)
const summaryData = ref(null)
const trendData = ref(null)
const graphDom = ref(null)
const trendDom = ref(null)
let graphChart = null
let trendChart = null

// 引擎状态
const llmReady = ref(false)
const entityCount = ref('')
const health = ref(null)

// ═══════════════════════════════════════════
// 初始化
// ═══════════════════════════════════════════
onMounted(async () => {
  try {
    const data = await graphragApi.status()
    llmReady.value = data.ready
    health.value = data.engine
    entityCount.value = Object.values(data.engine?.counts || {}).reduce((a, b) => a + b, 0)
  } catch { /* pass */ }
})

onUnmounted(() => { graphChart?.dispose() })

// ═══════════════════════════════════════════
// 发送消息
// ═══════════════════════════════════════════
async function send() {
  const q = question.value.trim()
  if (!q || loading.value) return

  messages.value.push({ role: 'user', text: q, time: now() })
  question.value = ''
  loading.value = true
  scrollBottom()

  try {
    const data = await graphragApi.ask(q, { mode: mode.value, level: level.value })

    const msg = { role: 'assistant', text: data.answer, time: now() }

    // 附带结构化数据
    if (data.entity) {
      msg.entity = data.entity
      // 自动显示上下文
      showContext(data.entity.id)
    }
    if (data.matched_entities?.length) msg.matched = data.matched_entities
    if (data.summary) {
      summaryData.value = data.summary
    }

    messages.value.push(msg)
  } catch (e) {
    messages.value.push({ role: 'assistant', text: `❌ 查询失败: ${e.response?.data?.detail || e.message}`, time: now() })
  } finally {
    loading.value = false
    scrollBottom()
  }
}

function quickAsk(q) {
  question.value = q
  send()
}

// ═══════════════════════════════════════════
// 上下文面板
// ═══════════════════════════════════════════
async function showContext(entityId) {
  contextEntity.value = entityId
  summaryData.value = null
  try {
    const data = await graphragApi.context(entityId)
    contextLayer.value = data.layer || ''
    contextData.value = data

    // 并行获取实时值 (point 或 device 层)
    try {
      const liveP = data.layer === 'point'
        ? graphragApi.livePoint(entityId)
        : data.layer === 'device'
          ? graphragApi.liveSnapshot(entityId)
          : null
      if (liveP) {
        const liveRes = await liveP
        contextData.value._live = liveRes
      }
    } catch {}

    loadSubgraph(entityId)

    // Point 层加载趋势数据
    if (data.layer === 'point') {
      loadTrend(entityId)
    } else {
      trendData.value = null
    }
  } catch {
    contextData.value = {}
  }
}

async function loadTrend(entityId) {
  try {
    const { data } = await graphragApi.livePoint ? null : null  // 直接调 API
    const resp = await fetch(`/api/graphrag/live/trend/${entityId}?hours=1`)
    trendData.value = await resp.json()
    await nextTick()
    renderTrendChart()
  } catch { trendData.value = null }
}

function renderTrendChart() {
  if (!trendDom.value || !trendData.value?.points?.length) return
  if (trendChart) trendChart.dispose()
  trendChart = echarts.init(trendDom.value)
  const pts = trendData.value.points
  trendChart.setOption({
    tooltip: { trigger: 'axis', formatter: p => `${p[0].axisValue}<br/>${p[0].value}` },
    grid: { top: 8, right: 8, bottom: 20, left: 40 },
    xAxis: { type: 'category', data: pts.map(p => p.ts?.slice(11,19) || ''), axisLabel: { color: '#8aa0c0', fontSize: 9, rotate: 30 } },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: '#1e3a5c' } }, axisLabel: { color: '#8aa0c0', fontSize: 9 } },
    series: [{
      type: 'line', data: pts.map(p => p.value), smooth: true, symbol: 'none',
      lineStyle: { color: '#4a9eff', width: 1.5 },
      areaStyle: { color: new echarts.graphic.LinearGradient(0,0,0,1, [
        { offset: 0, color: 'rgba(74,158,255,0.3)' }, { offset: 1, color: 'rgba(74,158,255,0.02)' }
      ]) },
      markLine: trendData.value.stats?.avg ? {
        silent: true, data: [{ yAxis: trendData.value.stats.avg, label: { formatter: `avg ${trendData.value.stats.avg}`, color: '#ffc107', fontSize: 9 } }],
        lineStyle: { color: '#ffc107', type: 'dashed', width: 1 }
      } : undefined,
    }],
  })
  setTimeout(() => trendChart?.resize(), 100)
}

async function loadSubgraph(entityId) {
  try {
    const data = await graphragApi.subgraph(entityId, 2)
    subgraphData.value = data
    await nextTick()
    renderGraph(data)
  } catch { subgraphData.value = null }
}

function renderGraph(data) {
  if (!graphDom.value || !data?.nodes?.length) return
  if (graphChart) graphChart.dispose()
  graphChart = echarts.init(graphDom.value)

  const layers = ['site', 'gateway', 'channel', 'device', 'point', 'constraint']
  const colors = { site: '#ffc107', gateway: '#66d9ff', channel: '#66bb6a', device: '#ab47bc', point: '#ef5350', constraint: '#ff9800' }
  const sizes = { site: 40, gateway: 35, channel: 30, device: 25, point: 20, constraint: 18 }

  const nodes = data.nodes.map(n => ({
    id: n.id, name: n.label, symbolSize: sizes[n.layer] || 18,
    category: layers.indexOf(n.layer),
    itemStyle: { color: colors[n.layer] || '#c0d5e8' },
    label: { show: n.layer !== 'point', fontSize: 10, color: '#c0d5e8', formatter: p => p.name.length > 12 ? p.name.slice(0,11)+'…' : p.name },
  }))

  const edges = data.edges.map((e, i) => ({
    source: e.source, target: e.target,
    lineStyle: { color: '#345078', width: 1, curveness: 0.15, opacity: 0.6 },
    label: { show: false },
  }))

  graphChart.setOption({
    tooltip: { formatter: p => p.dataType === 'node' ? `<b>${p.name}</b><br/>${p.data.category}` : '' },
    legend: { data: layers, bottom: 0, textStyle: { color: '#c0d5e8', fontSize: 10 } },
    series: [{
      type: 'graph', layout: 'force', roam: true, draggable: true,
      force: { repulsion: 200, edgeLength: [80, 200], gravity: 0.1 },
      data: nodes, edges: edges,
      categories: layers.map((l, i) => ({ name: l, itemStyle: { color: colors[l] } })),
      emphasis: { focus: 'adjacency', lineStyle: { width: 3 } },
    }],
  })

  setTimeout(() => graphChart?.resize(), 100)
}

// ═══════════════════════════════════════════
// 工具函数
// ═══════════════════════════════════════════
function severityColor(s) {
  return { critical: 'danger', danger: 'danger', warning: 'warning', info: 'info' }[s] || 'info'
}
function alarmTagType(s) {
  return { normal: 'success', high: 'warning', low: 'warning', critical_high: 'danger', critical_low: 'danger', no_threshold: 'info' }[s] || 'info'
}
function now() { return new Date().toLocaleTimeString() }
function scrollBottom() {
  nextTick(() => {
    const el = msgBox.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

// 监听 contextData / trendData 变化重新渲染图
watch(contextData, () => nextTick(() => { if (subgraphData.value) renderGraph(subgraphData.value) }))
watch(trendData, () => nextTick(renderTrendChart))
</script>

<style scoped>
.graphrag-page { display: flex; flex-direction: column; height: calc(100vh - 80px); color: #c0d5e8; }

/* ── 顶部 ── */
.topbar { display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; background: #162844; border-bottom: 1px solid #234060; flex-shrink: 0; }
.title { margin: 0; font-size: 16px; color: #e0e8f0; }
.topbar-right { display: flex; align-items: center; gap: 8px; }
.stat-txt { font-size: 12px; color: #8aa0c0; }

/* ── 主布局 ── */
.main-area { display: flex; flex: 1; overflow: hidden; gap: 0; }

/* ── 左侧聊天 ── */
.chat-panel { flex: 1; display: flex; flex-direction: column; min-width: 0; background: #0f1a2e; }
.messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
.welcome { text-align: center; padding: 60px 20px; }
.welcome-icon { font-size: 48px; margin-bottom: 12px; }
.welcome p { color: #8aa0c0; font-size: 14px; }
.hints { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 20px; }
.hint { padding: 6px 14px; background: #162844; border: 1px solid #234060; border-radius: 16px; font-size: 13px; cursor: pointer; transition: all .2s; }
.hint:hover { background: #1e3a5c; border-color: #4a9eff; color: #4a9eff; }

.msg { display: flex; gap: 10px; max-width: 85%; }
.msg.user { align-self: flex-end; flex-direction: row-reverse; }
.msg.assistant { align-self: flex-start; }
.msg-avatar { width: 32px; height: 32px; border-radius: 50%; background: #162844; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.msg-body { flex: 1; min-width: 0; }
.msg-text { padding: 10px 14px; border-radius: 12px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; word-break: break-word; }
.msg.user .msg-text { background: #1a5c8a; color: #e0e8f0; }
.msg.assistant .msg-text { background: #162844; border: 1px solid #234060; }
.msg-time { font-size: 11px; color: #5a7090; margin-top: 4px; }

/* 实体卡片 */
.entity-card { margin-top: 8px; padding: 6px 12px; background: #1a3050; border: 1px solid #2a4870; border-radius: 8px; font-size: 13px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
.entity-card:hover { border-color: #4a9eff; }
.layer-tag { font-size: 10px; padding: 1px 6px; border-radius: 4px; background: #234060; color: #8aa0c0; }

.matched-list { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 4px; }
.matched-item { font-size: 11px; padding: 2px 8px; background: #1a3050; border-radius: 4px; cursor: pointer; }
.matched-item:hover { background: #2a4870; }

/* 输入区 */
.input-area { padding: 12px 16px; background: #162844; border-top: 1px solid #234060; flex-shrink: 0; }

/* 打字动画 */
.typing { display: flex; gap: 4px; padding: 4px 0; }
.typing span { width: 6px; height: 6px; border-radius: 50%; background: #4a9eff; animation: bounce 1.4s infinite ease-in-out both; }
.typing span:nth-child(1) { animation-delay: -0.32s; }
.typing span:nth-child(2) { animation-delay: -0.16s; }
@keyframes bounce { 0%,80%,100% { transform: scale(0); } 40% { transform: scale(1); } }

/* ── 右侧上下文 ── */
.context-panel { width: 380px; background: #0f1a2e; border-left: 1px solid #234060; overflow-y: auto; flex-shrink: 0; padding: 12px; }
.ctx-card { background: #162844; border: 1px solid #234060; border-radius: 8px; overflow: hidden; }
.ctx-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #1a3050; font-size: 13px; font-weight: 600; }
.ctx-body { padding: 10px 12px; }
.ctx-section { margin-bottom: 12px; }
.ctx-label { font-size: 12px; color: #8aa0c0; margin-bottom: 6px; }

.path-chain { display: flex; flex-wrap: wrap; align-items: center; gap: 2px; margin-bottom: 12px; }
.chain-node { display: flex; align-items: center; gap: 3px; font-size: 11px; cursor: pointer; padding: 2px 4px; border-radius: 3px; }
.chain-node:hover { background: #1a3050; }
.chain-layer { color: #4a9eff; text-transform: uppercase; }
.chain-name { color: #c0d5e8; }
.chain-arrow { color: #5a7090; margin: 0 2px; }

.chip-list { display: flex; flex-wrap: wrap; gap: 4px; }
.chip { font-size: 11px; padding: 3px 8px; background: #1a3050; border-radius: 4px; cursor: pointer; }
.chip:hover { background: #2a4870; }

.rule-item { padding: 6px 8px; background: #1a3050; border-radius: 6px; margin-bottom: 6px; }
.rule-name { font-size: 13px; margin-left: 6px; }
.rule-desc { font-size: 11px; color: #8aa0c0; margin-top: 4px; }

.summary-text { font-size: 13px; line-height: 1.6; padding: 8px; background: #1a3050; border-radius: 6px; margin-bottom: 10px; }
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.stat-item { text-align: center; padding: 8px; background: #1a3050; border-radius: 6px; }
.stat-v { font-size: 20px; font-weight: bold; color: #66d9ff; }
.stat-k { font-size: 10px; color: #8aa0c0; margin-top: 2px; }

.graph-svg { width: 100%; height: 260px; margin-top: 8px; }
.trend-svg { width: 100%; height: 160px; margin-top: 4px; }
.trend-dir { font-size: 11px; margin-left: 6px; }
.trend-dir.up { color: #66bb6a; }
.trend-dir.down { color: #ef5350; }
.trend-dir.stable { color: #8aa0c0; }
.trend-stats { display: flex; gap: 10px; font-size: 10px; color: #8aa0c0; margin-top: 4px; flex-wrap: wrap; }

.empty-ctx { text-align: center; padding: 40px 20px; }
.empty-icon { font-size: 36px; margin-bottom: 8px; }
.empty-ctx p { color: #8aa0c0; font-size: 13px; }

/* 实时数据 */
.live-block { background: #0d1a2e; border: 1px solid #2a4870; border-radius: 8px; padding: 10px; }
.live-value-row { display: flex; align-items: center; gap: 8px; }
.live-value { font-size: 22px; font-weight: bold; font-family: monospace; }
.live-value.normal { color: #66bb6a; }
.live-value.high,.live-value.low { color: #ff9800; }
.live-value.critical_high,.live-value.critical_low { color: #ef5350; }
.live-ts { font-size: 10px; color: #5a7090; }
.live-points { display: flex; flex-direction: column; gap: 4px; }
.live-pt-row { display: flex; align-items: center; gap: 6px; font-size: 12px; padding: 3px 6px; background: #162844; border-radius: 4px; }
.lp-name { flex: 1; color: #8aa0c0; }
.lp-val { font-family: monospace; font-weight: 600; }
.lp-val.normal { color: #66bb6a; }
.lp-val.high,.lp-val.low { color: #ff9800; }
.lp-val.critical_high,.lp-val.critical_low { color: #ef5350; }
.mini-stats { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
.ms-item { font-size: 11px; padding: 4px 10px; background: #162844; border: 1px solid #234060; border-radius: 12px; color: #8aa0c0; }

/* ── Element Plus 覆盖 ── */
:deep(.el-select .el-input__wrapper) { background: #1a3050; box-shadow: none; border: 1px solid #234060; }
:deep(.el-select .el-input__inner) { color: #c0d5e8; }
:deep(.el-input__wrapper) { background: #1a3050; box-shadow: none; border: 1px solid #234060; }
:deep(.el-input__inner) { color: #c0d5e8; }
:deep(.el-input-group__append) { background: #1a5c8a; border: none; }
:deep(.el-button) { --el-button-bg-color: #1a5c8a; --el-button-border-color: #1a5c8a; }
</style>
