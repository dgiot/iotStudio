<template>
  <div class="scene-page">
    <div style="display:flex;justify-content:space-between;align-items:center">
      <h3 style="color:#c0d5e8;margin:0">🎬 采集场景管理</h3>
      <div style="display:flex;gap:8px">
        <el-button size="small" type="primary" @click="loadScenes">🔄 刷新</el-button>
        <el-button size="small" type="success" @click="showAdd=true">+ 新建场景</el-button>
      </div>
    </div>

    <!-- 三阶段接入进度 -->
    <el-card style="margin-top:12px" v-if="phaseData.phases">
      <template #header>📋 三阶段渐进接入</template>
      <el-steps :active="phaseData.phases.filter(p=>p.status!=='pending').length" finish-status="success" align-center>
        <el-step v-for="p in phaseData.phases" :key="p.phase" :title="p.name" :description="p.description.slice(0,20)+'...'" :status="p.status==='completed'?'success':p.status==='in_progress'?'process':'wait'" />
      </el-steps>
      <div style="text-align:center;margin-top:8px;color:#909399;font-size:12px">{{ phaseData.completed }}/{{ phaseData.total_zones }} 作业区 · 阶段{{ phaseData.phases.filter(p=>p.status!=='pending').length }}/3</div>
    </el-card>

    <!-- 断网补传 + 动态调频 -->
    <el-row :gutter="12" style="margin-top:12px">
      <el-col :span="12">
        <el-card v-if="catchupData.devices">
          <template #header>📡 断网补传状态</template>
          <div style="font-size:24px;font-weight:bold;color:#E6A23C;text-align:center">{{ catchupData['补传进度_pct'] || catchupData.catchup_pct || 0 }}%</div>
          <div style="text-align:center;color:#909399;font-size:12px;margin:4px 0">待补传 {{ (catchupData.total_pending||0).toLocaleString() }} 条</div>
          <div v-for="d in (catchupData.devices||[]).slice(0,4)" :key="d.id" style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid rgba(255,255,255,.04);font-size:12px">
            <span>{{ d.id }}</span><span>{{ d['补传进度']||d.catchup_pct||0 }}%</span><span style="color:#909399;font-size:10px">{{ d.speed||'—' }}</span><span style="color:#909399">{{ d['预计完成']||d.eta||'—' }}</span>
          </div>
          <div v-if="catchupData.history" style="margin-top:6px;font-size:11px;color:#909399">历史: <span v-for="h in catchupData.history" :key="h.date">{{ h.date }} {{ h['补传完成']||h.completed }}条 </span></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card v-if="freqData['策略']||freqData.strategies">
          <template #header>⚡ 智能动态调频</template>
          <div style="font-size:13px;color:#67C23A;margin-bottom:8px">当前模式: {{ freqData.current_mode==='normal'?'正常':freqData.current_mode }}</div>
          <div v-for="s in (freqData['策略']||freqData.strategies||[]).slice(0,3)" :key="s['作业区']||s.zone" style="display:flex;justify-content:space-between;padding:3px 0;font-size:12px">
            <span>{{ s['作业区']||s.zone }}</span>
            <el-tag :type="s['分级']==='高频'?'danger':s['分级']==='中频'?'warning':'info'" size="small">{{ s['频率']||s.freq }}s</el-tag>
            <span style="color:#909399">{{ s['设备数']||s.devices }}台</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 场景卡片 -->
    <el-row :gutter="12" style="margin-top:12px">
      <el-col :span="8" v-for="s in scenes" :key="s.id" style="margin-bottom:12px">
        <el-card :class="['scene-card', s.status]" shadow="hover">
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span style="font-weight:bold">{{ s.name }}</span>
              <el-tag :type="s.status==='running'?'success':s.status==='paused'?'warning':'info'" size="small" effect="dark">
                {{ s.status==='running'?'运行中':s.status==='paused'?'已暂停':'待部署' }}
              </el-tag>
            </div>
          </template>
          <el-descriptions :column="2" size="small" border>
            <el-descriptions-item label="设备数">{{ s.devices }} 台</el-descriptions-item>
            <el-descriptions-item label="采集间隔">{{ s.interval }}s</el-descriptions-item>
            <el-descriptions-item label="最后部署">{{ s.lastDeploy || '—' }}</el-descriptions-item>
            <el-descriptions-item label="场景ID">{{ s.id }}</el-descriptions-item>
          </el-descriptions>
          <div style="margin-top:8px">
            <el-tag v-for="p in s.protocols" :key="p" size="small" style="margin:2px">{{ p }}</el-tag>
          </div>
          <div class="scene-actions" style="margin-top:8px">
            <el-button v-if="s.status==='running'" size="small" type="warning" @click="pauseScene(s)">⏸ 暂停</el-button>
            <el-button v-if="s.status!=='running'" size="small" type="success" @click="startScene(s)">▶ 启动</el-button>
            <el-button size="small" @click="deployScene(s)">📤 下发</el-button>
            <el-button size="small" type="danger" @click="deleteScene(s)">🗑</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 新建场景弹窗 -->
    <el-dialog v-model="showAdd" title="新建采集场景" width="500px">
      <el-form :model="form" label-width="100px" size="small">
        <el-form-item label="场景名称"><el-input v-model="form.name"/></el-form-item>
        <el-row :gutter="10"><el-col :span="12"><el-form-item label="采集间隔(s)"><el-input-number v-model="form.interval" :min="1" :max="3600"/></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="目标设备数"><el-input-number v-model="form.devices" :min="1"/></el-form-item></el-col></el-row>
        <el-form-item label="协议"><el-select v-model="form.protocols" multiple><el-option v-for="p in allCtypes" :key="p" :label="p" :value="p"/></el-select></el-form-item>
      </el-form>
      <template #footer><el-button @click="showAdd=false">取消</el-button><el-button type="primary" @click="createScene">创建</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'
