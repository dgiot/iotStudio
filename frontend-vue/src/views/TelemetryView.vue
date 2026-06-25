<template>
  <div class="telemetry">
    <h3 style="color:#c0d5e8;margin-bottom:12px">历史数据查询</h3>
    <el-form :inline="true" style="margin-bottom:12px">
      <el-form-item label="设备"><el-input v-model="query.deviceId" placeholder="设备ID" style="width:160px" /></el-form-item>
      <el-form-item label="点位"><el-input v-model="query.pointId" placeholder="点位ID" style="width:160px" /></el-form-item>
      <el-form-item label="条数"><el-input-number v-model="query.limit" :min="10" :max="2000" style="width:100px" /></el-form-item>
      <el-form-item><el-button type="primary" @click="search"><el-icon><Search /></el-icon>查询</el-button></el-form-item>
    </el-form>
    <el-row :gutter="16">
      <el-col :span="14">
        <el-card shadow="never" class="chart-card">
          <template #header><span>📈 趋势曲线</span></template>
          <v-chart :option="chartOption" autoresize style="height:340px" v-if="hasData" />
          <el-empty v-else description="请输入设备ID和点位ID查询" />
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="never" class="table-card">
          <template #header><span>📋 数据明细 ({{ rows.length }}条)</span></template>
          <el-table :data="rows" size="small" max-height="340" v-loading="loading" stripe>
            <el-table-column prop="ts" label="时间戳" width="170"><template #default="{row}">{{ formatTs(row.ts) }}</template></el-table-column>
            <el-table-column prop="value" label="值" width="120"><template #default="{row}">{{ typeof row.value==='number'?row.value.toFixed(4):row.value }}</template></el-table-column>
            <el-table-column prop="quality" label="质量" width="70"><template #default="{row}"><el-tag :type="row.quality===0?'success':'warning'" size="small">{{ row.quality }}</el-tag></template></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getTelemetry } from '../api'
import { ElMessage } from 'element-plus'

const query = ref({ deviceId:'', pointId:'', limit:100 })
const rows = ref([])
const loading = ref(false)

const hasData = computed(() => rows.value.length > 0)

const chartOption = computed(() => ({
  backgroundColor:'transparent',
  grid:{top:10,right:20,bottom:30,left:50},
  tooltip:{trigger:'axis'},
  xAxis:{type:'category',data:rows.value.map(r=>formatTs(r.ts)).slice(0,200).reverse(),axisLabel:{color:'#8899aa',fontSize:10}},
  yAxis:{type:'value',splitLine:{lineStyle:{color:'#1a3a5c'}}},
  dataZoom:[{type:'inside'},{type:'slider',bottom:5,height:16,textStyle:{color:'#8899aa'}}],
  series:[{name:'值',type:'line',smooth:true,symbol:'none',lineStyle:{color:'#4fc3f7',width:2},data:rows.value.map(r=>r.value).slice(0,200).reverse(),areaStyle:{color:'rgba(79,195,247,0.08)'}}]
}))

async function search(){
  if(!query.value.deviceId||!query.value.pointId){ElMessage.warning('请输入设备ID和点位ID');return}
  loading.value=true
  try{
    const r=await getTelemetry(query.value.deviceId,query.value.pointId,{limit:query.value.limit})
    rows.value=r.data.data||[]
    if(rows.value.length===0) ElMessage.info('无数据')
  }catch(e){ElMessage.error('查询失败')}
  loading.value=false
}

function formatTs(ts){return ts?new Date(ts).toLocaleString():'-'}
</script>

<style scoped>
.telemetry{color:#c0d5e8}
.chart-card,.table-card{background:#0f1f3a;border:1px solid #1a3a5c}
.chart-card :deep(.el-card__header),.table-card :deep(.el-card__header){color:#c0d5e8;border-bottom:1px solid #1a3a5c;padding:10px 16px;font-size:13px}
.el-table{background:transparent;--el-table-tr-bg-color:#0d1b30;--el-table-header-bg-color:#122540}
</style>
