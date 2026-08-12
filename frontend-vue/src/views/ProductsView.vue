<template>
  <div class="prod-page">
    <h3>📦 产品管理</h3>
    <!-- iotStudio 风格: 分类筛选 + 操作栏 -->
    <div class="prod-toolbar">
      <el-select v-model="catFilter" size="small" placeholder="全部分类" clearable style="width:140px" @change="loadProducts">
        <el-option v-for="c in categories" :key="c.key" :label="c.name" :value="c.key" />
      </el-select>
      <div style="display:flex;gap:8px">
        <el-button size="small" @click="exportAll">📤 导出全部</el-button>
        <el-button size="small" type="primary" @click="importDialog=true">📥 导入</el-button>
        <el-button size="small" type="success" @click="addProduct">+ 新建产品</el-button>
      </div>
    </div>
    <div class="list-detail">
      <!-- 左侧：产品列表 -->
      <div class="list-panel">
        <el-row :gutter="8">
          <el-col :span="6" v-for="p in filteredProducts" :key="p.key">
            <el-card class="prod-card" :class="{active:selected?.key===p.key}" shadow="hover" @click="selectProduct(p)">
              <span class="pc-icon">{{ p.icon }}</span>
              <div class="pc-name">{{ p.name || p.label }}</div>
              <div class="pc-meta"><el-tag size="small" effect="plain">{{ p.devType || p.key }}</el-tag><span v-if="p.nodeType!==undefined" style="margin-left:4px;font-size:10px;color:#909399">{{ p.nodeType===0?'直连':'网关' }}</span></div>
              <div class="pc-stats"><b>{{ p.count }}</b> 设备 · <b>{{ p.pointCount }}</b> 测点</div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 右侧：物模型详情 -->
      <div class="detail-panel" v-if="selected">
        <div class="dp-header">
          <span class="dp-title">{{ selected.label }} — 物模型 (TSL)</span>
          <el-tag size="small" :type="tslStatus==='draft'?'warning':'success'" style="margin-left:8px">{{ tslStatus==='draft'?'草稿':'已发布' }}</el-tag>
          <span class="dp-sub">产品类型: {{ selected.key }} | {{ thingPoints.length }} 个测点</span>
        </div>
        <div class="dp-actions">
          <span>{{ activeZone }} ({{ zoneData.length }} 项)</span>
          <div style="display:flex;gap:6px">
            <el-button size="small" @click="exportTSL">📤 导出</el-button>
            <el-button size="small" @click="showImport=true">📥 导入</el-button>
            <el-button size="small" type="primary" @click="openPointDialog()">+ 添加</el-button>
            <el-button size="small" @click="tslStatus='published';ElMessage.success('物模型已发布')">{{ tslStatus==='draft'?'发布':'保存' }}</el-button>
            <el-button size="small" @click="selected=null">✕</el-button>
          </div>
        </div>
        <!-- TSL 分区标签 -->
        <div class="zone-tabs">
          <span v-for="z in zones" :key="z.key" :class="{active:activeZone===z.key}" @click="activeZone=z.key;ptPage=1">{{ z.label }}</span>
        </div>
        <div class="zone-desc">{{ zones.find(z=>z.key===activeZone)?.desc }}</div>
        <el-table :data="pagedPoints" size="small" max-height="320" v-loading="loading" stripe>
          <el-table-column label="分区" :min-width="50" align="center">
            <template #default="{row}"><el-tag size="small" :type="row.zone==='services'?'warning':row.zone==='events'?'danger':''" effect="dark">{{ zoneLabel(row.zone) }}</el-tag></template>
          </el-table-column>
          <el-table-column prop="identifier" label="标识符" :min-width="col('lg')" show-overflow-tooltip />
          <el-table-column prop="name" label="名称" :min-width="col('md')" />
          <el-table-column prop="dataType" label="类型" :min-width="col('sm')" align="center">
            <template #default="{row}"><el-tag size="small" effect="dark">{{ row.dataType }}</el-tag></template>
          </el-table-column>
          <el-table-column prop="unit" label="单位" :min-width="40" align="center" />
          <el-table-column label="范围" :min-width="col('lg')"><template #default="{row}">{{ row.min||0 }} ~ {{ row.max||9999 }}</template></el-table-column>
          <el-table-column label="告警阈值" :min-width="col('lg')">
            <template #default="{row}"><span v-if="row.alarm_low||row.alarm_high" style="font-family:monospace;font-size:11px">{{ row.alarm_low||'—' }} ~ {{ row.alarm_high||'—' }}</span><span v-else style="color:#8aa0b4">—</span></template>
          </el-table-column>
          <el-table-column label="操作" width="90" fixed="right" align="center">
            <template #default="{row}">
              <el-button link type="primary" size="small" @click="openPointDialog(row)">编辑</el-button>
              <el-popconfirm title="删除?" @confirm="delPoint(row)"><template #reference><el-button link type="danger" size="small">删</el-button></template></el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-if="thingPoints.length>ptPageSize" style="margin-top:6px;justify-content:center" background small layout="prev,pager,next" :total="thingPoints.length" v-model:current-page="ptPage" :page-size="ptPageSize" />

    <!-- 新建产品弹窗 -->
    <el-dialog v-model="showProdDialog" title="新建产品" width="480px">
      <el-form :model="prodForm" label-width="80px" size="small">
        <el-row :gutter="12">
          <el-col :span="12"><el-form-item label="devType"><el-input v-model="prodForm.devType" placeholder="inverter" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="名称"><el-input v-model="prodForm.name" placeholder="光伏逆变器" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12"><el-form-item label="图标"><el-input v-model="prodForm.icon" /></el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="节点类型"><el-select v-model="prodForm.nodeType" style="width:100%"><el-option :value="0" label="直连设备" /><el-option :value="1" label="网关子设备" /></el-select></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="网络"><el-select v-model="prodForm.netType" style="width:100%"><el-option value="ethernet" label="以太网" /><el-option value="wifi" label="WiFi" /><el-option value="cellular" label="4G/5G" /><el-option value="lora" label="LoRa" /></el-select></el-form-item>
          </el-col>
          <el-col :span="12"><el-form-item label="ObjectId"><el-input v-model="prodForm.objectId" placeholder="留空自动生成" /></el-form-item></el-col>
        </el-row>
        <el-form-item label="描述"><el-input v-model="prodForm.desc" type="textarea" :rows="2" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="showProdDialog=false">取消</el-button><el-button type="primary" @click="saveProduct">创建</el-button></template>
    </el-dialog>

    <!-- 产品导入弹窗 -->
    <el-dialog v-model="importDialog" title="导入产品" width="600px">
      <el-input v-model="importText" type="textarea" :rows="10" placeholder="粘贴产品 JSON 数组 [{objectId,devType,name,nodeType,netType,icon,desc}]" />
      <template #footer><el-button @click="importDialog=false">取消</el-button><el-button type="primary" @click="doImportProducts">导入</el-button></template>
    </el-dialog>

    <!-- TSL 导入弹窗 -->
    <el-dialog v-model="showImport" title="导入 TSL JSON" width="600px">
      <el-input v-model="importText" type="textarea" :rows="12" placeholder="粘贴 TSL JSON (兼容阿里云/IoT标准格式)..." />
      <template #footer><el-button @click="showImport=false">取消</el-button><el-button type="primary" @click="doImport">导入</el-button></template>
    </el-dialog>

    <!-- 测点编辑弹窗 -->
    <el-dialog v-model="ptDialogVis" :title="ptEditingId?'编辑测点':'添加测点'" width="480px">
      <el-form :model="ptForm" label-width="80px" size="small">
        <el-row :gutter="12">
          <el-col :span="12"><el-form-item label="标识符"><el-input v-model="ptForm.point_id" :disabled="!!ptEditingId" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="名称"><el-input v-model="ptForm.point_name" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12"><el-form-item label="数据类型"><el-select v-model="ptForm.data_type" style="width:100%"><el-option v-for="t in dtypes" :key="t" :label="t" :value="t" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="单位"><el-input v-model="ptForm.unit" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12"><el-form-item label="最小值"><el-input-number v-model="ptForm.min_val" :step="1" style="width:100%" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="最大值"><el-input-number v-model="ptForm.max_val" :step="1" style="width:100%" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12"><el-form-item label="报警下限"><el-input-number v-model="ptForm.alarm_low" :step="0.1" style="width:100%" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="报警上限"><el-input-number v-model="ptForm.alarm_high" :step="0.1" style="width:100%" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12"><el-form-item label="TSL分区"><el-select v-model="ptForm.zone" style="width:100%"><el-option v-for="z in zones" :key="z.key" :label="z.label" :value="z.key" /></el-select></el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="协议"><el-select v-model="ptForm.protocol" style="width:100%"><el-option v-for="p in protocols" :key="p" :label="p" :value="p" /></el-select></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="寄存器类型"><el-select v-model="ptForm.register_type" style="width:100%"><el-option label="保持寄存器(03)" value="3" /><el-option label="输入寄存器(04)" value="4" /><el-option label="线圈(01)" value="1" /><el-option label="离散输入(02)" value="2" /></el-select></el-form-item>
          </el-col>
          <el-col :span="12"><el-form-item label="寄存器地址"><el-input v-model="ptForm.register_addr" placeholder="0x0000" /></el-form-item></el-col>
        </el-row>
      </el-form>
      <template #footer><el-button @click="ptDialogVis=false">取消</el-button><el-button type="primary" @click="savePoint">保存</el-button></template>
    </el-dialog>
      </div>
      <div class="detail-panel empty-panel" v-else>
        <span>👈 点击左侧产品查看物模型</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import api from '../api'
