<template>
  <div class="topo-page">
    <div class="topo-hdr">
      <h3>🔗 设备拓扑</h3>
      <div class="topo-actions">
        <el-switch v-model="editMode" active-text="编辑" inactive-text="查看" size="small" />
        <!-- 当前布局挂在后端哪个视图上 —— 原来存 localStorage 只有一份，
             现在可以有多份，不说清楚就不知道自己在改谁 -->
        <el-tag :type="viewId ? 'info' : 'warning'" size="small" effect="plain">
          {{ viewId ? viewName : '默认布局' }}
        </el-tag>
        <span v-if="editMode" style="font-size:11px;color:#ffa726">拖拽节点移动位置</span>
        <el-button size="small" type="primary" @click="goScada" :disabled="!selected" style="margin-left:8px">🎮 组态</el-button>
        <span class="topo-legend">
          <span v-for="l in legend" :key="l.label" class="leg-item"><i :style="{background:l.color}"></i>{{ l.label }}</span>
        </span>
      </div>
    </div>

    <div class="list-detail">
      <!-- 左侧画布 -->
      <div class="canvas-panel" ref="wrap"
        @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp"
        @dblclick="onDblClick">
        <canvas ref="canvas" id="topoCanvas" />
      </div>

      <!-- 右侧信息面板 -->
      <div class="info-panel" v-if="selected">
        <div class="ip-header">
          <span class="ip-title">{{ editing? '✏️ 编辑' : '📋 详情' }}</span>
          <el-button size="small" @click="toggleEdit">{{ editing?'保存':'编辑' }}</el-button>
        </div>
        <template v-if="editing">
          <el-form label-width="60px" size="small">
            <el-form-item label="名称"><el-input v-model="selected.name" /></el-form-item>
            <el-form-item label="协议"><el-select v-model="selected.proto" style="width:100%"><el-option v-for="p in protocols" :key="p" :label="p" :value="p" /></el-select></el-form-item>
            <el-form-item label="IP"><el-input v-model="selected.ip" placeholder="127.0.0.1" /></el-form-item>
            <el-form-item label="端口"><el-input-number v-model="selected.port" :min="1" :max="65535" /></el-form-item>
            <el-form-item label="X"><el-input-number v-model="selected.x" :step="10" /></el-form-item>
            <el-form-item label="Y"><el-input-number v-model="selected.y" :step="10" /></el-form-item>
          </el-form>
        </template>
        <template v-else>
          <el-descriptions :column="1" size="small" border>
            <el-descriptions-item label="设备ID">{{ selected.device_id }}</el-descriptions-item>
            <el-descriptions-item label="名称">{{ selected.name }}</el-descriptions-item>
            <el-descriptions-item label="协议">{{ selected.proto }}</el-descriptions-item>
            <el-descriptions-item label="类型">{{ typeMap[selected.device_type]||selected.device_type }}</el-descriptions-item>
            <el-descriptions-item label="状态"><el-tag :type="selected.online?'success':'info'" size="small">{{ selected.online?'在线':'离线' }}</el-tag></el-descriptions-item>
            <el-descriptions-item label="采集">{{ selected.collects }} 次</el-descriptions-item>
            <el-descriptions-item label="位置">{{ Math.round(selected.x) }}, {{ Math.round(selected.y) }}</el-descriptions-item>
          </el-descriptions>
          <el-button size="small" @click="goDetail" style="width:100%;margin-top:8px">📟 设备详情</el-button>
        </template>
      </div>
      <div class="info-panel empty-panel" v-else>
        <span>{{ editMode ? '🖱️ 拖拽节点移动 · 双击编辑 · 单击选中' : '🖱️ 单击节点查看详情' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import api from '../api'
import { getDefaultView, createView, updateView } from '../api/admin'
import { DEVICE_TYPE_MAP, PROTOCOL_COLORS, PROTOCOLS } from '../utils/constants'

const router = useRouter()
const route = useRoute()
const canvas=ref(null), wrap=ref(null)
const editMode=ref(false), selected=ref(null), editing=ref(false)
const protoColors = PROTOCOL_COLORS
const legend = Object.entries(protoColors).map(([k,v])=>({label:k.replace('_',' ').toUpperCase(),color:v}))
const protocols = PROTOCOLS
const typeMap = DEVICE_TYPE_MAP

// 布局存后端 view_api（原来是 localStorage['topo_positions']，只活在本机）
const LEGACY_KEY = 'topo_positions'
const siteKey = String(route.query.site || '')
const viewId = ref(''), viewName = ref(''), viewVersion = ref(null)
let savedPositions = {}   // 服务端读到的布局，loadDevices 按 device_id 套用
let legacyLoaded = false
let baseline = ''         // 载入完成时的布局快照，用来判断「用户真的动过吗」

let ctx=null,animId=null,nodes=[],dragNode=null,dragOffX=0,dragOffY=0,ws=null

onMounted(async()=>{
  await nextTick()
  const c=canvas.value
  c.width=wrap.value.clientWidth; c.height=wrap.value.clientHeight
  ctx=c.getContext('2d')
  await loadLayout()        // 顺序不能换：布局要先于设备就位，loadDevices 里要按 device_id 套
  await loadDevices()
  baseline = JSON.stringify(snapshot())
  draw()
  try{const p=location.protocol==='https:'?'wss':'ws';ws=new WebSocket(`${p}://${location.host}/ws`);ws.onmessage=ev=>{const m=JSON.parse(ev.data);if(m.type==='telemetry'){const n=nodes.find(x=>x.device_id===m.device_id);if(n){n.collects++;n.online=true}}}}catch{}
})
// 只在用户**真的动过**节点时才回存。无条件存的话，每个来页面看一眼的人
// 都会凭空产出一个后端视图（空布局），多站点下还会互相抢「本站默认」。
onUnmounted(()=>{cancelAnimationFrame(animId);ws?.close();if(layoutChanged())saveLayout()})

function snapshot(){
  const pos={}; nodes.forEach(n=>{pos[n.device_id]={x:Math.round(n.x),y:Math.round(n.y)}})
  return pos
}
function layoutChanged(){ return nodes.length > 0 && JSON.stringify(snapshot()) !== baseline }

/** 取布局：服务端默认视图 → 本机旧版 → 默认网格（loadDevices 里算） */
async function loadLayout() {
  try {
    const r = await getDefaultView('topology', siteKey)
    if (r?.view?.objectId) {
      viewId.value = r.view.objectId
      viewName.value = r.view.name || ''
      viewVersion.value = r.view.version ?? 0
    }
    if (r?.canvas && typeof r.canvas === 'object') savedPositions = r.canvas
  } catch (e) {
    ElMessage.error(`读取服务端布局失败：${e?.response?.data?.detail || e?.message || e}`)
  }
  if (Object.keys(savedPositions).length) return
  // 本机旧版布局 —— 只载入不上传，等用户编辑后保存时再入库
  try {
    const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY) || '{}')
    if (legacy && Object.keys(legacy).length) {
      savedPositions = legacy; legacyLoaded = true
      ElMessage.info('本机存有旧版拓扑布局，已载入；编辑后「保存」即存入服务端')
    }
  } catch {}
}

