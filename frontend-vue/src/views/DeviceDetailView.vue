<template>
  <div class="device-detail">
    <el-page-header @back="$router.back()" :content="device?.device_name || '设备详情'" style="color:#c0d5e8" />

    <!-- 设备信息 -->
    <el-descriptions :column="3" border style="margin:16px 0" v-if="device">
      <el-descriptions-item label="设备ID">{{ device.device_id }}</el-descriptions-item>
      <el-descriptions-item label="类型">{{ typeMap[device.device_type] }}</el-descriptions-item>
      <el-descriptions-item label="状态"><el-tag :type="device.status==='online'?'success':'info'" size="small">{{ device.status }}</el-tag></el-descriptions-item>
      <el-descriptions-item label="协议">{{ device.protocol }}</el-descriptions-item>
      <el-descriptions-item label="场站">{{ device.station_id }}</el-descriptions-item>
      <el-descriptions-item label="厂商">{{ device.manufacturer || '-' }}</el-descriptions-item>
    </el-descriptions>

    <!-- 点位配置 -->
    <el-card shadow="never" header="点位配置" class="section-card">
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span>点位配置 ({{ points.length }})</span>
          <el-button type="primary" size="small" @click="showPointDialog(null)"><el-icon><Plus /></el-icon>添加点位</el-button>
        </div>
      </template>
      <el-table :data="points" size="small" max-height="300">
        <el-table-column prop="point_id" label="点位ID" width="160" />
        <el-table-column prop="point_name" label="名称" width="140" />
        <el-table-column prop="protocol_addr" label="协议地址" width="140" />
        <el-table-column prop="data_type" label="数据类型" width="90" />
        <el-table-column prop="unit" label="单位" width="70" />
        <el-table-column prop="scale" label="系数" width="70" />
        <el-table-column prop="collect_interval" label="周期(s)" width="80" />
        <el-table-column label="操作" width="100">
          <template #default="{row}">
            <el-button link type="primary" size="small" @click="showPointDialog(row)">编辑</el-button>
            <el-button link type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 最新数据 -->
    <el-card shadow="never" header="最新遥测数据" class="section-card" style="margin-top:12px">
      <el-table :data="latest" size="small" max-height="300" v-loading="loading">
        <el-table-column prop="point_id" label="点位ID" width="160" />
        <el-table-column prop="value" label="最新值" width="140">
          <template #default="{row}">{{ row.value?.toFixed?.(4) || row.value }}</template>
        </el-table-column>
        <el-table-column prop="ts" label="时间戳" />
      </el-table>
    </el-card>

    <!-- 点位弹窗 -->
    <el-dialog :title="pointForm.point_id ? '编辑点位' : '添加点位'" v-model="pointDialog" width="500px">
      <el-form :model="pointForm" label-width="100px">
        <el-row :gutter="12">
          <el-col :span="12"><el-form-item label="点位ID"><el-input v-model="pointForm.point_id" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="点位名称"><el-input v-model="pointForm.point_name" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12"><el-form-item label="协议地址"><el-input v-model="pointForm.protocol_addr" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="数据类型">
            <el-select v-model="pointForm.data_type" style="width:100%">
              <el-option v-for="t in dtypes" :key="t" :label="t" :value="t" />
            </el-select>
          </el-form-item></el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12"><el-form-item label="缩放系数"><el-input-number v-model="pointForm.scale" :min="0" :step="0.1" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="采集周期(s)"><el-input-number v-model="pointForm.collect_interval" :min="1" :max="3600" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12"><el-form-item label="单位"><el-input v-model="pointForm.unit" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="寄存器类型"><el-input v-model="pointForm.register_type" placeholder="3" /></el-form-item></el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="pointDialog = false">取消</el-button>
        <el-button type="primary" @click="savePoint">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getDevice, getPoints, createPoint, getLatest } from '../api'
import { ElMessage } from 'element-plus'

const route = useRoute()
const device = ref(null)
const points = ref([])
const latest = ref([])
const loading = ref(false)
const pointDialog = ref(false)
const pointForm = reactive({ point_id: '', point_name: '', protocol_addr: '', data_type: 'float32', register_type: '3', scale: 1.0, offset: 0.0, unit: '', collect_interval: 5 })
const dtypes = ['int16', 'uint16', 'int32', 'uint32', 'float32', 'float64', 'bool', 'string']
const typeMap = { inverter: '逆变器', pcs: 'PCS', charger: '充电桩', meter: '电表', sensor: '传感器' }

function showPointDialog(row) {
  Object.assign(pointForm, row || { point_id: '', point_name: '', protocol_addr: '', data_type: 'float32', register_type: '3', scale: 1.0, offset: 0.0, unit: '', collect_interval: 5 })
  pointDialog.value = true
}

async function savePoint() {
  await createPoint(route.params.id, { ...pointForm, device_id: route.params.id })
  ElMessage.success('保存成功')
  pointDialog.value = false
  load()
}

async function load() {
  try {
    const [dev, pts, lt] = await Promise.all([
      getDevice(route.params.id),
      getPoints(route.params.id),
      getLatest(route.params.id)
    ])
    device.value = dev.data
    points.value = pts.data?.points || []
    latest.value = lt.data?.data || []
  } catch {}
}

onMounted(load)
</script>

<style scoped>
.device-detail { color: #c0d5e8; }
.section-card { background: #0f1f3a; border: 1px solid #1a3a5c; }
.section-card :deep(.el-card__header) { color: #c0d5e8; border-bottom: 1px solid #1a3a5c; }
.el-table { background: transparent; --el-table-tr-bg-color: #0d1b30; --el-table-header-bg-color: #122540; }
:deep(.el-descriptions) { --el-descriptions-item-bordered-label-background: #122540; }
</style>
