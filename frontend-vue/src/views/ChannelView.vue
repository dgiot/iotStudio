<template>
  <div class="channel-page">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h3 style="color:#c0d5e8;margin:0">📡 通道管理</h3>
      <div style="display:flex;gap:8px;align-items:center">
        <el-radio-group v-model="viewMode" size="small">
          <el-radio-button value="vendor">厂商通道 ({{ vendorChannels.length }})</el-radio-button>
          <el-radio-button value="protocol">协议通道 ({{ channels.length }})</el-radio-button>
        </el-radio-group>
        <el-button size="small" @click="showScanDialog"><el-icon><Search /></el-icon>扫描</el-button>
        <el-button type="primary" size="small" @click="showAddDialog"><el-icon><Plus /></el-icon>添加</el-button>
      </div>
    </div>

    <!-- 厂商通道 — list-detail 布局 -->
    <template v-if="viewMode==='vendor'">
      <div class="list-detail" v-if="vendorChannels.length">
        <!-- 左侧: 通道列表 -->
        <div class="ld-list">
          <div v-for="vch in vendorChannels" :key="vch.key"
            class="vch-row" :class="{active:selVendor?.key===vch.key}"
            @click="selVendor = selVendor?.key===vch.key ? null : vch">
            <span class="vch-row-icon">{{ vch.icon }}</span>
            <div class="vch-row-main">
              <div class="vch-row-name">{{ vch.name }}</div>
              <div class="vch-row-source">{{ vch.source }}</div>
            </div>
            <el-tag :type="vch.connected?'success':'warning'" size="small" effect="dark">{{ vch.connected?'已同步':'待接入' }}</el-tag>
            <span style="color:#666;font-size:11px">{{ selVendor?.key===vch.key ? '▲' : '▼' }}</span>
          </div>
          <div class="ld-footer">共 {{ vendorChannels.length }} 通道 · 30秒刷新</div>
        </div>

        <!-- 右侧: 详情面板 -->
        <div class="ld-detail" v-if="selVendor">
          <div class="ldd-header">
            <span class="ldd-title">{{ selVendor.icon }} {{ selVendor.name }}</span>
            <el-tag :type="selVendor.connected?'success':'warning'" size="small" effect="dark">{{ selVendor.connected?'已同步':'待接入' }}</el-tag>
          </div>
          <div class="ldd-meta">{{ selVendor.source }}</div>

          <!-- KPI -->
          <el-row :gutter="10" style="margin:12px 0">
            <el-col :span="6"><div class="ldd-kpi"><div class="lk-val" style="color:#67C23A">{{ selVendor.devices }}台</div><div class="lk-lbl">接入设备</div></div></el-col>
            <el-col :span="6"><div class="ldd-kpi"><div class="lk-val" style="color:#409EFF">{{ selVendor.points }}个</div><div class="lk-lbl">采集测点</div></div></el-col>
            <el-col :span="6"><div class="ldd-kpi"><div class="lk-val" style="color:#909399">{{ selVendor.lastSync||'—' }}</div><div class="lk-lbl">最后同步</div></div></el-col>
            <el-col :span="6"><div class="ldd-kpi"><div class="lk-val" style="color:#E6A23C">{{ selVendor.interval }}</div><div class="lk-lbl">采集间隔</div></div></el-col>
          </el-row>

          <div class="ldd-status"><span>状态：<b :style="{color:selVendor.connected?'#67C23A':'#F56C6C'}">{{ selVendor.connected ? '已同步' : '未同步' }}</b></span><span style="margin-left:12px">{{ selVendor.desc }}</span></div>

          <div class="ldd-section">关联设备</div>
          <div v-for="d in selVendor.relatedDevices" :key="d.id" class="ldd-dev">
            <span>{{ d.name }}</span>
            <el-tag :type="d.status==='online'?'success':'info'" size="small">{{ d.status==='online'?'在线':'离线' }}</el-tag>
          </div>

          <div class="ldd-actions">
            <el-button size="small" @click="onVendorSync(selVendor.key)">🔄 同步</el-button>
            <el-button size="small" @click="onVendorConfig(selVendor.key)">⚙️ 配置</el-button>
            <el-button size="small" type="primary" @click="onVendorView(selVendor.key)">📋 查看数据</el-button>
          </div>
        </div>
        <div class="ld-detail ld-empty" v-else>
          <span>👈 点击左侧通道查看详情</span>
        </div>
      </div>
    </template>

    <!-- 协议通道 — list-detail 布局 -->
    <div class="list-detail" v-else-if="channels.length">
      <div class="ld-list">
        <div v-for="ch in filteredChannels" :key="ch.device_id"
          class="vch-row" :class="{active:selected?.device_id===ch.device_id}"
          @click="selectChannel(ch)">
          <span :style="{color:ch.connected?'#67C23A':'#F56C6C',fontSize:'18px',width:'20px'}">●</span>
          <div class="vch-row-main">
            <div class="vch-row-name">{{ ch.device_name }}</div>
            <div class="vch-row-source">{{ ch.protocol }} · {{ ch.config.host }}:{{ ch.config.port || '—' }}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:14px;font-weight:700"><span style="color:#67C23A">{{ ch.success }}</span><span style="color:#c0c4cc">/</span><span style="color:#F56C6C">{{ ch.fail }}</span></div>
            <div style="font-size:10px;color:#909399">成功/失败</div>
          </div>
        </div>
        <el-pagination v-if="filteredTotal > channelPageSize" layout="prev,next" size="small" :total="filteredTotal" v-model:current-page="channelPage" :page-size="channelPageSize" style="justify-content:center;margin-top:8px" />
        <div class="ld-footer">共 {{ filteredTotal }} 通道</div>
      </div>

      <div class="ld-detail" v-if="selected">
        <div class="ldd-header">
          <span class="ldd-title">{{ selected.device_name }}</span>
          <el-tag :type="selected.connected?'success':'danger'" size="small" effect="dark">{{ selected.connected?'已连接':'断开' }}</el-tag>
        </div>
        <el-descriptions :column="2" size="small" border style="margin:12px 0">
          <el-descriptions-item label="协议">{{ selected.protocol }}</el-descriptions-item>
          <el-descriptions-item label="地址">{{ selected.config.host }}</el-descriptions-item>
          <el-descriptions-item label="端口">{{ selected.config.port }}</el-descriptions-item>
          <el-descriptions-item label="类型">{{ typeMap[selected.device_type] }}</el-descriptions-item>
        </el-descriptions>
        <div class="ldd-section">实时报文</div>
        <div class="packet-list">
          <div v-if="!packets.length" class="pkt-empty">暂无报文</div>
          <div v-for="(p,i) in packets" :key="i" class="pkt-row">
            <span class="pkt-dir" :class="p.dir">{{ p.dir }}</span>
            <span class="pkt-len">{{ p.len }}B</span>
            <span class="pkt-hex">{{ p.hex?.slice(0,50) }}{{ p.hex?.length > 50 ? '...' : '' }}</span>
          </div>
        </div>
        <div class="ldd-actions">
          <el-button v-if="selected.protocol!=='mqtt'&&selected.protocol!=='tdengine'" size="small" @click="reconnect(selected.device_id)">🔄 重连</el-button>
          <el-button size="small" @click="editChannel(selected)">✏️ 编辑</el-button>
          <el-popconfirm title="确认删除?" @confirm="delChannel(selected.device_id)"><template #reference><el-button size="small" type="danger">🗑 删除</el-button></template></el-popconfirm>
        </div>
      </div>
      <div class="ld-detail ld-empty" v-else>
        <span>👈 点击左侧通道查看详情</span>
      </div>
    </div>

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
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { DEVICE_TYPE_MAP, VENDOR_CHANNELS } from '../utils/constants'
import ChannelCard from '../components/ChannelCard.vue'

