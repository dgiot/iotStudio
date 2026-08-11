<template>
  <div class="gis-page">
    <h3 style="color:#e0e0e0;margin:0 0 8px 0">GIS 油田地图下钻</h3>
    <el-breadcrumb separator=">" style="margin-bottom:8px">
      <el-breadcrumb-item v-for="(l,i) in breadcrumb" :key="i">
        <span @click="drillTo(i)" style="cursor:pointer;color:#66d9ff;font-size:12px">{{ l }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div ref="chart" style="width:100%;height:calc(100vh - 200px)"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const chart = ref(null)
const breadcrumb = ref(['大庆油田'])
let cInstance = null

const data = {
  '大庆油田': [
    { name:'一厂', wells:935, value:[125.10,46.60] },{ name:'二厂', wells:1311, value:[124.90,46.55] },
    { name:'三厂', wells:1302, value:[125.00,46.65] },{ name:'四厂', wells:1245, value:[124.85,46.50] },
    { name:'五厂', wells:1268, value:[125.15,46.70] },{ name:'六厂', wells:1205, value:[124.80,46.45] },
    { name:'七厂', wells:294, value:[125.20,46.75] },{ name:'八厂', wells:280, value:[124.75,46.40] },
    { name:'九厂', wells:220, value:[124.70,46.35] },{ name:'十厂', wells:1090, value:[125.25,46.80] },
  ],
  '二厂': [
    { name:'第一作业区', wells:180, value:[124.88,46.54] },{ name:'第二作业区', wells:165, value:[124.91,46.56] },
    { name:'第三作业区', wells:195, value:[124.87,46.53] },{ name:'第四作业区', wells:191, value:[124.89,46.55] },
    { name:'第五作业区', wells:175, value:[124.92,46.57] },
  ],
  '第四作业区': [
    { name:'南4联合站 (CY1C8K)', wells:54, value:[124.889,46.551], type:'联合站' },
    { name:'北9注水站', wells:12, value:[124.893,46.553], type:'注水站' },
    { name:'北15联合站', wells:38, value:[124.886,46.549], type:'联合站' },
    { name:'萨北21站', wells:8, value:[124.895,46.555], type:'注水站' },
    { name:'计量间A', wells:23, value:[124.891,46.552], type:'计量间' },
  ],
}

function render(level) {
  if (!chart.value) return
  if (cInstance) cInstance.dispose()
  cInstance = echarts.init(chart.value)
  const d = data[breadcrumb.value[level]] || []
  const title = breadcrumb.value[level]
  const isStation = level >= 2
  cInstance.setOption({
    title: { text: title, subtext: `${d.length} 个${isStation?'间站':'节点'} · ${d.reduce((s,x)=>s+(x.wells||0),0)} 口井`, left:'center', textStyle:{color:'#c0d5e8',fontSize:14}, subtextStyle:{color:'#8aa0b4',fontSize:11} },
    tooltip: { formatter: p => `<b>${p.name}</b><br/>油井: ${p.value?.[2]||'—'} 口` },
    xAxis: { show:false, min:124.6, max:125.4 },
    yAxis: { show:false, min:46.3, max:46.9 },
    series: [{
      type: 'scatter',
      symbolSize: p => Math.max(18, Math.min(60, (p[2]||10)/15)),
      data: d.map(x => ({ name:x.name, value:[...x.value, x.wells||0, x.type||''], itemStyle:{color: x.type==='注水站'?'#3b82f6':x.type==='联合站'?'#f59e0b':'#22c55e'} })),
      label: { show:true, formatter:p=>p.name.length>8?p.name.slice(0,8)+'…':p.name, fontSize:10, color:'#c0d5e8', position:'bottom' },
    }]
  })
  if (level < 2) {
    cInstance.on('click', (p) => {
      if (data[p.name]) { breadcrumb.value = breadcrumb.value.slice(0, level+1).concat(p.name); render(level+1) }
    })
  }
}

function drillTo(i) { breadcrumb.value = breadcrumb.value.slice(0, i+1); render(i) }

onMounted(async () => { await nextTick(); render(0) })
</script>

<style scoped>
.gis-page { padding:12px 16px; background:#0d1a2a; min-height:100vh }
</style>
