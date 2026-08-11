<template>
  <div class="live-page">
    <div class="toolbar">
      <h3>Live Telemetry</h3>
      <el-tag :type="connected?'success':'danger'">{{ connected ? 'WS Connected' : 'Disconnected' }}</el-tag>
      <span style="color:#8aa0b4;font-size:12px">{{ msgs.length }} msgs</span>
      <el-button size="small" @click="msgs=[]">Clear</el-button>
    </div>

    <el-row :gutter="12">
      <el-col :span="16">
        <div class="log-panel">
          <div v-for="(m,i) in msgs.slice(-50)" :key="i" class="log-row">
            <span class="lr-time">{{ m.time }}</span>
            <span class="lr-dev">{{ m.device }}</span>
            <span class="lr-pt">{{ m.point }}</span>
            <span class="lr-val" :class="{alert:m.alert}">{{ m.value }}{{ m.unit }}</span>
          </div>
          <div v-if="!msgs.length" class="empty">Waiting for telemetry...</div>
        </div>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" size="small">
          <template #header>Device Stats</template>
          <div v-for="(v,k) in deviceCounts" :key="k" class="stat-row">
            <span>{{ k }}</span>
            <el-tag size="small">{{ v }}</el-tag>
          </div>
        </el-card>
        <el-card shadow="hover" size="small" style="margin-top:8px">
          <template #header>Alerts</template>
          <div v-for="(a,i) in alerts.slice(-5)" :key="i" class="alert-row">
            <span class="ar-time">{{ a.time }}</span>
            <span>{{ a.msg }}</span>
          </div>
          <div v-if="!alerts.length" class="empty">No alerts</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const connected = ref(false)
const msgs = ref([])
const alerts = ref([])

const deviceCounts = computed(() => {
  const counts = {}
  msgs.value.forEach(m => {
    counts[m.device] = (counts[m.device]||0)+1
  })
  return counts
})

let ws = null
let reconnectTimer = null

function connect() {
  try {
    ws = new WebSocket('ws://dev.dgiotcloud.cn:8083/mqtt')
    ws.onopen = () => {
      connected.value = true
      // Subscribe to edge telemetry
      ws.send(JSON.stringify({
        type: 'subscribe',
        topic: 'dgiot/#',
        qos: 1
      }))
    }
    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        if (data.topic && data.payload) {
          const topic = data.topic
          const parts = topic.split('/')
          const payload = typeof data.payload === 'string'
            ? JSON.parse(data.payload) : data.payload

          const now = new Date().toLocaleTimeString()
          const device = parts[4] || '?'
          const point = parts[5] || '?'

          if (payload.type === 'alert' || topic.includes('alarms')) {
            alerts.value.push({ time: now, msg: `${payload.msg||'alert'}: ${payload.value||''}` })
          }

          msgs.value.push({
            time: now,
            device,
            point,
            value: payload.value?.toFixed?.(2) ?? payload.value,
            unit: payload.unit || '',
            alert: payload.value > 3.0 && point === 'oil_pressure'
          })
        }
      } catch {}
    }
    ws.onclose = () => {
      connected.value = false
      reconnectTimer = setTimeout(connect, 3000)
    }
  } catch {
    reconnectTimer = setTimeout(connect, 3000)
  }
}

onMounted(connect)
onUnmounted(() => {
  clearTimeout(reconnectTimer)
  ws?.close()
})
</script>

<style scoped>
.live-page { color: #c0d5e8; }
.toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.toolbar h3 { margin: 0; color: #e8f0f8; }
.log-panel { background: #0a1a2a; border: 1px solid #1e3a5f; border-radius: 6px; height: calc(100vh - 160px); overflow-y: auto; padding: 8px; font-family: monospace; font-size: 12px; }
.log-row { display: flex; gap: 8px; padding: 2px 4px; border-bottom: 1px solid #112233; }
.log-row:hover { background: rgba(79,195,247,0.05); }
.lr-time { color: #5a7a9a; width: 70px; }
.lr-dev { color: #66d9ff; width: 100px; }
.lr-pt { color: #8aa0b4; width: 100px; }
.lr-val { color: #66bb6a; font-weight: bold; }
.lr-val.alert { color: #ef5350; }
.empty { text-align: center; padding: 30px; color: #5a7a9a; }
.stat-row { display: flex; justify-content: space-between; padding: 4px 0; }
.alert-row { padding: 4px 0; border-bottom: 1px solid #3a1010; font-size: 12px; }
.ar-time { color: #5a7a9a; margin-right: 8px; }
</style>
