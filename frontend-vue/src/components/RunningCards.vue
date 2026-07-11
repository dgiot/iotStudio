<template>
  <div class="running-cards">
    <div class="rc-header">
      <span class="rc-title">📟 实时运行状态</span>
      <el-switch v-model="cardView" active-text="卡片" inactive-text="表格" size="small" />
    </div>

    <!-- 卡片视图 -->
    <el-row v-if="cardView" :gutter="12">
      <el-col :span="6" v-for="c in groupedCards" :key="c.group">
        <el-card class="rc-group-card" shadow="never">
          <div class="rc-group-title">{{ c.group }}</div>
          <div class="rc-items">
            <div v-for="item in c.items" :key="item.key" class="rc-item">
              <div class="rc-item-name">{{ item.name }}</div>
              <div class="rc-item-value" :style="{color: item.color}">
                {{ item.value }} <small>{{ item.unit }}</small>
              </div>
              <div class="rc-item-time">{{ item.ts }}</div>
            </div>
          </div>
          <div v-if="!c.items.length" class="rc-empty">暂无数据</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 表格视图 -->
    <el-table v-else :data="flatCards" size="small" max-height="400" v-loading="loading">
      <el-table-column prop="group" label="分类" width="100" />
      <el-table-column prop="name" label="测点" min-width="150" />
      <el-table-column prop="value" label="数值" width="120" align="center">
        <template #default="{row}"><b :style="{color:row.color}">{{ row.value }} {{ row.unit }}</b></template>
      </el-table-column>
      <el-table-column prop="ts" label="时间" width="100" align="center" />
    </el-table>

    <div class="rc-refresh">
      <span>更新于 {{ lastUpdate }}</span>
      <el-button link size="small" @click="refresh">🔄 刷新</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  deviceId: { type: String, default: '' }
})

const cardView = ref(true)
const loading = ref(false)
const dataMap = ref({})
const lastUpdate = ref('--:--:--')

const CATEGORY_MAP = {
  electrical: { group:'电气参数', color:'#66d9ff' },
  battery: { group:'电池状态', color:'#66bb6a' },
  temperature: { group:'温度', color:'#ffa726' },
  energy: { group:'电量', color:'#ffc107' },
  status: { group:'运行状态', color:'#ab47bc' },
  environment: { group:'环境', color:'#4fc3f7' },
}

const flatCards = computed(() => {
  const list = []
  for (const [key, val] of Object.entries(dataMap.value)) {
    const cat = CATEGORY_MAP[val.category] || { group:'其他', color:'#c0d5e8' }
    list.push({ key, name:val.point_name||key, value:val.value, unit:val.unit||'', ts:val.ts||'', group:cat.group, color:cat.color })
  }
  return list
})

const groupedCards = computed(() => {
  const groups = {}
  flatCards.value.forEach(item => {
    if (!groups[item.group]) groups[item.group] = []
    groups[item.group].push(item)
  })
  return Object.entries(groups).map(([group, items]) => ({ group, items }))
})

function refresh() {
  if (!props.deviceId) return
  loading.value = true
  fetch(`/api/telemetry/${props.deviceId}/latest`)
    .then(r => r.json())
    .then(d => {
      const map = {}
      ;(d.data || []).forEach(p => {
        map[p.point_id] = { ...p, category: guessCategory(p.point_name||p.point_id) }
      })
      dataMap.value = map
      lastUpdate.value = new Date().toLocaleTimeString()
    }).catch(() => {}).finally(() => loading.value = false)
}

function guessCategory(name) {
  const n = (name||'').toLowerCase()
  if (n.includes('voltage')||n.includes('current')||n.includes('power')||n.includes('电压')||n.includes('电流')||n.includes('功率')) return 'electrical'
  if (n.includes('soc')||n.includes('soh')||n.includes('battery')||n.includes('电池')||n.includes('荷电')) return 'battery'
  if (n.includes('temp')||n.includes('温度')||n.includes('温升')) return 'temperature'
  if (n.includes('energy')||n.includes('kwh')||n.includes('电量')||n.includes('发电')||n.includes('充电')) return 'energy'
  if (n.includes('status')||n.includes('state')||n.includes('状态')||n.includes('运行')) return 'status'
  if (n.includes('humidity')||n.includes('湿度')||n.includes('irradiance')||n.includes('辐照')||n.includes('wind')||n.includes('风速')) return 'environment'
  return 'electrical'
}

onMounted(refresh)
onUnmounted(() => {})
</script>

<style scoped>
.running-cards { margin-top: 12px; }
.rc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.rc-title { color: #e8f0f8; font-size: 14px; font-weight: bold; }
.rc-group-card { margin-bottom: 8px; }
.rc-group-title { font-size: 13px; color: #66d9ff; font-weight: bold; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid #234060; }
.rc-items { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.rc-item { padding: 4px 0; }
.rc-item-name { font-size: 11px; color: #c0d5e8; }
.rc-item-value { font-size: 18px; font-weight: bold; }
.rc-item-value small { font-size: 11px; color: #c0d5e8; font-weight: normal; }
.rc-item-time { font-size: 10px; color: #8aa0b4; }
.rc-empty { text-align: center; color: #c0d5e8; padding: 12px; font-size: 12px; }
.rc-refresh { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #8aa0b4; margin-top: 6px; }
</style>
