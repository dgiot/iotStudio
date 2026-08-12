<template>
  <div class="stream-page">
    <h3 style="color:#c0d5e8;margin:0 0 10px">🌊 流计算引擎</h3>
    <p style="color:#8aa0b4;font-size:13px;margin:0 0 16px">
      15种边缘算法实时执行 | 滑动窗口 (deque, max 20)
      <span style="margin-left:12px;background:#152a40;padding:2px 8px;border-radius:4px;font-size:12px">
        📡 作用域:
        <el-tag v-for="t in [...new Set(liveDevices.map(d=>d.dtype))]" :key="t" size="small" type="primary" effect="dark" style="margin-left:4px">{{ t }}</el-tag>
        <span style="margin-left:6px;color:#66d9ff;font-weight:bold">{{ liveDevices.length }}</span> 条数据流
      </span>
    </p>

    <div class="three-col">
      <!-- 第1栏: 算法列表 — 分页 -->
      <div class="col-left">
        <div class="col-title">算法 ({{ algorithms.length }})</div>
        <div class="alg-scroll">
          <div v-for="a in pagedAlgos" :key="a.name"
            class="alg-row" :class="{active: sel?.name===a.name}"
            @click="sel = sel?.name===a.name ? null : a">
            <span class="alg-row-icon">{{ a.icon }}</span>
            <div class="alg-row-main">
              <div class="alg-row-name">{{ a.name }}</div>
              <div class="alg-row-desc">{{ a.desc }}</div>
            </div>
            <el-switch v-model="a.active" size="small" @click.stop @change="saveConfig" />
            <div class="alg-row-badge" v-if="a.active && a.alarms>0" :style="{background:'#ef5350'}">{{ a.alarms }}</div>
            <div class="alg-row-badge" v-else-if="a.active" style="background:#409EFF">{{ a.count }}</div>
          </div>
        </div>
        <div class="col-footer">
          <span class="pg-btn" @click="algoPage=Math.max(1,algoPage-1)">◀</span>
          <span>{{ algoPage }}/{{ algoPages }}</span>
          <span class="pg-btn" @click="algoPage=Math.min(algoPages,algoPage+1)">▶</span>
        </div>
      </div>

      <!-- 第2栏: 详情+配置 -->
      <div class="col-mid">
        <div v-if="!sel" class="col-empty">← 点击算法查看详情与配置</div>
        <template v-else>
          <div class="col-title">{{ sel.icon }} {{ sel.name }}</div>
          <div class="col-meta">{{ sel.desc }}</div>

          <el-row :gutter="8" style="margin:10px 0">
            <el-col :span="8"><div class="kpi"><div class="kv" style="color:#409EFF">{{ sel.count }}</div><div class="kl">处理</div></div></el-col>
            <el-col :span="8"><div class="kpi"><div class="kv" :style="{color:sel.alarms>0?'#ef5350':'#67C23A'}">{{ sel.alarms }}</div><div class="kl">告警</div></div></el-col>
            <el-col :span="8"><div class="kpi"><div class="kv" style="color:#909399;font-size:14px">{{ sel.lastRun }}</div><div class="kl">时间</div></div></el-col>
          </el-row>

          <div class="sec">作用域 — 指定算法对哪些产品类型的数据流生效</div>
          <el-radio-group v-model="sel.scope" size="small" @change="saveConfig" style="display:flex;flex-direction:column;gap:2px">
            <el-radio v-for="t in scopeTypes" :key="t" :value="t" border style="margin:0;padding:4px 8px">
              <el-tag size="small" type="info" effect="plain">{{ t }}</el-tag>
              <span style="font-size:11px;color:#8aa0b4;margin-left:4px">{{ getScopeDesc(t) }}</span>
            </el-radio>
            <el-radio value="all" border style="margin:0;padding:4px 8px">
              <el-tag size="small" type="success" effect="plain">全部</el-tag>
              <span style="font-size:11px;color:#8aa0b4;margin-left:4px">所有产品类型</span>
            </el-radio>
          </el-radio-group>

          <div class="sec">阈值</div>
          <el-form label-width="70px" size="small" class="cfg-form">
            <el-form-item label="上限"><el-input-number v-model="sel.high" :step="0.1" size="small" style="width:120px" @change="saveConfig" /></el-form-item>
            <el-form-item label="下限"><el-input-number v-model="sel.low" :step="0.1" size="small" style="width:120px" @change="saveConfig" /></el-form-item>
            <el-form-item label="连续点"><el-input-number v-model="sel.consecutive" :min="1" :max="20" size="small" style="width:100px" @change="saveConfig" /></el-form-item>
            <el-form-item label="窗口"><el-input-number v-model="sel.windowSize" :min="5" :max="50" size="small" style="width:100px" @change="saveConfig" /></el-form-item>
          </el-form>
        </template>
      </div>

      <!-- 第3栏: 实时特征值 -->
      <div class="col-right">
        <div class="col-title">📊 窗口特征值 (n={{ WINDOW_SIZE }})</div>
        <div class="col-meta">对作用域内每条数据流计算统计特征，算法基于此判定</div>
        <div class="feat-scroll">
          <div v-for="f in pagedFeatures" :key="f.device+f.point" class="feat-row">
            <div class="fr-top">
              <el-tag size="small" type="info">{{ f.type }}</el-tag>
              <span class="fr-dev">{{ f.device }}</span>
              <span class="fr-pt">{{ f.point }}</span>
              <span class="fr-time">{{ f.time }}</span>
            </div>
            <div class="fr-vals">
              <span class="frv">μ={{ f.avg }}</span>
              <span class="frv">min={{ f.min }}</span>
              <span class="frv">max={{ f.max }}</span>
              <span class="frv">σ={{ f.std }}</span>
              <span :style="{color:f.trend>0?'#66bb6a':f.trend<0?'#ef5350':'#8aa0b4'}">{{ f.trend>0?'↑':f.trend<0?'↓':'→' }}{{ Math.abs(f.trend||0).toFixed(2) }}</span>
              <span class="frv">波动{{ f.volatility }}%</span>
            </div>
          </div>
        </div>
        <div class="col-footer">
          <span class="pg-btn" @click="featPage=Math.max(1,featPage-1)">◀</span>
          <span>{{ featPage }}/{{ featPages }} · {{ windowFeatures.length }} 条</span>
          <span class="pg-btn" @click="featPage=Math.min(featPages,featPage+1)">▶</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import api from '../api'

