<template>
  <div class="device-list">
    <div class="toolbar">
      <h3>设备管理</h3>
      <el-button type="primary" @click="showDialog(null)"><el-icon><Plus /></el-icon>添加设备</el-button>
    </div>

    <el-table :data="devices" style="width:100%" max-height="calc(100vh - 180px)">
      <el-table-column prop="device_id" label="设备ID" width="160" />
      <el-table-column prop="device_name" label="名称" width="180" />
      <el-table-column prop="device_type" label="类型" width="100">
        <template #default="{row}">
          <el-tag size="small">{{ typeMap[row.device_type] || row.device_type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="protocol" label="协议" width="110" />
      <el-table-column prop="status" label="状态" width="90">
        <template #default="{row}">
          <el-tag :type="row.status==='online'?'success':(row.status==='alarm'?'warning':'info')" size="small">
            {{ statusMap[row.status] || row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="station_id" label="场站" width="100" />
      <el-table-column prop="manufacturer" label="厂商" width="120" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{row}">
          <el-button link type="primary" @click="$router.push(`/devices/${row.device_id}`)">详情</el-button>
          <el-button link type="warning" @click="showDialog(row)">编辑</el-button>
          <el-popconfirm title="确认删除?" @confirm="handleDelete(row.device_id)">
            <template #reference><el-button link type="danger">删除</el-button></template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑弹窗 -->
    <el-dialog :title="editForm.device_id ? '编辑设备' : '添加设备'" v-model="dialogVisible" width="560px">
      <el-form :model="editForm" label-width="90px">
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="设备ID"><el-input v-model="editForm.device_id" :disabled="!!editingId" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备名称"><el-input v-model="editForm.device_name" /></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="设备类型">
              <el-select v-model="editForm.device_type" style="width:100%">
                <el-option v-for="t in deviceTypes" :key="t.value" :label="t.label" :value="t.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采集协议">
              <el-select v-model="editForm.protocol" style="width:100%">
                <el-option v-for="p in protocols" :key="p.value" :label="p.label" :value="p.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="场站"><el-input v-model="editForm.station_id" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="厂商"><el-input v-model="editForm.manufacturer" /></el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="通讯参数">
          <el-input v-model="commParamsStr" type="textarea" :rows="3" placeholder='{"host": "192.168.1.100", "port": 502}' />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getDevices, createDevice, deleteDevice } from '../api'
import { ElMessage } from 'element-plus'

const devices = ref([])
const dialogVisible = ref(false)
const editingId = ref('')
const editForm = reactive({
  device_id: '', device_name: '', device_type: 'inverter', station_id: 'station_01',
  protocol: 'modbus_tcp', manufacturer: '', comm_params: {}
})
const commParamsStr = ref('')

const typeMap = { inverter: '逆变器', pcs: 'PCS', charger: '充电桩', meter: '电表', sensor: '传感器' }
const statusMap = { online: '在线', offline: '离线', alarm: '告警', maintenance: '检修' }
const deviceTypes = [
  { label: '逆变器', value: 'inverter' }, { label: 'PCS', value: 'pcs' },
  { label: '充电桩', value: 'charger' }, { label: '电表', value: 'meter' }, { label: '传感器', value: 'sensor' }
]
const protocols = [
  { label: 'Modbus RTU', value: 'modbus_rtu' }, { label: 'Modbus TCP', value: 'modbus_tcp' },
  { label: 'IEC 104', value: 'iec104' }, { label: 'OPC UA', value: 'opcua' }
]

function showDialog(row) {
  editingId.value = row?.device_id || ''
  Object.assign(editForm, row ? { ...row } : { device_id: '', device_name: '', device_type: 'inverter', station_id: 'station_01', protocol: 'modbus_tcp', manufacturer: '', comm_params: {} })
  commParamsStr.value = JSON.stringify(editForm.comm_params || {}, null, 2)
  dialogVisible.value = true
}

async function handleSave() {
  try { editForm.comm_params = JSON.parse(commParamsStr.value || '{}') } catch { editForm.comm_params = {} }
  await createDevice({ ...editForm })
  ElMessage.success('保存成功')
  dialogVisible.value = false
  load()
}

async function handleDelete(id) { await deleteDevice(id); ElMessage.success('已删除'); load() }

async function load() {
  try { const r = await getDevices(); devices.value = r.data.devices || [] } catch {}
}

onMounted(load)
</script>

<style scoped>
.device-list { color: #c0d5e8; }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.toolbar h3 { color: #c0d5e8; }
.el-table { background: transparent; --el-table-tr-bg-color: #0d1b30; --el-table-header-bg-color: #122540; }
</style>
