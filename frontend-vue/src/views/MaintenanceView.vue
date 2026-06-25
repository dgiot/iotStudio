<template>
  <div class="maint-page">
    <h3 style="color:#c0d5e8;margin-bottom:12px">🔧 运维管理</h3>

    <!-- 系统状态卡片 -->
    <el-row :gutter="12" style="margin-bottom:12px">
      <el-col :span="6" v-for="c in statusCards" :key="c.label">
        <el-card shadow="hover" class="st-card">
          <div class="st-label">{{ c.label }}</div>
          <div class="st-val" :style="{color:c.color}">{{ c.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="12">
      <!-- 服务状态 -->
      <el-col :span="12">
        <el-card shadow="never" class="sec-card">
          <template #header><span>服务状态</span></template>
          <el-table :data="services" size="small">
            <el-table-column prop="name" label="服务" width="140" />
            <el-table-column prop="host" label="地址" width="180" />
            <el-table-column prop="status" label="状态" width="100" align="center">
              <template #default="{row}"><el-tag :type="row.online?'success':'danger'" size="small">{{ row.online?'运行':'离线' }}</el-tag></template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center">
              <template #default="{row}"><el-button link size="small" @click="checkPort(row)">检测</el-button></template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- 数据库状态 -->
        <el-card shadow="never" class="sec-card" style="margin-top:12px">
          <template #header><span>数据库</span></template>
          <el-descriptions :column="2" size="small" border>
            <el-descriptions-item label="PostgreSQL">{{ pgStatus }}</el-descriptions-item>
            <el-descriptions-item label="TDengine">{{ tdStatus }}</el-descriptions-item>
            <el-descriptions-item label="SQLite 降级">{{ sqliteStatus }}</el-descriptions-item>
            <el-descriptions-item label="遥测记录">{{ telemetryRows }} 条</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>

      <!-- 实时日志 -->
      <el-col :span="12">
        <el-card shadow="never" class="sec-card">
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span>系统日志</span>
              <el-button size="small" @click="refreshLogs">刷新</el-button>
            </div>
          </template>
          <div class="log-box" ref="logBox">
            <div v-if="!logs.length" class="log-empty">暂无日志</div>
            <div v-for="(l,i) in logs" :key="i" class="log-line" :class="l.level">
              <span class="log-ts">{{ l.ts }}</span>
              <span class="log-msg">{{ l.msg }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const statusCards = ref([
  { label: '运行时间', value: '--', color: '#4fc3f7' },
  { label: '在线设备', value: '0', color: '#66bb6a' },
  { label: '采集成功率', value: '0%', color: '#ffc107' },
  { label: '活跃告警', value: '0', color: '#ef5350' },
])

const services = ref([
  { name: 'Modbus TCP 逆变器', host: '127.0.0.1:502', online: false },
  { name: 'Modbus TCP 储能', host: '127.0.0.1:1502', online: false },
  { name: 'Modbus TCP 充电桩', host: '127.0.0.1:2502', online: false },
  { name: 'Modbus 电表', host: '127.0.0.1:503', online: false },
  { name: 'IEC 104', host: '127.0.0.1:2404', online: false },
  { name: 'OPC UA', host: '127.0.0.1:4840', online: false },
  { name: 'OPC DA', host: '127.0.0.1:9090', online: false },
])

const pgStatus = ref('未连接')
const tdStatus = ref('未连接')
const sqliteStatus = ref('--')
const telemetryRows = ref(0)
const logs = ref([])
let timer = null

async function checkPort(svc) {
  try { const r = await axios.get('/api/simulators/status'); const sims = r.data.simulators||[]
    sims.forEach(s => { if (s.port === parseInt(svc.host.split(':')[1])) svc.online = s.status==='running' })
  } catch {}
}

async function refreshLogs() {
  try {
    const r = await axios.get('/api/packets?limit=20')
    logs.value = (r.data.packets||[]).slice(-15).map(p => ({ ts: new Date(p.ts*1000).toLocaleTimeString(), level: 'info', msg: `[${p.dir}] ${p.device} ${p.len}B ${p.hex.slice(0,40)}` }))
  } catch {}
}

async function loadAll() {
  try {
    const [stats, alarms, sims] = await Promise.all([
      axios.get('/api/stats'), axios.get('/api/alarms?status=active'), axios.get('/api/simulators/status')
    ])
    const s = stats.data; const a = alarms.data; const sm = sims.data
    statusCards.value[0].value = '--'
    statusCards.value[1].value = s.online_devices || 0
    statusCards.value[2].value = (s.success_rate||0) + '%'
    statusCards.value[3].value = a.total || 0

    sm.simulators?.forEach(s => {
      const svc = services.value.find(v => v.host.includes(':'+s.port))
      if (svc) svc.online = s.status === 'running'
    })

    sqliteStatus.value = '正常 (data/telemetry.db)'
  } catch {}
}

onMounted(() => { loadAll(); refreshLogs(); timer = setInterval(loadAll, 8000) })
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.maint-page { color: #c0d5e8; }
.st-card { background: #0f1f3a; border: 1px solid #1a3a5c; }
.st-label { font-size: 12px; color: #8899aa; margin-bottom: 4px; }
.st-val { font-size: 24px; font-weight: bold; }
.sec-card { background: #0f1f3a; border: 1px solid #1a3a5c; }
.sec-card :deep(.el-card__header) { color: #c0d5e8; border-bottom: 1px solid #1a3a5c; padding: 8px 14px; font-size: 13px; }
.el-table { background: transparent; --el-table-tr-bg-color: #0d1b30; --el-table-header-bg-color: #122540; }
.log-box { max-height: 340px; overflow-y: auto; font-family: monospace; font-size: 12px; background: #0a1628; border-radius: 6px; padding: 8px; }
.log-empty { color: #8899aa; text-align: center; padding: 40px; }
.log-line { padding: 2px 6px; border-bottom: 1px solid #1a3a5c; display: flex; gap: 12px; }
.log-ts { color: #8899aa; flex-shrink: 0; }
.log-msg { color: #c0d5e8; word-break: break-all; }
.log-line.warning .log-msg { color: #ffc107; }
.log-line.error .log-msg { color: #ef5350; }
.el-descriptions { --el-descriptions-item-bordered-label-background: rgba(255,255,255,0.03); }
</style>