const saved = JSON.parse(localStorage.getItem('stream_config')||'{}')
const algorithms = ref([
  { name:'阈值判定', desc:'数值超出高/低限触发', icon:'📏', active:true, scope:'all', high:100, low:0, consecutive:1, windowSize:10, count:0, alarms:0, lastRun:'--' },
  { name:'突变检测', desc:'连续两点差值超阈值', icon:'⚡', active:true, scope:'all', high:5, low:-5, consecutive:2, windowSize:10, count:0, alarms:0, lastRun:'--' },
  { name:'趋势判定', desc:'窗口内持续上升/下降', icon:'📈', active:true, scope:'all', high:0.1, low:-0.1, consecutive:5, windowSize:20, count:0, alarms:0, lastRun:'--' },
  { name:'波动性检测', desc:'窗口内标准差超阈值', icon:'📊', active:true, scope:'all', high:3, low:0, consecutive:1, windowSize:20, count:0, alarms:0, lastRun:'--' },
  { name:'越限频次', desc:'窗口内越限次数占比', icon:'🔢', active:false, scope:'all', high:0.5, low:0, consecutive:1, windowSize:20, count:0, alarms:0, lastRun:'--' },
  { name:'滑动平均', desc:'窗口均值平滑输出', icon:'📉', active:true, scope:'all', high:100, low:0, consecutive:1, windowSize:10, count:0, alarms:0, lastRun:'--' },
  { name:'变化率检测', desc:'单位时间变化率超限', icon:'⏱️', active:true, scope:'all', high:2, low:-2, consecutive:1, windowSize:10, count:0, alarms:0, lastRun:'--' },
  { name:'峰值检测', desc:'识别局部极大/极小值', icon:'🔺', active:false, scope:'all', high:5, low:-5, consecutive:3, windowSize:20, count:0, alarms:0, lastRun:'--' },
  { name:'连续异常', desc:'连续N点越限告警', icon:'🔴', active:true, scope:'all', high:100, low:0, consecutive:3, windowSize:15, count:0, alarms:0, lastRun:'--' },
  { name:'基线偏离', desc:'与基线值偏离超限', icon:'📐', active:false, scope:'all', high:10, low:-10, consecutive:1, windowSize:20, count:0, alarms:0, lastRun:'--' },
  { name:'范围检查', desc:'数值在期望区间内', icon:'✅', active:true, scope:'all', high:100, low:0, consecutive:1, windowSize:10, count:0, alarms:0, lastRun:'--' },
  { name:'累积计数', desc:'窗口内越限累计', icon:'🧮', active:false, scope:'all', high:5, low:0, consecutive:1, windowSize:20, count:0, alarms:0, lastRun:'--' },
  { name:'变化方向', desc:'上升/下降/平稳判别', icon:'🧭', active:true, scope:'all', high:0.1, low:-0.1, consecutive:3, windowSize:15, count:0, alarms:0, lastRun:'--' },
  { name:'异常评分', desc:'综合多维度异常指数', icon:'🎯', active:true, scope:'all', high:0.7, low:0, consecutive:1, windowSize:20, count:0, alarms:0, lastRun:'--' },
  { name:'死区过滤', desc:'小幅度变化抑制输出', icon:'🔇', active:true, scope:'all', high:0.5, low:0, consecutive:1, windowSize:10, count:0, alarms:0, lastRun:'--' },
].map(a => ({...a, ...(saved[a.name]||{})})))