import { PROTOCOLS, DATA_TYPES } from '../utils/constants'

const COLS = { xs:40, sm:65, md:85, lg:115, xl:170 }
function col(k) { return COLS[k]||80 }
function zoneLabel(z) { return z==='props'?'属性':z==='events'?'事件':'服务' }

const products = ref([  // DG-IoT Product aligned: devType, nodeType, netType
  { key:'inverter', icon:'☀️', name:'光伏逆变器', devType:'inverter', nodeType:0, netType:'ethernet', cat:'energy', desc:'光储充核心设备', count:0, pointCount:0 },
  { key:'pcs', icon:'🔋', name:'储能PCS', devType:'pcs', nodeType:0, netType:'ethernet', cat:'energy', desc:'电池储能变流控制', count:0, pointCount:0 },
  { key:'charger', icon:'🔌', name:'充电桩', devType:'charger', nodeType:0, netType:'ethernet', cat:'energy', desc:'电动汽车充放电', count:0, pointCount:0 },
  { key:'meter', icon:'📟', name:'智能电表', devType:'meter', nodeType:1, netType:'cellular', cat:'meter', desc:'三相电量计量采集', count:0, pointCount:0 },
  { key:'sensor', icon:'🌡️', name:'环境传感器', devType:'sensor', nodeType:1, netType:'lora', cat:'sensor', desc:'温湿度/辐照/风速', count:0, pointCount:0 },
  { key:'oilwell', icon:'🛢️', name:'抽油机井', devType:'oilwell', nodeType:1, netType:'cellular', cat:'oilfield', desc:'油气田采油设备', count:0, pointCount:0 },
  { key:'rtu', icon:'📡', name:'RTU终端', devType:'rtu', nodeType:1, netType:'cellular', cat:'oilfield', desc:'远程采集终端', count:0, pointCount:0 },
  { key:'compressor', icon:'⚙️', name:'压缩机', devType:'compressor', nodeType:0, netType:'ethernet', cat:'oilfield', desc:'离心/往复压缩机', count:0, pointCount:0 },
  { key:'pipeline', icon:'🔗', name:'集输管线', devType:'pipeline', nodeType:0, netType:'ethernet', cat:'oilfield', desc:'油气集输管道', count:0, pointCount:0 },
])

