<template>
  <div class="capture-dashboard">
    <!-- 顶部状态栏 -->
    <el-row :gutter="16" class="status-bar">
      <el-col :span="4">
        <el-card shadow="hover" :class="['stat-card', capturing ? 'active' : 'idle']">
          <div class="stat-value">{{ capturing ? '抓包中' : '已停止' }}</div>
          <div class="stat-label">状态</div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value">{{ stats.packets?.toLocaleString() || 0 }}</div>
          <div class="stat-label">报文数</div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value">{{ stats.flows || 0 }}</div>
          <div class="stat-label">数据流</div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value">{{ protocolStats.length }}</div>
          <div class="stat-label">协议类型</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-label">API 端口</div>
          <div class="stat-value">{{ apiPort }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 控制按钮 -->
    <el-row :gutter="16" style="margin-top:16px">
      <el-col :span="24">
        <el-button :type="capturing ? 'danger' : 'success'" @click="toggleCapture" :icon="capturing ? 'VideoPause' : 'VideoPlay'">
          {{ capturing ? '停止抓包' : '开始抓包' }}
        </el-button>
        <el-button @click="clearData" :disabled="capturing" icon="Delete">清空数据</el-button>
        <el-button @click="refreshData" :icon="'Refresh'">刷新</el-button>
        <span style="margin-left:16px;color:#909399;font-size:13px">
          关注端口: {{ watchPorts.join(', ') }} | 自动刷新: {{ autoRefresh }}s
        </span>
      </el-col>
    </el-row>

    <!-- 图表 + 流表格 -->
    <el-row :gutter="16" style="margin-top:16px">
      <!-- 协议分布饼图 -->
      <el-col :span="8">
        <el-card header="协议分布">
          <div ref="pieChart" style="height:300px"></div>
        </el-card>
      </el-col>
      <!-- 流统计表 -->
      <el-col :span="16">
        <el-card header="数据流">
          <el-table :data="pagedFlows" size="small" max-height="260" stripe>
            <el-table-column prop="src" label="源地址" width="200" show-overflow-tooltip />
            <el-table-column prop="dst" label="目标地址" width="200" show-overflow-tooltip />
            <el-table-column prop="proto" label="协议" width="100">
              <template #default="{ row }">
                <el-tag :type="protoColor(row.proto)" size="small">{{ row.proto }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="packets" label="报文" width="80" sortable />
            <el-table-column prop="bytes" label="字节" width="100" sortable>
              <template #default="{ row }">{{ formatBytes(row.bytes) }}</template>
            </el-table-column>
            <el-table-column prop="last" label="最后活跃" width="100">
              <template #default="{ row }">{{ timeAgo(row.last) }}</template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-model:current-page="flowPage" v-model:page-size="flowPageSize"
            :page-sizes="[10, 20, 50]" :total="flows.length"
            layout="total, sizes, prev, pager, next"
            size="small" background style="margin-top:6px;justify-content:flex-end"
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近报文 (可点击展开解析) -->
    <el-row :gutter="16" style="margin-top:16px">
      <el-col :span="24">
        <el-card header="最近报文 (点击行展开字段解析)">
          <el-table :data="pagedRecent" size="small" max-height="410" stripe
            @row-click="toggleRow" :row-class-name="rowClass" style="cursor:pointer">
            <el-table-column type="expand">
              <template #default="{ row }">
                <div class="packet-detail">
                  <div class="detail-hex"><b>Hex:</b> {{ row.hex }}</div>
                  <el-table :data="parseFields(row)" size="small" border class="detail-table">
                    <el-table-column prop="field" label="字段" width="140" />
                    <el-table-column prop="value" label="值" />
                    <el-table-column prop="desc" label="说明" width="200" />
                  </el-table>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="ts" label="时间" width="85">
              <template #default="{ row }">{{ formatTime(row.ts) }}</template>
            </el-table-column>
            <el-table-column prop="dir" label="方向" width="55">
              <template #default="{ row }">
                <el-tag :type="row.dir === 'RX' ? 'success' : 'warning'" size="small">{{ row.dir }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="src" label="源地址" width="190" show-overflow-tooltip />
            <el-table-column prop="dst" label="目标地址" width="190" show-overflow-tooltip />
            <el-table-column prop="proto" label="协议" width="100">
              <template #default="{ row }">
                <el-tag :type="protoColor(row.proto)" size="small">{{ row.proto }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="len" label="长度" width="60" />
            <el-table-column prop="hex" label="Hex 预览" min-width="250" show-overflow-tooltip>
              <template #default="{ row }">
                <code style="font-size:11px;font-family:Consolas,monospace">{{ row.hex?.slice(0,80) }}</code>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-model:current-page="recentPage" v-model:page-size="recentPageSize"
            :page-sizes="[10, 20, 50, 100]" :total="recentPackets.length"
            layout="total, sizes, prev, pager, next, jumper"
            size="small" background style="margin-top:6px;justify-content:flex-end"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const API_BASE = 'http://localhost:8765'
const apiPort = 8765
const watchPorts = [8889, 502, 2404, 4840]
const autoRefresh = 3

const capturing = ref(false)
const stats = reactive({ packets: 0, flows: 0 })
const flows = ref([])
const recentPackets = ref([])
const protocolStats = ref([])
const pieChart = ref(null)
let chartInstance = null
let timer = null

// 分页 — 数据流
const flowPage = ref(1)
const flowPageSize = ref(10)
const pagedFlows = computed(() => {
  const start = (flowPage.value - 1) * flowPageSize.value
  return flows.value.slice(start, start + flowPageSize.value)
})

// 分页 — 最近报文
const recentPage = ref(1)
const recentPageSize = ref(20)
const pagedRecent = computed(() => {
  const start = (recentPage.value - 1) * recentPageSize.value
  return recentPackets.value.slice(start, start + recentPageSize.value)
})

function protoColor(proto) {
  const map = { A11: 'success', Modbus: 'warning', IEC104: 'danger', 'A11-jjZZ': '' }
  return map[proto] || 'info'
}

function formatBytes(b) {
  if (!b) return '0 B'
  if (b < 1024) return b + ' B'
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB'
  return (b / 1024 / 1024).toFixed(1) + ' MB'
}

function formatTime(ts) {
  if (!ts) return '-'
  const d = new Date(ts * 1000)
  return d.toLocaleTimeString('zh-CN', { hour12: false })
}

function timeAgo(ts) {
  if (!ts) return '-'
  const diff = Date.now() / 1000 - ts
  if (diff < 60) return Math.floor(diff) + 's 前'
  if (diff < 3600) return Math.floor(diff / 60) + 'min 前'
  return Math.floor(diff / 3600) + 'h 前'
}

async function fetchStatus() {
  try {
    const r = await fetch(`${API_BASE}/api/status`)
    const d = await r.json()
    capturing.value = d.capturing
    stats.packets = d.packets
    stats.flows = d.flows
  } catch (e) { /* offline */ }
}

async function fetchFlows() {
  try {
    const r = await fetch(`${API_BASE}/api/flows`)
    const d = await r.json()
    flows.value = d.flows || []

    // 统计协议
    const protoCount = {}
    flows.value.forEach(f => {
      const p = f.proto || 'unknown'
      protoCount[p] = (protoCount[p] || 0) + f.packets
    })
    protocolStats.value = Object.entries(protoCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  } catch (e) { /* */ }
}

async function fetchPackets() {
  try {
    const r = await fetch(`${API_BASE}/api/packets?limit=30`)
    const d = await r.json()
    recentPackets.value = (d.packets || []).reverse()
  } catch (e) { /* */ }
}

async function refreshData() {
  await Promise.all([fetchStatus(), fetchFlows(), fetchPackets()])
  updateChart()
}

function updateChart() {
  if (!chartInstance || !protocolStats.value.length) return
  const colors = { A11: '#67c23a', 'A11-jjZZ': '#67c23a', Modbus: '#e6a23c', IEC104: '#f56c6c', DCE_RPC: '#409eff', unknown: '#909399' }
  chartInstance.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c} 帧 ({d}%)' },
    series: [{
      type: 'pie', radius: ['45%', '75%'], center: ['50%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 4, borderColor: '#1d1e2b', borderWidth: 2 },
      label: { show: true, formatter: '{b}\n{d}%', color: '#c0c4cc', fontSize: 11 },
      data: protocolStats.value.map(s => ({
        ...s,
        itemStyle: { color: colors[s.name] || '#909399' }
      }))
    }]
  })
}

async function toggleCapture() {
  const endpoint = capturing.value ? 'stop' : 'start'
  const body = capturing.value ? null : JSON.stringify({ ports: watchPorts })
  await fetch(`${API_BASE}/api/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body
  })
  await refreshData()
}

async function clearData() {
  await fetch(`${API_BASE}/api/clear`, { method: 'POST' })
  await refreshData()
}

const expandedRows = ref(new Set())

function toggleRow(row) {
  const key = row.ts + row.src + row.dst
  if (expandedRows.value.has(key)) {
    expandedRows.value.delete(key)
  } else {
    expandedRows.value.add(key)
  }
  // trigger expand
  const table = document.querySelector('.el-table')
  if (table) table.__vue__?.toggleRowExpansion?.(row)
}

function rowClass({ row }) {
  const key = row.ts + row.src + row.dst
  return expandedRows.value.has(key) ? 'expanded-row' : ''
}

function parseFields(row) {
  const p = row.parsed || {}
  const fields = []
  const proto = row.proto

  if (proto === 'A11') {
    fields.push(
      { field: '协议', value: 'A11 (CNPC 私有协议)', desc: '5a5a 帧头' },
      { field: 'Magic', value: '5a 5a', desc: '帧起始标识' },
      { field: 'Frame Length', value: `${p.frame_len || '?'} (LE)`, desc: '不含 2B 头的小端长度' },
      { field: 'Flags', value: p.flags || '?', desc: '控制标志位' },
      { field: 'Message Type', value: p.msg_type || '?', desc: '消息类型编码' }
    )
    if (p.jjzz_offset !== undefined) {
      fields.push({ field: '内嵌 jjZZ', value: `偏移 ${p.jjzz_offset}`, desc: 'A11 子帧封装' })
    }
  } else if (proto === 'OPC-DA') {
    const pktNames = { Request: 'OPC 读/写/订阅请求', Response: '数据返回', Bind: 'DCOM 对象绑定', Bind_ack: '绑定确认' }
    fields.push(
      { field: '协议', value: 'OPC DA (DCOM)', desc: '基于 DCE/RPC 5.0' },
      { field: 'RPC 版本', value: p.rpc_ver || '5.0', desc: 'DCE/RPC 版本' },
      { field: '包类型', value: p.pkt_type || '?', desc: pktNames[p.pkt_type] || '操作码' },
      { field: '分片长度', value: `${p.frag_len || '?'}`, desc: 'DCE/RPC 分片大小' }
    )
  } else if (proto === 'Modbus') {
    const fcNames = { 1: '读线圈', 2: '读离散', 3: '读保持寄存器', 4: '读输入寄存器', 5: '写单线圈', 6: '写单寄存', 15: '写多线圈', 16: '写多寄存' }
    fields.push(
      { field: '协议', value: 'Modbus TCP', desc: 'MBAP 7B 头' },
      { field: '事务 ID', value: `${p.tid || '?'}`, desc: '请求/响应配对' },
      { field: '从站地址', value: `${p.slave || '?'}`, desc: 'Unit ID' },
      { field: '功能码', value: `FC${p.fc} (${fcNames[p.fc] || '?'})`, desc: '操作类型' }
    )
    if (p.addr !== undefined) {
      fields.push({ field: '起始地址', value: `${p.addr}`, desc: '寄存器地址' })
      fields.push({ field: '数量', value: `${p.count || '?'}`, desc: '寄存器/线圈数' })
    }
    if (p.value !== undefined) {
      fields.push({ field: '写入值', value: `${p.value}`, desc: '单寄存器写入值' })
    }
  } else if (proto === 'IEC104') {
    fields.push(
      { field: '协议', value: 'IEC 60870-5-104', desc: '电力远动规约' },
      { field: 'APDU 长度', value: `${p.apdu_len || '?'}`, desc: '应用层数据单元长度' }
    )
  } else {
    fields.push(
      { field: '协议', value: proto || 'Unknown', desc: '未识别/原始数据' },
      { field: '长度', value: `${row.len}B`, desc: '原始报文长度' }
    )
  }
  return fields
}

onMounted(async () => {
  await refreshData()
  timer = setInterval(refreshData, autoRefresh * 1000)

  await nextTick()
  if (pieChart.value) {
    chartInstance = echarts.init(pieChart.value, 'dark')
    updateChart()
  }
})

onUnmounted(() => {
  clearInterval(timer)
  if (chartInstance) chartInstance.dispose()
})
</script>

<style scoped>
.capture-dashboard {
  padding: 16px;
  background: #141520;
  min-height: 100vh;
}

.status-bar .stat-card {
  text-align: center;
  background: #1d1e2b;
  border-color: #2d2e3b;
  color: #e0e0e0;
}

.stat-card.active {
  border-color: #67c23a;
  box-shadow: 0 0 12px rgba(103, 194, 58, 0.3);
}

.stat-card.idle {
  border-color: #4a4b5a;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #e0e0e0;
}

.stat-label {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

:deep(.el-card) {
  background: #1d1e2b;
  border-color: #2d2e3b;
  color: #e0e0e0;
}

:deep(.el-card__header) {
  color: #c0c4cc;
  border-bottom-color: #2d2e3b;
  font-size: 14px;
}

:deep(.el-table) {
  background: transparent;
  --el-table-bg-color: #1d1e2b;
  --el-table-tr-bg-color: #1d1e2b;
  --el-table-header-bg-color: #252636;
  --el-table-border-color: #2d2e3b;
  --el-table-text-color: #c0c4cc;
  --el-table-row-hover-bg-color: #2d2e3b;
}

.packet-detail {
  padding: 12px 16px;
  background: #1a1b26;
  border-radius: 4px;
}
.detail-hex {
  font-family: Consolas, monospace;
  font-size: 12px;
  color: #67c23a;
  background: #0d0e14;
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 12px;
  word-break: break-all;
  line-height: 1.8;
}
.detail-table {
  margin-top: 8px;
}
.detail-table :deep(td) {
  font-family: Consolas, monospace;
  font-size: 12px;
}
code {
  color: #67c23a;
  background: #252636;
  padding: 1px 4px;
  border-radius: 2px;
}
</style>
