<!--
  DeviceView — IOT 底座 · 设备管理（通用视图）
  契约: GET /api/iot/devices → { total, items:[{id,code,name,type,model,protocol,status,online,location,last_active}] }
  各行业工程后端实现标准接口即可复用；数据为演示口径时由工程后端标注。
-->
<template>
  <div class="dv">
    <div class="kpis">
      <div class="card k"><b>{{ total }}</b><span>设备总数</span></div>
      <div class="card k"><b class="gr">{{ onlineCount }}</b><span>在线</span></div>
      <div class="card k"><b class="or">{{ offlineCount }}</b><span>离线/故障</span></div>
      <div class="card k"><b>{{ protoSet.length }}</b><span>协议类型</span></div>
    </div>
    <div class="card">
      <div class="bar">
        <h3>设备台账</h3>
        <el-input v-model="q" placeholder="搜索编号/名称/位置" size="small" clearable style="width: 200px" @input="load" />
        <el-select v-model="st" size="small" clearable placeholder="状态" style="width: 120px" @change="load">
          <el-option v-for="s in statusSet" :key="s" :label="s" :value="s" />
        </el-select>
      </div>
      <el-table :data="items" size="small">
        <el-table-column prop="code" label="设备编号" width="110" />
        <el-table-column prop="name" label="设备名称" min-width="140" />
        <el-table-column prop="type" label="类型" width="90" />
        <el-table-column prop="model" label="型号" width="110" />
        <el-table-column prop="protocol" label="协议" width="100" />
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.online ? (row.status === '故障' ? 'danger' : 'success') : 'info'" size="small">
              {{ row.online ? row.status : '离线' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="位置" min-width="110" show-overflow-tooltip />
        <el-table-column prop="last_active" label="最近活跃" width="100" />
      </el-table>
      <el-pagination v-if="total > size" layout="prev, pager, next" :total="total" :page-size="size"
                     :current-page="page" background small @current-change="p => { page = p; load() }" style="margin-top: 10px" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { iotDevices } from '../../api'

const items = ref([]), total = ref(0), page = ref(1), size = 20
const q = ref(''), st = ref('')
const onlineCount = computed(() => items.value.filter(d => d.online).length)
const offlineCount = computed(() => items.value.length - onlineCount.value)
const protoSet = computed(() => [...new Set(items.value.map(d => d.protocol))])
const statusSet = computed(() => [...new Set(items.value.map(d => d.status))])

async function load() {
  const d = await iotDevices({ page: page.value, page_size: size, q: q.value, status: st.value })
  items.value = d.items || []; total.value = d.total || 0
}
onMounted(load)
</script>

<style scoped>
.dv { display: flex; flex-direction: column; gap: 14px; }
.kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
@media (max-width: 900px) { .kpis { grid-template-columns: repeat(2, 1fr); } }
.k b { font-size: 22px; color: #58a6ff; display: block; }
.k b.gr { color: #3fb950; } .k b.or { color: #d29922; }
.k span { font-size: 11px; color: #6e7681; }
.bar { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.bar h3 { font-size: 14px; color: #c9d1d9; margin-right: auto; }
</style>
