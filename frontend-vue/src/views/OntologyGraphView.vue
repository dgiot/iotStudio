<!--
  OntologyGraphView v3 — 统一图库 · 本体图谱（Force 图，可按**证据档位**着色）

  数据来源（v2 起）：底座通用图查询面 —— GET /api/graph/namespaces + GET /api/graph/bundle/{ns}。
  任何插件用 ctx.register_graph() 挂上来的本体，前端零改动即可查看；私料留在服务端（graph_scope 鉴权）。

  v3（2026-10-05）新增**证据档位视角**：
    本仓全工程第一条硬规则是「每条记录必须能回源」，档位是 8 档闭集。
    结构图看不出"这条到底是原文核过的，还是只是转述"，而业务上这两者的处置完全不同
    （原文已核可直接引用；未取正本的只能作为线索）。所以把档位做成可切换的着色维度，
    数据本身就是通用的 src_grade 字段（底座 bundle 接口已带出，无需任何专用端点）。
    配色从"最硬"到"最软"：绿 → 青 → 蓝 → 紫 → 橙 → 黄 → 红。

  与 public/ontology.html（DLAS 树形浏览器）互补：树形看层级，Force 看全貌关系。
-->
<template>
  <div class="ogv">
    <div class="ogv-bar">
      <span class="ogv-title">统一图库 · 本体图谱</span>
      <el-select v-model="ns" size="small" style="width: 210px" placeholder="命名空间" @change="load">
        <el-option v-for="n in namespaces" :key="n.namespace"
                   :label="n.namespace + '（' + n.nodes + ' 节点 / ' + n.edges + ' 边）'"
                   :value="n.namespace" />
      </el-select>
      <el-select v-model="colorBy" size="small" style="width: 130px" @change="render(currentGraph)">
        <el-option label="按类别着色" value="category" />
        <el-option label="按证据档位" value="grade" />
      </el-select>
      <span class="ogv-meta">{{ metaText }}</span>
      <span v-if="err" class="ogv-err">{{ err }}</span>
    </div>
    <div ref="chartEl" class="ogv-chart"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'
import request from '../api/request'

const chartEl = ref(null)
const namespaces = ref([])
const ns = ref('')
const colorBy = ref('category')
const metaText = ref('加载中…')
const err = ref('')
let chart = null
let currentGraph = null

// 类别：多类时用大调色板轮转
const PALETTE = ['#409EFF', '#67C23A', '#e6a23c', '#f5c542', '#b37feb', '#36cfc9',
  '#ff7875', '#597ef7', '#95de64', '#ffc069', '#ffadd2', '#5cdbd3']

// 档位：**固定**配色（不让它随数据轮转）——颜色本身就是语义，稳定才可比。
// 从最硬到最软：绿 → 青 → 蓝 → 紫 → 橙 → 黄 → 红。
const GRADE_COLOR = {
  原文已核: '#67C23A',
  条文对应: '#36cfc9',
  官方检索实读: '#409EFF',
  本仓代码: '#597ef7',
  本仓裁定: '#b37feb',
  公开事实: '#e6a23c',
  转述未核: '#ffc069',
  未取正本: '#ff7875',
}
const GRADE_ORDER = Object.keys(GRADE_COLOR)

function unpack(g) {
  const b = g && g.bundle ? g.bundle : g
  return {
    nodes: (b && b.nodes) || [],
    edges: (b && b.edges) || [],
    cats: (b && b.categories) || [],
    meta: (b && b.meta) || {},
  }
}

function render(g) {
  currentGraph = g
  const { nodes, edges, meta } = unpack(g)
  if (!chart) chart = echarts.init(chartEl.value, 'dark')

  const byCat = {}
  const byGrade = {}
  nodes.forEach(n => {
    const c = n.category || n.type || '未分类'
    byCat[c] = (byCat[c] || 0) + 1
    const gd = n.src_grade || '（未标档位）'
    byGrade[gd] = (byGrade[gd] || 0) + 1
  })

  const useGrade = colorBy.value === 'grade'
  const groups = useGrade ? GRADE_ORDER.concat(['（未标档位）']).filter(x => byGrade[x]) 
                          : Object.keys(byCat).sort((a, b) => byCat[b] - byCat[a])
  const COLOR = {}
  groups.forEach((t, i) => {
    COLOR[t] = useGrade ? (GRADE_COLOR[t] || '#8899aa') : PALETTE[i % PALETTE.length]
  })

  const keyOf = n => (useGrade ? (n.src_grade || '（未标档位）') : (n.category || n.type || '未分类'))

  chart.setOption({
    tooltip: {
      formatter: p => {
        if (p.dataType === 'edge') return p.data.value
        const n = p.data.raw || {}
        const lines = ['<b>' + (n.label || n.id) + '</b>', '类别：' + (n.category || n.type || '-')]
        if (n.src_grade) lines.push('证据档位：<b>' + n.src_grade + '</b>')
        if (n.src) lines.push('出处：' + n.src)
        return lines.join('<br/>')
      },
    },
    series: [{
      type: 'graph', layout: 'force', roam: true, draggable: true,
      force: { repulsion: 55, edgeLength: [20, 80], gravity: 0.08, friction: 0.2 },
      label: { show: true, fontSize: 9, color: '#cfd8e3' },
      lineStyle: { color: '#3a4657', width: 0.6, curveness: 0.05 },
      emphasis: { focus: 'adjacency' },
      data: nodes.map(n => ({
        id: n.id, name: n.label || n.id, category: keyOf(n), raw: n,
        symbolSize: 8, itemStyle: { color: COLOR[keyOf(n)] },
      })),
      categories: groups.map(t => ({ name: t })),
      links: edges.map(e => ({
        source: e.source || e.from, target: e.target || e.to, value: e.relation || e.type || '',
      })),
    }],
  }, true)

  const legend = groups.map(t => t + '(' + (useGrade ? byGrade[t] : byCat[t]) + ')').join('  ')
  metaText.value = (meta.name ? meta.name + ' · ' : '') + nodes.length + ' 节点 · ' + edges.length + ' 边'
    + (useGrade ? ' · 档位：' : ' · 类别：') + legend.slice(0, 90)
}

async function load() {
  if (!ns.value) return
  err.value = ''
  metaText.value = '加载中…'
  try {
    const g = await request({ url: '/graph/bundle/' + encodeURIComponent(ns.value), method: 'get' })
    await nextTick()
    render(g)
  } catch (e) {
    err.value = '取数失败：' + (e && e.message ? e.message : e)
    metaText.value = ''
  }
}

onMounted(async () => {
  try {
    const r = await request({ url: '/graph/namespaces', method: 'get' })
    const list = (r && r.results) || []
    namespaces.value = list
    if (list.length) { ns.value = list[0].namespace; await load() }
    else metaText.value = '统一图库里还没有命名空间（业务插件用 register_graph 挂上来即可）'
  } catch (e) {
    err.value = '列命名空间失败（可能未登录）：' + (e && e.message ? e.message : e)
    metaText.value = ''
  }
})

onBeforeUnmount(() => { if (chart) { chart.dispose(); chart = null } })
</script>

<style scoped>
.ogv { height: calc(100vh - 64px); background: #0f1720; display: flex; flex-direction: column; }
.ogv-bar { padding: 8px 12px; border-bottom: 1px solid #1e2733; display: flex; align-items: center; gap: 10px; }
.ogv-title { color: #e6e8eb; font-size: 13px; }
.ogv-meta { color: #8899aa; font-size: 12px; }
.ogv-err { color: #f56c6c; font-size: 12px; }
.ogv-chart { flex: 1; min-height: 0; }
</style>
