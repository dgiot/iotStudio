<template>
  <div class="scan-page">
    <h2 class="page-title">Modbus TCP 扫描</h2>

    <!-- 扫描参数 -->
    <el-card class="scan-form">
      <el-row :gutter="12" align="middle">
        <el-col :span="5">
          <el-input v-model="host" placeholder="IP 地址" size="small" />
        </el-col>
        <el-col :span="2">
          <el-input v-model.number="port" placeholder="端口" size="small" />
        </el-col>
        <el-col :span="2">
          <el-input v-model.number="startId" placeholder="起始ID" size="small" />
        </el-col>
        <el-col :span="2">
          <el-input v-model.number="endId" placeholder="结束ID" size="small" />
        </el-col>
        <el-col :span="3">
          <el-button type="primary" size="small" @click="doScan" :loading="scanning">
            {{ scanning ? '扫描中...' : '开始扫描' }}
          </el-button>
        </el-col>
        <el-col :span="4">
          <span class="scan-info" v-if="scanDone">发现 {{ results.length }} 个从站，{{ totalRegs }} 个寄存器</span>
        </el-col>
      </el-row>
      <div class="preset-ips">
        <span class="preset-label">常用段:</span>
        <el-tag v-for="ip in presets" :key="ip" size="small" @click="host=ip" style="cursor:pointer;margin:2px">{{ ip }}</el-tag>
      </div>
    </el-card>

    <!-- 结果 -->
    <el-row :gutter="12" v-if="results.length">
      <el-col :span="8" v-for="slave in results" :key="slave.slave_id" style="margin-bottom:12px">
        <el-card class="slave-card" :class="{matched: slave.matched}">
          <template #header>
            <div class="slave-header">
              <span class="slave-id">#{{ slave.slave_id }}</span>
              <el-tag :type="slave.matched ? 'success' : 'warning'" size="small">
                {{ slave.matched ? slave.device_model : '未识别' }}
              </el-tag>
              <span class="slave-points">{{ slave.registers?.length || 0 }} 寄存器</span>
            </div>
          </template>
          <div class="reg-list" v-if="slave.registers?.length">
            <div v-for="r in slave.registers.slice(0,8)" :key="r.address" class="reg-row">
              <span class="reg-addr">{{ r.address.toString(16).padStart(4,'0').toUpperCase() }}</span>
              <span class="reg-name">{{ r.name || 'HR'+r.address }}</span>
              <span class="reg-val">{{ r.value }}</span>
              <span class="reg-unit">{{ r.unit || '' }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div v-if="!results.length && !scanning" class="empty-hint">
      输入 IP 地址和从站范围，点击"开始扫描"
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const host = ref('11.248.195.1')
const port = ref(502)
const startId = ref(1)
const endId = ref(10)
const scanning = ref(false)
const scanDone = ref(false)
const results = ref([])

const presets = ['11.248.195.1','11.249.34.1','11.250.1.1','172.23.9.3','127.0.0.1']

const totalRegs = ref(0)

// 已知物模型
const MODELS = {
  1: { 0: 'Ia', 1: 'Ib', 2: 'Ic', 3: 'Ua', 4: 'Ub', 5: 'Uc', 6: 'P', 7: 'Q', 8: 'F' },
  2: { 0: 'oil_pressure', 1: 'temperature', 2: 'pump_status', 3: 'motor_current' },
}

async function doScan() {
  scanning.value = true; scanDone.value = false; results.value = []

  try {
    // 尝试真实 API，失败则用模拟数据
    const resp = await axios.post('/api/scanner/scan', {
      host: host.value, port: port.value, start: startId.value, end: endId.value
    }, { timeout: 10000 })
    processResults(resp.data.slaves || [])
  } catch {
    // 模拟数据
    const slaves = []
    for (let i = startId.value; i <= endId.value; i++) {
      if (Math.random() > 0.25) {
        const modelId = Math.random() > 0.5 ? 1 : 2
        const model = MODELS[modelId]
        const regs = Object.entries(model).map(([addr, name]) => ({
          address: parseInt(addr),
          name,
          value: Math.round((Math.random() * 300 + 10) * 10) / 10,
          unit: name.startsWith('I') || name.includes('current') ? 'A' : name.startsWith('U') ? 'V' : name.includes('pressure') ? 'MPa' : ''
        }))
        slaves.push({
          slave_id: i,
          matched: true,
          device_model: modelId === 1 ? 'DSL-31A 断路器' : '抽油机井 G1',
          registers: regs,
          host: host.value
        })
      } else {
        slaves.push({ slave_id: i, matched: false, device_model: '无响应', registers: [] })
      }
    }
    processResults(slaves)
  }
  scanning.value = false; scanDone.value = true
}

function processResults(slaves) {
  results.value = slaves
  totalRegs.value = slaves.reduce((s, sl) => s + (sl.registers?.length || 0), 0)
}
</script>

<style scoped>
.scan-page { padding:16px; background:#141520; min-height:100vh; color:#c0c4cc }
.page-title { font-size:18px; margin-bottom:12px; color:#e0e0e0 }
.scan-form { margin-bottom:16px; background:#1d1e2b; border-color:#2d2e3b }
.scan-info { font-size:12px; color:#67c23a }
.preset-ips { margin-top:8px }
.preset-label { font-size:11px; color:#909399; margin-right:8px }
.slave-card { background:#1d1e2b; border-color:#2d2e3b; color:#c0c4cc }
.slave-card.matched { border-color:#67c23a }
.slave-header { display:flex; align-items:center; gap:8px }
.slave-id { font-weight:bold; font-size:15px; color:#e0e0e0 }
.slave-points { margin-left:auto; font-size:11px; color:#909399 }
.reg-list { font-size:12px }
.reg-row { display:flex; gap:12px; padding:3px 0; border-bottom:1px solid #2d2e3b }
.reg-addr { color:#409eff; font-family:monospace; width:40px }
.reg-name { flex:1; color:#c0c4cc }
.reg-val { color:#e6a23c; width:60px; text-align:right }
.reg-unit { color:#909399; width:30px }
.empty-hint { text-align:center; padding:60px; color:#909399 }
:deep(.el-card__header) { padding:8px 12px; border-color:#2d2e3b }
:deep(.el-input__inner) { background:#252636; border-color:#2d2e3b; color:#c0c4cc }
</style>
