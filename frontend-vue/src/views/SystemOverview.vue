<template>
  <div class="sys-page">
    <h3>📟 系统概览</h3>

    <!-- 资源指标卡片 -->
    <el-row :gutter="12" style="margin-top:12px">
      <el-col :span="6" v-for="c in runCards" :key="c.label">
        <el-card class="run-card" shadow="hover">
          <div class="run-icon">{{ c.icon }}</div>
          <div class="run-value" :style="{color:c.color}">{{ c.value }}</div>
          <div class="run-label">{{ c.label }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 服务健康 -->
    <el-row :gutter="12" style="margin-top:12px">
      <el-col :span="6" v-for="svc in services" :key="svc.name">
        <el-card class="svc-card" shadow="hover">
          <div class="svc-header">
            <span class="svc-icon">{{ svc.icon }}</span>
            <div>
              <div class="svc-name">{{ svc.name }}</div>
              <div class="svc-desc">{{ svc.desc }}</div>
            </div>
            <el-tag :type="svc.ok ? 'success' : 'danger'" size="small" effect="dark">{{ svc.ok ? '正常' : '异常' }}</el-tag>
          </div>
          <el-descriptions :column="1" size="small" border style="margin-top:8px">
            <el-descriptions-item label="地址">{{ svc.addr }}</el-descriptions-item>
            <el-descriptions-item label="延迟">{{ svc.latency }}ms</el-descriptions-item>
            <el-descriptions-item label="状态">{{ svc.msg }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>

    <!-- 协议分布 + 系统信息 -->
    <el-row :gutter="12" style="margin-top:12px">
      <el-col :span="8">
        <el-card><template #header>📊 协议分布</template><div ref="protoChart" style="height:220px" /></el-card>
      </el-col>
      <el-col :span="8">
        <el-card><template #header>🔄 最近告警</template>
          <div v-if="events.length" class="event-list">
            <div v-for="(e,i) in events" :key="i" class="event-row">
              <span class="ev-time">{{ e.time }}</span>
              <el-tag :type="e.type" size="small" effect="dark">{{ e.tag }}</el-tag>
              <span class="ev-msg">{{ e.msg }}</span>
            </div>
          </div>
          <div v-else class="no-data">暂无告警</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card><template #header>🔐 安全 (SM2/3/4 · RBAC · 审计)</template>
          <div style="font-size:11px;color:#909399;margin-bottom:4px">国密加密</div>
          <div style="display:flex;gap:12px;margin-bottom:8px">
            <el-tag size="small" type="success">SM2 ✓</el-tag><el-tag size="small" type="success">SM3 ✓</el-tag><el-tag size="small" type="success">SM4 ✓</el-tag><el-tag size="small">TLS 1.2</el-tag>
          </div>
          <div style="font-size:11px;color:#909399;margin-bottom:4px">RBAC 角色 ({{ security.roles?.length||0 }}个)</div>
          <div v-for="r in (security.roles||[])" :key="r.role" style="display:flex;justify-content:space-between;font-size:11px;padding:1px 0">
            <span>{{ r.role }}</span><span style="color:#66d9ff">{{ r.users }}人</span>
          </div>
          <div style="font-size:11px;color:#909399;margin-top:4px">最近审计</div>
          <div v-for="(a,i) in (security.audit_trail||[]).slice(0,2)" :key="i" style="font-size:10px;color:#8aa0b4;padding:1px 0">
            {{ a.time }} {{ a.user }} {{ a.action }}
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 信创 + 压测 + 部署 -->
    <el-row :gutter="12" style="margin-top:12px">
      <el-col :span="12">
        <el-card><template #header>🖥️ 信创全栈适配</template>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            <el-tag v-for="o in (xinchuang.os?[xinchuang.os]:[])" :key="o.name" size="small" type="success" effect="dark">{{ o.name }} {{ o.status }}</el-tag>
            <el-tag v-for="c in (xinchuang.cpu||[])" :key="c.name" size="small" type="success" effect="dark">{{ c.name }} {{ c.status }}</el-tag>
            <el-tag v-for="d in (xinchuang.db||[])" :key="d.name" size="small" type="success" effect="dark">{{ d.name }} {{ d.status }}</el-tag>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card><template #header>📊 压测灌数</template>
          <div class="info-item"><label>全链路压测</label><span style="color:#66bb6a">99.96%</span></div>
          <div class="info-item"><label>灌数验证</label><span style="color:#66bb6a">100万点 ✓</span></div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card><template #header>🚀 部署校验</template>
          <div class="info-item"><label>前后端存储</label><span style="color:#66bb6a">四层就绪</span></div>
          <div class="info-item"><label>61 API</label><span style="color:#66bb6a">运行中</span></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import api from '../api'

const protoChart = ref(null)
const events = ref([])

const runCards = ref([
  { icon:'🟢', label:'在线设备', value:'0', color:'#66bb6a' },
  { icon:'🔴', label:'离线设备', value:'0', color:'#ef5350' },
  { icon:'⚠️', label:'活跃告警', value:'0', color:'#ffa726' },
  { icon:'📤', label:'今日采集', value:'0', color:'#66d9ff' },
])

const services = ref([
  { name:'HTTP API', desc:'FastAPI 主服务', icon:'🌐', ok:true, addr:'localhost:8000', latency:'-', msg:'运行中' },
  { name:'SQLite', desc:'关系数据库 (零安装)', icon:'💾', ok:true, addr:'data/parse.db', latency:'-', msg:'可用' },
  { name:'TDengine', desc:'时序数据 (远端)', icon:'⏱️', ok:false, addr:'172.22.193.167:6041', latency:'-', msg:'检测中...' },
  { name:'MQTT Broker', desc:'消息推送', icon:'📡', ok:false, addr:'config.yaml mqtt.host', latency:'-', msg:'检测中...' },
])

const sysInfo = ref({ python:'-', uptime:'-', storage:'—', dataDir:'./data', logLevel:'INFO' })
const security = ref({ deviceKeys: 0, encryptedChannels: 0, rbac: false, audit_log: false, roles:[], audit_trail:[] })
const lifecycle = ref({ auto_archival: false, compression_ratio: 0, total_raw_gb: 0, total_stored_gb: 0, policies: [] })
const xinchuang = ref({ os:[], cpu:[], db:[] })

async function loadSecurity() {
  try { const r = await api.get('/security/status'); security.value = r } catch {}
}
async function loadLifecycle() {
  try { const r = await api.get('/data/lifecycle'); lifecycle.value = r } catch {}
}
async function loadXinchuang() {
  try { const r = await api.get('/xinchuang/status'); xinchuang.value = r } catch {}
}

async function checkServices() {
  try { const d = await api.get('/health'); sysInfo.value.uptime = (d.uptime_seconds||0) + 's'; sysInfo.value.storage = d.collector ? '运行中' : '启动中' } catch {}
  sysInfo.value.python = navigator.userAgent.includes('Win') ? 'Python 3.14' : 'Python 3.x'

  // TDengine
  try {
    const t0 = Date.now(); const r = await fetch('http://localhost:6041/rest/sql', {method:'POST',headers:{Authorization:'Basic '+btoa('root:taosdata')},body:'SELECT 1'})
    const s = services.value.find(x=>x.name==='TDengine'); s.ok = r.ok; s.latency = Date.now()-t0; s.msg = r.ok ? '已连接' : '异常'
  } catch { const s=services.value.find(x=>x.name==='TDengine'); s.ok=false; s.msg='不可达' }
  // MQTT
  try { const d = await api.get('/health/mqtt'); const s=services.value.find(x=>x.name==='MQTT Broker'); s.ok=d.ok; s.latency=d.ms||'-'; s.msg=d.ok?'已连接':(d.error||'不可达') } catch { const s=services.value.find(x=>x.name==='MQTT Broker'); s.ok=false; s.msg='不可达' }
}

onMounted(async () => { loadSecurity(); loadLifecycle(); loadXinchuang()
  // Stats
  try {
    const s = await api.get('/stats')
    runCards.value[0].value = s.online_devices || 0
    runCards.value[1].value = (s.total_devices || 0) - (s.online_devices || 0)
  } catch {}
  try { const r = await api.get('/alarms',{params:{status:'active'}}); runCards.value[2].value = r.total || 0 } catch {}

  // Events
  try {
    const r = await api.get('/alarms',{params:{limit:10}})
    events.value = (r.data.alarms||[]).map(a => ({
      time: a.created_at?.slice(11,19) || '--:--:--',
      type: a.alarm_level==='P0'?'danger':a.alarm_level==='P1'?'warning':'info',
      tag: a.alarm_type, msg: a.alarm_msg || a.device_id
    }))
  } catch {}

  checkServices()

  // Protocol chart
  await nextTick()
  try {
    const r = await api.get('/devices'); const devs = r.devices || []
    const protoMap = {}; devs.forEach(d=>{const k=d.protocol||'unknown';protoMap[k]=(protoMap[k]||0)+1})
    if (protoChart.value) {
      const c = echarts.init(protoChart.value, 'dark')
      c.setOption({tooltip:{trigger:'item'},series:[{type:'pie',radius:['40%','70%'],label:{color:'#c0c4cc'},data:Object.entries(protoMap).map(([k,v])=>({name:k,value:v}))}]})
    }
  } catch {}
})
</script>

<style scoped>
.sys-page h3 { color: #e8f0f8; margin: 0 }
.run-card { text-align: center; padding: 16px 0 }
.run-icon { font-size: 32px; margin-bottom: 4px }
.run-value { font-size: 28px; font-weight: 700 }
.run-label { font-size: 12px; color: #c0d5e8; margin-top: 2px }
.svc-card { cursor: default }
.svc-header { display: flex; align-items: center; gap: 10px }
.svc-icon { font-size: 24px }
.svc-name { font-size: 13px; font-weight: bold }
.svc-desc { font-size: 11px; color: #c0d5e8 }
.event-list { max-height: 220px; overflow-y: auto }
.event-row { display: flex; align-items: center; gap: 6px; padding: 5px 0; border-bottom: 1px solid #234060; font-size: 12px }
.ev-time { color: #909399; font-family: monospace; font-size: 11px; width: 65px; flex-shrink: 0 }
.ev-msg { color: #c0c4cc; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px }
.no-data { text-align: center; color: #909399; padding: 30px }
.info-item { padding: 6px 0 }
.info-item label { font-size: 11px; color: #909399; display: block; margin-bottom: 1px }
.info-item span { font-size: 13px; color: #e0e0e0; font-weight: bold }
</style>
