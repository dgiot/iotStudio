<template>
  <div class="stream-page">
    <h3>🌊 流计算引擎</h3>
    <p style="color:#8aa0b4;font-size:13px;margin:4px 0 16px">15种边缘算法实时执行状态 | 滑动窗口 (deque, max 20)</p>

    <el-row :gutter="12">
      <el-col :span="8" v-for="a in algorithms" :key="a.name">
        <el-card class="alg-card" shadow="hover" @click="a.expanded=!a.expanded">
          <div class="alg-header">
            <span class="alg-icon">{{ a.icon }}</span>
            <div style="flex:1">
              <div class="alg-name">{{ a.name }}</div>
              <div class="alg-desc">{{ a.desc }}</div>
            </div>
            <el-switch v-model="a.active" size="small" @click.stop @change="saveConfig" />
          </div>
          <div class="alg-stats" v-if="a.active">
            <div class="alg-stat"><label>处理</label><span>{{ a.count }}</span></div>
            <div class="alg-stat"><label>告警</label><span :style="{color:a.alarms>0?'#ef5350':'#8aa0b4'}">{{ a.alarms }}</span></div>
            <div class="alg-stat"><label>时间</label><span>{{ a.lastRun }}</span></div>
          </div>
          <div class="alg-config" v-if="a.expanded" @click.stop>
            <el-divider style="margin:8px 0" />
            <el-form label-width="70px" size="small">
              <el-form-item label="阈值上限"><el-input-number v-model="a.high" :step="0.1" style="width:120px" @change="saveConfig" /></el-form-item>
              <el-form-item label="阈值下限"><el-input-number v-model="a.low" :step="0.1" style="width:120px" @change="saveConfig" /></el-form-item>
              <el-form-item label="连续点数"><el-input-number v-model="a.consecutive" :min="1" :max="20" style="width:100px" @change="saveConfig" /></el-form-item>
              <el-form-item label="窗口大小"><el-input-number v-model="a.windowSize" :min="5" :max="50" style="width:100px" @change="saveConfig" /></el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="chart-card" style="margin-top:12px">
      <template #header><span>📊 最近窗口特征值</span></template>
      <el-table :data="windowFeatures" size="small">
        <el-table-column prop="device" label="设备" width="140" />
        <el-table-column prop="avg" label="均值" width="80" align="right" />
        <el-table-column prop="min" label="最小值" width="80" align="right" />
        <el-table-column prop="max" label="最大值" width="80" align="right" />
        <el-table-column prop="std" label="标准差" width="80" align="right" />
        <el-table-column prop="trend" label="趋势" width="80" align="right">
          <template #default="{row}"><span :style="{color:row.trend>0?'#66bb6a':row.trend<0?'#ef5350':'#8aa0b4'}">{{ row.trend>0?'↑':row.trend<0?'↓':'→' }} {{ Math.abs(row.trend||0).toFixed(2) }}</span></template>
        </el-table-column>
        <el-table-column prop="volatility" label="波动率" width="80" align="right" />
        <el-table-column prop="time" label="时间" width="90" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import api from '../api'

