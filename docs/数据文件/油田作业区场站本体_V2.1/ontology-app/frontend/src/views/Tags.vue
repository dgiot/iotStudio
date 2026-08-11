<template>
  <div>
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px">
      <h2 style="font-weight:600">pSpace 标签数据</h2>
      <div style="display:flex; gap:8px">
        <el-tag type="info">{{ stats.total?.toLocaleString() }} 标签</el-tag>
        <el-tag type="success">{{ stats.well_count }} 口井</el-tag>
        <el-tag type="warning">{{ stats.point_type_count }} 种测点</el-tag>
        <el-tag>{{ stats.metering_station_count }} 个计量间</el-tag>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="16" style="margin-bottom:16px">
      <el-col :span="6" v-for="s in statItems" :key="s.label">
        <el-card shadow="hover" style="border-radius:10px; text-align:center; cursor:pointer"
          :style="{ borderTop: '3px solid ' + s.color }" @click="s.action">
          <div style="font-size:12px; color:#888">{{ s.label }}</div>
          <div :style="{ fontSize:'24px', fontWeight:700, color: s.color, margin:'6px 0' }">{{ s.value }}</div>
          <div style="font-size:11px; color:#aaa">{{ s.sub }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 站点分布 -->
    <el-row :gutter="16" style="margin-bottom:16px">
      <el-col :span="8">
        <el-card shadow="hover" style="border-radius:10px" header="测点类型分布 (Top 12)">
          <div v-for="pt in pointTypes.slice(0,12)" :key="pt.code"
            style="display:flex; align-items:center; justify-content:space-between; padding:5px 0; border-bottom:1px solid #f5f5f5; font-size:13px">
            <span>
              <el-tag size="small" effect="plain" style="width:60px; text-align:center">{{ pt.code }}</el-tag>
              <span style="margin-left:6px; color:#666">{{ pt.name }}</span>
            </span>
            <span style="font-weight:600">{{ pt.count }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" style="border-radius:10px" header="计量间分布">
          <div v-for="m in meterings" :key="m.metering_station"
            style="display:flex; align-items:center; justify-content:space-between; padding:5px 0; border-bottom:1px solid #f5f5f5; font-size:13px">
            <span>{{ m.metering_station }}</span>
            <el-tag size="small">{{ m.count.toLocaleString() }}</el-tag>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" style="border-radius:10px" header="站点分布">
          <div v-for="(cnt, station) in stats.stations" :key="station"
            style="display:flex; align-items:center; justify-content:space-between; padding:5px 0; border-bottom:1px solid #f5f5f5; font-size:13px">
            <span>{{ station }}</span>
            <el-tag size="small" :type="station === 'CY1C7K' ? 'success' : 'info'">{{ cnt?.toLocaleString() }}</el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 井号搜索 -->
    <el-card shadow="hover" style="border-radius:10px; margin-bottom:16px">
      <template #header>
        <div style="display:flex; align-items:center; justify-content:space-between">
          <span style="font-weight:600">井号清单 ({{ wellsTotal }} 口)</span>
          <el-input v-model="wellSearch" placeholder="搜索井号..." clearable size="small" style="width:240px"
            :prefix-icon="Search" @change="loadWells" />
        </div>
      </template>
      <div style="display:flex; flex-wrap:wrap; gap:6px; max-height:240px; overflow-y:auto">
        <el-tag v-for="w in wells" :key="w.well_id" size="small" type="info" effect="plain"
          style="cursor:pointer" @click="onWellClick(w)">
          {{ w.well_id }} <span style="color:#aaa; margin-left:2px">({{ w.tag_count }})</span>
        </el-tag>
      </div>
      <el-pagination v-if="wellsTotal > 100" layout="prev, next" :total="wellsTotal" :page-size="100"
        style="margin-top:10px" @current-change="onWellPage" small />
    </el-card>

    <!-- 测点查询 -->
    <el-card shadow="hover" style="border-radius:10px">
      <template #header>
        <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap">
          <span style="font-weight:600">测点查询</span>
          <el-select v-model="qWell" placeholder="井号" filterable clearable size="small" style="width:180px">
            <el-option v-for="w in qWellsList" :key="w" :label="w" :value="w" />
          </el-select>
          <el-select v-model="qType" placeholder="测点类型" clearable size="small" style="width:140px">
            <el-option v-for="pt in pointTypes" :key="pt.code" :label="`${pt.code} (${pt.name})`" :value="pt.code" />
          </el-select>
          <el-button size="small" type="primary" @click="queryTags" :icon="Search">查询</el-button>
          <el-tag v-if="tagTotal > 0" size="small" type="info">{{ tagTotal }} 条结果</el-tag>
          <span v-if="tagTotal > 200" style="font-size:11px; color:#999">(显示前200条)</span>
        </div>
      </template>
      <el-table :data="tagResults" stripe size="small" max-height="360" border>
        <el-table-column prop="站点" label="站点" width="90" />
        <el-table-column prop="井号" label="井号" width="120" />
        <el-table-column prop="计量间" label="计量间" width="100" />
        <el-table-column prop="测点类型" label="测点类型" width="90" />
        <el-table-column prop="完整路径" label="完整路径" min-width="300" show-overflow-tooltip />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getTagsStats, getTagsPointTypes, getTagsWells, getTagsMetering, queryTags as apiQueryTags } from '../api'

const stats = ref({})
const pointTypes = ref([])
const wells = ref([])
const wellsTotal = ref(0)
const wellSearch = ref('')
const wellPage = ref(1)
const meterings = ref([])

// 查询
const qWell = ref('')
const qType = ref('')
const qWellsList = ref([])
const tagResults = ref([])
const tagTotal = ref(0)

const statItems = ref([
  { label: '总标签', value: '—', color: '#409EFF', sub: '', action: () => {} },
  { label: '井数', value: '—', color: '#67C23A', sub: '', action: () => {} },
  { label: '测点类型', value: '—', color: '#E6A23C', sub: '', action: () => {} },
  { label: '计量间', value: '—', color: '#F56C6C', sub: '', action: () => {} },
])

onMounted(async () => {
  try {
    const [s, pt, w, m] = await Promise.all([
      getTagsStats(), getTagsPointTypes(), getTagsWells(), getTagsMetering()
    ])
    stats.value = s.data
    pointTypes.value = pt.data
    wells.value = w.data.wells || []
    wellsTotal.value = w.data.total || 0
    meterings.value = m.data || []

    statItems.value[0].value = s.data.total?.toLocaleString() || '—'
    statItems.value[1].value = s.data.well_count || '—'
    statItems.value[2].value = s.data.point_type_count || '—'
    statItems.value[3].value = s.data.metering_station_count || '—'

    qWellsList.value = (w.data.wells || []).map(x => x.well_id).sort()
  } catch { /* silent */ }
})

async function loadWells() {
  const res = await getTagsWells({ search: wellSearch.value, limit: 100, offset: (wellPage.value - 1) * 100 })
  wells.value = res.data.wells || []
  wellsTotal.value = res.data.total || 0
}

function onWellPage(page) { wellPage.value = page; loadWells() }

function onWellClick(w) {
  qWell.value = w.well_id
  queryTags()
}

async function queryTags() {
  const res = await apiQueryTags({ well_id: qWell.value, point_type: qType.value, limit: 200 })
  tagResults.value = res.data.tags || []
  tagTotal.value = res.data.total || 0
}
</script>