const categories = [
  { key:'energy', name:'⚡ 能源设备' }, { key:'meter', name:'📟 计量仪表' },
  { key:'sensor', name:'🌡️ 传感器' }, { key:'oilfield', name:'🛢️ 油气设备' },
]
const catFilter = ref('')
const filteredProducts = computed(() =>
  catFilter.value ? products.value.filter(p => p.cat === catFilter.value) : products.value
)
const importDialog = ref(false)

const selected = ref(null)
const thingPoints = ref([])
const loading = ref(false)
const ptDialogVis = ref(false)
const showImport = ref(false)
const importText = ref('')
const ptEditingId = ref('')
const tslStatus = ref('published')
const ptPage = ref(1); const ptPageSize = ref(15)
const activeZone = ref('props')
const zones = [
  { key: 'props', label: '属性', desc: '设备采集与监控数据点 — 只读采集值' },
  { key: 'events', label: '事件', desc: '设备主动上报的事件与告警 — 只读状态位' },
  { key: 'services', label: '服务', desc: '可写控制参数与阈值设定 — 读写配置' },
]
const zoneData = computed(() => thingPoints.value.filter(p => (p.zone||'props') === activeZone.value))
const pagedPoints = computed(() => zoneData.value.slice((ptPage.value-1)*ptPageSize.value, ptPage.value*ptPageSize.value))
const ptForm = ref({ point_id:'', point_name:'', data_type:'float32', unit:'', min_val:0, max_val:9999, alarm_low:null, alarm_high:null, category:'electrical', register_addr:'', protocol:'modbus_tcp', register_type:'3', zone:'props' })
const dtypes = DATA_TYPES
const protocols = PROTOCOLS

