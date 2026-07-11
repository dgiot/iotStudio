<template>
  <div class="scada-editor">
    <!-- 顶栏 -->
    <div class="topbar">
      <div class="tb-left">
        <h2>⚡ 2D 组态</h2>
        <el-tag :type="isEdit ? 'warning' : 'success'" size="small" effect="dark">
          {{ isEdit ? '编辑模式' : '运行模式' }}
        </el-tag>
      </div>
      <div class="tb-right">
        <el-button size="small" @click="goTopo">🔗 拓扑</el-button>
        <el-button-group size="small">
          <el-button :type="isEdit ? 'warning' : 'primary'" @click="toggleMode">
            {{ isEdit ? '🔧 编辑中' : '👁 运行中' }}
          </el-button>
        </el-button-group>
        <el-button size="small" @click="clearCanvas" :disabled="!isEdit">清空画布</el-button>
        <el-button size="small" @click="saveCanvas">💾 保存</el-button>
        <el-button size="small" @click="loadCanvas">📂 加载</el-button>
        <el-button size="small" @click="exportJSON">📋 导出JSON</el-button>
        <span class="online-info">
          在线: <b>{{ stats.online }}</b> &nbsp; 采集: <b>{{ stats.collects }}</b>
        </span>
      </div>
    </div>

    <div class="main-area">
      <!-- 左侧图元库（编辑模式可见） -->
      <div class="sidebar" v-show="isEdit">
        <div class="sidebar-title">📦 电力图元</div>
        <div class="palette-group" v-for="g in paletteGroups" :key="g.name">
          <div class="group-label">{{ g.name }}</div>
          <div class="palette-items">
            <div
              v-for="item in g.items"
              :key="item.key"
              class="palette-item"
              draggable="true"
              @dragstart="onDragStart($event, item)"
            >
              <span class="pi-icon">{{ item.icon }}</span>
              <span class="pi-label">{{ item.label }}</span>
            </div>
          </div>
        </div>
        <!-- 文本/线 -->
        <div class="palette-group">
          <div class="group-label">基础工具</div>
          <div class="palette-items">
            <div class="palette-item" @click="addText">
              <span class="pi-icon">📝</span><span class="pi-label">文本</span>
            </div>
            <div class="palette-item" @click="addLine">
              <span class="pi-icon">📏</span><span class="pi-label">连线</span>
            </div>
            <div class="palette-item" @click="addRect">
              <span class="pi-icon">⬜</span><span class="pi-label">矩形</span>
            </div>
            <div class="palette-item" @click="addCircle">
              <span class="pi-icon">⭕</span><span class="pi-label">圆形</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 画布区 -->
      <div class="canvas-container" ref="canvasContainer">
        <canvas ref="canvas" id="scada-fabric-canvas"></canvas>
      </div>

      <!-- 右侧属性面板（编辑模式选中对象时可见） -->
      <div class="props-panel" v-show="isEdit && selectedObj">
        <div class="sidebar-title">🔧 属性</div>
        <div class="prop-row" v-if="selectedObj">
          <label>X</label><el-input-number v-model="selX" size="small" :step="10" @change="updateProp" controls-position="right" />
        </div>
        <div class="prop-row">
          <label>Y</label><el-input-number v-model="selY" size="small" :step="10" @change="updateProp" controls-position="right" />
        </div>
        <div class="prop-row">
          <label>W</label><el-input-number v-model="selW" size="small" :step="10" @change="updateProp" controls-position="right" :min="20" />
        </div>
        <div class="prop-row">
          <label>H</label><el-input-number v-model="selH" size="small" :step="10" @change="updateProp" controls-position="right" :min="20" />
        </div>
        <div class="prop-row">
          <label>颜色</label><el-color-picker v-model="selColor" size="small" @change="updateProp" />
        </div>
        <div class="prop-row" v-if="selectedObj?.text !== undefined">
          <label>文字</label><el-input v-model="selText" size="small" @change="updateProp" />
        </div>

        <!-- 数据绑定 -->
        <el-divider style="margin:8px 0">📡 数据绑定</el-divider>
        <div class="prop-row">
          <label>设备</label>
          <el-select v-model="bindDeviceId" size="small" placeholder="选择设备" style="width:120px" clearable @change="onBindDeviceChange">
            <el-option v-for="d in deviceList" :key="d.device_id" :label="d.device_name" :value="d.device_id" />
          </el-select>
        </div>
        <div class="prop-row" v-if="bindDeviceId">
          <label>测点</label>
          <el-select v-model="bindPointId" size="small" placeholder="选择测点" style="width:120px" clearable @change="onBindPointChange">
            <el-option v-for="p in pointList" :key="p.point_id" :label="`${p.point_name} (${p.unit||''})`" :value="p.point_id" />
          </el-select>
        </div>
        <div class="prop-row" v-if="selectedObj?.dataBind">
          <label>已绑定</label><span style="font-size:11px;color:#66d9ff">{{ selectedObj.dataBind }}</span>
          <el-button link size="small" type="danger" @click="clearBind">✕</el-button>
        </div>

        <el-divider style="margin:8px 0" />
        <el-button size="small" type="danger" @click="deleteSelected" style="width:100%">🗑 删除</el-button>
        <el-button size="small" @click="duplicateSelected" style="width:100%;margin-top:4px">📋 复制</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import api from '../api'
