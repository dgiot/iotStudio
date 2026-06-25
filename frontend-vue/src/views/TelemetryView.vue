<template>
  <div class="telemetry">
    <h3 style="color:#c0d5e8;margin-bottom:12px">历史数据查询</h3>
    <el-form :inline="true" style="margin-bottom:12px">
      <el-form-item label="设备">
        <el-select v-model="query.deviceId" placeholder="选择设备" style="width:180px" @change="onDeviceChange" filterable>
          <el-option v-for="d in devices" :key="d.device_id" :label="`${d.device_name} (${d.device_id})`" :value="d.device_id" />
        </el-select>
      </el-form-item>
      <el-form-item label="点位">
        <el-select v-model="query.pointId" placeholder="选择点位" style="width:200px" filterable>
          <el-option v-for="p in points" :key="p.point_id" :label="`${p.point_name} (${p.point_id})`" :value="p.point_id" />
        </el-select>
      </el-form-item>
      <el-form-item label="条数"><el-input-number v-model="query.limit" :min="10" :max="2000" style="width:100px" /></el-form-item>
      <el-form-item><el-button type="primary" @click="search" :disabled="!query.deviceId||!query.pointId"><el-icon><Search /></el-icon>查询</el-button></el-form-item>
    </el-form>

    <el-row :gutter="16">
      <el-col :span="14">
        <el-card shadow="never" class="chart-card">
          <template #header><span>📈 趋势曲线</span></template>
          <v-chart v-if="hasData" :option="chartOption" autoresize style="height:360px" />
          <el-empty v-else-if="!searched" description="选择设备和点位后点击查询" :image-size="80" />
          <el-empty v-else description="该点位暂无历史数据" :image-size="80">
            <el-button type="primary" size="small" @click="search">重新查询</el-button>
          </el-empty>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="never" class="table-card">
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span>📋 数据明细</span>
              <el-tag v-if="searched" size="small" effect="dark" :type="rows.length>0?'success':'info'">{{ rows.length }} 条</el-tag>
            </div>
          </template>
          <el-table v-if="rows.length>0" :data="rows" size="small" max-height="360" v-loading="loading" stripe>
            <el-table-column prop="ts" label="时间戳" width="175">
              <template #default="{row}">{{ formatTs(row.ts) }}</template>
            </el-table-column>
            <el-table-column prop="value" label="值" width="140">
              <template #default="{row}">{{ typeof row.value==='number'?row.value.toFixed(4):row.value }}</template>
            </el-table-column>
            <el-table-column prop="quality" label="质量" width="70">
              <template #default="{row}"><el-tag :type="row.quality===0?'success':'warning'" size="small">{{ row.quality===0?'正常':'异常' }}</el-tag></template>
            </el-table-column>
          </el-table>
          <el-empty v-else-if="!searched" description="查询结果将显示在此处" :image-size="60" />
          <el-empty v-else description="无数据" :image-size="60" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getDevices, getPoints, getTelemetry } from '../api'
import { ElMessage } from 'element-plus'

const devices = ref([])
const points = ref([])
const query = ref({ deviceId:'', pointId:'', limit:200 })
const rows = ref([])
const loading = ref(false)
const searched = ref(false)

const hasData = computed(() => rows.value.length > 0)

const chartOption = computed(() => ({
  backgroundColor:'transparent',
  grid:{top:10,right:25,bottom:35,left:55},
  tooltip:{trigger:'axis',formatter:p=>{const d=p[0];return `${d.name}<br/>值: <b>${d.value?.toFixed(4)}</b>`}},
  xAxis:{type:'category',data:rows.value.slice(0,300).reverse().map(r=>formatTs(r.ts)),axisLabel:{color:'#8899aa',fontSize:10}},
  yAxis:{type:'value',splitLine:{lineStyle:{color:'#1a3a5c'}}},
  dataZoom:[{type:'inside'},{type:'slider',bottom:5,height:18,borderColor:'#1a3a5c',textStyle:{color:'#8899aa'}}],
  series:[{name:'值',type:'line',smooth:true,symbol:'none',lineStyle:{color:'#4fc3f7',width:2},data:rows.value.slice(0,300).reverse().map(r=>r.value),areaStyle:{color:'rgba(79,195,247,0.06)'}}]
}))

onMounted(async()=>{
  try{const r=await getDevices();devices.value=r.data.devices||[]}catch{}
})

async function onDeviceChange(deviceId){
  points.value=[]
  query.value.pointId=''
  if(!deviceId)return
  try{const r=await getPoints(deviceId);points.value=r.data.points||[]}catch{}
}

async function search(){
  if(!query.value.deviceId||!query.value.pointId){ElMessage.warning('请选择设备和点位');return}
  loading.value=true;searched.value=true
  try{
    const r=await getTelemetry(query.value.deviceId,query.value.pointId,{limit:query.value.limit})
    rows.value=r.data.data||[]
    if(rows.value.length===0) ElMessage.info('该点位暂无历史数据（请确认模拟器已启动并采集了一段时间）')
  }catch(e){ElMessage.error('查询失败');rows.value=[]}
  loading.value=false
}

function formatTs(ts){if(!ts)return'-';const d=new Date(ts);return d.toLocaleString()}
</script>

<style scoped>
.telemetry{color:#c0d5e8}
.chart-card,.table-card{background:#0f1f3a;border:1px solid #1a3a5c}
.chart-card :deep(.el-card__header),.table-card :deep(.el-card__header){color:#c0d5e8;border-bottom:1px solid #1a3a5c;padding:10px 16px;font-size:13px}
.el-table{background:transparent;--el-table-tr-bg-color:#0d1b30;--el-table-header-bg-color:#122540}
:deep(.el-empty__description p){color:#8899aa}
</style>
