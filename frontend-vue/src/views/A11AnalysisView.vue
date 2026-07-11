<template>
  <div class="a11-page">
    <h2 class="page-title">报文分析 <span class="sub">A11 · Modbus · OPC-DA | 7.10.pcapng · 93,913帧</span></h2>

    <el-card style="margin-bottom:12px">
      <el-radio-group v-model="source" size="small" @change="switchSource">
        <el-radio-button value="pcap710">📁 7.10.pcapng</el-radio-button>
        <el-radio-button value="pcap73">📁 7.3.pcapng</el-radio-button>
        <el-radio-button value="local">🖥️ 本地抓包</el-radio-button>
        <el-radio-button value="remote">🌐 远程抓包</el-radio-button>
      </el-radio-group>
      <el-select v-if="source==='remote'" v-model="remoteEndpoint" size="small" style="width:180px;margin-left:8px" placeholder="选择端点">
        <el-option v-for="ep in endpoints" :key="ep.objectId" :label="ep.name+' ('+ep.host+':'+ep.port+')'" :value="ep.objectId" />
      </el-select>
      <el-button size="small" @click="showEpDialog=true" style="margin-left:4px" v-if="source==='remote'">⚙️</el-button>
      <el-button size="small" :type="capturing?'danger':'success'" @click="toggle" style="margin-left:12px" :disabled="source==='pcap710'||source==='pcap73'">
        {{capturing?'⏹ 停止':'▶ 开始抓包'}}
      </el-button>
      <span style="margin-left:12px;font-size:12px;color:#909399" v-if="source==='local'||source==='remote'">
        实时: {{livePackets}} 帧
      </span>
      <span style="margin-left:12px;font-size:12px;color:#67c23a" v-else>
        静态分析 · 点击报文列表查看详情 · A11 / Modbus / OPC-DA
      </span>
    </el-card>

    <!-- 端点配置弹窗 -->
    <el-dialog v-model="showEpDialog" title="采集端点配置" width="480px">
      <el-form label-width="70px" size="small">
        <el-form-item label="名称"><el-input v-model="epForm.name" placeholder="131 IO服务器" /></el-form-item>
        <el-form-item label="主机"><el-input v-model="epForm.host" placeholder="11.66.12.131" /></el-form-item>
        <el-form-item label="端口"><el-input-number v-model="epForm.port" :min="1" :max="65535" /></el-form-item>
        <el-form-item label="用户名"><el-input v-model="epForm.username" /></el-form-item>
        <el-form-item label="密码"><el-input v-model="epForm.password" type="password" show-password /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEpDialog=false">取消</el-button>
        <el-button type="primary" @click="saveEndpoint">保存</el-button>
        <el-button type="danger" size="small" @click="delEndpoint" v-if="epForm.objectId">删除</el-button>
      </template>
    </el-dialog>

    <el-row :gutter="12">
      <el-col :span="9">
        <el-card>
          <template #header><span>报文列表 (点击查看)</span><el-button size="small" style="float:right" @click="clearPackets">🗑 清空</el-button></template>
          <el-table :data="pagedPackets" size="small" @row-click="select" highlight-current-row max-height="440">
            <el-table-column prop="id" label="#" width="45"/>
            <el-table-column prop="dir" label="向" width="40"><template #d="{row}"><el-tag :type="row.dir==='TX'?'warning':'success'" size="small">{{row.dir}}</el-tag></template></el-table-column>
            <el-table-column prop="src" label="源地址" width="150"/>
            <el-table-column prop="dst" label="目标" width="130"/>
            <el-table-column prop="msg" label="类型" width="65"/>
            <el-table-column prop="sz" label="大小" width="55"/>
          </el-table>
          <el-pagination
            v-model:current-page="pktPage"
            v-model:page-size="pktPageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="packets.length"
            layout="total, sizes, prev, pager, next, jumper"
            size="small"
            background
            style="margin-top:8px;justify-content:flex-end"
          />
        </el-card>
      </el-col>
      <el-col :span="15">
        <el-card :header="'报文 #'+ (sel?.id||'')">
          <div v-if="sel" class="pkt-detail">
            <div class="pkt-meta">{{sel.dir==='TX'?'发送':'接收'}} | {{sel.src}} → {{sel.dst}} | {{sel.sz}}B | {{sel.msg}}</div>

            <!-- Wireshark 风格 Hex dump -->
            <div class="hex-title">Hex Dump</div>
            <div class="hex-dump">
              <div v-for="(line,i) in hexLines" :key="i" class="hex-line">
                <span class="hex-offset">{{ (i*16).toString(16).padStart(4,'0') }}</span>
                <span class="hex-bytes">{{ line.hex }}</span>
                <span class="hex-ascii">{{ line.ascii }}</span>
              </div>
            </div>

            <div class="hex-title">字段解码</div>
            <el-table :data="sel.fields" size="small" border><el-table-column prop="f" label="字段" width="100"/><el-table-column prop="v" label="值"><template #d="{row}"><code>{{row.v}}</code></template></el-table-column><el-table-column prop="d" label="说明"/></el-table>

            <div v-if="sel.str?.length" class="hex-title">Payload 可读字符串</div>
            <div v-for="s in sel.str" :key="s" class="path">{{s}}</div>
          </div>
          <div v-else style="padding:60px;text-align:center;color:#666">← 点击左侧报文查看详情</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="12" style="margin-top:12px">
      <el-col :span="12"><el-card header="设备路径"><div v-for="d in devs" :key="d.p" class="dev"><code class="dev-path">{{d.p}}</code><span style="color:#909399;margin-left:8px;font-size:11px">{{d.d}}</span></div></el-card></el-col>
      <el-col :span="12"><el-card header="统计"><el-table :data="stats" size="small"><el-table-column prop="l" label="项目" width="130"/><el-table-column prop="v" label="数值"><template #d="{row}"><span v-html="row.v"/></template></el-table-column></el-table></el-card></el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'

