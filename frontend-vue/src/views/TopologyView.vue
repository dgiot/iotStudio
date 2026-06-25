<template>
  <div class="topo-page">
    <h3 style="color:#c0d5e8;margin-bottom:12px">🔗 设备拓扑</h3>
    <div class="topo-canvas" ref="canvasWrap">
      <canvas ref="canvas" id="topoCanvas"></canvas>
    </div>
    <!-- 图例 -->
    <div class="legend">
      <span v-for="l in legend" :key="l.color" class="leg-item">
        <i :style="{background:l.color}"></i>{{ l.label }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import axios from 'axios'

const canvas = ref(null)
const canvasWrap = ref(null)
const legend = [
  { color:'#4fc3f7', label:'Modbus TCP' },
  { color:'#ffc107', label:'IEC 104' },
  { color:'#ab47bc', label:'OPC UA' },
  { color:'#66bb6a', label:'OPC DA' },
  { color:'#ef5350', label:'告警' },
]

let nodes = []
let animId = null
let devices = []

// 拓扑布局
const layout = {
  center: { x: 0.5, y: 0.35 },  // 平台中心
  simulators: [
    { x: 0.15, y: 0.15, label: 'Modbus TCP\n逆变器', port: 502, protocol: 'modbus_tcp', color: '#4fc3f7' },
    { x: 0.15, y: 0.35, label: 'Modbus TCP\n储能PCS', port: 1502, protocol: 'modbus_tcp', color: '#4fc3f7' },
    { x: 0.15, y: 0.55, label: 'Modbus TCP\n充电桩', port: 2502, protocol: 'modbus_tcp', color: '#4fc3f7' },
    { x: 0.15, y: 0.75, label: 'Modbus TCP\n电表', port: 503, protocol: 'modbus_tcp', color: '#4fc3f7' },
    { x: 0.85, y: 0.25, label: 'IEC 104\n储能PCS', port: 2404, protocol: 'iec104', color: '#ffc107' },
    { x: 0.85, y: 0.50, label: 'OPC UA\n充电桩', port: 4840, protocol: 'opcua', color: '#ab47bc' },
    { x: 0.85, y: 0.75, label: 'OPC DA\n数据源', port: 9090, protocol: 'opcda', color: '#66bb6a' },
  ],
  devices: [
    { x: 0.25, y: 0.18, label: 'inv_01' },
    { x: 0.25, y: 0.38, label: 'pcs_01' },
    { x: 0.25, y: 0.58, label: 'charger_01' },
    { x: 0.25, y: 0.78, label: 'meter_rtu_01' },
    { x: 0.72, y: 0.28, label: 'pcs_iec104' },
    { x: 0.72, y: 0.53, label: 'charger_opcua' },
  ]
}

function draw() {
  if (!canvas.value) return
  const w = canvas.value.width, h = canvas.value.height
  const ctx = canvas.value.getContext('2d')
  ctx.clearRect(0, 0, w, h)

  // 背景网格
  ctx.strokeStyle = '#122540'; ctx.lineWidth = 0.5
  for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
  for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }

  const cx = layout.center.x * w, cy = layout.center.y * h

  // 平台中心
  ctx.fillStyle = '#0d47a1'; ctx.beginPath(); ctx.arc(cx, cy, 50, 0, Math.PI * 2); ctx.fill()
  ctx.strokeStyle = '#4fc3f7'; ctx.lineWidth = 3; ctx.stroke()
  ctx.fillStyle = '#fff'; ctx.font = 'bold 14px "Microsoft YaHei"'; ctx.textAlign = 'center'
  ctx.fillText('dgiot_lite', cx, cy - 6)
  ctx.font = '11px "Microsoft YaHei"'; ctx.fillStyle = '#8899aa'
  ctx.fillText('物联网平台', cx, cy + 14)

  // 设备节点
  layout.devices.forEach((d, i) => {
    const dx = d.x * w, dy = d.y * h
    const dev = devices.find(dv => dv.device_id === d.label)
    const online = dev?.status === 'online'
    ctx.fillStyle = online ? '#1a4a6e' : '#1a3a5c'
    ctx.beginPath(); ctx.roundRect(dx - 50, dy - 16, 100, 32, 8); ctx.fill()
    ctx.strokeStyle = online ? '#4fc3f7' : '#1a3a5c'; ctx.lineWidth = 2; ctx.stroke()
    ctx.fillStyle = online ? '#4fc3f7' : '#8899aa'; ctx.font = '12px "Microsoft YaHei"'
    ctx.fillText(d.label, dx, dy + 5)
    // 连线到平台
    ctx.strokeStyle = online ? 'rgba(79,195,247,0.3)' : 'rgba(26,58,92,0.3)'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(dx, dy - 16); ctx.lineTo(cx, cy - 40); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(dx, dy + 16); ctx.lineTo(cx, cy + 40); ctx.stroke()
  })

  // 模拟器节点
  layout.simulators.forEach(s => {
    const sx = s.x * w, sy = s.y * h
    ctx.fillStyle = s.color + '30'; ctx.beginPath()
    ctx.roundRect(sx - 70, sy - 22, 140, 44, 10); ctx.fill()
    ctx.strokeStyle = s.color; ctx.lineWidth = 2; ctx.stroke()
    // 多行文字
    const lines = s.label.split('\n')
    ctx.fillStyle = '#c0d5e8'; ctx.font = 'bold 11px "Microsoft YaHei"'
    ctx.fillText(`:${s.port}`, sx, sy - 3)
    ctx.fillStyle = s.color; ctx.font = '10px "Microsoft YaHei"'
    ctx.fillText(lines[0], sx, sy - 16)
    ctx.fillStyle = '#8899aa'; ctx.fillText(lines[1] || '', sx, sy + 12)
  })

  animId = requestAnimationFrame(draw)
}

function resize() {
  if (canvas.value && canvasWrap.value) {
    canvas.value.width = canvasWrap.value.clientWidth
    canvas.value.height = canvasWrap.value.clientHeight
  }
}

onMounted(async () => {
  try {
    const r = await axios.get('/api/devices')
    devices = r.data.devices || []
  } catch {}
  await nextTick(); resize(); window.addEventListener('resize', resize); draw()
})

onUnmounted(() => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) })
</script>

<style scoped>
.topo-page { display: flex; flex-direction: column; height: 100%; color: #c0d5e8; }
.topo-canvas { flex: 1; background: #0a1628; border-radius: 8px; border: 1px solid #1a3a5c; overflow: hidden; }
#topoCanvas { display: block; }
.legend { display: flex; gap: 20px; padding: 8px 12px; flex-shrink: 0; }
.leg-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #8899aa; }
.leg-item i { width: 12px; height: 12px; border-radius: 3px; display: inline-block; }
</style>
