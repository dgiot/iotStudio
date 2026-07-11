<template>
  <div class="a11-page">
    <h2 class="page-title">报文分析 <span class="sub">A11 · Modbus · OPC-DA | 7.10.pcapng · 93,913帧</span></h2>

    <el-card style="margin-bottom:12px">
      <el-radio-group v-model="source" size="small" @change="switchSource">
        <el-radio-button value="pcap710">📁 7.10.pcapng</el-radio-button>
        <el-radio-button value="pcap73">📁 7.3.pcapng</el-radio-button>
        <el-radio-button value="local">🖥️ 本地抓包</el-radio-button>
        <el-radio-button value="remote131">🌐 远程131抓包</el-radio-button>
      </el-radio-group>
      <el-button size="small" :type="capturing?'danger':'success'" @click="toggle" style="margin-left:12px" :disabled="source==='pcap710'||source==='pcap73'">
        {{capturing?'⏹ 停止':'▶ 开始抓包'}}
      </el-button>
      <span style="margin-left:12px;font-size:12px;color:#909399" v-if="source==='local'||source==='remote131'">
        端口: 8889,502,2404 | 实时: {{livePackets}} 帧
      </span>
      <span style="margin-left:12px;font-size:12px;color:#67c23a" v-else>
        静态分析 · 点击报文列表查看详情 · A11 / Modbus / OPC-DA
      </span>
    </el-card>

    <el-row :gutter="12">
      <el-col :span="10">
        <el-card header="报文列表 (点击查看)">
          <el-table :data="pagedPackets" size="small" @row-click="select" highlight-current-row max-height="440">
            <el-table-column prop="id" label="#" width="35"/>
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
      <el-col :span="14">
        <el-card :header="'报文 #'+ (sel?.id||'')">
          <div v-if="sel">
            <div class="info">{{sel.src}} → {{sel.dst}} | {{sel.dir}} | {{sel.sz}}B | {{sel.msg}}</div>
            <div class="hex-title">Hex</div>
            <div class="hex">{{sel.hex}}</div>
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
      <el-col :span="12"><el-card header="设备路径"><div v-for="d in devs" :key="d.p" class="dev"><span style="color:#67c23a;font-family:monospace;font-size:12px">{{d.p}}</span><span style="color:#909399;margin-left:8px;font-size:11px">{{d.d}}</span></div></el-card></el-col>
      <el-col :span="12"><el-card header="统计"><el-table :data="stats" size="small"><el-table-column prop="l" label="项目" width="130"/><el-table-column prop="v" label="数值"><template #d="{row}"><span v-html="row.v"/></template></el-table-column></el-table></el-card></el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'

const source = ref('pcap710'); const capturing = ref(false); const livePackets = ref(0)
const sel = ref(null); let timer = null

// 分页
const pktPage = ref(1)
const pktPageSize = ref(20)
const pagedPackets = computed(() => {
  const start = (pktPage.value - 1) * pktPageSize.value
  return packets.value.slice(start, start + pktPageSize.value)
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

function switchSource(v) {
  pktPage.value = 1
  if (v === 'pcap710') { packets.value = pk710; livePackets.value = 0 }
  else if (v === 'pcap73') { packets.value = pk73; livePackets.value = 0 }
}

async function toggle() {
  if (capturing.value) {
    try { await fetch(source.value==='local'?'http://localhost:8765/api/stop':'/api/capture/stop',{method:'POST'}) } catch {}
    capturing.value = false; clearInterval(timer); livePackets.value = 0
  } else {
    try {
      if (source.value === 'local') {
        await fetch('http://localhost:8765/api/start',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ports:[8889,502,2404]})})
      } else {
        await fetch('/api/capture/start',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ports:'8889,502,2404'})})
      }
      capturing.value = true
      timer = setInterval(async () => {
        try {
          const url = source.value==='local'?'http://localhost:8765/api/packets?limit=5':'/api/packets?limit=5'
          const r = await fetch(url); const d = await r.json()
          if (d.packets?.length) {
            livePackets.value = d.total
            packets.value = [...d.packets.map(p=>({id:Date.now()%100000,dir:p.dir,src:p.src,dst:p.dst,sz:p.len,msg:p.proto||'?',hex:p.hex,fields:[{f:'协议',v:p.proto||'?',d:'实时解析'}]})), ...packets.value].slice(0,50)
          }
        } catch {}
      }, 3000)
    } catch { ElMessage.warning('抓包启动失败: 检查 capture_server 或远程 WinRM 连接') }
  }
}

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.a11-page{padding:16px;background:#141520;min-height:100vh}
.page-title{font-size:18px;font-weight:600;color:#e0e0e0;margin-bottom:12px}
.sub{font-size:12px;color:#909399;font-weight:400;margin-left:8px}
.info{font-size:13px;color:#c0c4cc;margin-bottom:8px}
.hex-title{font-size:13px;color:#e6a23c;font-weight:bold;margin:8px 0 4px}
.hex{background:#0d0e14;border-radius:4px;padding:10px;font-family:Consolas,monospace;font-size:12px;color:#e6a23c;line-height:1.8;word-break:break-all}
.path{font-family:Consolas,monospace;font-size:12px;color:#67c23a;padding:3px 0;border-bottom:1px solid #2d2e3b}
.dev{padding:6px 0;border-bottom:1px solid #2d2e3b}
:deep(.el-card){background:#1d1e2b;border-color:#2d2e3b;color:#e0e0e0;margin-bottom:12px}
:deep(.el-card__header){color:#c0c4cc;border-bottom-color:#2d2e3b;padding:8px 12px}
:deep(.el-table){--el-table-bg-color:#1d1e2b;--el-table-tr-bg-color:#1d1e2b;--el-table-header-bg-color:#252636;--el-table-border-color:#2d2e3b;--el-table-text-color:#c0c4cc;font-size:12px}
:deep(.el-table__row){cursor:pointer}
:deep(.el-radio-button__inner){background:#1d1e2b;border-color:#2d2e3b;color:#c0c4cc}
code{color:#e6a23c;font-family:Consolas,monospace;font-size:11px;background:#252636;padding:1px 4px;border-radius:2px}
</style>