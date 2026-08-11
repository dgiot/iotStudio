<template>
  <div class="sim-page">
    <div class="sp-top">
      <h3>🎛️ 设备模拟</h3>
      <div class="sp-actions">
        <el-button type="primary" size="small" @click="startAll" :loading="starting">▶ 全部启动</el-button>
        <el-button type="danger" size="small" @click="stopAll">⏹ 全部停止</el-button>
        <el-tag type="success" size="small" effect="dark">{{ runningCount }}/{{ simulators.length }} 运行中</el-tag>
      </div>
    </div>

    <el-row :gutter="12" style="margin-top:12px">
      <el-col :span="8" v-for="sim in simulators" :key="sim.id">
        <el-card class="sim-card" :class="{ running: sim.status==='running', inactive: sim.status==='stopped' }" shadow="hover">
          <template #header>
            <div class="sim-hdr">
              <span class="sim-icon">{{ protoIcons[sim.protocol] || '📡' }}</span>
              <div class="sim-title">
                <span class="sim-name">{{ sim.name }}</span>
                <span class="sim-proto">{{ sim.protocol }}</span>
              </div>
              <div class="sim-status-dot" :class="sim.status" />
              <el-tag :type="sim.status==='running'?'success':'info'" size="small" effect="dark">
                {{ sim.status==='running' ? '● 运行中' : '○ 已停止' }}
              </el-tag>
            </div>
          </template>

          <el-descriptions :column="2" size="small" border>
            <el-descriptions-item label="端口">{{ sim.port }}</el-descriptions-item>
            <el-descriptions-item label="设备">{{ sim.device }}</el-descriptions-item>
            <el-descriptions-item label="测点">{{ sim.itemCount }} 个</el-descriptions-item>
            <el-descriptions-item label="通道">{{ sim.channel || '—' }}</el-descriptions-item>
          </el-descriptions>

          <!-- 模拟数据预览 -->
          <div class="sim-preview" v-if="sim.status==='running'">
            <div class="preview-title">📊 实时模拟值</div>
            <div class="preview-items">
              <div class="pv-item" v-for="(v,k) in (sim.sampleValues||genSamples(sim)).slice(0,4)" :key="k">
                <span class="pv-name">{{ v.name || 'reg_'+k.toString(16) }}</span>
                <span class="pv-val">{{ v.value }}</span>
              </div>
            </div>
          </div>

          <div class="sim-ftr">
            <el-button size="small" @click="openRegPanel(sim)" v-if="sim.status==='running'&&sim.protocol.includes('Modbus')">🔧 寄存器设置</el-button>
            <span class="sim-cmd" v-else-if="sim.status==='stopped'">终端: {{ sim.startCmd }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 协议报文日志 -->
    <el-card class="log-card" style="margin-top:12px">
      <template #header>
        <div class="log-hdr">
          <span>📋 协议报文日志</span>
          <el-button size="small" @click="packetLog=[]">清空</el-button>
        </div>
      </template>
      <div class="packet-log" v-if="packetLog.length">
        <div class="pkt-row" v-for="(p,i) in packetLog" :key="i">
          <span class="pkt-time">{{ p.time }}</span>
          <span class="pkt-proto">{{ p.protocol }}</span>
          <span class="pkt-dir" :class="p.dir">{{ p.dir }}</span>
          <span class="pkt-hex">{{ p.hex }}</span>
        </div>
      </div>
      <div v-else class="pkt-empty">暂无报文 — 启动模拟器后将有 Modbus/OPC UA/IEC104 协议数据</div>
    </el-card>

    <!-- 寄存器设置弹窗 -->
    <el-dialog v-model="regVisible" :title="`🔧 ${regSim?.name} — 寄存器固定值`" width="500px">
      <p style="font-size:12px;color:#8aa0b4;margin-bottom:8px">设置固定值后，模拟器停止动态变化。清空恢复动态模拟。</p>
      <el-table :data="regList" size="small" max-height="360">
        <el-table-column prop="addr" label="地址" width="80"><template #default="{row}">0x{{ row.addr.toString(16) }}</template></el-table-column>
        <el-table-column label="动态值" width="100"><template #default="{row}"><span :style="{color:row.fixed?'#8aa0b4':'#66bb6a'}">{{ row.dynamic }}</span></template></el-table-column>
        <el-table-column label="固定值" width="140">
          <template #default="{row}">
            <el-input-number v-model="row.value" size="small" :step="1" style="width:120px" controls-position="right" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{row}">
            <el-button size="small" type="primary" @click="setReg(row)">设置</el-button>
            <el-button size="small" @click="clearReg(row)">清空</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import api from '../api'

const protoIcons = { 'Modbus TCP':'🔌', 'Modbus RTU':'🔌', 'IEC 104':'⚡', 'OPC UA':'🔗', 'OPC DA':'🖥️' }
const simulators = ref([])
const packetLog = ref([])
const starting = ref(false)
let timer = null

const runningCount = computed(() => simulators.value.filter(s => s.status==='running').length)

async function loadStatus() {
  try {
    const r = await api.get('/simulators/status')
    simulators.value = (r.simulators||r.data?.simulators||[]).map(s => ({
      ...s,
      sampleValues: s.status==='running' ? genSamples(s) : null,
      updateRate: s.protocol==='IEC 104'?'2s':'1s',
    }))
  } catch {}
}

function genSamples(sim) {
  const samples = []
  const base = sim.port % 100
  for (let i=0;i<Math.min(sim.itemCount,6);i++) {
    samples.push({
      name: `reg_${i.toString(16)}`,
      value: (base + Math.sin(Date.now()/3000 + i) * 3 + Math.random()*0.5).toFixed(2),
    })
  }
  return samples
}

async function loadPackets() {
  try {
    const r = await api.get('/packets', {params:{limit:20}})
    const raw = r.packets||r.data?.packets||[]
    packetLog.value = raw.slice(-10).map(p => ({
      time: p.time||(p.ts?new Date(p.ts*1000).toLocaleTimeString():new Date().toLocaleTimeString()),
      protocol: p.protocol||(p.device?.includes('iec')?'IEC104':p.device?.includes('opc')?'OPCUA':'Modbus'),
      dir: (p.dir||'--').toUpperCase(),
      hex: (p.hex||'').slice(0,60),
    }))
  } catch {}
}

async function startAll() {
  starting.value = true
  try {
    const r = await api.post('/simulators/start-all')
    ElMessage.success(r.data.msg || '模拟器启动中')
    setTimeout(() => { loadStatus(); starting.value = false }, 3000)
  } catch { starting.value = false; ElMessage.error('启动失败') }
}
async function stopAll() {
  try {
    const r = await api.post('/simulators/stop-all')
    ElMessage.success(r.data.msg || '模拟器已停止')
    setTimeout(loadStatus, 1000)
  } catch { ElMessage.error('停止失败') }
}

onMounted(() => {
  loadStatus(); loadPackets()
  timer = setInterval(() => { loadStatus(); loadPackets() }, 5000)
})
const regVisible = ref(false), regSim = ref(null), regList = ref([])

function openRegPanel(sim) {
  regSim.value = sim
  // 生成模拟寄存器列表 (匹配采集器读取的地址)
  const base = sim.port % 100
  regList.value = [0,2,4,6,8,10,16].map(addr => ({
    addr, value: Math.round(base + Math.sin(Date.now()/3000)*3 + Math.random()*0.5),
    dynamic: Math.round(base + Math.sin(Date.now()/3000)*3 + Math.random()*0.5),
    fixed: false,
  }))
  regVisible.value = true
}

async function setReg(row) {
  try {
    await api.post(`/simulators/${regSim.value.id}/register/${row.addr}?value=${row.value}`)
    row.fixed = true; row.dynamic = row.value
    ElMessage.success(`0x${row.addr.toString(16)} = ${row.value}`)
  } catch { ElMessage.error('设置失败') }
}

async function clearReg(row) {
  try {
    await api.post(`/simulators/${regSim.value.id}/register/${row.addr}?value=0`)
    row.fixed = false
    ElMessage.success('已恢复动态')
  } catch {}
}

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.sim-page h3 { color: #e8f0f8; margin: 0; }
.sp-top { display: flex; justify-content: space-between; align-items: center; }
.sp-actions { display: flex; gap: 8px; align-items: center; }

.sim-card { transition: all 0.3s; border: 1px solid #234060; }
.sim-card.running { border-color: #66bb6a; box-shadow: 0 0 12px rgba(102,187,106,0.15); }
.sim-card.inactive { opacity: 0.8; }
.sim-hdr { display: flex; align-items: center; gap: 10px; }
.sim-icon { font-size: 24px; }
.sim-title { flex: 1; }
.sim-name { font-size: 14px; font-weight: bold; color: #e8f0f8; display: block; }
.sim-proto { font-size: 11px; color: #8aa0b4; }
.sim-status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.sim-status-dot.running { background: #66bb6a; animation: pulse 1.5s infinite; }
.sim-status-dot.stopped { background: #8aa0b4; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

.sim-preview { background: #1a3050; border-radius: 6px; padding: 8px; margin-top: 8px; }
.preview-title { font-size: 11px; color: #8aa0b4; margin-bottom: 4px; }
.preview-items { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 8px; }
.pv-item { display: flex; justify-content: space-between; font-size: 12px; font-family: monospace; }
.pv-name { color: #66d9ff; }
.pv-val { color: #66bb6a; font-weight: bold; }

.sim-ftr { margin-top: 8px; }
.sim-cmd { font-size: 11px; color: #8aa0b4; font-family: monospace; }

.log-hdr { display: flex; justify-content: space-between; align-items: center; }
.packet-log { max-height: 200px; overflow-y: auto; font-family: monospace; font-size: 11px; }
.pkt-empty { text-align: center; color: #c0d5e8; padding: 30px; font-size: 13px; }
.pkt-row { display: flex; gap: 8px; padding: 2px 6px; border-bottom: 1px solid #1a3050; }
.pkt-row:hover { background: rgba(79,195,247,0.05); }
.pkt-time { color: #8aa0b4; width: 70px; flex-shrink: 0; }
.pkt-proto { color: #66d9ff; width: 60px; flex-shrink: 0; }
.pkt-dir { width: 24px; flex-shrink: 0; font-weight: bold; }
.pkt-dir.TX { color: #ffa726; } .pkt-dir.RX { color: #66bb6a; }
.pkt-hex { color: #d0e0ee; word-break: break-all; flex: 1; }
</style>
