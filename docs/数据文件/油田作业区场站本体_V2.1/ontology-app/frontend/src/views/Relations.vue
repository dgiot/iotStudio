<template>
  <div>
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px">
      <h2 style="font-weight:600">关系矩阵</h2>
      <el-tag type="info">共 {{ relations.length }} 条关系</el-tag>
    </div>

    <!-- 搜索筛选 -->
    <div style="display:flex; gap:12px; margin-bottom:16px">
      <el-input v-model="search" placeholder="搜索源/目标/关系..." clearable size="small" style="width:300px" :prefix-icon="Search" />
    </div>

    <!-- 关系卡片 -->
    <el-row :gutter="16">
      <el-col :span="8" v-for="(rel, idx) in filteredRelations" :key="idx" style="margin-bottom:16px">
        <el-card shadow="hover" style="border-radius:12px; border-left:4px solid #409EFF; height:100%">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:8px">
            <el-tag size="small" type="info">{{ rel.source }}</el-tag>
            <el-icon color="#409EFF" :size="16"><Right /></el-icon>
            <span style="font-weight:600; font-size:12px; color:#409EFF; background:#ecf5ff; padding:2px 8px; border-radius:4px">
              {{ rel.relation }}
            </span>
            <el-icon color="#409EFF" :size="16"><Right /></el-icon>
            <el-tag size="small" type="success">{{ rel.target }}</el-tag>
            <el-tag v-if="rel.direction" size="small" effect="plain" style="margin-left:auto">{{ rel.direction }}</el-tag>
          </div>
          <div style="font-size:12px; color:#888; margin-top:4px">
            <span v-if="rel.mechanism">🔧 {{ rel.mechanism }}</span>
          </div>
          <div style="font-size:12px; color:#999; margin-top:2px" v-if="rel.description">
            {{ rel.description }}
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-empty v-if="!filteredRelations.length" description="无匹配关系" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getRelations } from '../api'

const search = ref('')
const relations = ref([])

onMounted(async () => {
  try {
    const res = await getRelations()
    relations.value = res.data.relations || []
  } catch (e) {
    console.warn('Failed to load relations', e)
  }
})

const filteredRelations = computed(() => {
  if (!search.value) return relations.value
  const q = search.value.toLowerCase()
  return relations.value.filter(r =>
    (r.source || '').toLowerCase().includes(q) ||
    (r.target || '').toLowerCase().includes(q) ||
    (r.relation || '').toLowerCase().includes(q) ||
    (r.mechanism || '').toLowerCase().includes(q)
  )
})
</script>