import { ElMessage } from 'element-plus'

const scenes = ref([]); const showAdd = ref(false)
const allCtypes = ['modbus_tcp','modbus_rtu','opcda','opcua','a11','iec104','mqtt','http_rest']
const form = ref({name:'',interval:5,devices:100,protocols:['modbus_tcp']})

async function loadScenes() {
  try { const r = await api.get('/scene/list'); scenes.value = r.scenes || [] } catch {}
}
async function createScene() {
  scenes.value.push({id:'s'+Date.now(),name:form.value.name,devices:form.value.devices,protocols:form.value.protocols,interval:form.value.interval,status:'pending',lastDeploy:''})
  showAdd.value = false; ElMessage.success('场景已创建')
}
async function startScene(s) { s.status='running'; ElMessage.success(`${s.name} 已启动`) }
async function pauseScene(s) { s.status='paused'; ElMessage.success(`${s.name} 已暂停`) }
async function deployScene(s) { s.lastDeploy = new Date().toISOString().slice(0,16).replace('T',' '); s.status='running'; ElMessage.success(`${s.name} 已下发到边缘`) }
async function deleteScene(s) { scenes.value = scenes.value.filter(x=>x.id!==s.id); ElMessage.success('已删除') }
const phaseData = ref({}); const catchupData = ref({}); const freqData = ref({})
async function loadAdaptation() {
  try { phaseData.value = await api.get('/scene/progress') } catch {}
  try { const r = await api.get('/scene/catchup'); catchupData.value = r } catch {}
  try { const r = await api.get('/scene/frequency/config'); freqData.value = {strategies:r.strategies,current_mode:r.strategies?.[0]?.status==='高频'?'normal':'normal'} } catch {}
}
onMounted(()=>{loadScenes();loadAdaptation()})
</script>

<style scoped>
.scene-card.running { border-color: #66bb6a; }
.scene-card.paused { border-color: #E6A23C; opacity:0.8; }
.scene-actions { display:flex; gap:4px; }
</style>