const source = ref('pcap710'); const capturing = ref(false); const livePackets = ref(0)
const sel = ref(null); let timer = null

// 远程端点
const endpoints = ref([])
const remoteEndpoint = ref('')
const showEpDialog = ref(false)
const epForm = reactive({ objectId:'', name:'', host:'11.66.12.131', port:5985, username:'administrator', password:'' })

async function loadEndpoints() {
  try { const r = await fetch('/api/capture/endpoints'); const d = await r.json(); endpoints.value = d.endpoints || []
    if (endpoints.value.length && !remoteEndpoint.value) remoteEndpoint.value = endpoints.value[0].objectId
  } catch {}
}
async function saveEndpoint() {
  const body = { name: epForm.name, host: epForm.host, port: epForm.port, username: epForm.username, password: epForm.password, method: 'winrm' }
  try {
    if (epForm.objectId) { /* update not implemented yet */ }
    else { await fetch('/api/capture/endpoints', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }) }
    showEpDialog.value = false; loadEndpoints()
  } catch { ElMessage.error('保存失败') }
}
async function delEndpoint() {
  if (!epForm.objectId) return
  try { await fetch(`/api/capture/endpoints/${epForm.objectId}`, { method: 'DELETE' }); showEpDialog.value = false; loadEndpoints() } catch {}
}

// 分页
const pktPage = ref(1)
const pktPageSize = ref(20)
const pagedPackets = computed(() => {
  const start = (pktPage.value - 1) * pktPageSize.value
  return packets.value.slice(start, start + pktPageSize.value)
})

// Wireshark style hex dump
const hexLines = computed(() => {
  if (!sel.value?.hex) return []
  const hex = sel.value.hex.replace(/\s/g, '')
  const lines = []
  for (let i = 0; i < hex.length; i += 32) {
    const chunk = hex.slice(i, i + 32)
    const bytes = chunk.match(/.{1,2}/g) || []
    const spaced = bytes.map((b,i) => i===7 ? b+'  ' : b).join(' ')
    const ascii = bytes.map(b => { const c = parseInt(b,16); return c>=32&&c<127 ? String.fromCharCode(c) : '.' }).join('')
    lines.push({ hex: spaced.padEnd(51), ascii })
  }
  return lines
})

