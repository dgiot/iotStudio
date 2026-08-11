<template>
  <div class="topo-page">
    <div class="topo-toolbar">
      <h3 style="color:#e0e0e0;margin:0">采集链路拓扑</h3>
      <el-radio-group v-model="layout" size="small" @change="renderChart">
        <el-radio-button label="force">网状</el-radio-button>
        <el-radio-button label="tree">树状</el-radio-button>
      </el-radio-group>
    </div>
    <div class="topo-layout">
      <!-- 左侧导航树 -->
      <div class="topo-tree">
        <el-input v-model="treeFilter" size="small" placeholder="搜索..." clearable style="margin-bottom:8px" />
        <el-tree :data="treeData" :props="{label:'name',children:'children'}" node-key="name"
          :filter-node-method="filterNode" ref="treeRef" highlight-current
          @node-click="onTreeClick" default-expand-all
          style="background:transparent;color:#c0d5e8;font-size:12px" />
      </div>
      <!-- 中间拓扑图 -->
      <div class="topo-center" ref="chart"></div>
      <!-- 右侧详情 -->
      <div class="topo-detail" v-if="selected">
        <div class="td-header">
          <span :style="{color:protoColors[selected.protocol]||'#66d9ff',fontSize:16}">●</span>
          <span style="font-size:15px;font-weight:bold;color:#e0e0e0">{{ selected.name }}</span>
        </div>
        <el-descriptions :column="1" size="small" border>
          <el-descriptions-item label="类型">{{ selected.type||'设备' }}</el-descriptions-item>
          <el-descriptions-item label="协议">{{ selected.protocol||'—' }}</el-descriptions-item>
          <el-descriptions-item label="状态"><el-tag :type="selected.status==='online'?'success':'danger'" size="small">{{ selected.status||'—' }}</el-tag></el-descriptions-item>
          <el-descriptions-item label="ID">{{ selected.id||'—' }}</el-descriptions-item>
        </el-descriptions>
        <div style="margin-top:12px;font-size:13px;color:#8aa0b4">
          <div v-if="selected.children">子节点: {{ selected.children?.length||0 }} 个</div>
          <div v-if="selected.deviceCount">设备数: {{ selected.deviceCount }}</div>
          <div v-if="selected.desc">{{ selected.desc }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import * as echarts from 'echarts'
import api from '../api'

const chart = ref(null)
const treeRef = ref(null)
const layout = ref('force')
const treeFilter = ref('')
const selected = ref(null)
let chartInstance = null
const protoColors = { modbus_tcp:'#22c55e', opcda:'#8b5cf6', a11:'#06b6d4', iec104:'#eab308', mqtt:'#ec4899' }

// 油田组织树
const treeData = ref([
  { name:'大庆油田', type:'油田', children:[
    { name:'一厂', type:'采油厂', children:[
      { name:'作业区1-1', type:'作业区', children:[
        { name:'CY1C8K 南4联合站', type:'间站', id:'CY1C8K', protocol:'modbus_tcp', status:'online', desc:'191 RTU + 5 DCS + 54口井' },
        { name:'北9注水站', type:'间站', id:'Z9', protocol:'opcda', status:'online' },
      ]},
    ]},
    { name:'二厂', type:'采油厂', children:[
      { name:'第四作业区', type:'作业区', children:[
        { name:'南4联合站', type:'间站', id:'CY1C8K', protocol:'modbus_tcp', status:'online', desc:'191 RTU · 5 DCS · 54口井 · 4.7万点' },
        { name:'注水站1', type:'间站', id:'ZS1', protocol:'opcda', status:'online' },
        { name:'脱水站', type:'间站', id:'TS1', protocol:'opcda', status:'online' },
      ]},
      { name:'第五作业区', type:'作业区', children:[
        { name:'联合站A', type:'间站', id:'LHA', protocol:'modbus_tcp', status:'offline' },
      ]},
    ]},
    { name:'三厂', type:'采油厂', children:[
      { name:'第八作业区', type:'作业区', children:[
        { name:'北15联合站', type:'间站', id:'B15', protocol:'a11', status:'online' },
        { name:'萨北21站', type:'间站', id:'SB21', protocol:'modbus_tcp', status:'online' },
      ]},
    ]},
  ]},
])

function filterNode(value, data) { if (!value) return true; return data.name.includes(value) }
watch(treeFilter, v => treeRef.value?.filter(v))

function onTreeClick(node) {
  selected.value = { name:node.name, type:node.type, protocol:node.protocol, status:node.status, id:node.id, desc:node.desc, children:node.children, deviceCount:node.children?.length }
}

function renderChart() {
  if (!chart.value) return
  if (chartInstance) chartInstance.dispose()
  chartInstance = echarts.init(chart.value)

  const hub = { name:'边缘中枢', symbolSize:50, itemStyle:{color:'#3b82f6'}, value:'DMZ' }
  const nodes = [hub]
  const links = []

  function addNode(n, parent) {
    if (!n.children) return
    n.children.forEach(c => {
      const color = c.status==='offline'?'#ef4444':(c.type==='间站'?'#f59e0b':(c.type==='作业区'?'#22c55e':'#8b5cf6'))
      nodes.push({ name:c.name, symbolSize: c.type==='间站'?16:(c.type==='作业区'?30:24), itemStyle:{color}, value:c.type||'' })
      if (parent) links.push({ source:parent, target:c.name })
      addNode(c, c.name)
    })
  }
  treeData.value.forEach(t => {
    nodes.push({ name:t.name, symbolSize:40, itemStyle:{color:'#f59e0b'}, value:'油田' })
    links.push({ source:'边缘中枢', target:t.name })
    t.children?.forEach(p => {
      nodes.push({ name:p.name, symbolSize:28, itemStyle:{color:'#8b5cf6'}, value:'采油厂' })
      links.push({ source:t.name, target:p.name })
      addNode(p, p.name)
    })
  })

  chartInstance.setOption({
    tooltip: { formatter: p => p.dataType==='node'?`<b>${p.name}</b><br/>${p.value||''}`:'' },
    series: [{
      type: 'graph', layout: layout.value, roam: true, draggable: true,
      data: nodes, links,
      force: { repulsion: layout.value==='tree'?500:200, edgeLength: [60,200], gravity: 0.05 },
      label: { show: true, fontSize: 9, color: '#c0d5e8', formatter: p => p.name.length>8?p.name.slice(0,8)+'…':p.name },
      lineStyle: { color: '#1e3a5f', curveness: layout.value==='tree'?0:0.15, width: 1 },
      emphasis: { focus: 'adjacency', lineStyle: { width: 2 } },
    }]
  })
}

onMounted(async () => { await nextTick(); renderChart() })
</script>

<style scoped>
.topo-page { display:flex; flex-direction:column; height:calc(100vh - 100px); padding:12px 16px; background:#0d1a2a }
.topo-toolbar { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px }
.topo-layout { display:flex; gap:12px; flex:1; min-height:0 }
.topo-tree { width:240px; border:1px solid #1e3a5f; border-radius:6px; padding:8px; background:#0a1a2a; overflow-y:auto; flex-shrink:0 }
.topo-center { flex:1; border:1px solid #1e3a5f; border-radius:6px; background:#0a1a2a; min-height:400px }
.topo-detail { width:260px; border:1px solid #1e3a5f; border-radius:6px; padding:12px; background:#0d1f33; overflow-y:auto; flex-shrink:0 }
.td-header { display:flex; align-items:center; gap:8px; margin-bottom:10px }
:deep(.el-tree-node__content) { background:transparent !important; height:28px }
:deep(.el-tree-node__content:hover) { background:#152a40 !important }
:deep(.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content) { background:#1e3a5f !important }
</style>
