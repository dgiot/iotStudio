<template>
  <div class="device-page">
    <!-- 一级 Tab：按类型 -->
    <div class="type-tabs">
      <span v-for="g in typeGroups" :key="g.key" class="tab-chip" :class="{ active: activeTab === g.key }" @click="activeTab = g.key; currentPage = 1">
        {{ g.label }} <small>({{ g.count }})</small>
      </span>
    </div>

    <div class="content-row">
      <!-- 左侧表格 -->
      <div class="table-panel">
        <!-- iotStudio 风格: 字段选择搜索 -->
        <div class="toolbar">
          <h3>设备列表</h3>
          <el-input v-model="searchText" size="small" placeholder="搜索..." style="width:200px" clearable @clear="load" @keyup.enter="load">
            <template #prepend>
              <el-select v-model="searchField" size="small" style="width:90px">
                <el-option label="名称" value="name" />
                <el-option label="devaddr" value="devaddr" />
                <el-option label="产品" value="product" />
              </el-select>
            </template>
          </el-input>
          <div style="display:flex;gap:6px">
            <el-button type="primary" size="small" @click="showDialog(null)"><el-icon><Plus /></el-icon>添加</el-button>
            <el-button size="small" @click="exportDevices">📤 导出</el-button>
            <el-button type="success" size="small" @click="seedDemo" :loading="seeding">🎲 演示</el-button>
          </div>
        </div>

        <el-table :data="devices" highlight-current-row @row-click="selectRow" :row-class-name="rowClass" max-height="520" v-loading="loading">
          <el-table-column prop="devaddr" label="devaddr" :min-width="col('lg')" align="center">
            <template #default="{row}"><code style="font-size:11px">{{ row.devaddr }}</code></template>
          </el-table-column>
          <el-table-column prop="name" label="名称" :min-width="col('xl')" show-overflow-tooltip />
          <el-table-column prop="product" label="产品" :min-width="col('md')" align="center">
            <template #default="{row}">
              <el-tag size="small" effect="dark" type="">{{ row.productName || (row.product?.objectId) || '—' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="ip" label="IP" :min-width="col('md')" align="center">
            <template #default="{row}"><span v-if="row.ip" style="font-family:monospace;font-size:11px">{{ row.ip }}</span><span v-else style="color:#666">—</span></template>
          </el-table-column>
          <el-table-column prop="status" label="状态" :min-width="col('sm')" align="center">
            <template #default="{row}">
              <el-tag :type="row.status==='online'?'success':(row.status==='alarm'?'warning':'info')" size="small">
                {{ statusMap[row.status] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="station_id" label="场站" :min-width="col('md')" align="center" />
          <el-table-column label="操作" width="160" fixed="right" align="center">
            <template #default="{row}">
              <el-button link type="primary" size="small" @click.stop="goDetail(getDeviceId(row))">详情</el-button>
              <el-button link type="warning" size="small" @click.stop="showDialog(row)">编辑</el-button>
              <el-popconfirm title="确认?" @confirm="handleDelete(getDeviceId(row))"><template #reference><el-button link type="danger" size="small">删除</el-button></template></el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pager-bar">
          <el-pagination v-model:current-page="currentPage" :page-size="pageSize" :page-sizes="[10,20,50,100]"
            layout="total, sizes, prev, pager, next" :total="total" size="small" background
            @current-change="load" @size-change="onSizeChange" />
        </div>
      </div>

      <!-- 右侧面板 -->
      <div class="detail-panel" :style="{width: 'var(--detail-width-wide)'}">
        <template v-if="selected">
          <div class="panel-header">
            <span class="panel-title">{{ selected.device_name }}</span>
            <el-tag :type="selected.status==='online'?'success':'info'" size="small">{{ statusMap[selected.status] }}</el-tag>
          </div>
          <el-descriptions :column="1" size="small" border>
            <el-descriptions-item label="设备ID">{{ selected.device_id }}</el-descriptions-item>
            <el-descriptions-item label="类型">{{ typeMap[selected.device_type] }}</el-descriptions-item>
            <el-descriptions-item label="协议">{{ selected.protocol }}</el-descriptions-item>
            <el-descriptions-item label="场站">{{ selected.station_id }}</el-descriptions-item>
            <el-descriptions-item label="厂商">{{ selected.manufacturer || '-' }}</el-descriptions-item>
            <el-descriptions-item label="最后在线">{{ selected.last_online_at || '-' }}</el-descriptions-item>
          </el-descriptions>
          <div class="panel-actions">
            <el-button size="small" type="primary" @click="goDetail(getDeviceId(selected))">查看详情</el-button>
          </div>
        </template>
        <div v-else class="panel-empty">
          <el-icon :size="36" color="#c0d5e8"><Monitor /></el-icon>
          <p>点击设备查看详情</p>
          <div class="stats-mini">
            <div class="stat-row"><span>在线</span><b style="color:#66d9ff">{{ stats.online }}</b></div>
            <div class="stat-row"><span>离线</span><b style="color:#c0d5e8">{{ stats.offline }}</b></div>
            <div class="stat-row"><span>告警</span><b style="color:#ef5350">{{ stats.alarm }}</b></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 弹窗 -->
    <el-dialog :title="editForm.device_id ? '编辑设备' : '添加设备'" v-model="dialogVisible" width="520px">
      <el-form :model="editForm" label-width="80px">
        <el-row :gutter="12">
          <el-col :span="12"><el-form-item label="设备ID"><el-input v-model="editForm.device_id" :disabled="!!editingId" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="名称"><el-input v-model="editForm.device_name" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="类型"><el-select v-model="editForm.device_type" style="width:100%"><el-option v-for="t in deviceTypes" :key="t.value" :label="t.label" :value="t.value" /></el-select></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="协议"><el-select v-model="editForm.protocol" style="width:100%"><el-option v-for="p in protocols" :key="p.value" :label="p.label" :value="p.value" /></el-select></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12"><el-form-item label="场站"><el-input v-model="editForm.station_id" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="厂商"><el-input v-model="editForm.manufacturer" /></el-form-item></el-col>
        </el-row>
        <el-form-item label="通讯参数"><el-input v-model="commParamsStr" type="textarea" :rows="3" placeholder='{"host":"x.x.x.x","port":502}' /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary" @click="handleSave">保存</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getDevices, createDevice, deleteDevice } from '../api'
import api from '../api'
import { DEVICE_TYPE_MAP, DEVICE_STATUS_MAP } from '../utils/constants'
import { ElMessage } from 'element-plus'

const router = useRouter()
const devices = ref([])
const selected = ref(null)
const activeTab = ref('all')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const loading = ref(false)
const searchField = ref('name')
const searchText = ref('')
const dialogVisible = ref(false)
const editingId = ref('')
const editForm = reactive({ device_id:'', device_name:'', device_type:'inverter', station_id:'station_01', protocol:'modbus_tcp', manufacturer:'', comm_params:{} })
const commParamsStr = ref('')

const COLS = { xs:40, sm:65, md:85, lg:115, xl:170 }
function col(k) { return COLS[k] || 80 }

const typeMap = DEVICE_TYPE_MAP
const statusMap = DEVICE_STATUS_MAP
const deviceTypes = Object.entries(typeMap).map(([value, label]) => ({ label, value }))
const protocols = [{ label:'Modbus RTU',value:'modbus_rtu'},{ label:'Modbus TCP',value:'modbus_tcp'},{ label:'IEC 104',value:'iec104'},{ label:'OPC UA',value:'opcua'},{ label:'OPC DA',value:'opcda'}]

const typeGroups = computed(() => {
  const g = {}; devices.value.forEach(d => { const t = d.device_type; if (!g[t]) g[t] = { key:t, label:typeMap[t]||t, count:0 }; g[t].count++ })
  return [{ key:'all', label:'全部', count:devices.value.length }, ...Object.values(g).sort((a,b) => b.count - a.count)]
})

const stats = computed(() => {
  const counts = devices.value.reduce((acc, d) => { acc[d.status] = (acc[d.status] || 0) + 1; return acc }, {})
  return { online: counts.online || 0, offline: counts.offline || 0, alarm: counts.alarm || 0 }
})

function selectRow(row) { selected.value = row }
function rowClass({row}) { return row && selected.value && getDeviceId(row) === getDeviceId(selected.value) ? 'row-selected' : '' }
function goDetail(id) { router.push(`/devices/${id}`) }
function getDeviceId(row) { return row?.devaddr || row?.device_id || row?.objectId || 'unknown' }

function exportDevices() {
  const data = devices.value.map(d => ({ objectId: d.devaddr, name: d.name, devaddr: d.devaddr, product: d.product?.objectId, ip: d.ip, status: d.status, isEnable: d.isEnable }))
  navigator.clipboard.writeText(JSON.stringify(data, null, 2))
  ElMessage.success(`${data.length} 条设备数据已复制`)
}

function showDialog(row) {
  editingId.value = row?.device_id || ''
  Object.assign(editForm, row ? {...row} : { device_id:'', device_name:'', device_type:'inverter', station_id:'station_01', protocol:'modbus_tcp', manufacturer:'', comm_params:{} })
  commParamsStr.value = JSON.stringify(editForm.comm_params || {}, null, 2)
  dialogVisible.value = true
}
async function handleSave() {
  try { editForm.comm_params = JSON.parse(commParamsStr.value || '{}') } catch { editForm.comm_params = {} }
  await createDevice({...editForm}); ElMessage.success('已保存'); dialogVisible.value = false; load()
}
async function handleDelete(id) { await deleteDevice(id); ElMessage.success('已删除'); selected.value = null; load() }
async function load() {
  loading.value = true
  try {
    const params = { page: currentPage.value, page_size: pageSize.value }
    if (activeTab.value !== 'all') params.device_type = activeTab.value
    if (searchText.value) params.search = searchText.value; params.search_field = searchField.value
    const r = await getDevices(params)
    console.log('getDevices response:', r, 'keys:', Object.keys(r||{}))
    console.log('devices array:', r?.devices, 'results:', r?.results)
    devices.value = r.results || r.devices || []
    total.value = r.count || r.total || 0
    console.log('devices.value:', devices.value.length, 'total:', total.value)
  } catch {} finally { loading.value = false }
}
function onSizeChange(size) { pageSize.value = size; currentPage.value = 1; load() }
const seeding = ref(false)
async function seedDemo() {
  seeding.value = true
  try { await api.post('/seed-demo'); ElMessage.success('演示设备已创建'); load() }
  catch { ElMessage.error('创建失败') }
  finally { seeding.value = false }
}
onMounted(load)
</script>

<style scoped>
/* 变量 */
.device-page { --detail-width-wide: 420px; display: flex; flex-direction: column; height: 100%; color: #c0d5e8; }
/* Tab */
.type-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
.tab-chip { padding: 4px 14px; border-radius: 6px; font-size: 13px; cursor: pointer; background: #1a3050; border: 1px solid #2a4870; color: #c0d5e8; transition: all 0.2s; }
.tab-chip:hover { border-color: #66d9ff; color: #c0d5e8; }
.tab-chip.active { background: #1a4a6e; border-color: #66d9ff; color: #66d9ff; font-weight: bold; }
.tab-chip small { opacity: 0.7; }
/* 内容行 */
.content-row { display: flex; gap: var(--content-gap, 8px); flex: 1; overflow: hidden; }
.table-panel { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-shrink: 0; }
.toolbar h3 { color: #c0d5e8; font-size: 15px; }
.el-table { background: transparent !important; --el-table-tr-bg-color: #162844; --el-table-header-bg-color: #1a3050; }
:deep(.row-selected) { background: rgba(79,195,247,0.08) !important; }
/* 分页 */
.pager-bar { display: flex; justify-content: flex-end; padding: 8px 0; flex-shrink: 0; }
/* 右侧面板 */
.detail-panel { background: #162844; border-left: 1px solid #234060; padding: 16px; overflow-y: auto; flex-shrink: 0; }
.panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.panel-title { font-size: 16px; font-weight: bold; color: #c0d5e8; }
.panel-actions { margin-top: 12px; }
.panel-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 8px; color: #c0d5e8; }
.stats-mini { margin-top: 16px; display: flex; gap: 20px; }
.stat-row { display: flex; flex-direction: column; align-items: center; font-size: 12px; color: #c0d5e8; gap: 2px; }
.stat-row b { font-size: 20px; }
:deep(.el-descriptions) { --el-descriptions-item-bordered-label-background: rgba(255,255,255,0.03); }
</style>