async function loadDevices() {
  try {
    const r = await api.get('/devices',{params:{page_size:100}})
    const devs = r.data.devices||[]
    const saved = savedPositions
    const cols=Math.ceil(Math.sqrt(devs.length))
    nodes = devs.map((d,i)=>({
      device_id:d.device_id, name:d.device_name||d.device_id, proto:d.protocol,
      online:d.status==='online', device_type:d.device_type, collects:0,
      ip:(d.comm_params||{}).host||'127.0.0.1', port:(d.comm_params||{}).port||502,
      x:saved[d.device_id]?.x||80+(i%cols)*(canvas.value.width-160)/Math.max(cols-1,1),
      y:saved[d.device_id]?.y||60+Math.floor(i/cols)*100,
      color:protoColors[d.protocol]||'#8aa0b4', radius:30,
    }))
  } catch {}
}

/**
 * 存布局到服务端。带 version 做乐观锁 —— 两人同时拖节点时，
 * 后保存的那个以前会整块盖掉前一个且毫无提示，现在后端拒 409，这里如实说。
 */
async function saveLayout() {
  if (!nodes.length) return false
  const pos = snapshot()
  try {
    if (!viewId.value) {
      const name = viewName.value || (siteKey ? `${siteKey} 拓扑` : '默认拓扑')
      const created = await createView({ name, type: 'topology', site: siteKey })
      viewId.value = created.objectId
      viewName.value = name
      viewVersion.value = 0          // create_view 建出来的版本号就是 0
    }
    const r = await updateView(viewId.value, {
      name: viewName.value, type: 'topology', site: siteKey,
      canvas: pos, node_count: nodes.length, version: viewVersion.value,
    })
    // 后端回了新版本号，接着用它存下一次 —— 不接的话第二次保存必 409
    viewVersion.value = r?.version ?? (viewVersion.value ?? 0) + 1
    baseline = JSON.stringify(pos)
    if (legacyLoaded) { localStorage.removeItem(LEGACY_KEY); legacyLoaded = false }
    ElMessage.success(`布局已保存到服务端 · ${viewName.value}`)
    return true
  } catch (e) {
    if (e?.response?.status === 409) {
      ElMessage.error(e.response.data?.detail || '布局已被他人修改，本次未保存（刷新页面取回最新版）')
    } else {
      ElMessage.error(`保存布局失败：${e?.response?.data?.detail || e?.message || e}`)
    }
    return false
  }
}

