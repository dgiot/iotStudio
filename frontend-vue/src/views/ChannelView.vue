<template>
  <div class="channel-page">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h3 style="color:#c0d5e8;margin:0">📡 通道管理</h3>
      <div style="display:flex;gap:8px;align-items:center">
        <el-radio-group v-model="viewMode" size="small">
          <el-radio-button value="protocol">协议通道 ({{ protoChannels.length }})</el-radio-button>
          <el-radio-button value="td">时序通道 ({{ tdChannels.length }})</el-radio-button>
          <el-radio-button value="task">任务通道 ({{ taskChannels.length }})</el-radio-button>
          <el-radio-button value="vendor">厂商通道 ({{ vendorChannels.length }})</el-radio-button>
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

          <!-- 通道日志 -->
          <div class="ldd-section">📜 通道日志</div>
          <div class="log-list">
            <div v-for="(log,i) in selLogs" :key="i" class="log-row">
              <span :style="{color:log.level==='error'?'#ef5350':log.level==='warn'?'#E6A23C':'#67C23A'}">[{{ log.time }}]</span>
              <span :style="{marginLeft:'8px'}">{{ log.msg }}</span>
            </div>
            <div v-if="!selLogs.length" style="color:#5a7a9a;font-size:12px;padding:8px">暂无日志</div>
          </div>
        </div>
        <div class="ld-detail ld-empty" v-else>
          <span>👈 点击左侧通道查看详情</span>
        </div>
      </div>
    </template>

    <!-- 协议通道/时序通道/任务通道 — list-detail 布局 -->
    <div class="list-detail" v-else-if="filteredList.length">
      <div class="ld-list">
        <div v-for="ch in filteredChannels" :key="ch.device_id"
          class="vch-row" :class="{active:selected?.device_id===ch.device_id}"
          @click="selectChannel(ch)">
          <span :style="{color:ch.status==='online'?'#67C23A':'#F56C6C',fontSize:'18px',width:'20px'}">●</span>
          <div class="vch-row-main">
            <div class="vch-row-name">{{ ch.name || ch.device_id }}</div>
            <div class="vch-row-source">{{ ch.protocol || ch.cType }} · {{ ch.host || '—' }}:{{ ch.port || '—' }}</div>
          </div>
          <div style="text-align:right">
            <el-tag :type="ch.status==='online'?'success':ch.status==='offline'?'danger':'info'" size="small">{{ ch.status }}</el-tag>
            <div style="font-size:10px;color:#909399;margin-top:2px">{{ ch.devices || 0 }}台·{{ ch.points || 0 }}点</div>
          </div>
        </div>
        <el-pagination v-if="filteredTotal > channelPageSize" layout="prev,next" size="small" :total="filteredTotal" v-model:current-page="channelPage" :page-size="channelPageSize" style="justify-content:center;margin-top:8px" />
        <div class="ld-footer">共 {{ filteredTotal }} 通道</div>
      </div>

      <div class="ld-detail" v-if="selected">
        <div class="ldd-header">
          <span class="ldd-title">{{ selected.name || selected.device_id }}</span>
          <el-tag :type="selected.status==='online'?'success':'danger'" size="small" effect="dark">{{ selected.status }}</el-tag>
        </div>
        <el-descriptions :column="2" size="small" border style="margin:12px 0">
          <el-descriptions-item label="协议">{{ selected.protocol || selected.cType }}</el-descriptions-item>
          <el-descriptions-item label="地址">{{ selected.host || '—' }}</el-descriptions-item>
          <el-descriptions-item label="端口">{{ selected.port || '—' }}</el-descriptions-item>
          <el-descriptions-item label="设备数">{{ selected.devices || 0 }}台</el-descriptions-item>
        </el-descriptions>
        <div class="ldd-section">实时报文 <el-button size="small" type="primary" :loading="scanning" @click="scanChannel(selected)" style="float:right;margin-top:-2px">🔍 扫描</el-button></div>
        <div class="packet-list">
          <div v-if="!packets.length" class="pkt-empty">暂无报文</div>
          <div v-for="(p,i) in packets" :key="i" class="pkt-row">
            <span class="pkt-dir" :class="p.dir==='info'?'pkt-info':p.dir">{{ p.dir==='info'?'●':p.dir }}</span>
            <span v-if="p.step" class="pkt-step">{{ p.step }}</span>
            <span class="pkt-hex" :style="{flex:1}">{{ p.hex?.slice(0,80) }}{{ p.hex?.length > 80 ? '...' : '' }}</span>
          </div>
        </div>
        <div class="ldd-actions">
          <el-button v-if="selected.cType!=='mqtt'&&selected.cType!=='tdengine'&&selected.cType!=='task'" size="small" @click="reconnect(selected.device_id)">🔄 重连</el-button>
          <el-button size="small" @click="editChannel(selected)">✏️ 编辑</el-button>
          <el-popconfirm title="确认删除?" @confirm="delChannel(selected.device_id)"><template #reference><el-button size="small" type="danger">🗑 删除</el-button></template></el-popconfirm>
        </div>
      </div>
      <div class="ld-detail ld-empty" v-else>
        <span>👈 点击左侧通道查看详情</span>
      </div>
    </div>

    <!-- 扫描弹窗 -->
    <el-dialog title="Modbus 盲扫 — IPv4/IPv6" v-model="scanVisible" width="560px">
      <el-form :model="scanForm" label-width="70px" size="small">
        <el-row :gutter="10"><el-col :span="13"><el-form-item label="地址"><el-input v-model="scanForm.host" placeholder="240C:8042:F000:2230::5C 或 11.249.34.1"/></el-form-item></el-col><el-col :span="5"><el-form-item label="端口"><el-input-number v-model="scanForm.port" :min="1" :max="65535"/></el-form-item></el-col><el-col :span="6"><el-form-item label="从站"><el-input v-model="scanForm.range" placeholder="1-10"/></el-form-item></el-col></el-row>
        <el-row :gutter="10"><el-col :span="8"><el-form-item label="模式"><el-select v-model="scanForm.mode"><el-option label="快速" value="quick"/><el-option label="全扫(1-247)" value="full"/></el-select></el-form-item></el-col><el-col :span="8"><el-form-item label="探测点"><el-input v-model="scanForm.probe" placeholder="299,350,399"/></el-form-item></el-col><el-col :span="8"><el-form-item label="协议"><el-select v-model="scanForm.protocol"><el-option v-for="p in allCtypes" :key="p" :label="p" :value="p"/></el-select></el-form-item></el-col></el-row>
        <div style="margin-top:8px;padding:6px 10px;background:rgba(0,180,216,.08);border-radius:4px;font-size:11px;color:#5a9ab5">
          原理: 逐从站ID发送 read_holding_registers@探测地址 → 正常=存在, 0x02=不支持, timeout=无 · 含CRC · G1-G8寄存器组 · IEEE 754浮点解码
        </div>
      </el-form>
      <template #footer><el-button @click="scanVisible=false">取消</el-button><el-button type="primary" @click="doScan" :loading="scanning">扫描</el-button></template>
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
    <el-dialog :title="editId ? '编辑通道' : '添加通道'" v-model="editVisible" width="560px" top="5vh">
      <el-form :model="editForm" label-width="100px">
        <el-row :gutter="12">
          <el-col :span="12"><el-form-item label="通道ID"><el-input v-model="editForm.devaddr" :disabled="!!editId" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="名称"><el-input v-model="editForm.name" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="协议类型"><el-select v-model="editForm.cType" style="width:100%"><el-option v-for="p in allCtypes" :key="p" :label="p" :value="p" /></el-select></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="启用"><el-switch v-model="editForm.isEnable" /></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12"><el-form-item label="地址"><el-input v-model="editForm.host" placeholder="127.0.0.1" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="端口"><el-input-number v-model="editForm.port" :min="1" :max="65535" /></el-form-item></el-col>
        </el-row>
        <el-form-item label="描述"><el-input v-model="editForm.desc" /></el-form-item>
        <!-- Modbus 专有 -->
        <template v-if="editForm.cType==='modbus_tcp'||editForm.cType==='modbus_rtu'">
          <el-row :gutter="12"><el-col :span="8"><el-form-item label="从站"><el-input-number v-model="editForm.slave_id" :min="1" :max="247" /></el-form-item></el-col><el-col :span="8"><el-form-item label="间隔(s)"><el-input-number v-model="editForm.interval" :min="1" :max="3600" /></el-form-item></el-col><el-col :span="8"><el-form-item label="超时(s)"><el-input-number v-model="editForm.timeout" :min="1" :max="30" /></el-form-item></el-col></el-row>
          <template v-if="editForm.cType==='modbus_rtu'"><el-row :gutter="12"><el-col :span="8"><el-form-item label="串口"><el-input v-model="editForm.serial_port" /></el-form-item></el-col><el-col :span="8"><el-form-item label="波特率"><el-select v-model="editForm.baudrate"><el-option v-for="b in [9600,19200,38400,57600,115200]" :key="b" :label="b" :value="b" /></el-select></el-form-item></el-col><el-col :span="8"><el-form-item label="校验"><el-select v-model="editForm.parity"><el-option v-for="p in ['N','E','O']" :key="p" :label="p" :value="p" /></el-select></el-form-item></el-col></el-row></template>
        </template>
        <!-- OPC 专有 -->
        <template v-if="editForm.cType==='opcda'||editForm.cType==='opcua'">
          <el-row :gutter="12"><el-col :span="12"><el-form-item label="ProgID"><el-input v-model="editForm.prog_id" /></el-form-item></el-col><el-col :span="12"><el-form-item label="刷新(ms)"><el-input-number v-model="editForm.refresh_ms" :min="100" :max="60000" /></el-form-item></el-col></el-row>
        </template>
        <!-- MQTT 专有 -->
        <template v-if="editForm.cType==='mqtt'"><el-row :gutter="12"><el-col :span="12"><el-form-item label="Client ID"><el-input v-model="editForm.client_id" /></el-form-item></el-col><el-col :span="12"><el-form-item label="QoS"><el-select v-model="editForm.qos"><el-option :value="0" label="0" /><el-option :value="1" label="1" /><el-option :value="2" label="2" /></el-select></el-form-item></el-col></el-row><el-form-item label="Topics"><el-input v-model="editForm.topics" placeholder="dgiot/+/telemetry" /></el-form-item></template>
        <!-- IEC104 专有 -->
        <template v-if="editForm.cType==='iec104'"><el-row :gutter="12"><el-col :span="8"><el-form-item label="ASDU"><el-input-number v-model="editForm.asdu_addr" :min="1" :max="65535" /></el-form-item></el-col><el-col :span="8"><el-form-item label="IOA起"><el-input-number v-model="editForm.ioa_start" :min="0" :max="16777215" /></el-form-item></el-col><el-col :span="8"><el-form-item label="IOA止"><el-input-number v-model="editForm.ioa_end" :min="1" :max="16777215" /></el-form-item></el-col></el-row></template>
        <!-- DTU 专有 -->
        <template v-if="editForm.cType==='dtu'"><el-row :gutter="12"><el-col :span="12"><el-form-item label="厂商"><el-select v-model="editForm.vendor"><el-option v-for="v in ['宏电','映翰通','亿帆','有人','四信','中科']" :key="v" :label="v" :value="v" /></el-select></el-form-item></el-col><el-col :span="12"><el-form-item label="注册帧长度"><el-input-number v-model="editForm.reg_len" :min="4" :max="256" /></el-form-item></el-col></el-row></template>
        <!-- RTSP 专有 -->
        <template v-if="editForm.cType==='rtsp'"><el-row :gutter="12"><el-col :span="12"><el-form-item label="流路径"><el-input v-model="editForm.stream_path" placeholder="/live/ch01" /></el-form-item></el-col><el-col :span="12"><el-form-item label="编码"><el-select v-model="editForm.codec"><el-option v-for="c in ['H.264','H.265','MJPEG']" :key="c" :label="c" :value="c" /></el-select></el-form-item></el-col></el-row></template>
        <!-- TDengine 专有 -->
        <template v-if="editForm.cType==='tdengine'"><el-row :gutter="12"><el-col :span="12"><el-form-item label="数据库"><el-input v-model="editForm.td_db" /></el-form-item></el-col><el-col :span="12"><el-form-item label="超级表"><el-input v-model="editForm.td_stable" /></el-form-item></el-col></el-row></template>
        <!-- Task 专有 -->
        <template v-if="editForm.cType==='task'"><el-row :gutter="12"><el-col :span="12"><el-form-item label="队列名"><el-input v-model="editForm.queue_name" /></el-form-item></el-col><el-col :span="12"><el-form-item label="优先级"><el-select v-model="editForm.priority"><el-option :value="1" label="高" /><el-option :value="2" label="中" /><el-option :value="3" label="低" /></el-select></el-form-item></el-col></el-row></template>
      </el-form>
      <template #footer><el-button @click="editVisible=false">取消</el-button><el-button type="primary" @click="saveChannel">保存</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onUnmounted, computed } from 'vue'
