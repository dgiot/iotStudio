<template>
  <div class="alarm-list">
    <div class="toolbar">
      <h3>告警管理</h3>
      <el-radio-group v-model="filter" size="small">
        <el-radio-button label="active">活跃</el-radio-button>
        <el-radio-button label="confirmed">已确认</el-radio-button>
        <el-radio-button label="cleared">已清除</el-radio-button>
        <el-radio-button label="">全部</el-radio-button>
      </el-radio-group>
    </div>

    <el-table :data="alarms" max-height="calc(100vh - 180px)">
      <el-table-column prop="alarm_id" label="告警ID" width="130" />
      <el-table-column prop="alarm_level" label="级别" width="70">
        <template #default="{row}">
          <el-tag :type="row.alarm_level==='P0'?'danger':(row.alarm_level==='P1'?'warning':'info')" size="small">{{ row.alarm_level }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="device_id" label="设备ID" width="150" />
      <el-table-column prop="alarm_msg" label="告警描述" min-width="280" />
      <el-table-column prop="alarm_type" label="类型" width="90" />
      <el-table-column prop="created_at" label="时间" width="170">
        <template #default="{row}">{{ formatTime(row.created_at) }}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="90">
        <template #default="{row}">
          <el-tag :type="row.status==='active'?'danger':(row.status==='confirmed'?'warning':'success')" size="small">
            {{ statusMap[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{row}">
          <el-button v-if="row.status==='active'" link type="warning" @click="handleConfirm(row.alarm_id)">确认</el-button>
          <el-button v-if="row.status!=='cleared'" link type="success" @click="handleClear(row.alarm_id)">清除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { getAlarms, confirmAlarm, clearAlarm } from '../api'
import { ElMessage } from 'element-plus'

const filter = ref('active')
const alarms = ref([])
const statusMap = { active: '活跃', confirmed: '已确认', cleared: '已清除' }

async function load() {
  try { const r = await getAlarms({ status: filter.value || undefined }); alarms.value = r.data.alarms || [] } catch {}
}
async function handleConfirm(id) { await confirmAlarm(id); ElMessage.success('已确认'); load() }
async function handleClear(id) { await clearAlarm(id); ElMessage.success('已清除'); load() }

function formatTime(ts) { return ts ? new Date(ts).toLocaleString() : '-' }

watch(filter, load)
onMounted(load)
</script>

<style scoped>
.alarm-list { color: #c0d5e8; }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.toolbar h3 { color: #c0d5e8; }
.el-table { background: transparent; --el-table-tr-bg-color: #0d1b30; --el-table-header-bg-color: #122540; }
</style>
