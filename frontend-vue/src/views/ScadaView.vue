<template>
  <div class="scada-view">
    <div class="topbar">
      <h2>⚡ 光储充微电网 — 2D 组态</h2>
      <div class="tags">
        <el-tag v-for="v in views" :key="v.key" :type="currentView===v.key?'':'info'" size="small" style="cursor:pointer;margin-left:6px" @click="currentView=v.key" effect="dark">{{ v.label }}</el-tag>
        <span style="margin-left:16px;color:#8899aa;font-size:13px">
          在线: <b style="color:#4fc3f7">{{ stats.online }}</b> &nbsp; 采集: <b style="color:#ffc107">{{ stats.collects }}</b>
        </span>
      </div>
    </div>
    <div class="canvas-wrap">
      <canvas ref="canvas" id="scada-canvas"></canvas>
      <div id="tooltip" class="tooltip" v-show="tooltip.show" :style="{left:tooltip.x+'px',top:tooltip.y+'px'}">
        <div class="tt-name">{{ tooltip.name }}</div>
        <div class="tt-row" v-for="d in tooltip.data" :key="d.name"><span>{{ d.name }}</span><span class="val">{{ d.value }}</span></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { getStats } from '../api'

const views = [{key:'overview',label:'总览'},{key:'solar',label:'光伏'},{key:'storage',label:'储能'},{key:'charger',label:'充电桩'}]
const currentView = ref('overview')
const canvas = ref(null)
const stats = ref({online:0,collects:0})
const tooltip = ref({show:false,x:0,y:0,name:'',data:[]})
let ws = null, ctx = null, animId = null, latestData = {}

const layout = {
  overview: [
    {x:0.04,y:0.10,w:0.10,h:0.16,label:'光伏阵列',icon:'☀️',color:'#2e7d32'},
    {x:0.04,y:0.35,w:0.10,h:0.22,label:'储能系统',icon:'🔋',color:'#1565c0'},
    {x:0.04,y:0.68,w:0.10,h:0.16,label:'充电桩',icon:'🔌',color:'#5c3d8f'},
    {x:0.20,y:0.15,w:0.18,h:0.10,label:'逆变器',icon:'⚙️',color:'#0d47a1'},
    {x:0.20,y:0.42,w:0.18,h:0.10,label:'PCS变流器',icon:'⚡',color:'#0d47a1'},
    {x:0.44,y:0.28,w:0.12,h:0.10,label:'变压器',icon:'🔄',color:'#4e342e'},
    {x:0.62,y:0.12,w:0.14,h:0.12,label:'电网接口',icon:'🏭',color:'#1a237e'},
    {x:0.62,y:0.42,w:0.14,h:0.12,label:'本地负荷',icon:'🏠',color:'#1a237e'},
    {x:0.82,y:0.28,w:0.10,h:0.12,label:'数据推送',icon:'📤',color:'#004d40'},
    {type:'line',x1:0.14,y1:0.18,x2:0.20,y2:0.20,color:'#ffc107'},
    {type:'line',x1:0.14,y1:0.46,x2:0.20,y2:0.47,color:'#ffc107'},
    {type:'line',x1:0.38,y1:0.20,x2:0.44,y2:0.33,color:'#ffc107'},
    {type:'line',x1:0.38,y1:0.47,x2:0.44,y2:0.33,color:'#ffc107'},
    {type:'line',x1:0.56,y1:0.33,x2:0.62,y2:0.18,color:'#4fc3f7'},
    {type:'line',x1:0.56,y1:0.33,x2:0.62,y2:0.48,color:'#4fc3f7'},
    {type:'line',x1:0.76,y1:0.18,x2:0.82,y2:0.34,color:'#66bb6a'},
    {type:'line',x1:0.76,y1:0.48,x2:0.82,y2:0.34,color:'#66bb6a'},
  ],
  solar: [{x:0.08,y:0.15,w:0.25,h:0.20,label:'光伏阵列',icon:'☀️',color:'#2e7d32'},{x:0.42,y:0.20,w:0.22,h:0.12,label:'组串式逆变器',icon:'⚙️',color:'#0d47a1'},{x:0.42,y:0.45,w:0.22,h:0.12,label:'集中式逆变器',icon:'⚙️',color:'#0d47a1'},{x:0.72,y:0.28,w:0.14,h:0.10,label:'升压变',icon:'🔄',color:'#4e342e'}],
  storage: [{x:0.08,y:0.20,w:0.22,h:0.16,label:'电池堆',icon:'🔋',color:'#1565c0'},{x:0.38,y:0.22,w:0.22,h:0.14,label:'PCS变流器',icon:'⚡',color:'#0d47a1'},{x:0.38,y:0.48,w:0.22,h:0.14,label:'BMS管理',icon:'📊',color:'#37474f'},{x:0.68,y:0.28,w:0.16,h:0.14,label:'隔离变压器',icon:'🔄',color:'#4e342e'}],
  charger: [{x:0.06,y:0.20,w:0.16,h:0.14,label:'直流快充#1',icon:'🔌',color:'#5c3d8f'},{x:0.06,y:0.46,w:0.16,h:0.14,label:'直流快充#2',icon:'🔌',color:'#5c3d8f'},{x:0.30,y:0.20,w:0.16,h:0.14,label:'交流桩#1',icon:'🔌',color:'#00695c'},{x:0.30,y:0.46,w:0.16,h:0.14,label:'交流桩#2',icon:'🔌',color:'#00695c'},{x:0.56,y:0.28,w:0.16,h:0.14,label:'配电柜',icon:'⚡',color:'#37474f'},{x:0.80,y:0.28,w:0.12,h:0.14,label:'监控终端',icon:'🖥️',color:'#0d47a1'}],
}