const channels = ref([]); const selected = ref(null); const packets = ref([]); const viewMode = ref('vendor')
const channelPage = ref(1); const channelPageSize = ref(10)
const typeMap = DEVICE_TYPE_MAP

// 厂商通道插件 — 从注册表加载，后续可改为 API 动态获取
const vendorChannels = ref(VENDOR_CHANNELS.map(v => ({...v})))
const selVendor = ref(null)

const filteredList = computed(() => channels.value)
const filteredTotal = computed(() => filteredList.value.length)
const filteredChannels = computed(() => {
  const start = (channelPage.value - 1) * channelPageSize.value
  return filteredList.value.slice(start, start + channelPageSize.value)
})
const protocols = ['modbus_tcp','modbus_rtu','iec104','opcua','opcda']
const devTypes = Object.entries(typeMap).filter(([v]) => v !== 'storage' && v !== 'push').map(([v, l]) => ({ v, l }))

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

// ---- 厂商通道事件 ----
function onVendorSync(key) {
  const vch = vendorChannels.value.find(c => c.key === key)
  if (!vch) return
  ElMessage.info(`正在同步 ${vch.name} ...`)
  setTimeout(() => {
    vch.connected = true
    vch.lastSync = new Date().toLocaleTimeString()
    if (selVendor.value?.key === key) selVendor.value = vch
    ElMessage.success(`${vch.name} 同步完成`)
  }, 1500)
}
function onVendorConfig(key) {
  const vch = vendorChannels.value.find(c => c.key === key)
  if (vch) ElMessage.info(`配置 ${vch.name}`)
}
function onVendorView(key) {
  const vch = vendorChannels.value.find(c => c.key === key)
  if (vch) ElMessage.info(`查看 ${vch.name} 数据`)
}

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
  try { const r = await axios.get('/api/channels'); channels.value = r.data.channels || []; cats.value = r.data.categories || {protocol:0, storage:0, push:0}
    if (selected.value) { const f = channels.value.find(c => c.device_id === selected.value.device_id); if (f) { selected.value = f; loadPackets(f.device_id) } }
  } catch {}
}
onMounted(() => { loadAll(); timer = setInterval(loadAll, 5000) })
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.channel-page { color: #c0d5e8; }

/* ---- list-detail 布局 ---- */
.list-detail { display: flex; gap: 12px; min-height: calc(100vh - 180px) }
.ld-list { width: 360px; flex-shrink: 0; overflow-y: auto; }
.ld-detail { flex: 1; background: #1d1e2b; border: 1px solid #2d2e3b; border-radius: 8px; padding: 16px; min-height: 0 }
.ld-empty { display: flex; align-items: center; justify-content: center; color: #606266; font-size: 14px }
.ld-footer { text-align: center; color: #606266; font-size: 11px; padding: 8px 0 }

.vch-row { display: flex; align-items: center; gap: 10px; padding: 10px; margin-bottom: 6px; background: #1d1e2b; border: 1px solid #2d2e3b; border-radius: 6px; cursor: pointer; transition: all 0.15s }
.vch-row:hover { border-color: #409EFF }
.vch-row.active { border-color: #409EFF; box-shadow: 0 0 8px rgba(64,158,255,0.15) }
.vch-row-icon { font-size: 22px; width: 32px; text-align: center }
.vch-row-main { flex: 1; min-width: 0 }
.vch-row-name { font-size: 13px; font-weight: 600; color: #e0e0e0 }
.vch-row-source { font-size: 11px; color: #909399; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis }

.ldd-header { display: flex; align-items: center; gap: 10px; margin-bottom: 4px }
.ldd-title { font-size: 16px; font-weight: 700; color: #e0e0e0 }
.ldd-meta { font-size: 12px; color: #909399; margin-bottom: 4px }
.ldd-kpi { text-align: center; padding: 10px 6px; background: #252636; border-radius: 6px }
.lk-val { font-size: 18px; font-weight: 700 }
.lk-lbl { font-size: 11px; color: #909399; margin-top: 2px }
.ldd-status { font-size: 12px; color: #909399; padding: 10px 0; border-top: 1px solid #2d2e3b; border-bottom: 1px solid #2d2e3b; margin: 8px 0 }
.ldd-section { font-size: 12px; color: #909399; font-weight: 600; margin: 10px 0 6px }
.ldd-dev { display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; background: #252636; border-radius: 4px; margin: 4px 0; font-size: 12px; color: #c0c4cc }
.ldd-actions { display: flex; gap: 8px; margin-top: 16px }

/* ---- 协议通道 ---- */
.ch-card { background: #162844; border: 1px solid #234060; cursor: pointer; transition: all 0.2s; }
.ch-card:hover { border-color: #66d9ff; }
.ch-card.active { border-color: #66d9ff; box-shadow: 0 0 8px rgba(79,195,247,0.15); }
.ch-row { display: flex; align-items: center; gap: 12px; }
.ch-info { flex: 1; }
.ch-name { font-size: 14px; font-weight: bold; margin-bottom: 2px; }
.ch-meta { display: flex; gap: 8px; align-items: center; font-size: 12px; color: #c0d5e8; }
.ch-stats { text-align: center; }
.stat-ok { color: #66bb6a; font-size: 18px; font-weight: bold; }
.stat-fail { color: #ef5350; font-size: 18px; font-weight: bold; }
.stat-sep { color: #c0d5e8; }
.stat-label { display: block; font-size: 11px; color: #c0d5e8; }
.pkt-card { background: #162844; border: 1px solid #234060; }
.pkt-card :deep(.el-card__header) { color: #c0d5e8; border-bottom: 1px solid #234060; padding: 8px 14px; font-size: 13px; }
.pkt-empty { color: #c0d5e8; text-align: center; padding: 40px; }
.packet-list { max-height: 400px; overflow-y: auto; }
.pkt-row { display: flex; gap: 8px; padding: 4px 8px; border-bottom: 1px solid #234060; font-family: monospace; font-size: 11px; align-items: flex-start; }
.pkt-row:hover { background: rgba(79,195,247,0.05); }
.pkt-dir { font-weight: bold; width: 22px; flex-shrink: 0; line-height: 1.6; }
.pkt-dir.TX { color: #66d9ff; } .pkt-dir.RX { color: #66bb6a; }
.pkt-len { color: #8aa0b4; width: 26px; flex-shrink: 0; line-height: 1.6; }
.pkt-body { flex: 1; min-width: 0; }
.pkt-hex { color: #c0d5e8; word-break: break-all; line-height: 1.4; display: block; }
.pkt-parsed { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; margin-top: 3px; }
.pkt-parsed .el-tag { font-family: monospace; font-size: 10px; }
.el-descriptions { --el-descriptions-item-bordered-label-background: rgba(255,255,255,0.03); }
</style>
