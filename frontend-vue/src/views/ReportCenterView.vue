<template>
  <div class="page"><h3 style="color:#c0d5e8;margin:0 0 16px">📊 报表中心</h3>
    <el-row :gutter="12">
      <el-col :span="6" v-for="r in reports" :key="r.name">
        <el-card shadow="hover" style="margin-bottom:12px">
          <div style="text-align:center;font-size:36px">{{ r.icon }}</div>
          <div style="text-align:center;font-weight:bold;margin:8px 0">{{ r.name }}</div>
          <div style="font-size:12px;color:#909399;text-align:center">{{ r.desc }}</div>
          <div style="text-align:center;margin-top:8px"><el-tag :type="r.status==='ready'?'success':'info'" size="small">{{ r.time }}</el-tag></div>
          <div style="text-align:center;margin-top:8px"><el-button size="small" type="primary" @click="generate(r)">生成</el-button><el-button size="small" @click="schedule(r)">定时</el-button></div>
        </el-card>
      </el-col>
    </el-row>
    <el-card><template #header>📈 健康日报</template>
      <el-row :gutter="12">
        <el-col :span="6" v-for="m in health" :key="m.label">
          <div style="text-align:center;padding:12px"><div style="font-size:28px;color:#67C23A;font-weight:bold">{{ m.value }}</div><div style="font-size:12px;color:#909399">{{ m.label }}</div></div>
        </el-col>
      </el-row>
    </el-card>
    <el-card style="margin-top:12px"><template #header>🏆 作业区对比排行</template>
      <el-table :data="ranking" size="small"><el-table-column prop="zone" label="作业区"/><el-table-column prop="online" label="在线率" sortable/><el-table-column prop="complete" label="完整率" sortable/><el-table-column prop="alarms" label="告警数" sortable/></el-table>
    </el-card>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'; import api from '../api'
const reports = ref([{name:'日报',icon:'📅',desc:'每日采集统计与异常汇总',time:'今 18:00',status:'ready'},{name:'月报',icon:'📊',desc:'月度趋势分析与同比环比',time:'下月1日',status:'scheduled'},{name:'年报',icon:'📈',desc:'年度运营报告与 KPI 总结',time:'年末',status:'scheduled'}])
const health = ref([{label:'设备在线率',value:'99.2%'},{label:'采集完整率',value:'98.7%'},{label:'采集成功率',value:'99.96%'},{label:'今日告警',value:'3'}])
const ranking = ref([{zone:'第四作业区',online:'99.5%',complete:'99.1%',alarms:1},{zone:'第三作业区',online:'98.8%',complete:'97.3%',alarms:2},{zone:'第二作业区',online:'97.2%',complete:'95.8%',alarms:0}])
const generate=r=>api.post('/reports/generate',{type:r.name}).then(()=>{}).catch(()=>{})
const schedule=r=>{}
onMounted(()=>{})
</script>