const devs = [
  {p:'\\CY1C8K\\Z611SYWS\\ZD010838DOVXV301VC#',d:'采油一厂八矿·611井站·阀门开状态'},
  {p:'\\CY1C8K\\Z611SYWS\\ZD010838DOVXV301VO#',d:'采油一厂八矿·611井站·阀门关状态'},
  {p:'\\CY1C8K\\Z611SYWS\\ZD010838COMPV301VJ#',d:'采油一厂八矿·611井站·压缩机参数'},
  {p:'\\CY1C8K\\Z611SYWS\\ZD010838ERR1VVALVE#',d:'采油一厂八矿·611井站·阀门故障监测'},
]
const stats = [
  {l:'A11帧数(7.10)',v:'93,913'},
  {l:'通信端口',v:'130:8889'},
  {l:'心跳短帧',v:'93,455 (99%)'},
  {l:'<span style="color:#67c23a">0xF062</span> 设备列表',v:'~200 帧'},
  {l:'<span style="color:#e6a23c">0xF050</span> 单井数据',v:'~500 帧'},
  {l:'<span style="color:#409eff">0x3667</span> 批量上报',v:'~100 帧'},
  {l:'<span style="color:#909399">0x87B2/0x87B3</span> 心跳',v:'15,101 / 93,455'},
]