const scopeTypes = ref(['oilwell','compressor','inverter','pcs'])

// 分页
const algoPage = ref(1); const algoPageSize = 10
const featPage = ref(1); const featPageSize = 8
const pagedAlgos = computed(() => algorithms.value.slice((algoPage.value-1)*algoPageSize, algoPage.value*algoPageSize))
const pagedFeatures = computed(() => windowFeatures.value.slice((featPage.value-1)*featPageSize, featPage.value*featPageSize))
const algoPages = computed(() => Math.ceil(algorithms.value.length / algoPageSize))
const featPages = computed(() => Math.ceil(windowFeatures.value.length / featPageSize))

const sel = ref(null)
const SCOPE_DESC = { oilwell:'抽油机井 · 油压/套压/温度', compressor:'压缩机 · 振动/轴承温度', inverter:'逆变器 · 功率/效率', pcs:'储能PCS · 荷电状态' }
function getScopeDesc(t) { return SCOPE_DESC[t] || '' }

function saveConfig() {
  const cfg = {}
  algorithms.value.forEach(a => { cfg[a.name] = { active:a.active, scope:a.scope||'all', high:a.high, low:a.low, consecutive:a.consecutive, windowSize:a.windowSize } })
  localStorage.setItem('stream_config', JSON.stringify(cfg))
}

// 动态设备列表 (从 API 加载)
const liveDevices = ref([])
const windowFeatures = ref([])
const WINDOW_SIZE = 20
let timer = null

function evalAlgorithm(a, values) {
  if (!values || values.length < 2) return 0
  const n = values.length
  const last = values[n-1]; const prev = values[n-2]
  const mean = values.reduce((s,v)=>s+v,0) / n
  const std = Math.sqrt(values.reduce((s,v)=>s+(v-mean)**2,0) / n)
  switch(a.name) {
    case '阈值判定': return (last > a.high || last < a.low) ? 1 : 0
    case '突变检测': return Math.abs(last - prev) > a.high ? 1 : 0
    case '趋势判定': { let up=0; for(let i=1;i<n;i++) if(values[i]>values[i-1]) up++; return (up>n*0.7||up<n*0.3) ? 1 : 0 }
    case '波动性检测': return std > a.high ? 1 : 0
    case '滑动平均': return Math.abs(last - mean) > a.high ? 1 : 0
    case '变化率检测': return Math.abs(last - prev) / Math.max(0.01, Math.abs(prev)) > a.high ? 1 : 0
    case '连续异常': { let c=0; for(let i=n-1;i>=Math.max(0,n-a.consecutive);i--) if(values[i]>a.high) c++; return c>=a.consecutive ? 1 : 0 }
    case '范围检查': return (last >= a.low && last <= a.high) ? 0 : 1
    case '变化方向': return Math.abs(last-prev) < a.high ? 0 : (last>prev ? 1 : -1)
    case '异常评分': { const score = (Math.abs(last-mean)/std + (last>a.high?1:0) + (last<a.low?1:0)) / 3; return score > 0.5 ? 1 : 0 }
    case '死区过滤': return Math.abs(last - prev) < a.high ? 0 : 1
    default: return 0
  }
}