function resize(){if(canvas.value){canvas.value.width=canvas.value.parentElement.clientWidth;canvas.value.height=canvas.value.parentElement.clientHeight;draw()}}
function draw(){
  if(!canvas.value) return
  const w=canvas.value.width,h=canvas.value.height;ctx=canvas.value.getContext('2d')
  ctx.clearRect(0,0,w,h)
  ctx.strokeStyle='#122540';ctx.lineWidth=0.5
  for(let x=0;x<w;x+=50)ctx.strokeRect(x,0,0,h)
  for(let y=0;y<h;y+=50)ctx.strokeRect(0,y,w,0)
  const objs=layout[currentView.value]||layout.overview
  objs.forEach(o=>{
    if(o.type==='line'){
      ctx.strokeStyle=o.color;ctx.lineWidth=3
      ctx.beginPath();ctx.moveTo(o.x1*w,o.y1*h);ctx.lineTo(o.x2*w,o.y2*h);ctx.stroke()
      const mx=(o.x1+o.x2)/2*w,my=(o.y1+o.y2)/2*h,ang=Math.atan2((o.y2-o.y1)*h,(o.x2-o.x1)*w)
      ctx.save();ctx.translate(mx,my);ctx.rotate(ang)
      ctx.fillStyle=o.color;ctx.beginPath();ctx.moveTo(8,0);ctx.lineTo(-5,-4);ctx.lineTo(-5,4);ctx.fill();ctx.restore()
    }else{
      const x=o.x*w,y=o.y*h,rw=o.w*w,rh=o.h*h
      ctx.fillStyle=o.color;ctx.globalAlpha=0.5;ctx.fillRect(x,y,rw,rh);ctx.globalAlpha=1
      ctx.strokeStyle='#4fc3f7';ctx.lineWidth=2;ctx.strokeRect(x,y,rw,rh)
      ctx.font='28px serif';ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText(o.icon||'',x+rw/2,y+rh/2+4)
      ctx.font='13px "Microsoft YaHei"';ctx.fillStyle='#c0d5e8';ctx.fillText(o.label,x+rw/2,y+rh+18)
      ctx.font='11px "Microsoft YaHei"';ctx.fillStyle='#4fc3f7'
      const keys=Object.keys(latestData)
      if(keys.length>0&&o.label){const d=latestData[keys[Math.floor(Math.random()*keys.length)]];if(d&&d.length)ctx.fillText(`${d[0].value||'--'} ${d[0].unit||''}`,x+rw/2,y+rh+32)}
    }
  })
  animId=requestAnimationFrame(draw)
}

onMounted(async()=>{
  await nextTick();resize();window.addEventListener('resize',resize)
  const proto=location.protocol==='https:'?'wss':'ws'
  ws=new WebSocket(`${proto}://${location.host}/ws`)
  ws.onmessage=ev=>{
    const msg=JSON.parse(ev.data)
    if(msg.type==='telemetry'){latestData[msg.device_id]=msg.data;stats.value.collects++}
  }
  setInterval(async()=>{try{const r=await getStats();stats.value.online=r.data.online_devices;stats.value.collects=r.data.total_collects}catch{}},5000)
})
onUnmounted(()=>{ws?.close();cancelAnimationFrame(animId);window.removeEventListener('resize',resize)})
</script>

<style scoped>
.scada-view{display:flex;flex-direction:column;height:calc(100vh - 70px)}
.topbar{display:flex;justify-content:space-between;align-items:center;padding:8px 0;margin-bottom:8px}
.topbar h2{color:#c0d5e8;font-size:16px}
.canvas-wrap{flex:1;position:relative;overflow:hidden;background:#0a1628;border-radius:8px;border:1px solid #1a3a5c}
#scada-canvas{display:block}
.tooltip{position:absolute;background:#132540e0;border:1px solid #4fc3f7;border-radius:8px;padding:10px 14px;min-width:180px;z-index:100;pointer-events:none}
.tooltip .tt-name{font-size:15px;font-weight:bold;color:#4fc3f7;margin-bottom:5px}
.tooltip .tt-row{font-size:12px;margin:3px 0;display:flex;justify-content:space-between}
.tooltip .tt-row .val{color:#fff;font-weight:bold;margin-left:20px}
</style>