import { Canvas as FabricCanvas, Rect as FabricRect, Text as FabricText, Line as FabricLine, Triangle as FabricTriangle, Group as FabricGroup, Ellipse as FabricEllipse } from 'fabric'

const router = useRouter()
const route = useRoute()

// ===== 状态 =====
const canvas = ref(null)
const canvasContainer = ref(null)
const isEdit = ref(true)
const stats = ref({ online: 0, collects: 0 })
const selectedObj = ref(null)
const selX = ref(0), selY = ref(0), selW = ref(100), selH = ref(80), selColor = ref('#0d47a1'), selText = ref(''), selDataBind = ref('')
const bindDeviceId = ref(''), bindPointId = ref('')
const deviceList = ref([]), pointList = ref([])
let fc = null, ws = null

// ===== 图元库 =====
const paletteGroups = [
  { name: '光伏', items: [
    { key: 'pv_array', icon: '☀️', label: '光伏阵列', color: '#2e7d32', w: 120, h: 80 },
    { key: 'inverter', icon: '⚙️', label: '逆变器', color: '#0d47a1', w: 100, h: 70 },
    { key: 'combiner', icon: '🔀', label: '汇流箱', color: '#37474f', w: 80, h: 60 },
  ]},
  { name: '储能', items: [
    { key: 'battery', icon: '🔋', label: '电池堆', color: '#1565c0', w: 120, h: 90 },
    { key: 'pcs', icon: '⚡', label: 'PCS变流器', color: '#0d47a1', w: 100, h: 70 },
    { key: 'bms', icon: '📊', label: 'BMS', color: '#37474f', w: 80, h: 60 },
  ]},
  { name: '充电', items: [
    { key: 'dc_charger', icon: '🔌', label: '直流快充桩', color: '#5c3d8f', w: 80, h: 90 },
    { key: 'ac_charger', icon: '🔌', label: '交流充电桩', color: '#00695c', w: 70, h: 80 },
  ]},
  { name: '配电', items: [
    { key: 'transformer', icon: '🔄', label: '变压器', color: '#4e342e', w: 90, h: 70 },
    { key: 'grid', icon: '🏭', label: '电网接口', color: '#1a237e', w: 100, h: 70 },
    { key: 'load', icon: '🏠', label: '本地负荷', color: '#1a237e', w: 90, h: 60 },
    { key: 'meter', icon: '📟', label: '电表', color: '#bf360c', w: 70, h: 80 },
  ]},
]

// ===== Fabric 初始化 =====
async function initFabric() {
  const c = canvas.value
  fc = new FabricCanvas(c, {
    width: canvasContainer.value.clientWidth,
    height: canvasContainer.value.clientHeight - 4,
    backgroundColor: '#0c1c30',
    selection: true,
    preserveObjectStacking: true,
  })

  // 网格背景
  drawGrid()

  // 选择事件
  fc.on('selection:created', onSelect)
  fc.on('selection:updated', onSelect)
  fc.on('selection:cleared', () => { selectedObj.value = null })

  // 对象修改事件
  fc.on('object:modified', (e) => {
    if (e.target && selectedObj.value) syncPropsFromObj(e.target)
  })

  // 右键菜单
  canvasContainer.value.addEventListener('contextmenu', onContextMenu)

  // 双击编辑文本
  fc.on('mouse:dblclick', (e) => {
    if (!isEdit.value) return
    const obj = e.target
    if (obj?.text !== undefined) {
      const newText = prompt('编辑文字:', obj.text)
      if (newText !== null) { obj.set('text', newText); fc.renderAll(); syncPropsFromObj(obj) }
    }
  })

  // 删除键
  window.addEventListener('keydown', onKeyDown)

  // 拖放接收
  const el = canvasContainer.value
  el.addEventListener('dragover', (e) => e.preventDefault())
  el.addEventListener('drop', onDrop)

  window.addEventListener('resize', onResize)

  // 加载已保存画布
  loadSavedCanvas()
}

