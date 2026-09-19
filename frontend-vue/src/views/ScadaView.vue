<template>
  <div class="scada-editor">
    <!-- 顶栏 -->
    <div class="topbar">
      <div class="tb-left">
        <h2>⚡ 2D 组态</h2>
        <el-tag :type="isEdit ? 'warning' : 'success'" size="small" effect="dark">
          {{ isEdit ? '编辑模式' : '运行模式' }}
        </el-tag>
        <!-- 当前画布是后端哪一个视图 —— 原来存 localStorage 时没这问题（就一份），
             现在可以有多份，不说清楚就不知道自己在改谁 -->
        <el-tag :type="viewId ? 'info' : 'warning'" size="small" effect="plain">
          {{ viewId ? viewName : '未保存' }}
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
import { getDefaultView, createView, updateView } from '../api/admin'
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
// 当前画布对应的后端视图 —— 存的是 view_api 的 View 对象，不再是 localStorage。
// viewId 为空 = 这份画布还没落过后端，第一次保存时才建。
const viewId = ref(''), viewName = ref(''), viewVersion = ref(null)
// 站点标识：默认视图按 (site, type) 分组，组态页认的是「本站那份」。
// 没带 ?site= 就是「不绑站点」的全局组态 —— 空串在接口里是个有效值，不是缺省。
const siteKey = String(route.query.site || '')
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

  // 加载画布（服务端默认视图 → 本机旧画布 → 内置示例）
  await loadCanvasFromServer()
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
  // 网格要压在元件**下面**。initFabric 里先画网格再放元件，顺序天然是对的；
  // 但 loadFromJSON 内部会 clear() 掉整个画布（fabric v6+ 的行为），
  // 加载完再补画的网格就成了「后加的」= 盖在元件上。所以补画之后显式置底，
  // 判据用 excludeFromExport —— 那正是网格自己的标记。
  fc.getObjects().filter(o => o.excludeFromExport).forEach(o => fc.sendObjectToBack(o))
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
// 原先存 localStorage['scada_canvas'] —— 只活在**那一台浏览器**里：换机器没了、
// 清缓存没了、别人看不到，两个站点还会互相覆盖同一把键。现在存 view_api，
// 画布成为后端正式对象：可命名、可多份、可设默认（「视图管理」页里管）。
//
// 并发：保存带上 version 做乐观锁。组态画布是整块 JSON，两个人同时拖元件时
// 后保存的那个会把前一个整块盖掉且毫无提示 —— 现在后端拒 409，这里如实说，
// 绝不无条件弹「已保存」。
const LEGACY_KEY = 'scada_canvas'
const defaultViewName = siteKey ? `${siteKey} 组态` : '默认组态'
// 本机旧画布被载入过 —— 它进了服务端之后才敢删本地那份，否则一关页面就没了
let legacyLoaded = false

function canvasJSON() {
  // 必须用 toObject 而不是 toJSON —— fabric v6 起 toJSON() 的定义是
  // `toJSON() { return this.toObject() }`，**一个参数都不接**。原先写的
  // `toJSON(['customType', ...])` 在 v5 是转发给 toObject 的，升到 v7 后
  // 这个数组被静默丢掉，于是 customType / componentKey / dataBind 从来没进过
  // 存档：画布存下来看着一样，但图元是哪一种、绑了哪个测点全丢了，
  // 重新加载后数据绑定的实时刷新自然也就没了。
  return fc.toObject(['customType', 'componentKey', 'dataBind'])
}

function applyCanvas(data) {
  return fc.loadFromJSON(data).then(() => {
    // loadFromJSON 会 clear() 整个画布 —— 连同 initFabric 里画的网格一起没了。
    // 元件就位后补回来（drawGrid 自己会置底，不会盖住元件）。
    drawGrid()
    fc.renderAll()
    if (!isEdit.value) {
      fc.selection = false
      fc.getObjects().forEach(obj => { obj.selectable = false; obj.evented = false })
    }
  })
}