// 作用域: 有遥测数据的设备+测点 (优先用已知有数据的)
const SCOPE_PRESET = [
  { did:'oilwell_0001', pid:'oil_pressure', name:'葡2-27向2', pname:'油压', dtype:'oilwell' },
  { did:'oilwell_0001', pid:'casing_pressure', name:'葡2-27向2', pname:'套压', dtype:'oilwell' },
  { did:'oilwell_0001', pid:'wellhead_temp', name:'葡2-27向2', pname:'井口温度', dtype:'oilwell' },
  { did:'comp_01', pid:'vibration', name:'压缩机-1号', pname:'振动', dtype:'compressor' },
  { did:'comp_01', pid:'bearing_temp', name:'压缩机-1号', pname:'轴承温度', dtype:'compressor' },
  { did:'inv_01', pid:'power_output', name:'逆变器-1号', pname:'输出功率', dtype:'inverter' },
  { did:'inv_01', pid:'efficiency', name:'逆变器-1号', pname:'转换效率', dtype:'inverter' },
  { did:'pcs_01', pid:'soc', name:'储能PCS-1号', pname:'荷电状态', dtype:'pcs' },
]

async function discoverDevices() {
  // 1. 优先: 有遥测历史数据的预设测点
  const discovered = [...SCOPE_PRESET]

  // 2. 补充: 从设备列表发现新产品类型
  try {
    const devR = await api.get('/devices', { params: { page_size: 200 } })
    const devices = devR.data?.devices || []
    const seenTypes = {}
    discovered.forEach(d => seenTypes[d.dtype] = true)

    for (const d of devices) {
      const dt = d.device_type || 'default'
      if (seenTypes[dt]) continue
      seenTypes[dt] = true

      try {
        const mR = await api.get(`/products/${dt}/model`)
        const pts = Object.entries(mR.data?.points || {}).slice(0, 2)
        for (const [pid, pt] of pts) {
          discovered.push({
            did: d.devaddr || d.device_id, pid,
            name: d.name || dt, pname: pt.name || pid, dtype: dt,
          })
        }
      } catch {}
    }
  } catch {}
  liveDevices.value = discovered.slice(0, 16)
}

async function refresh() {
  if (liveDevices.value.length === 0) await discoverDevices()
  const now = new Date().toLocaleTimeString()
  const features = []

  for (const dev of liveDevices.value) {
    try {
      const r = await api.get(`/telemetry/${dev.did}/${dev.pid}`, { params: { limit: WINDOW_SIZE } })
      const rows = (r.data?.data || []).map(p => p.value).reverse()
      if (rows.length < 2) continue
      const n = rows.length; const mean = rows.reduce((s,v)=>s+v,0) / n
      const mn = Math.min(...rows); const mx = Math.max(...rows)
      const std = Math.sqrt(rows.reduce((s,v)=>s+(v-mean)**2,0) / n)
      features.push({
        device: dev.name, point: dev.pname, type: dev.dtype,
        avg: mean.toFixed(1), min: mn.toFixed(1), max: mx.toFixed(1),
        std: std.toFixed(2), trend: rows[n-1]-rows[0],
        volatility: (std/mean*100).toFixed(1), time: now,
      })
      // 只对作用域匹配的算法执行
      algorithms.value.forEach(a => {
        if (!a.active) return
        if (a.scope && a.scope !== 'all' && a.scope !== dev.dtype) return
        const hit = evalAlgorithm(a, rows)
        if (hit) { a.count++; if (hit > 0) a.alarms++ }
        a.lastRun = now
      })
    } catch {}
  }
  windowFeatures.value = features
}

