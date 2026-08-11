<template>
  <div>
    <h2 style="margin-bottom:20px; font-weight:600">仪表盘</h2>

    <!-- 统计卡片 -->
    <el-row :gutter="16">
      <el-col :span="6" v-for="card in statCards" :key="card.label">
        <el-card shadow="hover" style="text-align:center; border-radius:12px; cursor:pointer"
          @click="$router.push(card.link)">
          <div style="font-size:13px; color:#888; margin-bottom:8px">{{ card.label }}</div>
          <div :style="{ fontSize:'32px', fontWeight:700, color: card.color }">{{ card.value }}</div>
          <div style="font-size:12px; color:#aaa; margin-top:6px">{{ card.sub }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- DLAS 四层 -->
    <el-row :gutter="16" style="margin-top:20px">
      <el-col :span="6" v-for="layer in layers" :key="layer.name">
        <el-card shadow="hover" style="border-radius:12px; height:200px; border-top:4px solid" :style="{borderTopColor: layer.color}">
          <template #header>
            <div style="display:flex; align-items:center; gap:8px">
              <el-icon :size="20" :color="layer.color"><component :is="layer.icon" /></el-icon>
              <span style="font-weight:600">{{ layer.name }}</span>
            </div>
          </template>
          <div style="font-size:28px; font-weight:700; color:#333">{{ layer.count }}</div>
          <div style="font-size:12px; color:#999; margin-top:4px">{{ layer.desc }}</div>
          <div style="margin-top:12px">
            <span v-for="tag in layer.tags" :key="tag" style="font-size:11px; color:#888; margin-right:8px">{{ tag }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Excel 来源 + 快捷入口 -->
    <el-row :gutter="16" style="margin-top:20px">
      <el-col :span="12">
        <el-card shadow="hover" style="border-radius:12px">
          <template #header>
            <div style="display:flex; align-items:center; justify-content:space-between">
              <span style="font-weight:600">数据来源 (Excel + 文档)</span>
              <el-tag size="small" type="success">从 3 份 Excel 导入</el-tag>
            </div>
          </template>
          <el-table :data="excelSources" stripe size="small">
            <el-table-column prop="file" label="文件" width="160" />
            <el-table-column prop="sheet" label="工作表" width="120" />
            <el-table-column prop="rows" label="行数" width="80" />
            <el-table-column prop="cols" label="列" width="180">
              <template #default="{ row }">
                <span style="font-size:11px; color:#888">{{ row.cols }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" style="border-radius:12px">
          <template #header><span style="font-weight:600">交付物清单</span></template>
          <div v-for="f in files" :key="f.name"
            style="display:flex; align-items:center; justify-content:space-between; padding:8px 0; border-bottom:1px solid #f5f5f5; font-size:13px">
            <span>{{ f.name }}</span>
            <el-tag size="small" effect="plain">{{ f.size }}</el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getOntologyStats } from '../api'

const statCards = ref([
  { label: 'Data 实体', value: '—', color: '#409EFF', sub: '场站/设备/进程/协议/DCS', link: '/entities' },
  { label: 'Logic 规则', value: '—', color: '#67C23A', sub: '采集节拍/五级校验/公式', link: '/constraints' },
  { label: 'Action 链路', value: '—', color: '#E6A23C', sub: 'Modbus·OPC DA·A11', link: '/relations' },
  { label: 'Security 规则', value: '—', color: '#F56C6C', sub: '访问控制/红线/合规', link: '/constraints' },
])

const layers = ref([
  { name: 'Data', icon: 'Monitor', color: '#409EFF', count: '—', desc: '物理世界', tags: [] },
  { name: 'Logic', icon: 'Cpu', color: '#67C23A', count: '—', desc: '推理决策', tags: [] },
  { name: 'Action', icon: 'Promotion', color: '#E6A23C', count: '—', desc: '执行闭环', tags: [] },
  { name: 'Security', icon: 'Lock', color: '#F56C6C', count: '—', desc: '安全合规', tags: [] },
])

const excelSources = ref([
  { file: '实体清单.xlsx', sheet: '实体清单', rows: '—', cols: '层/类别/实体名称/数量/说明/数据源' },
  { file: '关系矩阵.xlsx', sheet: '关系矩阵', rows: '—', cols: '源实体/关系类型/目标实体/协议/方向/说明' },
  { file: '约束规则库.xlsx', sheet: '约束规则库', rows: '—', cols: '层级/规则名称/阈值/严重度/动作/出处' },
])

const files = [
  { name: 'oilfield_ontology.json', size: '20KB' },
  { name: 'force_graph_data.json', size: '16KB' },
  { name: 'excel_entities.json', size: '—' },
  { name: 'excel_relations.json', size: '—' },
  { name: 'excel_constraints.json', size: '—' },
  { name: 'ontology_report.md', size: '5.4KB' },
]

onMounted(async () => {
  try {
    const res = await getOntologyStats()
    const s = res.data

    // 按层统计
    const el = s.entities_by_layer || {}
    statCards.value[0].value = el.Data || '—'
    statCards.value[1].value = el.Logic || '—'
    statCards.value[2].value = el.Action || '—'
    statCards.value[3].value = el.Security || '—'

    layers.value[0].count = el.Data || '—'
    layers.value[1].count = el.Logic || '—'
    layers.value[2].count = el.Action || '—'
    layers.value[3].count = el.Security || '—'

    layers.value[0].tags = ['实体清单', `${s.excel_entities || '—'} 条`, '6列']
    layers.value[1].tags = ['约束规则库', `${s.excel_constraints || '—'} 条`, '6列']
    layers.value[2].tags = ['关系矩阵', '采集链路 3条', 'IPC机制']
    layers.value[3].tags = ['访问控制', '生产红线', '合规审计']

    excelSources.value[0].rows = s.excel_entities || '—'
    excelSources.value[1].rows = s.excel_relations || '—'
    excelSources.value[2].rows = s.excel_constraints || '—'
  } catch { /* silent */ }
})
</script>
