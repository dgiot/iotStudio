<!--
  ProductView — IOT 底座 · 产品管理（通用视图）
  契约: GET /api/iot/products → { total, items:[{id,code,name,category,protocol,spec,desc}] }
  各行业工程后端实现标准接口即可复用；数据为演示口径时由工程后端标注。
-->
<template>
  <div class="pv">
    <div class="kpis">
      <div class="card k"><b>{{ total }}</b><span>产品总数</span></div>
      <div class="card k"><b>{{ catSet.length }}</b><span>产品类目</span></div>
      <div class="card k"><b>{{ protoSet.length }}</b><span>协议类型</span></div>
      <div class="card k"><b>{{ specCount }}</b><span>规格型号</span></div>
    </div>
    <div class="card">
      <div class="bar">
        <h3>产品目录</h3>
        <el-input v-model="q" placeholder="搜索产品/型号" size="small" clearable style="width: 200px" @input="load" />
        <el-select v-model="cat" size="small" clearable placeholder="类目" style="width: 140px" @change="load">
          <el-option v-for="c in catSet" :key="c" :label="c" :value="c" />
        </el-select>
      </div>
      <el-table :data="items" size="small">
        <el-table-column prop="code" label="产品编码" width="120" />
        <el-table-column prop="name" label="产品名称" min-width="160" />
        <el-table-column prop="category" label="类目" width="90" />
        <el-table-column prop="protocol" label="协议" width="110" />
        <el-table-column prop="spec" label="规格" width="160" show-overflow-tooltip />
        <el-table-column prop="desc" label="说明" min-width="200" show-overflow-tooltip />
      </el-table>
      <el-pagination v-if="total > size" layout="prev, pager, next" :total="total" :page-size="size"
                     :current-page="page" background small @current-change="p => { page = p; load() }" style="margin-top: 10px" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { iotProducts } from '../../api'

const items = ref([]), total = ref(0), page = ref(1), size = 20
const q = ref(''), cat = ref('')
const catSet = computed(() => [...new Set(items.value.map(d => d.category))])
const protoSet = computed(() => [...new Set(items.value.map(d => d.protocol))])
const specCount = computed(() => new Set(items.value.map(d => d.spec)).size)

async function load() {
  const d = await iotProducts({ page: page.value, page_size: size, q: q.value, category: cat.value })
  items.value = d.items || []; total.value = d.total || 0
}
onMounted(load)
</script>

<style scoped>
.pv { display: flex; flex-direction: column; gap: 14px; }
.kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
@media (max-width: 900px) { .kpis { grid-template-columns: repeat(2, 1fr); } }
.k b { font-size: 22px; color: #58a6ff; display: block; }
.k span { font-size: 11px; color: #6e7681; }
.bar { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.bar h3 { font-size: 14px; color: #c9d1d9; margin-right: auto; }
</style>
