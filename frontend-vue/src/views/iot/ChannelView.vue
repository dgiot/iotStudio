<!--
  ChannelView — IOT 底座 · 通道管理（通用视图）
  契约: GET /api/iot/channels → { total, items:[{id,name,type,protocol,transport,status,desc}] }
  各行业工程后端实现标准接口即可复用；数据为演示口径时由工程后端标注。
-->
<template>
  <div class="cv">
    <div class="kpis">
      <div class="card k"><b>{{ total }}</b><span>通道总数</span></div>
      <div class="card k"><b>{{ onlineCount }}</b><span>在线</span></div>
      <div class="card k"><b>{{ protoSet.length }}</b><span>协议类型</span></div>
      <div class="card k"><b>{{ typeSet.length }}</b><span>通道类型</span></div>
    </div>
    <div class="card">
      <div class="bar">
        <h3>采集与接入通道</h3>
        <el-input v-model="q" placeholder="搜索通道名称" size="small" clearable style="width: 200px" @input="load" />
      </div>
      <el-table :data="items" size="small">
        <el-table-column prop="name" label="通道名称" min-width="160" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="protocol" label="协议" width="120" />
        <el-table-column prop="transport" label="传输方式" width="110" />
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === '在线' ? 'success' : 'info'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="说明" min-width="220" show-overflow-tooltip />
      </el-table>
      <el-pagination v-if="total > size" layout="prev, pager, next" :total="total" :page-size="size"
                     :current-page="page" background small @current-change="p => { page = p; load() }" style="margin-top: 10px" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { iotChannels } from '../../api'

const items = ref([]), total = ref(0), page = ref(1), size = 20
const q = ref('')
const onlineCount = computed(() => items.value.filter(c => c.status === '在线').length)
const protoSet = computed(() => [...new Set(items.value.map(d => d.protocol))])
const typeSet = computed(() => [...new Set(items.value.map(d => d.type))])

async function load() {
  const d = await iotChannels({ page: page.value, page_size: size, q: q.value })
  items.value = d.items || []; total.value = d.total || 0
}
onMounted(load)
</script>

<style scoped>
.cv { display: flex; flex-direction: column; gap: 14px; }
.kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
@media (max-width: 900px) { .kpis { grid-template-columns: repeat(2, 1fr); } }
.k b { font-size: 22px; color: #58a6ff; display: block; }
.k span { font-size: 11px; color: #6e7681; }
.bar { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.bar h3 { font-size: 14px; color: #c9d1d9; margin-right: auto; }
</style>