onMounted(()=>{ refresh(); timer=setInterval(refresh, 8000) })
onUnmounted(()=>clearInterval(timer))
</script>

<style scoped>
.stream-page { height: calc(100vh - 100px); display: flex; flex-direction: column; }
.stream-page h3 { color: #e8f0f8; margin: 0; flex-shrink: 0; }
.three-col { display: flex; gap: 10px; flex: 1; min-height: 0; overflow: hidden; }

.col-left { width: 320px; flex-shrink: 0; display: flex; flex-direction: column; border: 1px solid #1e3a5f; border-radius: 6px; background: #0a1a2a; }
.col-mid { width: 300px; flex-shrink: 0; display: flex; flex-direction: column; border: 1px solid #1e3a5f; border-radius: 6px; background: #0d1f33; padding: 10px 14px; overflow-y: auto; }
.col-right { flex: 1; display: flex; flex-direction: column; border: 1px solid #1e3a5f; border-radius: 6px; background: #0a1a2a; min-width: 0; }

.col-title { font-size: 13px; font-weight: bold; color: #c0d5e8; padding: 10px 12px 6px; flex-shrink: 0; }
.col-meta { font-size: 11px; color: #6a8aaa; padding: 0 12px 4px; flex-shrink: 0; }
.col-footer { padding: 6px 12px; font-size: 11px; color: #5a7a9a; text-align: center; border-top: 1px solid #1e3a5f; flex-shrink: 0; }
.col-empty { padding: 40px 20px; text-align: center; color: #5a7a9a; font-size: 13px; }

.alg-scroll { flex: 1; overflow-y: auto; }
.alg-row { display: flex; align-items: center; gap: 8px; padding: 7px 12px; cursor: pointer; border-bottom: 1px solid #162d45; transition: background 0.2s; }
.alg-row:hover { background: #112233; }
.alg-row.active { background: #152a40; border-left: 3px solid #66d9ff; }
.alg-row-icon { font-size: 20px; width: 28px; text-align: center; flex-shrink: 0; }
.alg-row-main { flex: 1; min-width: 0; }
.alg-row-name { font-size: 12px; font-weight: bold; color: #e0e0e0; }
.alg-row-desc { font-size: 10px; color: #6a8aaa; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.alg-row-badge { min-width: 18px; height: 18px; border-radius: 9px; color: #fff; font-size: 10px; display: flex; align-items: center; justify-content: center; font-weight: bold; }

.kpi { text-align: center; padding: 6px; background: #0a1a2a; border-radius: 4px; }
.kv { font-size: 18px; font-weight: bold; }
.kl { font-size: 10px; color: #6a8aaa; }
.sec { font-size: 12px; color: #409EFF; margin: 10px 0 4px; padding-bottom: 2px; border-bottom: 1px solid #1e3a5f; }
.cfg-form .el-form-item { margin-bottom: 6px; }

.feat-scroll { flex: 1; overflow-y: auto; padding: 8px; }
.feat-row { padding: 6px 8px; border-bottom: 1px solid #162d45; }
.feat-row:hover { background: #112233; }
.fr-top { display: flex; align-items: center; gap: 6px; margin-bottom: 2px; }
.fr-dev { font-size: 12px; color: #c0d5e8; font-weight: bold; }
.fr-pt { font-size: 11px; color: #8aa0b4; }
.fr-time { font-size: 10px; color: #5a7a9a; margin-left: auto; }
.fr-vals { display: flex; gap: 10px; font-size: 11px; color: #8aa0b4; }
.frv { font-family: monospace; }
.pg-btn { cursor: pointer; color: #409EFF; padding: 0 4px; user-select: none; }
.pg-btn:hover { color: #66d9ff; }
</style>
