<template>
  <div class="shadow-page">
    <div class="toolbar">
      <h3>Shadow</h3>
      <el-input v-model="deviceId" placeholder="device id" size="small" style="width:200px" @keyup.enter="loadShadow" />
      <el-button type="primary" size="small" @click="loadShadow">Query</el-button>
    </div>

    <el-row :gutter="12" v-if="shadow">
      <el-col :span="8">
        <el-card shadow="hover"><template #header>Desired</template>
          <div v-for="(v,k) in shadow.desired" :key="k" class="kv">
            <span class="k">{{ k }}</span><span class="v">{{ v }}</span>
          </div>
          <el-input v-model="newKey" placeholder="key" size="small" style="width:45%;margin-top:8px" />
          <el-input-number v-model="newVal" size="small" style="width:45%" controls-position="right" />
          <el-button size="small" type="primary" style="margin-top:4px" @click="addDesired">Add</el-button>
          <el-button size="small" type="warning" style="margin-top:4px" @click="saveDesired">Save</el-button>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover"><template #header>Reported</template>
          <div v-for="(v,k) in shadow.reported" :key="k" class="kv">
            <span class="k">{{ k }}</span><span class="v">{{ v }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover"><template #header>Delta</template>
          <div v-for="(v,k) in shadow.delta" :key="k" class="kv">
            <span class="k">{{ k }}</span>
            <span class="v" :class="{pending:v>0.5}">{{ v }}</span>
          </div>
          <div style="margin-top:12px">
            <el-tag :type="shadow.sync_status==='synced'?'success':'warning'">
              {{ shadow.sync_status }}
            </el-tag>
            <el-button size="small" style="margin-left:8px" @click="syncDevice">Sync</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-empty v-else description="Enter device ID to query shadow" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import api from '../api'

const deviceId = ref('CY1C8K-001')
const shadow = ref(null)
const newKey = ref('')
const newVal = ref(0)

async function loadShadow() {
  try {
    const r = await api.get(`/shadow/${deviceId.value}`)
    shadow.value = r.shadow
    ElMessage.success(`v${r.version}`)
  } catch { ElMessage.error('Failed') }
}

function addDesired() {
  if (!shadow.value) return
  shadow.value.desired[newKey.value] = newVal.value
  newKey.value = ''; newVal.value = 0
}

async function saveDesired() {
  try {
    const r = await api.put(`/shadow/${deviceId.value}/desired`, { desired: shadow.value.desired })
    shadow.value.version = r.version
    ElMessage.success('Saved')
    loadShadow()
  } catch { ElMessage.error('Save failed') }
}

async function syncDevice() {
  try {
    await api.post(`/shadow/${deviceId.value}/sync`)
    ElMessage.success('Sync pushed')
  } catch { ElMessage.error('Sync failed') }
}
</script>

<style scoped>
.shadow-page { color: #c0d5e8; }
.toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.toolbar h3 { margin: 0; color: #e8f0f8; }
.kv { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #1a3050; font-size:13px; }
.k { color: #8aa0b4; }
.v { color: #e0e0e0; font-weight: bold; font-family: monospace; }
.v.pending { color: #E6A23C; }
</style>
