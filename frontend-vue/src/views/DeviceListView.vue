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
        <div class="toolbar">
          <h3>设备列表</h3>
          <el-button type="primary" size="small" @click="showDialog(null)"><el-icon><Plus /></el-icon>添加</el-button>
        </div>

        <el-table :data="pagedData" highlight-current-row @row-click="selectRow" :row-class-name="rowClass" max-height="560">
          <el-table-column prop="device_id" label="设备ID" :min-width="col('lg')" align="center" />
          <el-table-column prop="device_name" label="名称" :min-width="col('xl')" show-overflow-tooltip />
          <el-table-column prop="device_type" label="类型" :min-width="col('md')" align="center">
            <template #default="{row}"><el-tag size="small">{{ typeMap[row.device_type] }}</el-tag></template>
          </el-table-column>
          <el-table-column prop="protocol" label="协议" :min-width="col('md')" align="center" />
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
              <el-button link type="primary" size="small" @click.stop="goDetail(row.device_id)">详情</el-button>
              <el-button link type="warning" size="small" @click.stop="showDialog(row)">编辑</el-button>
              <el-popconfirm title="确认?" @confirm="handleDelete(row.device_id)"><template #reference><el-button link type="danger" size="small">删除</el-button></template></el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pager-bar">
          <el-pagination v-model:current-page="currentPage" :page-size="pageSize" :page-sizes="[10,15,20,30]"
            layout="total, sizes, prev, pager, next" :total="filteredData.length" size="small" background />
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
            <el-button size="small" type="primary" @click="goDetail(selected.device_id)">查看详情</el-button>
          </div>
        </template>
        <div v-else class="panel-empty">
          <el-icon :size="36" color="#8899aa"><Monitor /></el-icon>
          <p>点击设备查看详情</p>
          <div class="stats-mini">
            <div class="stat-row"><span>在线</span><b style="color:#4fc3f7">{{ stats.online }}</b></div>
            <div class="stat-row"><span>离线</span><b style="color:#8899aa">{{ stats.offline }}</b></div>
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
import { ElMessage } from 'element-plus'

const router = useRouter()
const devices = ref([])
const selected = ref(null)
const activeTab = ref('all')
const currentPage = ref(1)
const pageSize = ref(15)
const dialogVisible = ref(false)
const editingId = ref('')
const editForm = reactive({ device_id:'', device_name:'', device_type:'inverter', station_id:'station_01', protocol:'modbus_tcp', manufacturer:'', comm_params:{} })
const commParamsStr = ref('')

const COLS = { xs:40, sm:65, md:85, lg:115, xl:170 }
function col(k) { return COLS[k] || 80 }

const typeMap = { inverter:'逆变器', pcs:'储能PCS', charger:'充电桩', meter:'电表', sensor:'传感器' }
const statusMap = { online:'在线', offline:'离线', alarm:'告警', maintenance:'检修' }
const deviceTypes = [{ label:'逆变器',value:'inverter'},{ label:'储能PCS',value:'pcs'},{ label:'充电桩',value:'charger'},{ label:'电表',value:'meter'},{ label:'传感器',value:'sensor'}]
const protocols = [{ label:'Modbus RTU',value:'modbus_rtu'},{ label:'Modbus TCP',value:'modbus_tcp'},{ label:'IEC 104',value:'iec104'},{ label:'OPC UA',value:'opcua'},{ label:'OPC DA',value:'opcda'}]

const typeGroups = computed(() => {
  const g = {}; devices.value.forEach(d => { const t = d.device_type; if (!g[t]) g[t] = { key:t, label:typeMap[t], count:0 }; g[t].count++ })
  return [{ key:'all', label:'全部', count:devices.value.length }, ...Object.values(g).sort((a,b) => b.count - a.count)]
})

const filteredData = computed(() => activeTab.value === 'all' ? devices.value : devices.value.filter(d => d.device_type === activeTab.value))
const pagedData = computed(() => filteredData.value.slice((currentPage.value-1)*pageSize.value, currentPage.value*pageSize.value))

const stats = computed(() => ({
  online: devices.value.filter(d => d.status==='online').length,
  offline: devices.value.filter(d => d.status==='offline').length,
  alarm: devices.value.filter(d => d.status==='alarm').length,
}))

function selectRow(row) { selected.value = row }
function rowClass({row}) { return row.device_id === selected.value?.device_id ? 'row-selected' : '' }
function goDetail(id) { router.push(`/devices/${id}`) }

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
async function load() { try { const r = await getDevices(); devices.value = r.data.devices || [] } catch {} }
onMounted(load)
</script>

<style scoped>
/* 变量 */
.device-page { --detail-width-wide: 420px; display: flex; flex-direction: column; height: 100%; color: #c0d5e8; }
/* Tab */
.type-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
.tab-chip { padding: 4px 14px; border-radius: 6px; font-size: 13px; cursor: pointer; background: #122540; border: 1px solid #1a3a5c; color: #8899aa; transition: all 0.2s; }
.tab-chip:hover { border-color: #4fc3f7; color: #c0d5e8; }
.tab-chip.active { background: #1a4a6e; border-color: #4fc3f7; color: #4fc3f7; font-weight: bold; }
.tab-chip small { opacity: 0.7; }
/* 内容行 */
.content-row { display: flex; gap: var(--content-gap, 8px); flex: 1; overflow: hidden; }
.table-panel { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-shrink: 0; }
.toolbar h3 { color: #c0d5e8; font-size: 15px; }
.el-table { background: transparent; --el-table-tr-bg-color: #0d1b30; --el-table-header-bg-color: #122540; }
:deep(.row-selected) { background: rgba(79,195,247,0.08) !important; }
/* 分页 */
.pager-bar { display: flex; justify-content: flex-end; padding: 8px 0; flex-shrink: 0; }
/* 右侧面板 */
.detail-panel { background: #0d1b30; border-left: 1px solid #1a3a5c; padding: 16px; overflow-y: auto; flex-shrink: 0; }
.panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.panel-title { font-size: 16px; font-weight: bold; color: #c0d5e8; }
.panel-actions { margin-top: 12px; }
.panel-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 8px; color: #8899aa; }
.stats-mini { margin-top: 16px; display: flex; gap: 20px; }
.stat-row { display: flex; flex-direction: column; align-items: center; font-size: 12px; color: #8899aa; gap: 2px; }
.stat-row b { font-size: 20px; }
:deep(.el-descriptions) { --el-descriptions-item-bordered-label-background: rgba(255,255,255,0.03); }
</style>
