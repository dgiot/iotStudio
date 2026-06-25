<template>
  <div class="scanner-page">
    <h3 style="color:#c0d5e8;margin-bottom:12px">🔍 网络扫描</h3>

    <!-- 扫描表单 -->
    <el-card shadow="never" class="scan-card" style="margin-bottom:12px">
      <el-form :inline="true" :model="form" size="small">
        <el-form-item label="主机"><el-input v-model="form.host" placeholder="127.0.0.1" style="width:140px" /></el-form-item>
        <el-form-item label="端口"><el-input-number v-model="form.port" :min="1" :max="65535" style="width:100px" /></el-form-item>
        <el-form-item label="从站范围">{{ form.start }} - {{ form.end }}</el-form-item>
        <el-form-item><el-button type="primary" @click="doScan" :loading="scanning"><el-icon><Search /></el-icon>扫描</el-button></el-form-item>
      </el-form>
    </el-card>

    <!-- 结果 -->
    <el-row :gutter="12">
      <el-col :span="12">
        <el-card shadow="never" class="scan-card">
          <template #header><span>从站列表 ({{ slaves.length }})</span></template>
          <el-table :data="slaves" size="small" max-height="400" v-loading="scanning" empty-text="点击扫描按钮">
            <el-table-column prop="slave_id" label="从站ID" width="80" align="center" />
            <el-table-column label="寄存器数" width="100" align="center">
              <template #default="{row}">{{ row.registers?.length || 0 }}</template>
            </el-table-column>
            <el-table-column label="示例值" min-width="200">
              <template #default="{row}">
                <span v-for="r in (row.registers||[]).slice(0,4)" :key="r.address" style="margin-right:8px;font-size:12px">
                  <el-tag size="small" effect="plain">0x{{ r.address.toString(16) }}={{ r.value }}</el-tag>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center">
              <template #default="{row}">
                <el-button link type="primary" size="small" @click="addDevice(row)">添加设备</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="never" class="scan-card">
          <template #header><span>报文追溯</span></template>
          <div v-if="!packets.length" style="color:#8899aa;text-align:center;padding:40px">
            <el-icon :size="32"><Connection /></el-icon>
            <p style="margin-top:8px">选择设备查看报文</p>
            <el-select v-model="selectedDevice" placeholder="选择设备" size="small" style="width:200px;margin-top:8px" @change="loadPackets">
              <el-option v-for="d in devices" :key="d.device_id" :label="d.device_name" :value="d.device_id" />
            </el-select>
          </div>
          <div v-else class="packet-list" ref="packetList">
            <div v-for="(p,i) in packets" :key="i" class="packet-row" :class="p.dir">
              <span class="p-dir" :style="{color: p.dir==='TX'?'#4fc3f7':'#66bb6a'}">{{ p.dir }}</span>
              <span class="p-len">{{ p.len }}B</span>
              <span class="p-hex">{{ p.hex.slice(0,60) }}{{ p.hex.length>60?'...':'' }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const form = reactive({ host:'127.0.0.1', port:502, start:1, end:10 })
const scanning = ref(false)
const slaves = ref([])
const devices = ref([])
const selectedDevice = ref('')
const packets = ref([])

async function doScan() {
  scanning.value = true; slaves.value = []
  try {
    const r = await axios.post('/api/scanner/scan', { ...form })
    if (r.data.error) { ElMessage.error(r.data.error) }
    else {
      slaves.value = r.data.slaves || []
      ElMessage.success(`发现 ${slaves.value.length} 个从站`)
    }
  } catch(e) { ElMessage.error('扫描失败') }
  scanning.value = false
}

async function loadPackets() {
  packets.value = []
  if (!selectedDevice.value) return
  try {
    const r = await axios.get(`/api/scanner/packet/${selectedDevice.value}`)
    packets.value = r.data.traces || []
  } catch { packets.value = [] }
}

async function addDevice(row) {
  ElMessage.info(`从站 ${row.slave_id} — 请到设备管理页手动添加`)
}

onMounted(async () => {
  try { const r = await axios.get('/api/devices'); devices.value = r.data.devices || [] } catch {}
})
</script>

<style scoped>
.scanner-page { color: #c0d5e8; }
.scan-card { background: #0f1f3a; border: 1px solid #1a3a5c; }
.scan-card :deep(.el-card__header) { color: #c0d5e8; border-bottom: 1px solid #1a3a5c; padding: 8px 14px; font-size: 13px; }
.el-table { background: transparent; --el-table-tr-bg-color: #0d1b30; --el-table-header-bg-color: #122540; }
.packet-list { max-height: 400px; overflow-y: auto; font-family: monospace; font-size: 12px; }
.packet-row { padding: 4px 8px; border-bottom: 1px solid #1a3a5c; display: flex; gap: 12px; align-items: center; }
.packet-row:hover { background: rgba(79,195,247,0.05); }
.p-dir { font-weight: bold; width: 24px; }
.p-len { color: #8899aa; width: 36px; }
.p-hex { color: #c0d5e8; word-break: break-all; }
</style>
