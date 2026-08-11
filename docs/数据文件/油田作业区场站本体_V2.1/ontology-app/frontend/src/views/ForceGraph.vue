<template>
  <div style="height:100%; display:flex; flex-direction:column">
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px">
      <h2 style="font-weight:600">力导图 — 油田作业区场站本体</h2>
      <div style="display:flex; gap:8px; align-items:center">
        <el-button size="small" @click="resetGraph" :icon="RefreshRight">重置</el-button>
        <el-select v-model="highlightCat" placeholder="按分类高亮" clearable size="small" style="width:130px" @change="onHighlightCat">
          <el-option v-for="c in categories" :key="c.name" :label="c.name" :value="c.name" />
        </el-select>
        <span style="font-size:12px; color:#999">
          节点: {{ graphData.nodes?.length || 0 }} · 连线: {{ graphData.links?.length || 0 }}
        </span>
      </div>
    </div>

    <!-- 分类图例 -->
    <div style="display:flex; gap:14px; flex-wrap:wrap; margin-bottom:10px">
      <span v-for="c in categories" :key="c.name"
        @click="highlightCat = highlightCat === c.name ? '' : c.name; onHighlightCat(highlightCat)"
        :style="{
          display:'inline-flex', alignItems:'center', gap:'4px', fontSize:'12px',
          cursor:'pointer', padding:'3px 10px', borderRadius:'12px',
          background: highlightCat === c.name ? c.itemStyle.color + '22' : 'transparent',
          border: '1px solid ' + (highlightCat === c.name ? c.itemStyle.color : '#e0e0e0'),
          fontWeight: highlightCat === c.name ? 600 : 400
        }"
      >
        <span :style="{width:'10px',height:'10px',borderRadius:'50%',background:c.itemStyle.color,display:'inline-block'}"></span>
        {{ c.name }}
      </span>
    </div>

    <!-- 图表 -->
    <div ref="chartRef" style="flex:1; min-height:500px; border-radius:12px; overflow:hidden; border:1px solid #e8eaed; background:#fff"></div>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" :title="selectedNode?.name" width="420px">
      <div v-if="selectedNode">
        <p><b>分类:</b> {{ selectedNode.category }}</p>
        <p><b>关联节点 ({{ neighbors.length }}):</b></p>
        <el-tag v-for="n in neighbors" :key="n" size="small" style="margin:2px">{{ n }}</el-tag>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getGraphData } from '../api'

const chartRef = ref(null)
const highlightCat = ref('')
const detailVisible = ref(false)
const selectedNode = ref(null)
const neighbors = ref([])

let chart = null
let graphData = { nodes: [], links: [], categories: [] }
let categories = []

// 初始化
onMounted(async () => {
  try {
    const res = await getGraphData()
    graphData = res.data
    categories = graphData.categories || []
    await nextTick()
    initChart()
  } catch {
    // fallback: 直接用内置数据
    await loadFallbackData()
    await nextTick()
    initChart()
  }
})

onBeforeUnmount(() => {
  chart?.dispose()
})

async function loadFallbackData() {
  const res = await import('../../../../force_graph_data.json')
  graphData = res.default
  categories = graphData.categories || []
}

function initChart() {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)

  const option = {
    backgroundColor: '#fafbfc',
    tooltip: {
      trigger: 'item',
      formatter: p => p.dataType === 'node'
        ? `<b>${p.name}</b><br/>分类: ${p.data.category}`
        : `${p.data.source} → ${p.data.target}`
    },
    series: [{
      type: 'graph',
      layout: 'force',
      data: graphData.nodes,
      links: graphData.links,
      categories: graphData.categories,
      roam: true,
      draggable: true,
      force: {
        repulsion: 800,
        gravity: 0.1,
        edgeLength: [120, 280],
        layoutAnimation: true,
        friction: 0.6
      },
      emphasis: {
        focus: 'adjacency',
        lineStyle: { width: 8, color: '#333' },
        itemStyle: { shadowBlur: 20, shadowColor: 'rgba(0,0,0,0.4)' }
      },
      blur: {
        itemStyle: { opacity: 0.15 },
        lineStyle: { opacity: 0.05 }
      },
      label: {
        show: true,
        position: 'right',
        fontSize: 11,
        color: '#555',
        formatter: p => p.name.length > 15 ? p.name.slice(0, 14) + '...' : p.name
      },
      edgeLabel: {
        show: true,
        fontSize: 9,
        color: '#bbb',
        formatter: p => p.data.label || ''
      },
      lineStyle: {
        color: 'source',
        curveness: 0.25,
        opacity: 0.35,
        width: 1.5
      },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 1.5,
        shadowBlur: 6,
        shadowColor: 'rgba(0,0,0,0.15)'
      },
      scaleLimit: { min: 0.3, max: 5 },
      animation: true,
      animationDuration: 1500,
      animationEasingUpdate: 'quinticInOut'
    }]
  }

  chart.setOption(option)

  // 点击节点
  chart.on('click', (params) => {
    if (params.dataType === 'node') {
      selectedNode.value = { name: params.name, category: params.data.category }
      const ns = new Set()
      graphData.links.forEach(l => {
        if (l.source === params.name) ns.add(l.target)
        if (l.target === params.name) ns.add(l.source)
      })
      neighbors.value = [...ns]
      detailVisible.value = true

      // 高亮
      graphData.nodes.forEach(n => {
        n.itemStyle = ns.has(n.name) || n.name === params.name
          ? { opacity: 1 }
          : { opacity: 0.15 }
      })
      graphData.links.forEach(l => {
        l.lineStyle = (l.source === params.name || l.target === params.name)
          ? { opacity: 0.9, width: 3 }
          : { opacity: 0.03, width: 0.5 }
      })
      chart.setOption({ series: [{ data: graphData.nodes, links: graphData.links }] })
    }
  })

  // 双击恢复
  chart.on('dblclick', () => resetGraph())

  window.addEventListener('resize', () => chart?.resize())
}

function resetGraph() {
  graphData.nodes.forEach(n => { delete n.itemStyle })
  graphData.links.forEach(l => { delete l.lineStyle })
  chart?.setOption({ series: [{ data: graphData.nodes, links: graphData.links }] })
  highlightCat.value = ''
}

function onHighlightCat(cat) {
  if (!cat) { resetGraph(); return }
  graphData.nodes.forEach(n => {
    n.itemStyle = n.category === cat ? { opacity: 1 } : { opacity: 0.1 }
  })
  graphData.links.forEach(l => {
    const sn = graphData.nodes.find(n => n.name === l.source)
    const tn = graphData.nodes.find(n => n.name === l.target)
    const active = sn?.category === cat || tn?.category === cat
    l.lineStyle = active ? { opacity: 0.7, width: 2.5 } : { opacity: 0.02, width: 0.3 }
  })
  chart?.setOption({ series: [{ data: graphData.nodes, links: graphData.links }] })
}
</script>