function drawGrid() {
  if (!fc) return
  const w = fc.width, h = fc.height, grid = 40
  for (let x = 0; x < w; x += grid) {
    fc.add(new FabricLine([x, 0, x, h], { stroke: '#1a3050', selectable: false, evented: false, excludeFromExport: true }))
  }
  for (let y = 0; y < h; y += grid) {
    fc.add(new FabricLine([0, y, w, y], { stroke: '#1a3050', selectable: false, evented: false, excludeFromExport: true }))
  }
}

// ===== 拖放/添加图元 =====
function onDragStart(e, item) {
  e.dataTransfer.setData('application/json', JSON.stringify(item))
  e.dataTransfer.effectAllowed = 'copy'
}

function onDrop(e) {
  e.preventDefault()
  if (!isEdit.value) return
  const rect = canvasContainer.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  try {
    const item = JSON.parse(e.dataTransfer.getData('application/json'))
    addComponent(item, x - item.w / 2, y - item.h / 2)
  } catch {}
}

function addComponent(item, x, y) {
  if (!fc) return
  const group = new FabricGroup([
    new FabricRect({ width: item.w, height: item.h, fill: item.color, rx: 6, ry: 6, opacity: 0.75 }),
    new FabricText(item.icon || '', { fontSize: 28, originX: 'center', originY: 'center', top: -6 }),
    new FabricText(item.label, { fontSize: 13, fontFamily: 'Microsoft YaHei', fontWeight: 'bold', fill: '#ffffff', originX: 'center', top: item.h / 2 - 17 }),
  ], {
    left: x, top: y,
    subTargetCheck: true,
    customType: 'component',
    componentKey: item.key,
    dataBind: null,
  })
  fc.add(group)
  fc.setActiveObject(group)
  fc.renderAll()
}

function addText() {
  if (!fc) return
  const t = new FabricText('双击编辑', {
    left: 200, top: 200, fontSize: 18, fontFamily: 'Microsoft YaHei', fontWeight: 'bold',
    fill: '#e8f0f8', customType: 'text', dataBind: null,
  })
  fc.add(t); fc.setActiveObject(t); fc.renderAll()
}

function addLine() {
  if (!fc) return
  const l = new FabricLine([100, 200, 300, 200], {
    stroke: '#66d9ff', strokeWidth: 3, customType: 'line',
  })
  // 加箭头
  const arrow = new FabricTriangle({
    width: 12, height: 12, fill: '#66d9ff', left: 294, top: 194,
    angle: 90, selectable: false, evented: false,
  })
  const g = new FabricGroup([l, arrow], { left: 100, top: 200, customType: 'connector' })
  fc.add(g); fc.setActiveObject(g); fc.renderAll()
}

function addRect() {
  if (!fc) return
  const r = new FabricRect({
    width: 120, height: 80, fill: 'rgba(79,195,247,0.3)', stroke: '#66d9ff',
    strokeWidth: 2, rx: 4, ry: 4, left: 200, top: 200, customType: 'rect',
  })
  fc.add(r); fc.setActiveObject(r); fc.renderAll()
}

function addCircle() {
  if (!fc) return
  const c = new FabricEllipse({
    rx: 40, ry: 40, fill: 'rgba(255,193,7,0.3)', stroke: '#ffd54f',
    strokeWidth: 2, left: 200, top: 200, customType: 'circle',
  })
  fc.add(c); fc.setActiveObject(c); fc.renderAll()
}

// ===== 选中/属性面板 =====
function onSelect(e) {
  const obj = e.selected?.[0] || null
  selectedObj.value = obj
  if (obj) syncPropsFromObj(obj)
}