async function selectProduct(p) {
  selected.value = p; ptPage.value = 1; activeZone.value = 'props'; tslStatus.value = 'published'
  loading.value = true
  try {
    const r = await api.get(`/products/${p.key}/model`)
    const pts = (r.data||{}).points||{}
    thingPoints.value = Object.entries(pts).map(([k,v]) => ({
      identifier: k, name: v.name||k, dataType: v.type||'float32',
      unit: v.unit||'', min: v.min, max: v.max,
      category: v.category||'—', register_addr: v.register_addr||'—',
      alarm_low: v.alarm_low, alarm_high: v.alarm_high,
      zone: v.zone||(v.register_type==='3'||v.register_type==='4'?'services':(v.register_type==='1'||v.register_type==='2'?'events':'props')),
    }))
    p.pointCount = thingPoints.value.length
  } catch { thingPoints.value = [] }
  loading.value = false
}

function exportAll() {
  const data = products.value.map(p => ({ objectId: p.key, devType: p.devType, name: p.name, nodeType: p.nodeType, netType: p.netType, icon: p.icon, desc: p.desc }))
  navigator.clipboard.writeText(JSON.stringify(data, null, 2))
  ElMessage.success(`${data.length} 个产品定义已复制`)
}
const showProdDialog = ref(false)
const prodForm = reactive({objectId:'',name:'',devType:'',icon:'📦',nodeType:0,netType:'ethernet',desc:''})
function addProduct() { Object.assign(prodForm,{objectId:'',name:'',devType:'',icon:'📦',nodeType:0,netType:'ethernet',desc:''}); showProdDialog.value=true }
async function saveProduct() {
  if (!prodForm.name || !prodForm.devType) { ElMessage.warning('名称和devType必填'); return }
  const key = prodForm.objectId || prodForm.devType
  products.value.push({ key, icon: prodForm.icon, name: prodForm.name, devType: prodForm.devType, nodeType: prodForm.nodeType, netType: prodForm.netType, desc: prodForm.desc, count:0, pointCount:0 })
  // 同步到后端 parse_lite
  try {
    await api.post('/products', { objectId: key, devType: prodForm.devType, name: prodForm.name, icon: prodForm.icon, nodeType: prodForm.nodeType, netType: prodForm.netType, desc: prodForm.desc })
  } catch {}
  showProdDialog.value = false; ElMessage.success(`产品 ${prodForm.name} 已创建`)
}
function exportTSL() {
  const tsl = {
    schema: 'TSL/v1', product: selected.value?.key, label: selected.value?.label,
    properties: thingPoints.value.filter(p => p.zone==='props'),
    events: thingPoints.value.filter(p => p.zone==='events'),
    services: thingPoints.value.filter(p => p.zone==='services'),
  }
  navigator.clipboard.writeText(JSON.stringify(tsl, null, 2))
  ElMessage.success('TSL 已复制到剪贴板')
}

function doImportProducts() {
  try {
    const items = JSON.parse(importText.value)
    items.forEach(item => {
      const existing = products.value.find(p => p.key === item.objectId)
      if (existing) { Object.assign(existing, { name: item.name, devType: item.devType, nodeType: item.nodeType, netType: item.netType, icon: item.icon || '📦', desc: item.desc }) }
      else { products.value.push({ key: item.objectId, icon: item.icon || '📦', name: item.name, devType: item.devType, nodeType: item.nodeType, netType: item.netType, desc: item.desc, count: 0, pointCount: 0 }) }
    })
    importDialog.value = false; ElMessage.success(`导入 ${items.length} 个产品`)
  } catch { ElMessage.error('JSON 格式错误') }
}

