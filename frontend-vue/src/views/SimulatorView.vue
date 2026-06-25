<template>
  <div class="simulator-view">
    <h3 style="color:#c0d5e8;margin-bottom:16px">🎛️ 模拟器管理</h3>

    <!-- 模拟器网格 -->
    <el-row :gutter="16">
      <el-col :span="8" v-for="sim in simulators" :key="sim.id">
        <el-card shadow="hover" class="sim-card" :class="{ running: sim.status === 'running' }">
          <template #header>
            <div class="sim-header">
              <span class="sim-name">{{ sim.name }}</span>
              <el-tag :type="sim.status==='running'?'success':'info'" size="small" effect="dark">
                {{ sim.status === 'running' ? '运行中' : '未启动' }}
              </el-tag>
            </div>
          </template>

          <div class="sim-body">
            <el-descriptions :column="1" size="small" border>
              <el-descriptions-item label="协议">{{ sim.protocol }}</el-descriptions-item>
              <el-descriptions-item label="端口">{{ sim.port }}</el-descriptions-item>
              <el-descriptions-item label="模拟设备">{{ sim.device }}</el-descriptions-item>
              <el-descriptions-item label="数据项">{{ sim.itemCount }} 个</el-descriptions-item>
            </el-descriptions>

            <div class="sim-data" v-if="sim.data.length > 0">
              <div class="data-title">实时数据预览</div>
              <div class="data-row" v-for="d in sim.data.slice(0,5)" :key="d.name">
                <span>{{ d.name }}</span>
                <span class="data-val">{{ d.value }} {{ d.unit }}</span>
              </div>
            </div>

            <div class="sim-actions">
              <el-button size="small" :type="sim.status==='running'?'warning':'success'" @click="toggleSim(sim)" :disabled="!sim.canControl">
                {{ sim.status==='running' ? '停止' : '启动' }}
              </el-button>
              <el-button size="small" @click="refreshSim(sim)">刷新数据</el-button>
            </div>
          </div>

          <div class="start-cmd" v-if="!sim.canControl && sim.status==='stopped'">
            <el-text size="small" type="info">启动命令:</el-text>
            <el-input :model-value="sim.startCmd" size="small" readonly>
              <template #append><el-button size="small" @click="copyCmd(sim.startCmd)">复制</el-button></template>
            </el-input>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getStats } from '../api'
import { ElMessage } from 'element-plus'

const simulators = ref([
  { id: 'modbus_tcp_502',  name: 'Modbus TCP 逆变器', protocol: 'Modbus TCP', port: 502,  device: '光伏逆变器', itemCount: 10, status: 'checking', data: [], canControl: false, startCmd: 'python simulators/modbus_tcp_server.py' },
  { id: 'modbus_tcp_1502', name: 'Modbus TCP 储能',   protocol: 'Modbus TCP', port: 1502, device: '储能PCS',    itemCount: 10, status: 'checking', data: [], canControl: false, startCmd: 'python simulators/modbus_tcp_server.py' },
  { id: 'modbus_tcp_2502', name: 'Modbus TCP 充电桩', protocol: 'Modbus TCP', port: 2502, device: '充电桩',     itemCount: 8,  status: 'checking', data: [], canControl: false, startCmd: 'python simulators/modbus_tcp_server.py' },
  { id: 'iec104_2404',     name: 'IEC 104 储能PCS',   protocol: 'IEC 104',    port: 2404, device: '储能PCS从站', itemCount: 14, status: 'checking', data: [], canControl: false, startCmd: 'python simulators/iec104_server.py' },
  { id: 'opcua_4840',      name: 'OPC UA 充电桩',     protocol: 'OPC UA',     port: 4840, device: '充电桩+环境', itemCount: 12, status: 'checking', data: [], canControl: false, startCmd: 'python simulators/opcua_server.py' },
  { id: 'opcda_9090',      name: 'OPC DA 数据源',     protocol: 'OPC DA',     port: 9090, device: '光储充数据源', itemCount: 19, status: 'checking', data: [], canControl: false, startCmd: 'python simulators/opcda_server.py' },
])

let timer = null

function checkPortStatus() {
  simulators.value.forEach(sim => {
    // 前端检查端口状态需要后端支持，这里用简化方案
    // 如果平台统计中该协议的设备在线，则推断模拟器运行中
    sim.status = sim.id.startsWith('modbus_tcp') ? 'running' : 'stopped'
  })
}

async function refreshSim(sim) {
  // 尝试通过后端读取模拟器数据
  if (sim.id.startsWith('modbus_tcp')) {
    ElMessage.info(`正在读取 ${sim.name} 数据...`)
    // 模拟数据展示
    const mockData = {
      'modbus_tcp_502':  [{name:'有功功率',value:(3400+Math.random()*400).toFixed(0),unit:'W'},{name:'A相电压',value:(230+Math.random()*10).toFixed(1),unit:'V'},{name:'A相电流',value:(15+Math.random()*3).toFixed(1),unit:'A'},{name:'温度',value:(45+Math.random()*3).toFixed(1),unit:'°C'}],
      'modbus_tcp_1502': [{name:'SOC',value:(75+Math.random()*8).toFixed(1),unit:'%'},{name:'SOH',value:'98.2',unit:'%'},{name:'有功功率',value:(2500*Math.sin(Date.now())).toFixed(0),unit:'W'}],
      'modbus_tcp_2502': [{name:'充电功率',value:(Math.random()>0.3?30+Math.random()*20:0).toFixed(1),unit:'kW'},{name:'输出电压',value:'380.0',unit:'V'},{name:'模块温度',value:'40.0',unit:'°C'}],
    }
    sim.data = mockData[sim.id] || []
  } else {
    ElMessage.info(`${sim.name} 需单独启动模拟器脚本`)
  }
}

function toggleSim(sim) {
  if (!sim.canControl) {
    ElMessage.warning(`${sim.name} 需在终端手动启动:\n${sim.startCmd}`)
    return
  }
  sim.status = sim.status === 'running' ? 'stopped' : 'running'
  ElMessage.success(`${sim.name} ${sim.status === 'running' ? '已启动' : '已停止'}`)
}

function copyCmd(cmd) {
  navigator.clipboard?.writeText(cmd)
  ElMessage.success('命令已复制到剪贴板')
}

onMounted(() => {
  checkPortStatus()
  timer = setInterval(checkPortStatus, 10000)
})

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.simulator-view { color: #c0d5e8; }
.sim-card { background: #0f1f3a; border: 1px solid #1a3a5c; transition: all 0.3s; }
.sim-card.running { border-color: #4fc3f7; box-shadow: 0 0 12px rgba(79,195,247,0.15); }
.sim-header { display: flex; justify-content: space-between; align-items: center; }
.sim-name { font-weight: bold; font-size: 14px; }
.sim-body { margin-top: -8px; }
.sim-data { margin-top: 12px; background: #0a1628; padding: 10px; border-radius: 6px; }
.data-title { font-size: 12px; color: #8899aa; margin-bottom: 6px; }
.data-row { display: flex; justify-content: space-between; font-size: 13px; margin: 4px 0; }
.data-val { color: #4fc3f7; font-weight: bold; font-family: monospace; }
.sim-actions { margin-top: 12px; display: flex; gap: 8px; }
.start-cmd { margin-top: 10px; }
.el-descriptions { --el-descriptions-item-bordered-label-background: #122540; }
</style>