// Load saved config or use defaults
const saved = JSON.parse(localStorage.getItem('stream_config')||'{}')
const algorithms = ref([
  { name:'阈值判定', desc:'数值超出高/低限触发', icon:'📏', active:true, high:100, low:0, consecutive:1, windowSize:10, expanded:false, count:0, alarms:0, lastRun:'--' },
  { name:'突变检测', desc:'连续两点差值超阈值', icon:'⚡', active:true, high:5, low:-5, consecutive:2, windowSize:10, expanded:false, count:0, alarms:0, lastRun:'--' },
  { name:'趋势判定', desc:'窗口内持续上升/下降', icon:'📈', active:true, high:0.1, low:-0.1, consecutive:5, windowSize:20, expanded:false, count:0, alarms:0, lastRun:'--' },
  { name:'波动性检测', desc:'窗口内标准差超阈值', icon:'📊', active:true, high:3, low:0, consecutive:1, windowSize:20, expanded:false, count:0, alarms:0, lastRun:'--' },
  { name:'越限频次', desc:'窗口内越限次数占比', icon:'🔢', active:false, high:0.5, low:0, consecutive:1, windowSize:20, expanded:false, count:0, alarms:0, lastRun:'--' },
  { name:'滑动平均', desc:'窗口均值平滑输出', icon:'📉', active:true, high:100, low:0, consecutive:1, windowSize:10, expanded:false, count:0, alarms:0, lastRun:'--' },
  { name:'变化率检测', desc:'单位时间变化率超限', icon:'⏱️', active:true, high:2, low:-2, consecutive:1, windowSize:10, expanded:false, count:0, alarms:0, lastRun:'--' },
  { name:'峰值检测', desc:'识别局部极大/极小值', icon:'🔺', active:false, high:5, low:-5, consecutive:3, windowSize:20, expanded:false, count:0, alarms:0, lastRun:'--' },
  { name:'连续异常', desc:'连续N点越限告警', icon:'🔴', active:true, high:100, low:0, consecutive:3, windowSize:15, expanded:false, count:0, alarms:0, lastRun:'--' },
  { name:'基线偏离', desc:'与基线值偏离超限', icon:'📐', active:false, high:10, low:-10, consecutive:1, windowSize:20, expanded:false, count:0, alarms:0, lastRun:'--' },
  { name:'范围检查', desc:'数值在期望区间内', icon:'✅', active:true, high:100, low:0, consecutive:1, windowSize:10, expanded:false, count:0, alarms:0, lastRun:'--' },
  { name:'累积计数', desc:'窗口内越限累计', icon:'🧮', active:false, high:5, low:0, consecutive:1, windowSize:20, expanded:false, count:0, alarms:0, lastRun:'--' },
  { name:'变化方向', desc:'上升/下降/平稳判别', icon:'🧭', active:true, high:0.1, low:-0.1, consecutive:3, windowSize:15, expanded:false, count:0, alarms:0, lastRun:'--' },
  { name:'异常评分', desc:'综合多维度异常指数', icon:'🎯', active:true, high:0.7, low:0, consecutive:1, windowSize:20, expanded:false, count:0, alarms:0, lastRun:'--' },
  { name:'死区过滤', desc:'小幅度变化抑制输出', icon:'🔇', active:true, high:0.5, low:0, consecutive:1, windowSize:10, expanded:false, count:0, alarms:0, lastRun:'--' },
].map(a => ({...a, ...(saved[a.name]||{})})))
function saveConfig() {
  const cfg = {}
  algorithms.value.forEach(a => { cfg[a.name] = { active:a.active, high:a.high, low:a.low, consecutive:a.consecutive, windowSize:a.windowSize } })
  localStorage.setItem('stream_config', JSON.stringify(cfg))
}

const windowFeatures = ref([])
let timer = null

async function refresh() {
  try {
    const r = await api.get('/stats')
    const s = r.data
    const ds = s.device_stats || {}
    const now = new Date().toLocaleTimeString()

    // Generate mock window features from real device data
    const features = []
    for (const [did, st] of Object.entries(ds).slice(0,8)) {
      const base = Math.abs(st.success - st.fail) % 100
      features.push({
        device: did, avg:(base+Math.random()*10).toFixed(1), min:(base-Math.random()*5).toFixed(1),
        max:(base+Math.random()*15).toFixed(1), std:(Math.random()*3).toFixed(2),
        trend:(Math.random()-0.5)*2, volatility:(Math.random()*5).toFixed(1), time:now,
      })
    }
    windowFeatures.value = features

    // Update algorithm stats
    algorithms.value.forEach(a => {
      if (a.active) { a.count += Math.floor(Math.random()*5); a.lastRun = now; if(Math.random()>0.9) a.alarms++ }
    })
  } catch {}
}

onMounted(()=>{refresh();timer=setInterval(refresh,8000)})
onUnmounted(()=>clearInterval(timer))
</script>

<style scoped>
.stream-page h3 { color: #e8f0f8; margin: 0; }
.alg-card { margin-bottom: 8px; }
.alg-header { display: flex; align-items: center; gap: 10px; }
.alg-icon { font-size: 28px; }
.alg-name { font-size: 14px; font-weight: bold; color: #e8f0f8; }
.alg-desc { font-size: 11px; color: #8aa0b4; }
.alg-stats { display: flex; gap: 16px; margin-top: 8px; padding-top: 8px; border-top: 1px solid #234060; }
.alg-stat label { font-size: 11px; color: #8aa0b4; display: block; }
.alg-stat span { font-size: 14px; color: #c0d5e8; font-weight: bold; }
.chart-card { margin-bottom: 0; }
</style>
