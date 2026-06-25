<template>
  <div class="channel-page">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h3 style="color:#c0d5e8;margin:0">📡 通道管理</h3>
      <div style="display:flex;gap:8px">
        <el-button size="small" @click="showScanDialog"><el-icon><Search /></el-icon>扫描发现</el-button>
        <el-button type="primary" size="small" @click="showAddDialog"><el-icon><Plus /></el-icon>添加通道</el-button>
      </div>
    </div>

    <el-row :gutter="12">
      <el-col :span="14">
        <el-card v-for="ch in channels" :key="ch.device_id" shadow="never" class="ch-card" :class="{ active: selected?.device_id === ch.device_id }" @click="selectChannel(ch)" style="margin-bottom:8px">
          <div class="ch-row">
            <div class="ch-info">
              <div class="ch-name"><span :style="{color: ch.connected?'#66bb6a':'#ef5350'}">●</span> {{ ch.device_name }}</div>
              <div class="ch-meta">
                <el-tag size="small" effect="dark" type="">{{ ch.protocol }}</el-tag>
                <span>{{ ch.config.host }}:{{ ch.config.port }}</span>
              </div>
            </div>
            <div class="ch-stats">
              <span class="stat-ok">{{ ch.success }}</span><span class="stat-sep">/</span><span class="stat-fail">{{ ch.fail }}</span>
              <span class="stat-label">成功/失败</span>
            </div>
            <span style="color:#8899aa;font-size:12px">{{ ch.packet_count }} 报文</span>
            <el-button link type="primary" size="small" @click.stop="reconnect(ch.device_id)">重连</el-button>
            <el-button link type="warning" size="small" @click.stop="editChannel(ch)">编辑</el-button>
            <el-popconfirm title="确认删除?" @confirm="delChannel(ch.device_id)"><template #reference><el-button link type="danger" size="small">删除</el-button></template></el-popconfirm>
          </div>
        </el-card>
      </el-col>

      <el-col :span="10">
        <el-card shadow="never" class="pkt-card">
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span>{{ selected ? selected.device_name + ' — 报文' : '选择通道' }}</span>
              <el-tag v-if="selected" size="small" effect="dark" :type="selected.connected?'success':'danger'">{{ selected.connected?'已连接':'断开' }}</el-tag>
            </div>
          </template>
          <el-descriptions v-if="selected" :column="2" size="small" border style="margin-bottom:8px">
            <el-descriptions-item label="协议">{{ selected.protocol }}</el-descriptions-item>
            <el-descriptions-item label="地址">{{ selected.config.host }}</el-descriptions-item>
            <el-descriptions-item label="端口">{{ selected.config.port }}</el-descriptions-item>
            <el-descriptions-item label="类型">{{ typeMap[selected.device_type] }}</el-descriptions-item>
          </el-descriptions>
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

    <!-- 扫描弹窗 -->
    <el-dialog title="网络扫描" v-model="scanVisible" width="600px">
      <el-form :inline="true" :model="scanForm" size="small">
        <el-form-item label="主机"><el-input v-model="scanForm.host" style="width:140px" /></el-form-item>
        <el-form-item label="端口"><el-input-number v-model="scanForm.port" :min="1" :max="65535" /></el-form-item>
        <el-form-item><el-button type="primary" @click="doScan" :loading="scanning">扫描</el-button></el-form-item>
      </el-form>
      <el-table :data="scanResults" size="small" max-height="300" v-loading="scanning">
        <el-table-column prop="slave_id" label="从站ID" width="80" align="center" />
        <el-table-column label="寄存器" min-width="200">
          <template #default="{row}">
            <el-tag v-for="r in (row.registers||[]).slice(0,6)" :key="r.address" size="small" effect="plain" style="margin:1px">
              0x{{ r.address.toString(16) }}={{ r.value }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template #default="{row}"><el-button size="small" type="primary" @click="addFromScan(row)">添加为通道</el-button></template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 添加/编辑弹窗 -->
    <el-dialog :title="editId ? '编辑通道' : '添加通道'" v-model="editVisible" width="520px">
      <el-form :model="editForm" label-width="80px">
        <el-row :gutter="12">
          <el-col :span="12"><el-form-item label="设备ID"><el-input v-model="editForm.device_id" :disabled="!!editId" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="名称"><el-input v-model="editForm.device_name" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="协议"><el-select v-model="editForm.protocol" style="width:100%"><el-option v-for="p in protocols" :key="p" :label="p" :value="p" /></el-select></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型"><el-select v-model="editForm.device_type" style="width:100%"><el-option v-for="t in devTypes" :key="t.v" :label="t.l" :value="t.v" /></el-select></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12"><el-form-item label="地址"><el-input v-model="editForm.host" placeholder="127.0.0.1" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="端口"><el-input-number v-model="editForm.port" :min="1" :max="65535" /></el-form-item></el-col>
        </el-row>
        <el-form-item label="场站"><el-input v-model="editForm.station_id" /></el-form-item>
        <el-form-item label="额外参数"><el-input v-model="editForm.extraStr" type="textarea" :rows="2" placeholder='{"slave_id":1}' /></el-form-item>
      </el-form>
      <template #footer><el-button @click="editVisible=false">取消</el-button><el-button type="primary" @click="saveChannel">保存</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const channels = ref([]); const selected = ref(null); const packets = ref([])
const typeMap = { inverter:'逆变器', pcs:'储能PCS', charger:'充电桩', meter:'电表', sensor:'传感器' }
const protocols = ['modbus_tcp','modbus_rtu','iec104','opcua','opcda']
const devTypes = [{l:'逆变器',v:'inverter'},{l:'储能PCS',v:'pcs'},{l:'充电桩',v:'charger'},{l:'电表',v:'meter'},{l:'传感器',v:'sensor'}]

// 扫描
const scanVisible = ref(false); const scanning = ref(false); const scanResults = ref([])
const scanForm = reactive({ host:'127.0.0.1', port:502 })

// 编辑
const editVisible = ref(false); const editId = ref('')
const editForm = reactive({ device_id:'', device_name:'', protocol:'modbus_tcp', device_type:'inverter', host:'127.0.0.1', port:502, station_id:'station_01', extraStr:'{}' })

let timer = null

function selectChannel(ch) { selected.value = ch; loadPackets(ch.device_id) }
async function loadPackets(did) {
  try { const r = await axios.get(`/api/packets?device_id=${did}&limit=30`); packets.value = r.data.packets || [] } catch { packets.value = [] }
}
async function reconnect(did) { try { await axios.post(`/api/channels/${did}/reconnect`); ElMessage.success('已重连'); loadAll() } catch { ElMessage.error('失败') } }
async function delChannel(did) { try { await axios.delete(`/api/devices/${did}`); ElMessage.success('已删除'); selected.value = null; loadAll() } catch { ElMessage.error('删除失败') } }

function showScanDialog() { scanVisible.value = true; scanResults.value = [] }
async function doScan() {
  scanning.value = true; scanResults.value = []
  try { const r = await axios.post('/api/scanner/scan', { host: scanForm.host, port: scanForm.port, start:1, end:10 }); scanResults.value = r.data.slaves || []; ElMessage.success(`发现 ${scanResults.value.length} 个从站`) } catch { ElMessage.error('扫描失败') }
  scanning.value = false
}
function addFromScan(row) {
  scanVisible.value = false
  Object.assign(editForm, { device_id: `slave_${row.slave_id}_${Date.now()%10000}`, device_name: `从站#${row.slave_id}`, protocol:'modbus_tcp', device_type:'meter', host:scanForm.host, port:scanForm.port, station_id:'station_01', extraStr: JSON.stringify({slave_id:row.slave_id}) })
  editId.value = ''; editVisible.value = true
}
function showAddDialog() { editId.value = ''; Object.assign(editForm, { device_id:'', device_name:'', protocol:'modbus_tcp', device_type:'inverter', host:'127.0.0.1', port:502, station_id:'station_01', extraStr:'{}' }); editVisible.value = true }
function editChannel(ch) {
  editId.value = ch.device_id
  Object.assign(editForm, { device_id: ch.device_id, device_name: ch.device_name, protocol: ch.protocol, device_type: ch.device_type, host: ch.config.host, port: ch.config.port || 502, station_id: 'station_01', extraStr: JSON.stringify({slave_id:1}) })
  editVisible.value = true
}
async function saveChannel() {
  let extra = {}; try { extra = JSON.parse(editForm.extraStr || '{}') } catch {}
  const data = { device_id: editForm.device_id, device_name: editForm.device_name, protocol: editForm.protocol, device_type: editForm.device_type, station_id: editForm.station_id, comm_params: { host: editForm.host, port: editForm.port, ...extra } }
  try {
    await axios.post('/api/devices', data)
    ElMessage.success(editId.value ? '已更新' : '已添加')
    editVisible.value = false; loadAll()
  } catch { ElMessage.error('保存失败') }
}

async function loadAll() {
  try { const r = await axios.get('/api/channels'); channels.value = r.data.channels || []
    if (selected.value) { const f = channels.value.find(c => c.device_id === selected.value.device_id); if (f) { selected.value = f; loadPackets(f.device_id) } }
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
.ch-row { display: flex; align-items: center; gap: 12px; }
.ch-info { flex: 1; }
.ch-name { font-size: 14px; font-weight: bold; margin-bottom: 2px; }
.ch-meta { display: flex; gap: 8px; align-items: center; font-size: 12px; color: #8899aa; }
.ch-stats { text-align: center; }
.stat-ok { color: #66bb6a; font-size: 18px; font-weight: bold; }
.stat-fail { color: #ef5350; font-size: 18px; font-weight: bold; }
.stat-sep { color: #8899aa; }
.stat-label { display: block; font-size: 11px; color: #8899aa; }
.pkt-card { background: #0f1f3a; border: 1px solid #1a3a5c; }
.pkt-card :deep(.el-card__header) { color: #c0d5e8; border-bottom: 1px solid #1a3a5c; padding: 8px 14px; font-size: 13px; }
.pkt-empty { color: #8899aa; text-align: center; padding: 40px; }
.packet-list { max-height: 400px; overflow-y: auto; }
.pkt-row { display: flex; gap: 8px; padding: 3px 6px; border-bottom: 1px solid #1a3a5c; font-family: monospace; font-size: 11px; align-items: center; }
.pkt-row:hover { background: rgba(79,195,247,0.05); }
.pkt-dir { font-weight: bold; width: 22px; flex-shrink: 0; }
.pkt-dir.TX { color: #4fc3f7; } .pkt-dir.RX { color: #66bb6a; }
.pkt-len { color: #8899aa; width: 26px; flex-shrink: 0; }
.pkt-hex { color: #c0d5e8; word-break: break-all; line-height: 1.4; }
.el-descriptions { --el-descriptions-item-bordered-label-background: rgba(255,255,255,0.03); }
</style>
