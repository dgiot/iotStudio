<template>
  <div class="a11-page">
    <!-- 工具栏 -->
    <div class="topbar">
      <h3>🛢️ A11 IO服务 — 会话分析</h3>
      <div class="tb-actions">
        <el-select v-model="capIface" size="small" style="width:100px" placeholder="网口" clearable>
          <el-option v-for="ifc in ifaces" :key="ifc" :label="ifc" :value="ifc" />
        </el-select>
        <el-input v-model="capPorts" size="small" style="width:150px" placeholder="端口" />
        <el-button size="small" :type="capRunning?'danger':'success'" @click="toggleCapture" :loading="capToggling">{{ capRunning?'⏹ 停止':'▶ 抓包' }}</el-button>
        <el-button size="small" @click="showReplay=!showReplay">📡 回放</el-button>
        <el-button size="small" type="primary" @click="showInject=true">✚ 注入</el-button>
        <el-button size="small" @click="refresh" :loading="loading">🔄</el-button>
        <el-tag v-if="capRunning" size="small" effect="dark" type="danger">{{ capStats?.packets||0 }} pkts</el-tag>
        <el-tag size="small" effect="dark" type="success">{{ conversations.length }} 会话</el-tag>
      </div>
    </div>

    <!-- 回放 -->
    <el-card v-if="showReplay" style="margin-bottom:8px;flex-shrink:0">
      <el-row :gutter="8" align="middle">
        <el-col :span="6"><el-input v-model="replayPath" size="small" placeholder="pcapng路径"/></el-col>
        <el-col :span="1"><el-input-number v-model="replayPort" size="small" :min="1"/></el-col>
        <el-col :span="1"><el-input-number v-model="replayLimit" size="small" :min="10" :max="5000"/></el-col>
        <el-col :span="1"><el-input-number v-model="replaySpeed" size="small" :min="1" :max="100"/></el-col>
        <el-col :span="2"><el-button size="small" type="primary" @click="startReplay" :loading="repRunning">▶</el-button></el-col>
        <el-col :span="13"><el-progress v-if="repRunning" :percentage="Math.round((repStatus?.total||0)/replayLimit*100)" :stroke-width="6"/></el-col>
      </el-row>
    </el-card>

    <!-- 会话列表 -->
    <div class="conv-list" ref="convList">
      <div v-for="(conv, ci) in conversations" :key="conv.key" class="conv-card" :class="{active:activeConv===conv.key}" @click="selectConv(conv.key)">
        <!-- 会话头 -->
        <div class="conv-header">
          <div class="conv-peers">
            <span class="conv-src">{{ conv.src }}</span>
            <span class="conv-arrow">→</span>
            <span class="conv-dst">{{ conv.dst }}</span>
          </div>
          <div class="conv-meta">
            <el-tag size="small" effect="dark" :type="conv.proto==='A11'?'warning':conv.proto==='Modbus'?'':'info'">{{ conv.proto }}</el-tag>
            <span class="conv-count">{{ conv.msgs.length }} 消息</span>
            <span class="conv-bytes">{{ conv.bytes }}B</span>
            <span class="conv-expand">{{ activeConv===conv.key ? '▼' : '▶' }}</span>
          </div>
        </div>

        <!-- 消息序列 (展开时) -->
        <div v-if="activeConv===conv.key" class="conv-body">
          <div v-for="(msg, mi) in conv.msgs" :key="mi" class="msg-row" :class="msg.dir" @click.stop="selectMsg(msg)">
            <div class="msg-timeline">
              <div class="msg-dot" :class="msg.dir"/>
              <div class="msg-line"/>
            </div>
            <div class="msg-card" :class="{selected:selectedMsg===msg}">
              <div class="msg-top">
                <el-tag size="small" :type="msg.dir==='TX'?'':'success'" effect="dark">{{ msg.dir }}</el-tag>
                <code class="msg-type">{{ msg.parsed?.msg_type || msg.parsed?.a11_type || '—' }}</code>
                <span class="msg-len">{{ msg.len }}B</span>
                <span v-if="msg.parsed?.slave" class="msg-slave">slave={{ msg.parsed.slave }}</span>
                <span class="msg-time">{{ new Date(msg.ts*1000).toLocaleTimeString() }}</span>
              </div>
              <!-- 展开的 hex -->
              <div v-if="selectedMsg===msg" class="msg-detail">
                <el-descriptions :column="2" size="small" border style="margin-top:6px">
                  <el-descriptions-item label="从站">{{ msg.parsed?.slave || '—' }}</el-descriptions-item>
                  <el-descriptions-item label="类型">{{ msg.parsed?.msg_type || msg.parsed?.a11_type || '—' }}</el-descriptions-item>
                  <el-descriptions-item label="子类型">{{ msg.parsed?.msg_sub || '—' }}</el-descriptions-item>
                  <el-descriptions-item label="魔术字">{{ msg.parsed?.magic || '—' }}</el-descriptions-item>
                </el-descriptions>
                <pre class="msg-hex">{{ msg.hex?.slice(0,300) }}{{ msg.hex?.length>300?'...':'' }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!conversations.length" class="empty-state">
        <el-icon :size="48" color="var(--el-text-color-secondary)"><Connection/></el-icon>
        <p>暂无会话数据</p>
        <p class="sub">启动抓包或注入报文开始分析</p>
      </div>
    </div>

    <!-- 统计条 -->
    <div class="stats-bar">
      <div v-for="s in statsCards" :key="s.label" class="stat-item">
        <span class="stat-val" :style="{color:s.color}">{{ s.value }}</span>
        <span class="stat-label">{{ s.label }}</span>
      </div>
    </div>

    <!-- 注入弹窗 -->
    <el-dialog title="注入报文" v-model="showInject" width="500px">
      <el-form label-width="80px" size="small">
        <el-form-item label="设备ID"><el-input v-model="injDevice"/></el-form-item>
        <el-form-item label="方向"><el-radio-group v-model="injDir"><el-radio-button value="TX">TX</el-radio-button><el-radio-button value="RX">RX</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="Hex"><el-input v-model="injHex" type="textarea" :rows="4"/></el-form-item>
      </el-form>
      <div style="font-size:11px;color:var(--el-text-color-secondary);margin-bottom:8px">5a5a + len(2B LE) + flags(4B) + msg_type(2B LE) + payload</div>
      <template #footer>
        <el-button size="small" @click="injectDemo">🎲 5a5a心跳</el-button>
        <el-button size="small" type="primary" @click="doInject" :loading="injLoading">注入</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import api from '../api'

const packets = ref([]); const loading = ref(false); const selectedMsg = ref(null); const activeConv = ref('')
const showInject = ref(false); const showReplay = ref(false)
const injDevice = ref('a11_test'); const injDir = ref('RX'); const injHex = ref(''); const injLoading = ref(false)

// 按流分组为会话
const conversations = computed(() => {
  const groups = {}
  packets.value
    .filter(p => p.proto === 'a11' || (p.hex||'').includes('5a5a') || (p.hex||'').includes('6a6a5a5a'))
    .forEach(p => {
      const key = p.src + '→' + p.dst
      if (!groups[key]) groups[key] = { key, src: p.src, dst: p.dst, proto: p.proto, msgs: [], bytes: 0, first: p.ts, last: p.ts }
      groups[key].msgs.push(p)
      groups[key].bytes += p.len
      groups[key].last = p.ts
      if (p.proto !== 'unknown') groups[key].proto = p.proto
    })
  return Object.values(groups).sort((a, b) => b.last - a.last)
})

const statsCards = computed(() => {
  const all = conversations.value.reduce((s,c) => s + c.msgs.length, 0)
  const tx = conversations.value.reduce((s,c) => s + c.msgs.filter(m=>m.dir==='TX').length, 0)
  const rx = all - tx
  const bytes = conversations.value.reduce((s,c) => s + c.bytes, 0)
  return [
    { label:'会话', value:conversations.value.length, color:'#ffa726' },
    { label:'消息', value:all, color:'#66d9ff' },
    { label:'TX', value:tx, color:'#66bb6a' },
    { label:'RX', value:rx, color:'#ab47bc' },
    { label:'KB', value:(bytes/1024).toFixed(1), color:'#ef5350' },
  ]
})

function selectConv(key) { activeConv.value = activeConv.value === key ? '' : key }
function selectMsg(msg) { selectedMsg.value = selectedMsg.value === msg ? null : msg }
async function refresh() { loading.value=true; try{const r=await api.get('/proxy/capture/packets',{params:{limit:500}});packets.value=r.data.packets||[]}catch{}finally{loading.value=false} }
function injectDemo(){injHex.value='5a5a130000000a00f0502f000900000a00'}
async function doInject(){injLoading.value=true;try{await api.post(`/packets/inject?device_id=${injDevice.value}&direction=${injDir.value}&hex_data=${injHex.value.replace(/\s/g,'')}`);ElMessage.success('已注入');showInject.value=false;refresh()}catch{ElMessage.error('失败')}finally{injLoading.value=false}}

// 抓包
const capRunning=ref(false),capToggling=ref(false),capStats=ref(null),capIface=ref(''),capPorts=ref('502,1502,2502,2404,4840,8889')
const ifaces=ref([]); let capTimer=null
async function loadInterfaces(){try{const r=await api.get('/capture/interfaces');ifaces.value=r.data.interfaces||[]}catch{}}
async function toggleCapture(){capToggling.value=true;try{if(capRunning.value){await api.post('/capture/stop');capRunning.value=false;clearInterval(capTimer);ElMessage.success('已停止')}else{await api.post('/capture/start?ports='+capPorts.value.replace(/\s/g,'')+(capIface.value?'&iface='+capIface.value:''));capRunning.value=true;capTimer=setInterval(async()=>{try{const s=await api.get('/capture/status');capStats.value=s.data;if(!s.data.running){capRunning.value=false;clearInterval(capTimer);refresh()}}catch{}},2000)}}catch{ElMessage.error('操作失败')}finally{capToggling.value=false}}

// 回放
const replayPath=ref('D:/ai/dgiot_lite/data/7.3.pcapng'),replayPort=ref(8889),replayLimit=ref(200),replaySpeed=ref(10),repRunning=ref(false),repStatus=ref(null)
let repTimer=null
async function startReplay(){repRunning.value=true;try{const r=await api.post(`/packets/replay?file_path=${replayPath.value}&port=${replayPort.value}&limit=${replayLimit.value}&speed=${replaySpeed.value}`);ElMessage.success(r.data.msg);repTimer=setInterval(async()=>{try{const s=await api.get('/packets/replay/status');repStatus.value=s.data;if(!s.data.running){clearInterval(repTimer);repRunning.value=false;refresh()}}catch{}},1500)}catch{ElMessage.error('失败');repRunning.value=false}}
onMounted(()=>{refresh();loadInterfaces()})
</script>

<style scoped>
.a11-page { color:var(--el-text-color-regular); height:100%; display:flex; flex-direction:column; }
.topbar { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-shrink:0; }
.topbar h3 { color:var(--el-text-color-primary); font-size:16px; margin:0; }
.tb-actions { display:flex; gap:6px; align-items:center; }
/* 会话列表 */
.conv-list { flex:1; overflow-y:auto; padding-right:4px; }
.conv-card { background:var(--el-bg-color-overlay); border:1px solid var(--el-border-color); border-radius:8px; margin-bottom:8px; cursor:pointer; overflow:hidden; transition:border-color .2s; }
.conv-card:hover { border-color:var(--el-color-primary); }
.conv-card.active { border-color:var(--el-color-primary); box-shadow:0 0 8px rgba(102,217,255,0.1); }
.conv-header { display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:var(--el-fill-color-light); }
.conv-peers { font-size:13px; font-family:monospace; }
.conv-src { color:#66d9ff; }
.conv-arrow { color:var(--el-text-color-secondary); margin:0 6px; }
.conv-dst { color:#66bb6a; }
.conv-meta { display:flex; gap:10px; align-items:center; font-size:12px; color:var(--el-text-color-secondary); }
.conv-count { font-weight:bold; }
.conv-expand { font-size:10px; }
/* 消息序列 */
.conv-body { padding:0; }
.msg-row { display:flex; padding:0; }
.msg-row.RX { flex-direction:row; }
.msg-row.TX { flex-direction:row-reverse; }
.msg-timeline { width:24px; display:flex; flex-direction:column; align-items:center; flex-shrink:0; padding-top:8px; }
.msg-dot { width:8px; height:8px; border-radius:50%; margin-bottom:2px; }
.msg-dot.RX { background:#66bb6a; }
.msg-dot.TX { background:#66d9ff; }
.msg-line { width:1px; flex:1; background:var(--el-border-color); }
.msg-row:last-child .msg-line { display:none; }
.msg-card { flex:1; margin:4px 8px; padding:6px 10px; border-radius:6px; border:1px solid var(--el-border-color); background:var(--el-fill-color-blank); }
.msg-card:hover { border-color:var(--el-color-primary); }
.msg-card.selected { border-color:var(--el-color-primary); background:rgba(102,217,255,0.05); }
.msg-card.RX .msg-top { border-left:2px solid #66bb6a; padding-left:8px; }
.msg-card.TX .msg-top { border-left:2px solid #66d9ff; padding-left:8px; }
.msg-top { display:flex; gap:8px; align-items:center; flex-wrap:wrap; font-size:12px; }
.msg-type { font-size:11px; color:var(--el-color-primary); font-weight:bold; }
.msg-len { color:var(--el-text-color-secondary); }
.msg-slave { color:#8aa0b4; font-size:11px; }
.msg-time { color:var(--el-text-color-secondary); font-size:11px; margin-left:auto; }
.msg-detail { margin-top:4px; }
.msg-hex { font-size:9px; line-height:1.4; background:var(--el-fill-color-light); color:var(--el-text-color-regular); padding:6px; border-radius:4px; max-height:120px; overflow:auto; white-space:pre-wrap; word-break:break-all; margin-top:4px; }
/* 底部统计 */
.stats-bar { display:flex; gap:16px; padding:8px 0 0; flex-shrink:0; border-top:1px solid var(--el-border-color); margin-top:8px; }
.stat-item { text-align:center; flex:1; }
.stat-val { font-size:22px; font-weight:bold; }
.stat-label { font-size:11px; color:var(--el-text-color-secondary); }
.empty-state { display:flex; flex-direction:column; align-items:center; padding:60px; color:var(--el-text-color-secondary); gap:8px; }
.empty-state p { margin:0; }
.empty-state .sub { font-size:12px; }
:deep(.el-descriptions) { --el-descriptions-item-bordered-label-background:rgba(255,255,255,0.03); }
</style>
