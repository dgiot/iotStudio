<template>
  <div class="channel-page">
    <h3 style="color:#c0d5e8;margin-bottom:12px">📡 通道管理</h3>

    <el-row :gutter="12">
      <!-- 通道列表 -->
      <el-col :span="14">
        <el-card shadow="never" class="ch-card" v-for="ch in channels" :key="ch.device_id" :class="{ active: selected?.device_id === ch.device_id }" @click="selectChannel(ch)" style="margin-bottom:8px">
          <div class="ch-row">
            <div class="ch-info">
              <div class="ch-name">
                <span :style="{color: ch.connected?'#66bb6a':'#ef5350'}">●</span>
                {{ ch.device_name }}
              </div>
              <div class="ch-meta">
                <el-tag size="small" effect="dark" :type="ch.protocol==='modbus_tcp'?'':(ch.protocol==='iec104'?'warning':(ch.protocol==='opcua'?'success':'info'))">{{ ch.protocol }}</el-tag>
                <span v-if="ch.config.host">{{ ch.config.host }}:{{ ch.config.port }}</span>
              </div>
            </div>
            <div class="ch-stats">
              <span class="stat-ok">{{ ch.success }}</span>
              <span class="stat-sep">/</span>
              <span class="stat-fail">{{ ch.fail }}</span>
              <span class="stat-label">成功/失败</span>
            </div>
            <div class="ch-packets">
              <el-icon><Connection /></el-icon>
              <span>{{ ch.packet_count }} 报文</span>
            </div>
            <el-button link type="primary" size="small" @click.stop="reconnect(ch.device_id)">重连</el-button>
          </div>
        </el-card>
      </el-col>

      <!-- 报文面板 -->
      <el-col :span="10">
        <el-card shadow="never" class="pkt-card">
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span>{{ selected ? selected.device_name + ' — 报文流' : '选择通道查看报文' }}</span>
              <el-tag v-if="selected" size="small" effect="dark" :type="selected.connected?'success':'danger'">
                {{ selected.connected ? '已连接' : '断开' }}
              </el-tag>
            </div>
          </template>

          <!-- 通道详情 -->
          <el-descriptions v-if="selected" :column="2" size="small" border style="margin-bottom:12px">
            <el-descriptions-item label="协议">{{ selected.protocol }}</el-descriptions-item>
            <el-descriptions-item label="设备类型">{{ typeMap[selected.device_type] || '-' }}</el-descriptions-item>
            <el-descriptions-item label="地址">{{ selected.config.host || '-' }}</el-descriptions-item>
            <el-descriptions-item label="端口">{{ selected.config.port || '-' }}</el-descriptions-item>
            <el-descriptions-item label="成功">{{ selected.success }}</el-descriptions-item>
            <el-descriptions-item label="失败">{{ selected.fail }}</el-descriptions-item>
          </el-descriptions>

          <!-- 报文列表 -->
          <div class="packet-list" ref="pktList">
            <div v-if="!packets.length" class="pkt-empty">暂无报文</div>
            <div v-for="(p,i) in packets" :key="i" class="pkt-row">
              <span class="pkt-dir" :class="p.dir">{{ p.dir }}</span>
              <span class="pkt-len">{{ p.len }}B</span>
              <span class="pkt-hex">{{ p.hex }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const channels = ref([])
const selected = ref(null)
const packets = ref([])
const typeMap = { inverter:'逆变器', pcs:'储能PCS', charger:'充电桩', meter:'电表', sensor:'传感器' }
let timer = null

function selectChannel(ch) {
  selected.value = ch
  loadPackets(ch.device_id)
}

async function loadPackets(did) {
  try {
    const r = await axios.get(`/api/packets?device_id=${did}&limit=30`)
    packets.value = r.data.packets || []
  } catch { packets.value = [] }
}

async function reconnect(did) {
  try {
    await axios.post(`/api/channels/${did}/reconnect`)
    ElMessage.success('重连成功')
    loadAll()
  } catch { ElMessage.error('重连失败') }
}

async function loadAll() {
  try {
    const r = await axios.get('/api/channels')
    channels.value = r.data.channels || []
    if (selected.value) {
      const found = channels.value.find(c => c.device_id === selected.value.device_id)
      if (found) { selected.value = found; loadPackets(found.device_id) }
    }
  } catch {}
}

onMounted(() => { loadAll(); timer = setInterval(loadAll, 5000) })
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.channel-page { color: #c0d5e8; }
.ch-card { background: #0f1f3a; border: 1px solid #1a3a5c; cursor: pointer; transition: all 0.2s; }
.ch-card:hover { border-color: #4fc3f7; }
.ch-card.active { border-color: #4fc3f7; box-shadow: 0 0 8px rgba(79,195,247,0.15); }
.ch-row { display: flex; align-items: center; gap: 16px; }
.ch-info { flex: 1; }
.ch-name { font-size: 14px; font-weight: bold; margin-bottom: 2px; }
.ch-meta { display: flex; gap: 8px; align-items: center; font-size: 12px; color: #8899aa; }
.ch-stats { text-align: center; }
.stat-ok { color: #66bb6a; font-size: 18px; font-weight: bold; }
.stat-fail { color: #ef5350; font-size: 18px; font-weight: bold; }
.stat-sep { color: #8899aa; }
.stat-label { display: block; font-size: 11px; color: #8899aa; }
.ch-packets { display: flex; align-items: center; gap: 4px; color: #8899aa; font-size: 12px; }
.pkt-card { background: #0f1f3a; border: 1px solid #1a3a5c; }
.pkt-card :deep(.el-card__header) { color: #c0d5e8; border-bottom: 1px solid #1a3a5c; padding: 8px 14px; font-size: 13px; }
.pkt-empty { color: #8899aa; text-align: center; padding: 40px; }
.packet-list { max-height: 400px; overflow-y: auto; }
.pkt-row { display: flex; gap: 10px; padding: 4px 6px; border-bottom: 1px solid #1a3a5c; font-family: monospace; font-size: 11px; align-items: center; }
.pkt-row:hover { background: rgba(79,195,247,0.05); }
.pkt-dir { font-weight: bold; width: 22px; flex-shrink: 0; }
.pkt-dir.TX { color: #4fc3f7; } .pkt-dir.RX { color: #66bb6a; }
.pkt-len { color: #8899aa; width: 30px; flex-shrink: 0; }
.pkt-hex { color: #c0d5e8; word-break: break-all; line-height: 1.4; }
.el-descriptions { --el-descriptions-item-bordered-label-background: rgba(255,255,255,0.03); }
</style>