const allPkts = [
  {id:1,dir:"TX",src:"131:62535",dst:"130:8889",sz:1204,msg:"0xF062",hex:"5a5ab2040100260062f02f000900000a0024060000230000005c43593143384b5c5a363131535957535c5a44303130383338444f5658563330315643230000005c435931...",fields:[{"f": "Magic", "v": "5a5a", "d": "A11帧起始"}, {"f": "FrameLen", "v": "0x04B2=1202(LE)", "d": "不含2B头小端长度"}, {"f": "Flags", "v": "01002600", "d": "控制标志"}, {"f": "MsgType", "v": "0xF062", "d": "设备列表查询"}, {"f": "Payload", "v": "1194B", "d": "ASCII设备路径名"}],str:["\\CY1C8K\\Z611SYWS\\ZD010838DOVXV301VC#(阀门开)", "\\CY1C8K\\Z611SYWS\\ZD010838DOVXV301VO#(阀门关)"]},
  {id:2,dir:"RX",src:"130:8889",dst:"131:62531",sz:25,msg:"0x87B2",hex:"5a5a170000003900b28735000500800a00000000006a6a",fields:[{"f": "Magic", "v": "5a5a", "d": "帧起始"}, {"f": "FrameLen", "v": "0x17=23", "d": "23字节"}, {"f": "MsgType", "v": "0x87B2", "d": "心跳应答"}, {"f": "jjZZ", "v": "6a6a", "d": "魔术字封尾"}],str:[]},
  {id:3,dir:"TX",src:"131:62530",dst:"130:8889",sz:217,msg:"0xF050",hex:"5a5ad9000000390050f033000400000a00090000002f0f00000d0f00006a6a5a5a06050300...",fields:[{"f": "Magic", "v": "5a5a", "d": "帧起始"}, {"f": "MsgType", "v": "0xF050", "d": "单井数据查询"}, {"f": "jjZZ", "v": "6a6a5a5a", "d": "内嵌A11子帧type=0x0506"}],str:[]},
  {id:4,dir:"RX",src:"130:8889",dst:"131:58646",sz:117,msg:"0x0000",hex:"5a5a730000003e0000000000020000000004000000340000008719000007bd69506ae4030b000000c01e454240c0008819000007bd69506ae4030b0000006066e63c40...",fields:[{"f": "Magic", "v": "5a5a", "d": "帧起始"}, {"f": "MsgType", "v": "0x0000", "d": "CommBridge二次封装"}, {"f": "jjZZ", "v": "6a6a5a5a@offset", "d": "内嵌子帧"}, {"f": "Float1", "v": "~0xC01EC000", "d": "传感器读数1"}, {"f": "Float2", "v": "~0x3CE66660", "d": "传感器读数2"}],str:[]},
  {id:5,dir:"TX",src:"131:62531",dst:"130:8889",sz:4096,msg:"0xF062",hex:"5a5a314000003900b28735000500000a00c503000032e0000031da0000...",fields:[{"f": "Magic", "v": "5a5a", "d": "帧起始"}, {"f": "FrameLen", "v": "0x4031=16433", "d": "批量数据帧"}, {"f": "MsgType", "v": "0xF062", "d": "批量设备查询"}],str:[]},
  {id:6,dir:"RX",src:"130:8889",dst:"131:62534",sz:73,msg:"0x3667",hex:"5a5a4900000039006736...",fields:[{"f": "Magic", "v": "5a5a", "d": "帧起始"}, {"f": "MsgType", "v": "0x3667", "d": "批量数据上报"}, {"f": "Data", "v": "float数组", "d": "传感器测量值"}],str:[]},
  {id:7,dir:"TX",src:"131:62533",dst:"130:8889",sz:19,msg:"0x87B3",hex:"5a5a130000003900b38703000500800a00006a6a",fields:[{"f": "Magic", "v": "5a5a", "d": "帧起始"}, {"f": "MsgType", "v": "0x87B3", "d": "心跳请求"}],str:[]},
  {id:8,dir:"TX",src:"131:53001",dst:"11.249.61.243:502",sz:12,msg:"Modbus",hex:"df05000000060103012b0004",fields:[{"f": "TID", "v": "0xDF05", "d": "事务ID"}, {"f": "UnitID", "v": "1", "d": "从站1"}, {"f": "FC", "v": "3", "d": "读保持寄存器"}, {"f": "Addr", "v": "299", "d": "起始地址"}, {"f": "Count", "v": "4", "d": "4个寄存器"}],str:[]},
  {id:9,dir:"RX",src:"11.249.61.243:502",dst:"131:53001",sz:17,msg:"Modbus",hex:"df050000000b0103083eda20fbc61c3c00",fields:[{"f": "TID", "v": "0xDF05", "d": "事务ID"}, {"f": "ByteCnt", "v": "8", "d": "8字节数据"}, {"f": "Values", "v": "[15930,8420,50780,0]", "d": "寄存器原始值"}],str:[]},
  {id:10,dir:"RX",src:"172.23.9.3:58648",dst:"131:49778",sz:1460,msg:"OPC-DA",hex:"05000003100000008c080000b8760200640800000100030002ac...",fields:[{"f": "Version", "v": "5.0", "d": "DCE/RPC v5"}, {"f": "PktType", "v": "0(Request)", "d": "OPC DA请求"}, {"f": "FragLen", "v": "0x088C=2188", "d": "分片长度"}],str:[]},
  {id:11,dir:"RX",src:"172.23.18.194:3514",dst:"131:135",sz:120,msg:"OPC-DA",hex:"05000b03100000007800280066020000d016d016...",fields:[{"f": "PktType", "v": "11(Bind)", "d": "DCOM对象绑定"}, {"f": "Server", "v": "RSLinx", "d": "Rockwell OPC"}],str:[]},
  {id:12,dir:"TX",src:"131:53001",dst:"11.248.203.74:502",sz:12,msg:"Modbus",hex:"7400000000060203012b0004",fields:[{"f": "UnitID", "v": "2", "d": "从站2"}, {"f": "FC", "v": "3", "d": "读保持寄存器"}, {"f": "Addr", "v": "299", "d": "起始地址"}],str:[]},
]
const packets = ref(allPkts)

function select(row) { sel.value = row }
function clearPackets() { packets.value = packets.value.filter(p => p.id <= 12); pktPage.value = 1; sel.value = null; livePackets.value = 0 }

function switchSource(v) {
  pktPage.value = 1
  if (v === 'pcap710') { packets.value = pk710; livePackets.value = 0 }
  else if (v === 'pcap73') { packets.value = pk73; livePackets.value = 0 }
}