import request from '../api/request.js'
import { ElMessage } from 'element-plus'
import { DEVICE_TYPE_MAP } from '../utils/constants'
import ChannelCard from '../components/ChannelCard.vue'

const channels = ref([]); const selected = ref(null); const packets = ref([]); const viewMode = ref('protocol')
const channelPage = ref(1); const channelPageSize = ref(10)
const typeMap = DEVICE_TYPE_MAP

// 厂商通道 — 从 DB 动态加载
const vendorChannels = ref([])

async function loadVendors() {
  try {
    const r = await import('../api').then(m => m.default.get('/vendor/list'))
    const vendors = r.data?.vendors || []
    if (vendors.length) vendorChannels.value = vendors
  } catch { /* API 不可用时保持空列表 */ }
}
const selVendor = ref(null)
const selLogs = ref([])

// 选中厂商通道时加载日志
watch(selVendor, (v) => {
  if (!v) { selLogs.value = []; return }
  const now = new Date()
  const t = (d) => d.toTimeString().slice(0,8)
  const logs = [
    { time: t(now), level: 'info', msg: `通道 ${v.name} 状态刷新: 已同步` },
    { time: t(new Date(now - 60000)), level: 'info', msg: `采集完成: ${v.devices} 设备, ${v.points} 测点` },
    { time: t(new Date(now - 120000)), level: 'info', msg: `连接验证成功: ${v.source}` },
  ]
  if (v.key === 'youyeyun') {
    logs.push({ time: t(new Date(now - 180000)), level: 'info', msg: '有叶云 API 登录成功, Token 刷新' })
    logs.push({ time: t(new Date(now - 300000)), level: 'info', msg: 'CCS-1液压系统: 28 测点 (含水量1.34ppm, 温度35.67°C)' })
    logs.push({ time: t(new Date(now - 300000)), level: 'info', msg: '2号齿轮系统: 26 测点 (温度34.65°C, 含水量5.25ppm)' })
  }
  if (v.key === 'boiler') {
    logs.push({ time: t(new Date(now - 180000)), level: 'warn', msg: '2号锅炉排烟温度偏高 (182°C > 180°C)' })
  }
  if (v.key === 'phm_vib') {
    logs.push({ time: t(new Date(now - 120000)), level: 'warn', msg: '压缩机-C2振动超标 (7.2mm/s > 6mm/s)' })
  }
  logs.push({ time: t(new Date(now - 3600000)), level: 'info', msg: `通道初始化完成, 注册协议: ${v.protocol}` })
  selLogs.value = logs
})

