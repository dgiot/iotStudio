<template>
  <div class="phm-page">
    <h3>🔮 PHM 预测性维护</h3>
    <p style="color:#8aa0b4;font-size:13px;margin:4px 0 16px">CNN 故障诊断 (7种模式) + LSTM RUL 预测 | 健康评分 0-100</p>

    <el-row :gutter="12">
      <el-col :span="6" v-for="e in equipments" :key="e.id">
        <el-card class="equip-card" shadow="hover" @click="selectEquip(e)">
          <div class="eq-header">
            <span class="eq-icon">{{ e.icon }}</span>
            <div>
              <div class="eq-name">{{ e.name }}</div>
              <div class="eq-model">{{ e.model }}</div>
            </div>
          </div>
          <div class="eq-score">
            <el-progress :percentage="e.healthScore" :color="scoreColor(e.healthScore)" :stroke-width="8" :show-text="false" />
            <div class="score-text" :style="{color:scoreColor(e.healthScore)}">{{ e.healthScore }}/100 — {{ e.level }}</div>
          </div>
          <div class="eq-rul" v-if="e.rulDays">RUL: <b>{{ e.rulDays }}</b> 天</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 详情 -->
    <el-card class="detail-card" style="margin-top:12px" v-if="selected">
      <template #header><span>📋 {{ selected.name }} — 诊断详情</span></template>
      <el-row :gutter="12">
        <el-col :span="12">
          <div ref="healthChart" style="height:280px"></div>
        </el-col>
        <el-col :span="12">
          <el-table :data="selected.faults" size="small">
            <el-table-column prop="mode" label="故障模式" width="140" />
            <el-table-column prop="probability" label="概率" width="100" align="center">
              <template #default="{row}"><el-progress :percentage="row.probability*100" :color="row.probability>0.5?'#ef5350':'#ffa726'" :stroke-width="6" :show-text="true" :text-inside="true" /></template>
            </el-table-column>
            <el-table-column prop="severity" label="严重度" width="80" align="center">
              <template #default="{row}"><el-tag :type="row.severity==='高'?'danger':row.severity==='中'?'warning':'info'" size="small" effect="dark">{{ row.severity }}</el-tag></template>
            </el-table-column>
            <el-table-column prop="action" label="建议措施" min-width="200" show-overflow-tooltip />
          </el-table>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import api from '../api'

const equipments = ref([])

const selected = ref(null)
const healthChart = ref(null)
let timer = null

async function loadEquipments() {
  try { const r = await api.get('/phm/equipments'); equipments.value = r.equipments || [] } catch {}
}

function scoreColor(s) { return s>=80?'#66bb6a':s>=60?'#ffa726':s>=40?'#ef5350':'#f44336' }
function selectEquip(e) { selected.value = e; nextTick(()=>initChart()) }

function initChart() {
  if (!healthChart.value || !selected.value) return
  const c = echarts.init(healthChart.value)
  const scores = [95,93,90,88,85,82,80,78,75,72]
  c.setOption({
    tooltip:{trigger:'axis'},xAxis:{type:'category',data:scores.map((_,i)=>(30-i*3)+'天前'),axisLabel:{color:'#8aa0b4',fontSize:10}},
    yAxis:{type:'value',min:0,max:100,splitLine:{lineStyle:{color:'#234060'}}},
    series:[{name:'健康评分',type:'line',smooth:true,data:scores,lineStyle:{color:'#66d9ff',width:2},areaStyle:{color:'rgba(102,217,255,0.1)'},markLine:{silent:true,data:[{yAxis:80,lineStyle:{color:'#66bb6a',type:'dashed'}},{yAxis:60,lineStyle:{color:'#ffa726',type:'dashed'}},{yAxis:40,lineStyle:{color:'#ef5350',type:'dashed'}}]}}]
  })
}

onMounted(async ()=>{ loadEquipments(); timer = setInterval(loadEquipments, 10000) })
onUnmounted(()=>{clearInterval(timer)})
</script>

<style scoped>
.phm-page h3 { color: #e8f0f8; margin: 0; }
.equip-card { cursor: pointer; transition: all 0.2s; }
.equip-card:hover { border-color: #66d9ff; }
.eq-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.eq-icon { font-size: 32px; }
.eq-name { font-size: 15px; font-weight: bold; color: #e8f0f8; }
.eq-model { font-size: 11px; color: #8aa0b4; }
.eq-score { margin: 8px 0; }
.score-text { font-size: 13px; font-weight: bold; margin-top: 4px; }
.eq-rul { font-size: 12px; color: #8aa0b4; }
.eq-rul b { color: #66d9ff; }
.detail-card { margin-bottom: 0; }
</style>