async function toggle() {
  if (capturing.value) {
    try { await fetch(source.value==='local'?'http://localhost:8765/api/stop':'/api/capture/remote/stop',{method:'POST'}) } catch {}
    capturing.value = false; clearInterval(timer); livePackets.value = 0
  } else {
    try {
      if (source.value === 'local') {
        await fetch('http://localhost:8765/api/start',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ports:[8889,502,2404]})})
      } else {
        const ep = endpoints.value.find(e => e.objectId === remoteEndpoint.value)
        const host = ep?.host || '11.66.12.131'
        await fetch(`/api/capture/remote/start?host=${host}&ports=8889,53001,502`,{method:'POST'})
      }
      capturing.value = true
      timer = setInterval(async () => {
        try {
          const url = source.value==='local'?'http://localhost:8765/api/packets?limit=5':'/api/capture/remote/packets?limit=5'
          const r = await fetch(url); const d = await r.json()
          if (d.packets?.length) {
            livePackets.value = d.total
            // 去重: 已存在的 hex 不重复加
            const seen = new Set(packets.value.map(p => p.hex?.slice(0,20)))
            const fresh = d.packets.filter(p => !seen.has(p.hex?.slice(0,20)))
            if (fresh.length) {
              packets.value = [...fresh.map(p=>({id:Date.now()%100000,dir:p.dir,src:p.src,dst:p.dst,sz:p.len,msg:p.proto||'?',hex:p.hex,fields:[{f:'协议',v:p.proto||'?',d:'实时解析'}]})), ...packets.value].slice(0,50)
            }
          }
        } catch {}
      }, 5000)  // 远程慢, 5s 轮询
    } catch { ElMessage.warning('抓包启动失败') }
  }
}

onMounted(loadEndpoints)

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.a11-page{padding:16px;background:#141520;min-height:100vh}
.page-title{font-size:18px;font-weight:600;color:#e0e0e0;margin-bottom:12px}
.sub{font-size:12px;color:#909399;font-weight:400;margin-left:8px}
.info{font-size:13px;color:#c0c4cc;margin-bottom:8px}
.pkt-meta{font-size:12px;color:#409EFF;margin-bottom:8px;font-family:Consolas,monospace}
.hex-title{font-size:12px;color:#e6a23c;font-weight:bold;margin:8px 0 4px}
.hex-dump{background:#0d0e14;border-radius:4px;padding:8px;font-family:Consolas,monospace;font-size:12px;line-height:1.6;overflow-x:auto;max-height:300px;overflow-y:auto}
.hex-line{display:flex;gap:12px}
.hex-offset{color:#606266;width:40px;flex-shrink:0}
.hex-bytes{color:#e6a23c;flex-shrink:0;letter-spacing:1px}
.hex-ascii{color:#67c23a}
.hex{background:#0d0e14;border-radius:4px;padding:10px;font-family:Consolas,monospace;font-size:12px;color:#e6a23c;line-height:1.8;word-break:break-all}
.path{font-family:Consolas,monospace;font-size:12px;color:#67c23a;padding:3px 0;border-bottom:1px solid #2d2e3b}
.dev{padding:6px 0;border-bottom:1px solid #2d2e3b}
.dev-path{font-family:Consolas,monospace;font-size:11px;color:#67c23a;word-break:break-all}
:deep(.el-card){background:#1d1e2b;border-color:#2d2e3b;color:#e0e0e0;margin-bottom:12px}
:deep(.el-card__header){color:#c0c4cc;border-bottom-color:#2d2e3b;padding:8px 12px}
:deep(.el-table){--el-table-bg-color:#1d1e2b;--el-table-tr-bg-color:#1d1e2b;--el-table-header-bg-color:#252636;--el-table-border-color:#2d2e3b;--el-table-text-color:#c0c4cc;font-size:12px}
:deep(.el-table__row){cursor:pointer}
:deep(.el-radio-button__inner){background:#1d1e2b;border-color:#2d2e3b;color:#c0c4cc}
code{color:#e6a23c;font-family:Consolas,monospace;font-size:11px;background:#252636;padding:1px 4px;border-radius:2px}
</style>