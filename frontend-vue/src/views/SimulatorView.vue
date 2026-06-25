<template>
  <div class="simulator-view">
    <h3 style="color:#c0d5e8;margin-bottom:16px">🎛️ 模拟器管理</h3>
    <el-row :gutter="16">
      <el-col :span="8" v-for="sim in simulators" :key="sim.id">
        <el-card shadow="hover" class="sim-card" :class="{ running: sim.status === 'running' }">
          <template #header>
            <div class="sim-header">
              <span class="sim-name">{{ sim.name }}</span>
              <el-tag :type="sim.status==='running'?'success':'info'" size="small" effect="dark">
                {{ sim.status === 'running' ? '运行中' : (sim.status === 'checking' ? '检测中' : '未启动') }}
              </el-tag>
            </div>
          </template>
          <div class="sim-body">
            <el-descriptions :column="1" size="small" border>
              <el-descriptions-item label="协议">{{ sim.protocol }}</el-descriptions-item>
              <el-descriptions-item label="端口">{{ sim.port }}</el-descriptions-item>
              <el-descriptions-item label="设备">{{ sim.device }}</el-descriptions-item>
              <el-descriptions-item label="数据项">{{ sim.itemCount }} 个</el-descriptions-item>
            </el-descriptions>
            <div class="sim-actions">
              <el-button size="small" @click="refreshSim(sim)">刷新数据</el-button>
              <el-text size="small" type="info" v-if="sim.status==='stopped'">终端启动: {{ sim.startCmd }}</el-text>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const simulators = ref([])
let timer = null

async function checkPortStatus() {
  try {
    const r = await axios.get('/api/simulators/status')
    simulators.value = (r.data.simulators || []).map(s => ({ ...s, data: [], canControl: false, startCmd: 'python simulators/run_all.py' }))
  } catch {}
}

async function refreshSim(sim) {
  ElMessage.info(`${sim.name}: ${sim.status === 'running' ? '运行正常' : '请终端启动 python simulators/run_all.py'}`)
}

onMounted(() => { checkPortStatus(); timer = setInterval(checkPortStatus, 5000) })
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.simulator-view { color: #c0d5e8; }
.sim-card { background: #0f1f3a; border: 1px solid #1a3a5c; transition: all 0.3s; }
.sim-card.running { border-color: #4fc3f7; box-shadow: 0 0 12px rgba(79,195,247,0.15); }
.sim-header { display: flex; justify-content: space-between; align-items: center; }
.sim-name { font-weight: bold; font-size: 14px; }
.sim-body { margin-top: -8px; }
.sim-actions { margin-top: 12px; display: flex; gap: 8px; align-items: center; }
.el-descriptions { --el-descriptions-item-bordered-label-background: #122540; }
</style>