function doImport() {
  try {
    const tsl = JSON.parse(importText.value)
    const pts = [
      ...(tsl.properties||[]).map(p => ({...p, zone:'props'})),
      ...(tsl.events||[]).map(p => ({...p, zone:'events'})),
      ...(tsl.services||[]).map(p => ({...p, zone:'services'})),
    ]
    if (pts.length === 0) { ElMessage.warning('未识别到数据') }
    else { thingPoints.value = pts; selected.value.pointCount = pts.length; tslStatus.value = 'draft'; showImport.value = false; ElMessage.success(`导入 ${pts.length} 个条目`) }
  } catch { ElMessage.error('JSON 格式错误') }
}

function openPointDialog(row) {
  ptEditingId.value = row?.identifier || ''
  ptForm.value = row ? {
    point_id: row.identifier, point_name: row.name, data_type: row.dataType,
    unit: row.unit, min_val: row.min||0, max_val: row.max||9999,
    alarm_low: row.alarm_low, alarm_high: row.alarm_high,
    category: row.category, register_addr: row.register_addr||'',
    protocol: row.protocol||'modbus_tcp', register_type: row.register_type||'3',
    zone: row.zone||'props',
  } : { point_id:'', point_name:'', data_type:'float32', unit:'', min_val:0, max_val:9999, alarm_low:null, alarm_high:null, category:'electrical', register_addr:'', protocol:'modbus_tcp', register_type:'3', zone:'props' }
  ptDialogVis.value = true
}

async function savePoint() {
  try {
    const body = ptForm.value
    if (ptEditingId.value) {
      await api.put(`/products/${selected.value.key}/model/points/${ptEditingId.value}`, body)
    } else {
      await api.post(`/products/${selected.value.key}/model/points`, body)
    }
    ptDialogVis.value = false
    selectProduct(selected.value) // refresh
  } catch { ElMessage.error('保存失败') }
}

async function delPoint(row) {
  try {
    await api.delete(`/products/${selected.value.key}/model/points/${row.identifier}`)
    selectProduct(selected.value)
  } catch {}
}


onMounted(async () => {
  try {
    const r = await api.get('/devices', {params:{page_size:200}})
    ;(r.data.devices||[]).forEach(d => {
      const p = products.value.find(x=>x.key===d.device_type)
      if (p) p.count++
    })
  } catch {}
  // 预加载所有产品的测点数 + 默认选中第一个
  for (const p of products.value) {
    try {
      const r = await api.get(`/products/${p.key}/model`)
      p.pointCount = Object.keys((r.data||{}).points||{}).length
    } catch { p.pointCount = 0 }
  }
  if (products.value.length > 0) selectProduct(products.value[0])
})
</script>

<style scoped>
.prod-page { height: 100%; display: flex; flex-direction: column; }
.prod-page h3 { color: #e8f0f8; margin: 0 0 8px; flex-shrink: 0; }
.prod-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px }
.list-detail { display: flex; gap: 12px; flex: 1; min-height: 0; }
.list-panel { flex: 1; overflow-y: auto; }

.prod-card { margin-bottom: 8px; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; text-align: center; padding: 10px 8px; }
.prod-card:hover { border-color: #66d9ff; }
.prod-card.active { border-color: #66d9ff; box-shadow: 0 0 10px rgba(102,217,255,0.15); }
.pc-icon { font-size: 28px; display: block; }
.pc-name { font-size: 13px; font-weight: bold; margin: 4px 0; color: #e0e0e0 }
.pc-meta { margin: 2px 0 }
.pc-stats { font-size: 11px; color: #8aa0b4; }
.pc-stats b { color: #66d9ff; }

.detail-panel { width: 440px; flex-shrink: 0; background: #162844; border: 1px solid #2a4870; border-radius: 8px; display: flex; flex-direction: column; }
.empty-panel { display: flex; align-items: center; justify-content: center; color: #8aa0b4; font-size: 14px; }
.dp-header { padding: 12px 16px; border-bottom: 1px solid #2a4870; }
.dp-title { font-size: 15px; font-weight: bold; color: #e8f0f8; display: block; }
.dp-sub { font-size: 11px; color: #8aa0b4; margin-top: 2px; display: block; }
.dp-footer { padding: 8px 16px; border-top: 1px solid #2a4870; display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #8aa0b4; }
.zone-tabs { display: flex; gap: 0; padding: 8px 12px 0; border-bottom: 1px solid #2a4870; }
.zone-tabs span { padding: 6px 16px; font-size: 13px; color: #8aa0b4; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s; }
.zone-tabs span.active { color: #66d9ff; border-bottom-color: #66d9ff; }
.zone-desc { font-size: 11px; color: #5a7188; padding: 6px 12px; }
</style>