function draw() {
  if(!ctx||!canvas.value) return
  const w=canvas.value.width,h=canvas.value.height
  ctx.clearRect(0,0,w,h)
  // Connections
  ctx.strokeStyle='#1a3050'; ctx.lineWidth=1
  for(let i=0;i<nodes.length;i++)
    for(let j=i+1;j<nodes.length;j++)
      if(nodes[i].proto===nodes[j].proto){
        ctx.beginPath(); ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(nodes[j].x,nodes[j].y); ctx.stroke()
      }
  // Nodes
  nodes.forEach(n=>{
    const r=n.radius
    ctx.shadowColor=n.color; ctx.shadowBlur=n.online?10:3
    ctx.beginPath(); ctx.arc(n.x,n.y,r,0,Math.PI*2)
    ctx.fillStyle=n.online?n.color+'30':'#1a3050'; ctx.fill()
    ctx.strokeStyle=selected.value===n?'#fff':n.online?n.color:'#8aa0b4'; ctx.lineWidth=selected.value===n?3:2
    ctx.stroke(); ctx.shadowBlur=0
    // Status dot
    ctx.beginPath(); ctx.arc(n.x+r-5,n.y-r+5,4,0,Math.PI*2)
    ctx.fillStyle=n.online?'#66bb6a':'#8aa0b4'; ctx.fill()
    // Name
    ctx.font='11px "Microsoft YaHei"'; ctx.fillStyle='#e8f0f8'; ctx.textAlign='center'
    const label=n.name.length>8?n.name.slice(0,8)+'…':n.name
    ctx.fillText(label,n.x,n.y+r+14)
    // Icon
    ctx.font='18px serif'; ctx.fillStyle=n.color
    ctx.fillText(n.proto==='iec104'?'⚡':n.proto==='opcua'?'🔗':'🔌',n.x,n.y+5)
  })
  animId=requestAnimationFrame(draw)
}

function hitTest(mx,my){return nodes.find(n=>Math.hypot(mx-n.x,my-n.y)<n.radius+6)}

function onMouseDown(e){
  const rect=canvas.value.getBoundingClientRect()
  const mx=e.clientX-rect.left, my=e.clientY-rect.top
  const n = hitTest(mx,my)
  if (editMode.value) {
    // 编辑模式: 拖拽
    dragNode = n; selected.value=n
    if(dragNode){ dragOffX=dragNode.x-mx; dragOffY=dragNode.y-my }
  } else if (n) {
    // 查看模式: 选中查看详情
    selected.value = n; editing.value = false
  }
}
function onMouseMove(e){
  if(dragNode){
    const rect=canvas.value.getBoundingClientRect()
    dragNode.x=e.clientX-rect.left+dragOffX; dragNode.y=e.clientY-rect.top+dragOffY
  }
}
function onMouseUp(){ dragNode=null }
function onDblClick(e){
  if(!editMode.value) return
  const rect=canvas.value.getBoundingClientRect()
  const n=hitTest(e.clientX-rect.left,e.clientY-rect.top)
  if(n){ selected.value=n; editing.value=true }
}

async function toggleEdit(){
  if (editing.value) {
    // 保存 —— 等结果再收面板，不然「保存」两个字点下去毫无准信
    const n = selected.value
    if (n) n.color = protoColors[n.proto] || '#8aa0b4'
    editing.value = false
    if (n) await saveLayout()
  } else {
    editing.value = true
  }
}

function goDetail(){ if(selected.value) router.push(`/devices/${selected.value.device_id}`) }
function goScada(){ if(selected.value) router.push(`/scada?device=${selected.value.device_id}&name=${encodeURIComponent(selected.value.name||'')}`) }
</script>

<style scoped>
.topo-page { height: calc(100vh - 100px); display: flex; flex-direction: column; }
.topo-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-shrink: 0; }
.topo-hdr h3 { color: #e8f0f8; margin: 0; }
.topo-actions { display: flex; align-items: center; gap: 8px; }
.topo-legend { display: flex; gap: 12px; margin-left: 16px; }
.leg-item { display: flex; align-items: center; gap: 4px; font-size: 10px; color: #8aa0b4; }
.leg-item i { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }

.list-detail { display: flex; gap: 12px; flex: 1; min-height: 0; }
.canvas-panel { flex: 1; background: #0a1620; border-radius: 8px; border: 1px solid #234060; overflow: hidden; position: relative; cursor: default; }
#topoCanvas { display: block; }

.info-panel { width: 260px; flex-shrink: 0; background: #162844; border: 1px solid #2a4870; border-radius: 8px; padding: 12px; overflow-y: auto; }
.empty-panel { display: flex; align-items: center; justify-content: center; color: #8aa0b4; font-size: 13px; text-align: center; }
.ip-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.ip-title { font-size: 14px; font-weight: bold; color: #e8f0f8; }
</style>
