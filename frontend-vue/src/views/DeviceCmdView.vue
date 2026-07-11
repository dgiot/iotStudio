<template>
  <div class="cmd-page">
    <h3>🎮 设备远程控制</h3>
    <el-row :gutter="16" style="margin-top:16px">
      <el-col :span="8">
        <el-card class="sec-card">
          <template #header><span>📟 选择设备</span></template>
          <el-select v-model="selectedDevice" placeholder="选择设备" style="width:100%" @change="loadPoints">
            <el-option v-for="d in deviceList" :key="d.device_id" :label="`${d.device_name} (${d.device_id})`" :value="d.device_id" />
          </el-select>
          <el-descriptions v-if="deviceInfo" :column="1" border size="small" style="margin-top:12px">
            <el-descriptions-item label="设备ID">{{ deviceInfo.device_id }}</el-descriptions-item>
            <el-descriptions-item label="协议">{{ deviceInfo.protocol }}</el-descriptions-item>
            <el-descriptions-item label="类型">{{ typeMap[deviceInfo.device_type] }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="deviceInfo.status==='online'?'success':'info'" size="small">{{ deviceInfo.status }}</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="sec-card">
          <template #header><span>⚙️ 指令下发</span></template>
          <el-form label-width="80px" size="small">
            <el-form-item label="测点"><el-select v-model="cmd.pointId" placeholder="选择测点" style="width:100%"><el-option v-for="p in pointList" :key="p.point_id" :label="`${p.point_name} (${p.protocol_addr})`" :value="p.point_id" /></el-select></el-form-item>
            <el-form-item label="指令类型">
              <el-radio-group v-model="cmd.type">
                <el-radio value="write">写寄存器</el-radio>
                <el-radio value="start">启动</el-radio>
                <el-radio value="stop">停止</el-radio>
                <el-radio value="reset">复位</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="写入值" v-if="cmd.type==='write'"><el-input-number v-model="cmd.value" :step="1" style="width:150px" /></el-form-item>
            <el-form-item label="MQTT主题"><el-input v-model="cmd.topic" :placeholder="`$dg/device/${selectedDevice||'inv_01'}/command`" /></el-form-item>
            <el-form-item>
              <el-button type="primary" @click="sendCommand" :disabled="!selectedDevice">🚀 发送指令</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="sec-card">
          <template #header><span>📋 指令历史</span></template>
          <div class="cmd-log">
            <div v-if="!cmdHistory.length" class="cmd-empty">暂无指令记录</div>
            <div v-for="(c,i) in cmdHistory" :key="i" class="cmd-row">
              <span class="cmd-time">{{ c.time }}</span>
              <el-tag :type="c.status==='ok'?'success':'danger'" size="small" effect="dark">{{ c.status }}</el-tag>
              <span class="cmd-dev">{{ c.device }}</span>
              <span class="cmd-val">{{ c.command }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import api from '../api'
import mqtt from 'mqtt/dist/mqtt.esm'
import { DEVICE_TYPE_MAP } from '../utils/constants'

const deviceList = ref([])
const selectedDevice = ref('')
const deviceInfo = ref(null)
const pointList = ref([])
const cmd = reactive({ pointId:'', type:'write', value:0, topic:'' })
const cmdHistory = ref([])
const typeMap = DEVICE_TYPE_MAP

let mqttClient = null

onMounted(async () => {
  try { const r = await api.get('/devices', {params:{page:1,page_size:100}}); deviceList.value = r.data.devices || [] } catch {}
  try {
    mqttClient = mqtt.connect('ws://127.0.0.1:8083/mqtt', { clientId:'dgiot_cmd_'+Date.now()%10000, clean:true, connectTimeout:3000 })
    mqttClient.on('error', () => {})
  } catch {}
  // 默认选中第一台在线设备
  setTimeout(() => {
    const firstOnline = deviceList.value.find(d => d.status === 'online')
    if (firstOnline) { selectedDevice.value = firstOnline.device_id; loadPoints(firstOnline.device_id) }
    else if (deviceList.value.length > 0) { selectedDevice.value = deviceList.value[0].device_id; loadPoints(deviceList.value[0].device_id) }
  }, 500)
})

async function loadPoints(did) {
  deviceInfo.value = deviceList.value.find(d => d.device_id === did) || null
  cmd.topic = `$dg/device/${did}/command`
  try { const r = await api.get(`/devices/${did}/points`); pointList.value = r.data.points || []
    // 默认选第一个测点
    if (pointList.value.length > 0 && !cmd.pointId) { cmd.pointId = pointList.value[0].point_id }
  } catch { pointList.value = [] }
}

function sendCommand() {
  const payload = JSON.stringify({
    device_id: selectedDevice.value,
    point_id: cmd.pointId,
    command: cmd.type,
    value: cmd.type === 'write' ? cmd.value : undefined,
    timestamp: new Date().toISOString(),
  })

  if (mqttClient && mqttClient.connected) {
    mqttClient.publish(cmd.topic, payload, { qos: 1 })
    cmdHistory.value.unshift({
      time: new Date().toLocaleTimeString(),
      device: selectedDevice.value,
      command: `${cmd.type}${cmd.type==='write'?'='+cmd.value:''} → ${cmd.pointId}`,
      status: 'ok',
    })
    ElMessage.success('指令已发送')
  } else {
    // Fallback: 通过 API
    api.post(`/bridge/telemetry`, {
      device_id: selectedDevice.value,
      points: [{ point_id: cmd.pointId, value: cmd.value }],
    }).then(() => {
      cmdHistory.value.unshift({
        time: new Date().toLocaleTimeString(),
        device: selectedDevice.value,
        command: `API: ${cmd.type} → ${cmd.pointId}=${cmd.value}`,
        status: 'ok',
      })
      ElMessage.success('指令已通过 API 发送')
    }).catch(() => ElMessage.error('发送失败'))
  }
}
</script>

<style scoped>
.cmd-page h3 { color: #e8f0f8; margin: 0; }
.sec-card { margin-bottom: 0; }
.cmd-log { max-height: 260px; overflow-y: auto; }
.cmd-empty { text-align: center; color: #c0d5e8; padding: 30px; }
.cmd-row { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-bottom: 1px solid #234060; font-size: 13px; }
.cmd-time { color: #8aa0b4; width: 70px; font-family: monospace; flex-shrink: 0; }
.cmd-dev { color: #66d9ff; width: 100px; flex-shrink: 0; overflow: hidden; text-overflow: ellipsis; }
.cmd-val { color: #d0e0ee; flex: 1; }
</style>