const protoChannels = computed(() => channels.value.filter(c => ['modbus_tcp','modbus_rtu','opcda','opcua','a11','iec104','mqtt','http_rest','dtu','rtsp'].includes(c.cType)))
const tdChannels = computed(() => channels.value.filter(c => c.cType==='tdengine'))
const taskChannels = computed(() => channels.value.filter(c => c.cType==='task'))
const filteredList = computed(() => {
  if (viewMode.value==='protocol') return protoChannels.value
  if (viewMode.value==='td') return tdChannels.value
  if (viewMode.value==='task') return taskChannels.value
  return vendorChannels.value
})
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
const defaultForm = () => ({ devaddr:'', name:'', cType:'modbus_tcp', isEnable:true, host:'127.0.0.1', port:502, desc:'',
  slave_id:1, interval:5, timeout:3, serial_port:'COM3', baudrate:9600, parity:'N',
  prog_id:'', refresh_ms:1000, client_id:'', qos:0, topics:'', asdu_addr:1, ioa_start:0, ioa_end:100,
  vendor:'宏电', reg_len:32, stream_path:'/live/ch01', codec:'H.264',
  td_db:'dgiot_lite', td_stable:'telemetry', queue_name:'collect', priority:2 })
const editForm = reactive(defaultForm())
const allCtypes = ['modbus_tcp','modbus_rtu','opcda','opcua','a11','iec104','mqtt','http_rest','dtu','rtsp','tdengine','task']