function syncPropsFromObj(obj) {
  selX.value = Math.round(obj.left || 0)
  selY.value = Math.round(obj.top || 0)
  selW.value = Math.round((obj.width || obj.getScaledWidth?.() || 100))
  selH.value = Math.round((obj.height || obj.getScaledHeight?.() || 80))
  selColor.value = obj.fill || obj.stroke || '#66d9ff'
  selText.value = obj.text || ''
  const bind = obj.dataBind || ''
  selDataBind.value = bind
  if (bind && bind.includes('.')) {
    const [did, pid] = bind.split('.')
    bindDeviceId.value = did
    bindPointId.value = pid
    onBindDeviceChange(did)
  } else {
    bindDeviceId.value = ''
    bindPointId.value = ''
  }
}

function updateProp() {
  if (!fc || !selectedObj.value) return
  const obj = selectedObj.value
  obj.set({ left: selX.value, top: selY.value })
  if (obj.width !== undefined) obj.set({ width: selW.value })
  if (obj.height !== undefined) obj.set({ height: selH.value })
  if (obj.fill) obj.set('fill', selColor.value)
  else if (obj.stroke && obj.customType === 'connector') obj.set('stroke', selColor.value)
  if (obj.text !== undefined) obj.set('text', selText.value)
  obj.dataBind = selDataBind.value || null
  fc.renderAll()
}

function deleteSelected() {
  if (!fc) return
  const obj = fc.getActiveObject()
  if (obj) {
    fc.remove(obj)
    fc.discardActiveObject()
  } else if (selectedObj.value) {
    fc.remove(selectedObj.value)
  }
  selectedObj.value = null
  fc.renderAll()
}

// 右键菜单
function onContextMenu(e) {
  if (!isEdit.value || !fc) return
  e.preventDefault()
  const pointer = fc.getPointer(e)
  const obj = fc.findTarget(e, false)
  if (obj) {
    fc.setActiveObject(obj)
    fc.renderAll()
    // 小弹窗：删除
    const menu = document.createElement('div')
    menu.style.cssText = 'position:fixed;z-index:9999;background:#162844;border:1px solid #234060;border-radius:6px;padding:4px;min-width:100px'
    menu.style.left = e.clientX + 'px'; menu.style.top = e.clientY + 'px'
    menu.innerHTML = '<div style="padding:6px 12px;color:#ef5350;cursor:pointer;font-size:13px" id="ctx-del">🗑 删除图元</div>'
    document.body.appendChild(menu)
    const close = () => { menu.remove(); document.removeEventListener('click', close) }
    setTimeout(() => document.addEventListener('click', close), 100)
    document.getElementById('ctx-del').onclick = () => { deleteSelected(); close() }
  }
}

function duplicateSelected() {
  if (!fc || !selectedObj.value) return
  const obj = selectedObj.value
  obj.clone().then(cloned => {
    cloned.set({ left: cloned.left + 30, top: cloned.top + 30 })
    fc.add(cloned); fc.setActiveObject(cloned); fc.renderAll()
  })
}

// ===== 设备/测点绑定 =====
async function loadDeviceList() {
  try {
    const r = await api.get('/devices')
    deviceList.value = r.data.devices || []
  } catch {}
}

async function onBindDeviceChange(deviceId) {
  bindPointId.value = ''
  if (!deviceId) { pointList.value = []; return }
  try {
    const r = await api.get(`/devices/${deviceId}/points`)
    pointList.value = r.data.points || []
  } catch {}
}

function onBindPointChange(pointId) {
  if (!pointId || !bindDeviceId.value || !selectedObj.value) return
  const bind = `${bindDeviceId.value}.${pointId}`
  const obj = selectedObj.value
  obj.dataBind = bind
  selDataBind.value = bind
  // 如果有子文本对象，也标记绑定
  if (obj._objects) {
    const txtChild = obj._objects.find(c => c.text !== undefined && c.fontSize >= 10)
    if (txtChild) txtChild.dataBind = bind
  }
  fc.renderAll()
  ElMessage.success(`已绑定: ${bind}`)
}

function clearBind() {
  if (!selectedObj.value) return
  selectedObj.value.dataBind = null
  if (selectedObj.value._objects) {
    selectedObj.value._objects.forEach(c => { if (c.dataBind) c.dataBind = null })
  }
  bindDeviceId.value = ''; bindPointId.value = ''
  selDataBind.value = ''
  fc.renderAll()
}

function onKeyDown(e) {
  if (!isEdit.value) return
  if (e.key === 'Delete' || e.key === 'Backspace') {
    if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return
    if (fc.getActiveObject()) deleteSelected()
  }
}

