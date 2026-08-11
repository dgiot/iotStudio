<template>
  <div>
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px">
      <h2 style="font-weight:600">约束规则库</h2>
      <el-tag type="warning">共 {{ rules.length }} 条规则</el-tag>
    </div>

    <!-- 筛选 -->
    <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap; margin-bottom:16px">
      <el-radio-group v-model="layerFilter" size="small">
        <el-radio-button value="">全部</el-radio-button>
        <el-radio-button value="Logic">Logic ({{ countBy('layer', 'Logic') }})</el-radio-button>
        <el-radio-button value="Action">Action ({{ countBy('layer', 'Action') }})</el-radio-button>
        <el-radio-button value="Security">Security ({{ countBy('layer', 'Security') }})</el-radio-button>
      </el-radio-group>
      <el-divider direction="vertical" />
      <el-select v-model="severityFilter" placeholder="严重度" clearable size="small" style="width:120px">
        <el-option v-for="s in severities" :key="s" :label="severityLabel(s)" :value="s">
          <el-tag size="small" :type="severityType(s)">{{ severityLabel(s) }}</el-tag>
        </el-option>
      </el-select>
      <el-input v-model="search" placeholder="搜索规则..." clearable size="small" style="width:200px" :prefix-icon="Search" />
    </div>

    <el-table :data="filteredRules" stripe border style="border-radius:12px; overflow:hidden" max-height="calc(100vh - 260px)">
      <el-table-column prop="layer" label="层级" width="90" sortable>
        <template #default="{ row }">
          <el-tag size="small" :type="layerType(row.layer)">{{ row.layer }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="规则名称" min-width="180" sortable />
      <el-table-column prop="condition" label="阈值/条件" min-width="220">
        <template #default="{ row }">
          <code style="font-size:12px; background:#f5f7fa; padding:2px 6px; border-radius:4px">{{ row.condition }}</code>
        </template>
      </el-table-column>
      <el-table-column prop="severity" label="严重度" width="100" sortable>
        <template #default="{ row }">
          <el-tag size="small" :type="severityType(row.severity)">{{ severityLabel(row.severity) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="action" label="执行动作" min-width="200" />
      <el-table-column prop="source" label="出处" width="180">
        <template #default="{ row }">
          <span style="font-size:12px; color:#888">{{ row.source }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getConstraints } from '../api'

const search = ref('')
const layerFilter = ref('')
const severityFilter = ref('')
const rules = ref([])

onMounted(async () => {
  try {
    const res = await getConstraints()
    rules.value = res.data.rules || []
  } catch (e) {
    console.warn('Failed to load constraints', e)
  }
})

const severities = computed(() => [...new Set(rules.value.map(r => r.severity))].filter(Boolean).sort())

const filteredRules = computed(() => {
  let list = rules.value
  if (layerFilter.value) list = list.filter(r => r.layer === layerFilter.value)
  if (severityFilter.value) list = list.filter(r => r.severity === severityFilter.value)
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(r =>
      (r.name || '').toLowerCase().includes(q) ||
      (r.condition || '').toLowerCase().includes(q) ||
      (r.action || '').toLowerCase().includes(q)
    )
  }
  return list
})

function countBy(field, val) { return rules.value.filter(r => r[field] === val).length }

function layerType(l) { return { Logic: 'success', Action: 'warning', Security: 'danger' }[l] || 'info' }

function severityType(s) {
  return { info: 'info', warn: 'warning', danger: 'danger', critical: 'danger' }[s] || 'info'
}
function severityLabel(s) {
  return { info: '信息', warn: '警告', danger: '危险', critical: '严重' }[s] || s
}
</script>