/** 本机旧版 localStorage 画布 —— 只在服务端没有默认视图时才看它 */
function takeLegacyLocalCanvas() {
  const raw = localStorage.getItem(LEGACY_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

async function saveCanvas() {
  if (!fc) return false
  const canvas = canvasJSON()
  try {
    if (!viewId.value) {
      const name = viewName.value || defaultViewName
      const created = await createView({ name, type: 'scada', site: siteKey })
      viewId.value = created.objectId
      viewName.value = name
      viewVersion.value = 0          // create_view 建出来的版本号就是 0
    }
    const r = await updateView(viewId.value, {
      name: viewName.value, type: 'scada', site: siteKey,
      // 只数真会进存档的图元 —— getObjects() 把网格线也算上，
      // 一张 8 个元件的画布在列表里会显示「63 节点」（63 = 8 + 55 条网格线），
      // 跟实际存下来的 objects 数对不上。判据与 drawGrid/序列化同一把尺子。
      canvas, node_count: fc.getObjects().filter(o => !o.excludeFromExport).length,
      version: viewVersion.value,
    })
    // 后端回了新版本号，接着用它存下一次 —— 不接的话第二次保存必 409
    viewVersion.value = r?.version ?? (viewVersion.value ?? 0) + 1
    if (legacyLoaded) {              // 旧画布已安全落到服务端，本机副本可以撤了
      localStorage.removeItem(LEGACY_KEY)
      legacyLoaded = false
    }
    ElMessage.success(`画布已保存到服务端 · ${viewName.value}`)
    return true
  } catch (e) {
    const st = e?.response?.status
    if (st === 409) {
      ElMessage.error(e.response.data?.detail || '画布已被他人修改，请先「📂 加载」取回最新版')
    } else {
      ElMessage.error(`保存失败：${e?.response?.data?.detail || e?.message || e}`)
    }
    return false
  }
}

async function loadCanvas() {
  if (!fc) return
  const ok = await loadCanvasFromServer()
  if (ok) ElMessage.success(`已从服务端载入 · ${viewName.value || '视图'}`)
}

/**
 * 打开页面时取画布。三层回退，顺序不能换：
 *   ① 服务端 (site, scada) 的默认视图 —— 权威那份
 *   ② 本机旧版 localStorage —— 迁移用；**只载入不上传**，等用户按保存。
 *      自动上传的话，两台机器各有一份草稿时会互相抢「本站默认」，
 *      而两边的人都只当自己打开了个页面。
 *   ③ 内置示例画布 —— 全新部署的观感，不落库（免得每次只读访问都建一个视图）
 * 返回是否拿到了真画布（示例不算）。
 */
async function loadCanvasFromServer() {
  if (!fc) return false
  let data = null
  try {
    const r = await getDefaultView('scada', siteKey)
    data = r?.canvas || null
    if (r?.view?.objectId) {
      viewId.value = r.view.objectId
      viewName.value = r.view.name || ''
      viewVersion.value = r.view.version ?? 0
    }
  } catch (e) {
    ElMessage.error(`读取服务端画布失败：${e?.response?.data?.detail || e?.message || e}`)
    return false
  }

  if (!data) {
    const legacy = takeLegacyLocalCanvas()
    if (legacy) {
      data = legacy
      legacyLoaded = true
      ElMessage.info('本机存有旧版画布，已载入；点「💾 保存」即存入服务端')
    }
  }
  if (!data) {
    loadDefaultDemo()               // 示例画布：viewId 保持为空，标签显示「未保存」
    return false
  }
  try {
    await applyCanvas(data)
    return true
  } catch (e) {
    // 服务端那份不删不改 —— 坏数据停在这儿，别把库里的好数据一起带走
    console.warn('加载画布失败', e)
    ElMessage.error('画布数据无法解析，已停在空白页（服务端那份未改动）')
    return false
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
  const json = canvasJSON()   // 同上：toJSON 在 v6+ 不吃参数
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
  // 画布的加载已在 initFabric 末尾按其三层回退做完（服务端 → 本机旧版 → 示例），
  // 这里不要再补一次 loadDefaultDemo —— 会叠出第二套示例图元
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
  // 示例画布**不自动入库** —— 打开页面看一眼就凭空多出一个后端视图，
  // 是多站点下互相抢「本站默认」的经典起手式。要留就按「💾 保存」。
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