// ===== 模式切换 =====
function goTopo() {
  const d = route.query.device || ''
  router.push(`/topology${d ? `?device=${d}` : ''}`)
}

function toggleMode() {
  isEdit.value = !isEdit.value
  if (!fc) return
  fc.selection = isEdit.value
  fc.getObjects().forEach(obj => {
    obj.selectable = isEdit.value
    obj.evented = isEdit.value
  })
  fc.discardActiveObject()
  fc.renderAll()
  selectedObj.value = null
  if (!isEdit.value) startDataBinding()
}

// ===== WebSocket 数据绑定 =====
function startDataBinding() {
  if (ws?.readyState === WebSocket.OPEN) return
  const proto = location.protocol === 'https:' ? 'wss' : 'ws'
  ws = new WebSocket(`${proto}://${location.host}/ws`)
  ws.onopen = () => console.log('[SCADA] WebSocket connected')
  ws.onmessage = ev => {
    const msg = JSON.parse(ev.data)
    if (msg.type === 'telemetry') {
      stats.value.collects++
      updateDataBindings(msg.device_id, msg.data)
    }
  }
  ws.onclose = () => { if (!isEdit.value) setTimeout(startDataBinding, 3000) }
}

function updateDataBindings(deviceId, points) {
  if (!fc || isEdit.value) return
  const pointMap = {}
  points.forEach(p => { pointMap[p.point_id] = p })

  fc.getObjects().forEach(obj => {
    // 检查对象自身的绑定
    checkAndUpdate(obj, deviceId, pointMap)
    // 检查组内子对象
    if (obj._objects) {
      obj._objects.forEach(child => checkAndUpdate(child, deviceId, pointMap))
    }
  })
  fc.renderAll()
}

function checkAndUpdate(obj, deviceId, pointMap) {
  const bind = obj.dataBind
  if (!bind || !bind.includes('.')) return
  const [did, pid] = bind.split('.')
  if (did !== deviceId || !pointMap[pid]) return
  const point = pointMap[pid]
  const val = point.value?.toFixed?.(1) ?? point.value ?? '--'
  const txt = obj.text !== undefined ? `${val} ${point.unit || ''}` : null
  if (txt && obj.fontSize >= 10) {
    obj.set('text', txt)
  }
}

// ===== 保存/加载 =====
function saveCanvas() {
  if (!fc) return
  const json = fc.toJSON(['customType', 'componentKey', 'dataBind'])
  localStorage.setItem('scada_canvas', JSON.stringify(json))
  ElMessage.success('画布已保存')
}

function loadCanvas() {
  if (!fc) return
  loadSavedCanvas()
  ElMessage.success('画布已加载')
}

function loadSavedCanvas() {
  const saved = localStorage.getItem('scada_canvas')
  if (!saved || !fc) return
  try {
    fc.loadFromJSON(JSON.parse(saved)).then(() => {
      fc.renderAll()
      if (!isEdit.value) {
        fc.selection = false
        fc.getObjects().forEach(obj => { obj.selectable = false; obj.evented = false })
      }
    })
  } catch (e) {
    console.warn('加载画布失败', e)
  }
}

function clearCanvas() {
  if (!fc) return
  fc.clear()
  drawGrid()
  fc.renderAll()
  ElMessage.success('画布已清空')
}

function exportJSON() {
  if (!fc) return
  const json = fc.toJSON(['customType', 'componentKey', 'dataBind'])
  const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = 'scada-canvas.json'; a.click()
  URL.revokeObjectURL(url)
}

function onResize() {
  if (!fc || !canvasContainer.value) return
  fc.setWidth(canvasContainer.value.clientWidth)
  fc.setHeight(canvasContainer.value.clientHeight - 4)
  fc.renderAll()
}

// ===== 生命周期 =====
onMounted(async () => {
  await nextTick()
  await initFabric()
  loadDeviceList()
  // 默认加载示例
  if (!localStorage.getItem('scada_canvas')) loadDefaultDemo()
  // 统计轮询
  const statsTimer = setInterval(async () => {
    try {
      const r = await api.get('/stats')
      stats.value.online = r.data.online_devices || 0
      stats.value.collects = r.data.total_collects || stats.value.collects
    } catch {}
  }, 5000)
  onUnmounted(() => clearInterval(statsTimer))
})

