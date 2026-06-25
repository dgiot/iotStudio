<template>
  <div class="telemetry">
    <h3 style="color:#c0d5e8;margin-bottom:12px">历史数据查询</h3>

    <el-form :inline="true" style="margin-bottom:12px">
      <el-form-item label="设备"><el-input v-model="query.deviceId" placeholder="设备ID" style="width:180px" /></el-form-item>
      <el-form-item label="点位"><el-input v-model="query.pointId" placeholder="点位ID" style="width:180px" /></el-form-item>
      <el-form-item label="开始"><el-date-picker v-model="query.start" type="datetime" placeholder="开始时间" style="width:180px" /></el-form-item>
      <el-form-item label="结束"><el-date-picker v-model="query.end" type="datetime" placeholder="结束时间" style="width:180px" /></el-form-item>
      <el-form-item><el-button type="primary" @click="search">查询</el-button></el-form-item>
    </el-form>

    <el-table :data="rows" max-height="calc(100vh - 280px)" v-loading="loading">
      <el-table-column prop="ts" label="时间戳" width="200" />
      <el-table-column prop="value" label="值" width="180" />
      <el-table-column prop="quality" label="质量" width="80">
        <template #default="{row}"><el-tag :type="row.quality===0?'success':'warning'" size="small">{{ row.quality }}</el-tag></template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getTelemetry } from '../api'

const query = ref({ deviceId: '', pointId: '', start: null, end: null })
const rows = ref([])
const loading = ref(false)

async function search() {
  if (!query.value.deviceId || !query.value.pointId) { ElMessage.warning('请输入设备和点位ID'); return }
  loading.value = true
  try {
    const params = {}
    if (query.value.start) params.start = new Date(query.value.start).toISOString()
    if (query.value.end) params.end = new Date(query.value.end).toISOString()
    const r = await getTelemetry(query.value.deviceId, query.value.pointId, params)
    rows.value = r.data.data || []
  } catch (e) { ElMessage.error('查询失败') }
  loading.value = false
}
</script>

<style scoped>
.telemetry { color: #c0d5e8; }
.el-table { background: transparent; --el-table-tr-bg-color: #0d1b30; --el-table-header-bg-color: #122540; }
</style>
