<template>
  <div class="scan-page">
    <h2 class="page-title">OPC DA 扫描</h2>

    <el-card class="scan-form">
      <el-row :gutter="12" align="middle">
        <el-col :span="5">
          <el-input v-model="host" placeholder="OPC Server IP" size="small" />
        </el-col>
        <el-col :span="1">
          <el-tag type="info" size="small">:135</el-tag>
        </el-col>
        <el-col :span="5">
          <el-select v-model="server" placeholder="选择 OPC Server" size="small" style="width:100%">
            <el-option v-for="s in knownServers" :key="s" :label="s" :value="s" />
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" size="small" @click="doScan" :loading="scanning">
            {{ scanning ? '扫描中...' : '扫描服务器' }}
          </el-button>
        </el-col>
        <el-col :span="4">
          <span class="scan-info" v-if="scanDone">发现 {{ tags.length }} 个点位</span>
        </el-col>
      </el-row>
      <div class="preset-ips">
        <span class="preset-label">已知 DCS 端点:</span>
        <el-tag v-for="ip in presets" :key="ip" size="small" @click="host=ip" style="cursor:pointer;margin:2px">{{ ip }}</el-tag>
      </div>
    </el-card>

    <!-- 结果 -->
    <el-table :data="tags" size="small" v-if="tags.length" max-height="500" stripe>
      <el-table-column type="index" width="50" />
      <el-table-column prop="path" label="点位路径" min-width="250" show-overflow-tooltip />
      <el-table-column prop="station" label="站点" width="120">
        <template #default="{row}"><el-tag size="small" type="success">{{ row.station }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="type" label="类型" width="100">
        <template #default="{row}"><el-tag size="small">{{ row.type }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="value" label="当前值" width="100" />
      <el-table-column prop="quality" label="质量" width="80">
        <template #default="{row}">
          <span :style="{color: row.quality === 192 ? '#67c23a' : '#e6a23c'}">{{ row.quality === 192 ? 'GOOD' : 'BAD' }}</span>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="!tags.length && !scanning" class="empty-hint">
      输入 DCS 端点 IP，选择 OPC Server，点击"扫描服务器"
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const host = ref('172.23.9.3')
const server = ref('Kepware.KEPServerEx.V6')
const scanning = ref(false)
const scanDone = ref(false)
const tags = ref([])

const presets = ['172.23.9.3', '172.23.9.23', '172.26.6.3', '172.23.18.194', '172.21.14.192']
const knownServers = [
  'Kepware.KEPServerEx.V6',
  'RSLinx.OPC.Server',
  'Matrikon.OPC.Simulation.1',
  'Intouch.OPCLink.1',
  'WinCC.OPCServer',
]

// 已知点位模板 — 基于第四作业区摸底
const stationPoints = {
  'DX8ZRZ': { type: '联合站', points: ['AYD.pv','FTV.status','FVx_01','FVx_02','ALM_01'] },
  'DX6PZ':  { type: '联合站', points: ['ALA.status','AFR.pv','AFT_01','AFT_02'] },
  'DX5ZRZ': { type: '联合站', points: ['ALA.status','BEL.status','DEA.pv','VAL.pv'] },
  'XZ202TP': { type: '脱水站', points: ['ABx_01.status','ACCx_01.status'] },
  'SYZ105':  { type: '注水站', points: ['VEx.pv','SFEx.pv','VEx_02.pv'] },
}

async function doScan() {
  scanning.value = true; scanDone.value = false; tags.value = []

  // 模拟扫描 — 实际接入 OpenOPC/PyOPC
  await new Promise(r => setTimeout(r, 800))
  const results = []
  for (const [station, info] of Object.entries(stationPoints)) {
    for (const p of info.points) {
      results.push({
        path: `\\\\${host.value}\\\\${station}\\\\${p}`,
        station,
        type: info.type,
        value: (Math.random() * 100 + 10).toFixed(1),
        quality: Math.random() > 0.05 ? 192 : 0,  // 95% GOOD
      })
    }
  }
  tags.value = results
  scanning.value = false; scanDone.value = true
}
</script>

<style scoped>
.scan-page { padding:16px; background:#141520; min-height:100vh; color:#c0c4cc }
.page-title { font-size:18px; margin-bottom:12px; color:#e0e0e0 }
.scan-form { margin-bottom:16px; background:#1d1e2b; border-color:#2d2e3b }
.scan-info { font-size:12px; color:#67c23a }
.preset-ips { margin-top:8px }
.preset-label { font-size:11px; color:#909399; margin-right:8px }
.empty-hint { text-align:center; padding:60px; color:#909399 }
:deep(.el-card) { background:#1d1e2b; border-color:#2d2e3b }
:deep(.el-table) { --el-table-bg-color:#1d1e2b; --el-table-header-bg-color:#252636; --el-table-text-color:#c0c4cc }
</style>