onUnmounted(() => {
  ws?.close()
  window.removeEventListener('resize', onResize)
  window.removeEventListener('keydown', onKeyDown)
  if (canvasContainer.value) {
    canvasContainer.value.removeEventListener('dragover', () => {})
    canvasContainer.value.removeEventListener('drop', onDrop)
  }
  fc?.dispose()
})

function loadDefaultDemo() {
  if (!fc) return
  // 光伏阵列
  addComponent(paletteGroups[0].items[0], 60, 80)
  // 逆变器
  addComponent(paletteGroups[0].items[1], 280, 90)
  // 电池堆
  addComponent(paletteGroups[1].items[0], 60, 240)
  // PCS
  addComponent(paletteGroups[1].items[1], 280, 250)
  // 变压器
  addComponent(paletteGroups[3].items[0], 500, 170)
  // 电网
  addComponent(paletteGroups[3].items[1], 700, 80)
  // 负荷
  addComponent(paletteGroups[3].items[2], 700, 250)
  // 充电桩
  addComponent(paletteGroups[2].items[0], 500, 320)
  // 连接线
  const lines = [
    [180, 120, 280, 125],
    [180, 285, 280, 285],
    [380, 125, 500, 205],
    [380, 285, 500, 205],
    [590, 205, 700, 115],
    [590, 205, 700, 280],
    [550, 355, 550, 355],
  ]
  lines.forEach(([x1, y1, x2, y2]) => {
    if (x1 === x2 && y1 === y2) return
    const l = new FabricLine([x1, y1, x2, y2], { stroke: '#ffc107', strokeWidth: 3, selectable: false, evented: false })
    fc.add(l)
  })
  fc.renderAll()
  saveCanvas()
}
</script>

<style scoped>
.scada-editor { display: flex; flex-direction: column; height: calc(100vh - 70px); }

.topbar { display: flex; justify-content: space-between; align-items: center; padding: 6px 0 8px; flex-shrink: 0; }
.tb-left { display: flex; align-items: center; gap: 12px; }
.tb-left h2 { color: #c0d5e8; font-size: 16px; margin: 0; }
.tb-right { display: flex; align-items: center; gap: 8px; }
.online-info { color: #c0d5e8; font-size: 13px; margin-left: 8px; }
.online-info b { color: #66d9ff; }

.main-area { display: flex; flex: 1; gap: 8px; min-height: 0; }

/* 图元库 */
.sidebar { width: 170px; flex-shrink: 0; background: #162844; border: 1px solid #234060; border-radius: 8px; overflow-y: auto; padding: 8px; }
.sidebar-title { color: #66d9ff; font-size: 13px; font-weight: bold; padding: 4px 0 8px; }
.group-label { color: #c0d5e8; font-size: 11px; margin: 8px 0 4px; padding-left: 4px; }
.palette-items { display: flex; flex-wrap: wrap; gap: 4px; }
.palette-item { display: flex; flex-direction: column; align-items: center; padding: 6px 4px; background: #1a3050; border: 1px solid #234060; border-radius: 6px; cursor: grab; width: 72px; transition: all 0.15s; }
.palette-item:hover { border-color: #66d9ff; background: #234060; }
.palette-item:active { cursor: grabbing; }
.pi-icon { font-size: 22px; }
.pi-label { font-size: 10px; color: #d0dce8; margin-top: 2px; text-align: center; }

/* 画布 */
.canvas-container { flex: 1; background: #0c1c30; border: 1px solid #234060; border-radius: 8px; overflow: hidden; position: relative; }
#scada-fabric-canvas { display: block; }

/* 属性面板 */
.props-panel { width: 180px; flex-shrink: 0; background: #162844; border: 1px solid #234060; border-radius: 8px; overflow-y: auto; padding: 8px; }
.prop-row { display: flex; align-items: center; gap: 4px; margin-bottom: 6px; }
.prop-row label { width: 30px; font-size: 11px; color: #c0d5e8; flex-shrink: 0; }
.prop-row :deep(.el-input-number) { width: 110px; }
.prop-row :deep(.el-input) { width: 110px; }
.prop-row :deep(.el-input__inner) { background: #1a3050; border-color: #234060; color: #e8f0f8; }
.prop-row :deep(.el-select .el-input__inner) { background: #1a3050; border-color: #234060; color: #e8f0f8; }
.props-panel :deep(.el-divider__text) { background: #162844; color: #c0d5e8; }
</style>
