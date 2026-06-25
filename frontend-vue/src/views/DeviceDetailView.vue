<template>
  <div class="device-detail">
    <el-page-header @back="$router.back()" :content="device?.device_name || '设备详情'" style="color:#c0d5e8" />
    <el-descriptions :column="3" border style="margin:16px 0" v-if="device">
      <el-descriptions-item label="设备ID">{{ device.device_id }}</el-descriptions-item>
      <el-descriptions-item label="类型">{{ typeMap[device.device_type] }}</el-descriptions-item>
      <el-descriptions-item label="状态"><el-tag :type="device.status==='online'?'success':'info'" size="small">{{ device.status }}</el-tag></el-descriptions-item>
      <el-descriptions-item label="协议">{{ device.protocol }}</el-descriptions-item>
      <el-descriptions-item label="场站">{{ device.station_id }}</el-descriptions-item>
      <el-descriptions-item label="厂商">{{ device.manufacturer || '-' }}</el-descriptions-item>
    </el-descriptions>
    <el-card shadow="never" class="section-card" style="margin-bottom:12px">
      <template #header><span>📈 实时数据趋势 (最近30点)</span></template>
      <v-chart :option="chartOption" autoresize style="height:280px" v-if="hasData" />
      <el-empty v-else description="暂无数据" />
    </el-card>
    <el-row :gutter="12">
      <el-col :span="14">
        <el-card shadow="never" class="section-card">
          <template #header><div style="display:flex;justify-content:space-between;align-items:center"><span>点位配置 ({{ points.length }})</span><el-button type="primary" size="small" @click="showPointDialog(null)"><el-icon><Plus /></el-icon>添加</el-button></div></template>
          <el-table :data="points" size="small" max-height="300">
            <el-table-column prop="point_name" label="名称" width="120" />
            <el-table-column prop="protocol_addr" label="地址" width="120" />
            <el-table-column prop="data_type" label="类型" width="80" />
            <el-table-column prop="unit" label="单位" width="60" />
            <el-table-column prop="collect_interval" label="周期(s)" width="70" />
            <el-table-column label="操作" width="80"><template #default="{row}"><el-button link type="primary" size="small" @click="showPointDialog(row)">编辑</el-button></template></el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="never" class="section-card">
          <template #header><span>最新遥测值</span></template>
          <el-table :data="latest" size="small" max-height="300" v-loading="loading">
            <el-table-column prop="point_id" label="点位ID" width="150" />
            <el-table-column prop="value" label="值" width="120"><template #default="{row}">{{ typeof row.value==='number' ? row.value.toFixed(4) : row.value }}</template></el-table-column>
            <el-table-column prop="ts" label="时间" min-width="100" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :title="pointForm.point_id ? '编辑点位' : '添加点位'" v-model="pointDialog" width="500px">
      <el-form :model="pointForm" label-width="100px">
        <el-row :gutter="12"><el-col :span="12"><el-form-item label="点位ID"><el-input v-model="pointForm.point_id" /></el-form-item></el-col><el-col :span="12"><el-form-item label="名称"><el-input v-model="pointForm.point_name" /></el-form-item></el-col></el-row>
        <el-row :gutter="12"><el-col :span="12"><el-form-item label="协议地址"><el-input v-model="pointForm.protocol_addr" /></el-form-item></el-col><el-col :span="12"><el-form-item label="数据类型"><el-select v-model="pointForm.data_type" style="width:100%"><el-option v-for="t in dtypes" :key="t" :label="t" :value="t" /></el-select></el-form-item></el-col></el-row>
        <el-row :gutter="12"><el-col :span="12"><el-form-item label="系数"><el-input-number v-model="pointForm.scale" :min="0" :step="0.1" /></el-form-item></el-col><el-col :span="12"><el-form-item label="周期(s)"><el-input-number v-model="pointForm.collect_interval" :min="1" :max="3600" /></el-form-item></el-col></el-row>
        <el-row :gutter="12"><el-col :span="12"><el-form-item label="单位"><el-input v-model="pointForm.unit" /></el-form-item></el-col><el-col :span="12"><el-form-item label="寄存器"><el-input v-model="pointForm.register_type" placeholder="3" /></el-form-item></el-col></el-row>
      </el-form>
      <template #footer><el-button @click="pointDialog = false">取消</el-button><el-button type="primary" @click="savePoint">保存</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getDevice, getPoints, createPoint, getLatest, getTelemetry } from '../api'
import { ElMessage } from 'element-plus'

const route = useRoute()
const device = ref(null), points = ref([]), latest = ref([]), loading = ref(false), pointDialog = ref(false)
const pointForm = reactive({ point_id: '', device_id: route.params.id, point_name: '', protocol_addr: '', data_type: 'float32', register_type: '3', scale: 1.0, offset: 0.0, unit: '', collect_interval: 5 })
const dtypes = ['int16','uint16','int32','uint32','float32','float64','bool','string']
const typeMap = { inverter:'逆变器',pcs:'储能PCS',charger:'充电桩',meter:'电表',sensor:'传感器' }

const chartTimes = ref([]), chartSeries = ref([])
const hasData = computed(() => chartSeries.value.length > 0)
const chartOption = computed(() => ({
  backgroundColor: 'transparent',
  grid: { top:10,right:20,bottom:30,left:50 },
  tooltip: { trigger:'axis' },
  legend: { data: chartSeries.value.map(s=>s.name), textStyle:{color:'#8899aa'}, top:-5 },
  xAxis: { type:'category', data:chartTimes.value, axisLabel:{color:'#8899aa',fontSize:10} },
  yAxis: { type:'value', splitLine:{lineStyle:{color:'#1a3a5c'}} },
  dataZoom: [{ type:'inside' }],
  series: chartSeries.value.map(s=>({ name:s.name, type:'line', smooth:true, symbol:'none', data:s.data, lineStyle:{width:2} }))
}))

function showPointDialog(row) {
  if(row) Object.assign(pointForm,row)
  else Object.assign(pointForm,{point_id:'',device_id:route.params.id,point_name:'',protocol_addr:'',data_type:'float32',register_type:'3',scale:1.0,offset:0.0,unit:'',collect_interval:5})
  pointDialog.value = true
}
async function savePoint(){await createPoint(route.params.id,{...pointForm});ElMessage.success('已保存');pointDialog.value=false;load()}
async function load(){
  try{
    const [dev,pts,lt]=await Promise.all([getDevice(route.params.id),getPoints(route.params.id),getLatest(route.params.id)])
    device.value=dev.data; points.value=pts.data?.points||[]; latest.value=lt.data?.data||[]
    if(points.value.length>0){
      const p=points.value[0]
      const r=await getTelemetry(route.params.id,p.point_id,{limit:30})
      const d=r.data.data||[]
      chartTimes.value=d.map(x=>x.ts?new Date(x.ts).toLocaleTimeString():'').reverse()
      chartSeries.value=[{name:p.point_name,data:d.map(x=>x.value).reverse()}]
    }
  }catch(e){}
}
onMounted(load)
</script>

<style scoped>
.device-detail{color:#c0d5e8}
.section-card{background:#0f1f3a;border:1px solid #1a3a5c}
.section-card :deep(.el-card__header){color:#c0d5e8;border-bottom:1px solid #1a3a5c;padding:10px 16px;font-size:13px}
.el-table{background:transparent;--el-table-tr-bg-color:#0d1b30;--el-table-header-bg-color:#122540}
</style>
