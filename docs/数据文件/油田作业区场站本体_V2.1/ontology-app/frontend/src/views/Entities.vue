<template>
  <div>
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px">
      <h2 style="font-weight:600">实体清单</h2>
      <div style="display:flex; gap:12px; align-items:center">
        <el-input v-model="search" placeholder="搜索实体名称/属性..." clearable size="small" style="width:260px" :prefix-icon="Search" />
        <el-tag type="info">共 {{ filteredEntities.length }} 个实体</el-tag>
      </div>
    </div>

    <!-- 按层 + 类别筛选 -->
    <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap; margin-bottom:16px">
      <el-radio-group v-model="layerFilter" size="small" @change="onLayerChange">
        <el-radio-button value="">全部</el-radio-button>
        <el-radio-button v-for="l in layers" :key="l" :value="l">{{ l }} ({{ layerCount(l) }})</el-radio-button>
      </el-radio-group>
      <el-divider direction="vertical" />
      <el-select v-model="catFilter" placeholder="类别筛选" clearable size="small" style="width:130px">
        <el-option v-for="c in currentCategories" :key="c" :label="`${c} (${catCount(c)})`" :value="c" />
      </el-select>
    </div>

    <el-table :data="filteredEntities" stripe border style="border-radius:12px; overflow:hidden"
      max-height="calc(100vh - 280px)" :default-sort="{ prop: 'layer', order: 'ascending' }">
      <el-table-column prop="layer" label="层级" width="90" sortable>
        <template #default="{ row }">
          <el-tag size="small" :type="layerType(row.layer)">{{ row.layer }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="category" label="类别" width="100" sortable />
      <el-table-column prop="name" label="实体名称" min-width="180" sortable />
      <el-table-column prop="identifier" label="标识/数量" width="180">
        <template #default="{ row }">
          <code v-if="row.identifier" style="font-size:12px; background:#f5f7fa; padding:2px 6px; border-radius:4px">{{ row.identifier }}</code>
          <span v-else style="color:#ccc">—</span>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="属性说明" min-width="220" show-overflow-tooltip />
      <el-table-column prop="source" label="数据源" width="120">
        <template #default="{ row }">
          <el-tag v-if="row.source" size="small" type="info" effect="plain">{{ row.source }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getEntities } from '../api'

const search = ref('')
const layerFilter = ref('')
const catFilter = ref('')
const entities = ref([])
const layers = ref([])

onMounted(async () => {
  try {
    const res = await getEntities()
    entities.value = res.data.entities || []
    const ls = new Set(entities.value.map(e => e.layer))
    layers.value = [...ls].sort()
  } catch (e) {
    console.warn('Failed to load entities, backend may be down', e)
  }
})

const currentCategories = computed(() => {
  const cats = new Set()
  entities.value
    .filter(e => !layerFilter.value || e.layer === layerFilter.value)
    .forEach(e => cats.add(e.category))
  return [...cats].sort()
})

const filteredEntities = computed(() => {
  let list = entities.value
  if (layerFilter.value) list = list.filter(e => e.layer === layerFilter.value)
  if (catFilter.value) list = list.filter(e => e.category === catFilter.value)
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(e =>
      (e.name || '').toLowerCase().includes(q) ||
      (e.description || '').toLowerCase().includes(q) ||
      (e.category || '').toLowerCase().includes(q)
    )
  }
  return list
})

function onLayerChange() { catFilter.value = '' }

function layerCount(layer) { return entities.value.filter(e => e.layer === layer).length }
function catCount(cat) { return entities.value.filter(e => e.category === cat && (!layerFilter.value || e.layer === layerFilter.value)).length }

function layerType(layer) {
  const map = { Data: '', Logic: 'success', Action: 'warning', Security: 'danger' }
  return map[layer] || 'info'
}
</script>