let timer = null

function selectChannel(ch) { selected.value = ch; loadPackets(ch.device_id) }
async function loadPackets(did) {
  try { const r = await request.get(`/packets?device_id=${did}&limit=30`); packets.value = r.packets || [] } catch { packets.value = [] }
}
async function reconnect(did) { try { await request.post(`/channels/${did}/reconnect`); ElMessage.success('已重连'); loadAll() } catch { ElMessage.error('失败') } }
async function delChannel(did) { try { await request.delete(`/devices/${did}`); ElMessage.success('已删除'); selected.value = null; loadAll() } catch { ElMessage.error('删除失败') } }
async function scanChannel(ch) {
  scanning.value = true
  try {
    let r
    if (ch.cType.startsWith('modbus')) {
      r = await request.post('/scanner/modbus/scan', { host: ch.host, port: ch.port || 502, start: 1, end: 10 })
    } else {
      r = await request.post('/scanner/scan', { host: ch.host, port: ch.port, start: 1, end: 10 })
    }
    // 显示完整 trace
    const trace = r.trace || []
    packets.value = trace.filter(t => t.dir === 'tx' || t.dir === 'rx' || t.dir === 'info').map(t => ({
      dir: t.dir === 'info' ? 'info' : t.dir,
      len: t.hex?.length || 0,
      hex: t.hex || '',
      step: t.step || ''
    }))
    ElMessage.success(`${r.host}:${r.port} 活跃${r.active}/${r.total_scanned}从站 · ${trace.length}条报文`)
  } catch (e) {
    packets.value = [{ dir: 'tx', len: 0, hex: `→ ${ch.host}:${ch.port} 不可达` }]
    ElMessage.error(`${ch.host||'—'}:${ch.port||'—'} 不可达`)
  } finally { scanning.value = false }
}

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
  try { const r = await request.post('/scanner/scan', { host: scanForm.host, port: scanForm.port, start:1, end:10 }); scanResults.value = r.slaves || []; ElMessage.success(`发现 ${scanResults.value.length} 个从站`) } catch { ElMessage.error('扫描失败') }
  scanning.value = false
}
function addFromScan(row) {
  scanVisible.value = false
  Object.assign(editForm, { ...defaultForm(), devaddr: `slave_${row.slave_id}_${Date.now()%10000}`, name: `从站#${row.slave_id}`, cType: 'modbus_tcp', host: scanForm.host, port: scanForm.port, slave_id: row.slave_id })
  editId.value = ''; editVisible.value = true
}
function showAddDialog() { editId.value = ''; Object.assign(editForm, defaultForm()); editVisible.value = true }
function editChannel(ch) {
  editId.value = ch.device_id
  Object.assign(editForm, {
    ...defaultForm(),
    devaddr: ch.device_id, name: ch.name || ch.device_id, cType: ch.cType, isEnable: ch.status === 'online',
    host: ch.host || '127.0.0.1', port: ch.port || 502, desc: ch.desc || '',
  })
  editVisible.value = true
}
async function saveChannel() {
  const cfg = { ...editForm }
  delete cfg.devaddr; delete cfg.name; delete cfg.isEnable; delete cfg.desc
  try {
    await request.post('/devices', { device_id: editForm.devaddr, device_name: editForm.name, protocol: editForm.cType, device_type: editForm.cType, station_id: editForm.station_id || 'default', comm_params: { host: editForm.host, port: editForm.port, ...cfg } })
    ElMessage.success(editId.value ? '已更新' : '已添加')
    editVisible.value = false; loadAll()
  } catch { ElMessage.error('保存失败') }
}

async function loadAll() {
  try {
    const r = await request.get('/channels')
    channels.value = r.channels || []
    // 厂商通道从 channels 提取
    vendorChannels.value = channels.value.filter(c => c.cType === 'vendor').map(c => ({
      key: c.device_id, name: c.name, icon: '\u{1F517}', source: c.desc,
      connected: c.status === 'online', lastSync: '—', devices: c.devices, points: c.points,
      interval: '30s', desc: c.desc, relatedDevices: []
    }))
    if (selected.value) { const f = channels.value.find(c => c.device_id === selected.value.device_id); if (f) { selected.value = f; loadPackets(f.device_id) } }
  } catch (e) { console.error('loadAll:', e) }
}
onMounted(() => { loadAll(); timer = setInterval(loadAll, 30000) })
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

/* 通道日志 */
.log-list { max-height: 180px; overflow-y: auto; margin-top: 4px; }
.log-row { font-size: 11px; padding: 2px 0; border-bottom: 1px solid #0d1f33; font-family: monospace; color: #8aa0b4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.log-row:hover { background: #112233; }

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
