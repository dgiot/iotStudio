<template>
  <div class="alarm-page">
    <div class="toolbar">
      <h3 style="color:#c0d5e8;margin:0">🚨 告警管理</h3>
      <el-radio-group v-model="filter" size="small">
        <el-radio-button label="active">活跃</el-radio-button>
        <el-radio-button label="confirmed">已确认</el-radio-button>
        <el-radio-button label="cleared">已清除</el-radio-button>
        <el-radio-button label="">全部</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 统计分类 + 饼图 -->
    <el-row :gutter="12" style="margin-bottom:12px">
      <el-col :span="3">
        <div class="stat-card danger" @click="filter='active'">
          <div class="sc-num">{{ stats.active }}</div><div class="sc-lbl">活跃</div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="stat-card warn" @click="filter='confirmed'">
          <div class="sc-num">{{ stats.confirmed }}</div><div class="sc-lbl">已确认</div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="stat-card ok">
          <div class="sc-num">{{ stats.cleared }}</div><div class="sc-lbl">已清除</div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="stat-card info">
          <div class="sc-num">{{ stats.total }}</div><div class="sc-lbl">总计</div>
        </div>
      </el-col>
      <el-col :span="6">
        <v-chart :option="severityChart" style="height:80px" autoresize />
      </el-col>
      <el-col :span="6">
        <v-chart :option="channelChart" style="height:80px" autoresize />
      </el-col>
    </el-row>

    <!-- list-detail 布局 -->
    <div class="list-detail">
      <div class="ld-list">
        <div v-for="a in pagedAlarms" :key="a.alarm_id"
          class="alarm-row" :class="{active:sel?.alarm_id===a.alarm_id}"
          @click="sel = sel?.alarm_id===a.alarm_id ? null : a">
          <div class="ar-sev" :class="a.alarm_level||a.severity">
            {{ (a.alarm_level||a.severity||'P2').toUpperCase() }}
          </div>
          <div class="ar-main">
            <div class="ar-msg">{{ a.alarm_msg||a.message }}</div>
            <div class="ar-meta">{{ a.device_id||a.device_type||'—' }} · {{ a.alarm_type||'告警' }}</div>
          </div>
          <div style="text-align:right;flex-shrink:0">
            <div class="ar-time">{{ formatTime(a.created_at||a.createdAt) }}</div>
            <el-tag :type="(a.status||'active')==='active'?'danger':(a.status==='confirmed'?'warning':'success')" size="small">{{ statusMap[a.status||'active'] }}</el-tag>
          </div>
        </div>
        <div class="ld-footer">
          <span class="pg-btn" @click="page=Math.max(1,page-1)">◀</span>
          <span>{{ page }}/{{ totalPages }} · {{ alarms.length }} 条</span>
          <span class="pg-btn" @click="page=Math.min(totalPages,page+1)">▶</span>
        </div>
      </div>

      <div class="ld-detail" v-if="sel">
        <div class="ldd-header">
          <span :class="'sev-badge '+(sel.alarm_level||sel.severity)">{{ (sel.alarm_level||sel.severity||'P2').toUpperCase() }}</span>
          <span class="ldd-title">{{ sel.alarm_msg||sel.message }}</span>
          <el-tag :type="(sel.status||'active')==='active'?'danger':'success'" size="small">{{ statusMap[sel.status||'active'] }}</el-tag>
        </div>

        <el-row :gutter="10" style="margin:12px 0">
          <el-col :span="6"><div class="ldd-kpi"><div class="lk-val">{{ formatTime(sel.created_at||sel.createdAt) }}</div><div class="lk-lbl">触发时间</div></div></el-col>
          <el-col :span="6"><div class="ldd-kpi"><div class="lk-val" style="color:#409EFF">{{ sel.device_id||sel.device_type||'—' }}</div><div class="lk-lbl">关联设备</div></div></el-col>
          <el-col :span="6"><div class="ldd-kpi"><div class="lk-val">{{ sel.alarm_type||'告警' }}</div><div class="lk-lbl">告警类型</div></div></el-col>
          <el-col :span="6"><div class="ldd-kpi"><div class="lk-val">{{ severityLabel(sel.alarm_level||sel.severity) }}</div><div class="lk-lbl">严重度</div></div></el-col>
        </el-row>

        <div class="ldd-section">处理建议</div>
        <div class="ldd-advice">{{ getAdvice(sel) }}</div>

        <div class="ldd-section">历史同类告警</div>
        <div class="history-list">
          <div v-for="h in historyAlarms" :key="h.alarm_id" class="hl-row">
            <span :class="'sev-dot '+(h.alarm_level||h.severity)"></span>
            <span style="color:#8aa0b4;font-size:11px;margin-right:8px">{{ formatTime(h.created_at) }}</span>
            <span style="font-size:12px">{{ h.alarm_msg }}</span>
            <el-tag size="small" style="margin-left:auto" :type="h.status==='cleared'?'success':'info'">{{ statusMap[h.status] }}</el-tag>
          </div>
        </div>

        <div class="ldd-actions">
          <el-button v-if="(sel.status||'active')==='active'" type="warning" size="small" @click="handleConfirm(sel.alarm_id)">✅ 确认告警</el-button>
          <el-button v-if="(sel.status||'active')!=='cleared'" type="success" size="small" @click="handleClear(sel.alarm_id)">🔕 清除告警</el-button>
        </div>
      </div>
      <div class="ld-detail ld-empty" v-else>
        <span>👈 点击左侧告警查看详情</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { getAlarms, confirmAlarm, clearAlarm } from '../api'
import { ElMessage } from 'element-plus'

const filter = ref('active')
const alarms = ref([])
const sel = ref(null)
const page = ref(1); const pageSize = 10
const statusMap = { active: '活跃', confirmed: '已确认', cleared: '已清除' }

// 饼图: 严重度分布
const severityChart = computed(() => ({
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie', radius: ['55%','85%'], center: ['50%','50%'],
    label: { show: false },
    data: [
      { value: stats.value.danger, name: '危险', itemStyle: { color: '#ef5350' } },
      { value: stats.value.warn, name: '注意', itemStyle: { color: '#E6A23C' } },
      { value: stats.value.info, name: '提示', itemStyle: { color: '#409EFF' } },
    ]
  }]
}))

// 饼图: 通道分布
const channelChart = computed(() => ({
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie', radius: ['55%','85%'], center: ['50%','50%'],
    label: { show: false },
    data: [
      { value: stats.value.ch_oil, name: '油液监测', itemStyle: { color: '#00d4aa' } },
      { value: stats.value.ch_vib, name: '声振温', itemStyle: { color: '#ab47bc' } },
      { value: stats.value.ch_boiler, name: '锅炉能效', itemStyle: { color: '#ff9800' } },
      { value: stats.value.ch_bolt, name: '智能螺栓', itemStyle: { color: '#66d9ff' } },
      { value: stats.value.ch_other, name: '其他', itemStyle: { color: '#6a8aaa' } },
    ]
  }]
}))

const pagedAlarms = computed(() => alarms.value.slice((page.value-1)*pageSize, page.value*pageSize))
const totalPages = computed(() => Math.max(1, Math.ceil(alarms.value.length / pageSize)))

const stats = computed(() => {
  const all = alarms.value
  return {
    total: all.length,
    active: all.filter(a => (a.status||'active')==='active').length,
    confirmed: all.filter(a => a.status==='confirmed').length,
    cleared: all.filter(a => a.status==='cleared').length,
    danger: all.filter(a => (a.severity||'')==='danger'||(a.alarm_level||'')==='P0').length,
    warn: all.filter(a => (a.severity||'')==='warn'||(a.alarm_level||'')==='P1').length,
    info: all.filter(a => (a.severity||'')==='info'||(a.alarm_level||'')==='P2').length,
    ch_oil: all.filter(a => (a.device_type||'').includes('油液')).length,
    ch_vib: all.filter(a => (a.device_type||'').includes('声振')).length,
    ch_boiler: all.filter(a => (a.device_type||'').includes('锅炉')).length,
    ch_bolt: all.filter(a => (a.device_type||'').includes('螺栓')).length,
    ch_other: all.filter(a => !['油液','声振','锅炉','螺栓'].some(t => (a.device_type||'').includes(t))).length,
    channels: [
      { name: '声振温', alarms: all.filter(a => (a.device_type||'').includes('声振')).length },
      { name: '油液监测', alarms: all.filter(a => (a.device_type||'').includes('油液')).length },
      { name: '锅炉能效', alarms: all.filter(a => (a.device_type||'').includes('锅炉')).length },
      { name: '智能螺栓', alarms: all.filter(a => (a.device_type||'').includes('螺栓')).length },
    ]
  }
})

// 同类历史告警
const historyAlarms = computed(() => {
  if (!sel.value) return []
  const type = sel.value.alarm_type || sel.value.alarm_msg?.slice(0,4)
  return alarms.value.filter(a => a.alarm_id !== sel.value?.alarm_id && (
    a.alarm_type === type || a.alarm_msg?.includes(type?.slice(0,4))
  )).slice(0, 5)
})

function severityLabel(s) {
  return s==='P0'||s==='danger'?'危险': s==='P1'||s==='warn'?'注意': '提示'
}
function getAdvice(a) {
  const msg = (a.alarm_msg||'').toLowerCase()
  if (msg.includes('振动')||msg.includes('rms')) return '1. 立即检查设备运行状态\n2. 对比历史振动趋势\n3. 安排现场巡检确认'
  if (msg.includes('温度')||msg.includes('排烟')) return '1. 检查燃烧器工况\n2. 确认燃料供应正常\n3. 必要时减负荷运行'
  if (msg.includes('含水')||msg.includes('颗粒')||msg.includes('粘度')) return '1. 取样送实验室分析\n2. 检查过滤器状态\n3. 评估换油周期'
  return '1. 确认告警真实性\n2. 检查关联设备状态\n3. 记录处理结果'
}
function formatTime(ts) { return ts ? new Date(ts).toLocaleString() : '-' }

async function load() {
  try { const r = await getAlarms({ status: filter.value || undefined }); alarms.value = r.data.alarms || [] } catch {}
  page.value = 1
}
async function handleConfirm(id) { await confirmAlarm(id); ElMessage.success('已确认'); load() }
async function handleClear(id) { await clearAlarm(id); ElMessage.success('已清除'); load() }

watch(filter, load)
watch(page, () => {})
onMounted(load)
</script>

<style scoped>
.alarm-page { color: #c0d5e8; display: flex; flex-direction: column; height: calc(100vh - 100px); }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-shrink: 0; }

/* 统计卡片 */
.stat-card { padding: 10px 12px; border-radius: 6px; cursor: pointer; transition: all .2s; text-align: center; }
.stat-card:hover { filter: brightness(1.2); }
.stat-card.danger { background: linear-gradient(135deg, #3a1010, #4a1515); border: 1px solid #5a2020; }
.stat-card.warn { background: linear-gradient(135deg, #3a2a10, #4a3515); border: 1px solid #5a4020; }
.stat-card.ok { background: linear-gradient(135deg, #103a10, #154a15); border: 1px solid #205a20; }
.stat-card.info { background: #152a40; border: 1px solid #1e3a5f; }
.stat-card.ch { background: #0d1f33; border: 1px solid #1e3a5f; padding: 8px 12px; text-align: left; }
.sc-num { font-size: 24px; font-weight: bold; }
.sc-lbl { font-size: 11px; color: #6a8aaa; }

/* list-detail */
.list-detail { display: flex; gap: 12px; flex: 1; min-height: 0; }
.ld-list { width: 480px; flex-shrink: 0; overflow-y: auto; border: 1px solid #1e3a5f; border-radius: 6px; background: #0a1a2a; display: flex; flex-direction: column; }
.ld-detail { flex: 1; overflow-y: auto; border: 1px solid #1e3a5f; border-radius: 6px; background: #0d1f33; padding: 12px 16px; }
.ld-empty { display: flex; align-items: center; justify-content: center; color: #5a7a9a; }
.ld-footer { padding: 8px; text-align: center; font-size: 12px; color: #6a8aaa; border-top: 1px solid #1e3a5f; margin-top: auto; }

/* 告警行 */
.alarm-row { display: flex; align-items: center; gap: 10px; padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #162d45; }
.alarm-row:hover { background: #112233; }
.alarm-row.active { background: #152a40; border-left: 3px solid #ef5350; }
.ar-sev { width: 36px; height: 22px; border-radius: 4px; font-size: 10px; font-weight: bold; color: #fff; display: flex; align-items: center; justify-content: center; text-transform: uppercase; flex-shrink: 0; }
.ar-sev.danger,.ar-sev.p0 { background: #ef5350; }
.ar-sev.warn,.ar-sev.p1 { background: #E6A23C; }
.ar-sev.info,.ar-sev.p2 { background: #409EFF; }
.ar-main { flex: 1; min-width: 0; }
.ar-msg { font-size: 13px; color: #e0e0e0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ar-meta { font-size: 11px; color: #6a8aaa; }
.ar-time { font-size: 10px; color: #5a7a9a; }

/* 详情 */
.ldd-header { display: flex; align-items: center; gap: 10px; }
.ldd-title { font-size: 15px; color: #e0e0e0; font-weight: bold; }
.sev-badge { width: 40px; height: 24px; border-radius: 4px; font-size: 11px; font-weight: bold; color: #fff; display: flex; align-items: center; justify-content: center; }
.sev-badge.danger { background: #ef5350; } .sev-badge.warn { background: #E6A23C; } .sev-badge.info { background: #409EFF; }
.ldd-kpi { text-align: center; padding: 6px; background: #0a1a2a; border-radius: 4px; }
.lk-val { font-size: 14px; font-weight: bold; }
.lk-lbl { font-size: 10px; color: #6a8aaa; }
.ldd-section { font-size: 12px; color: #909399; font-weight: 600; margin: 12px 0 6px; }
.ldd-advice { font-size: 12px; color: #8aa0b4; white-space: pre-line; background: #0a1a2a; padding: 8px; border-radius: 4px; }
.ldd-actions { margin-top: 12px; display: flex; gap: 8px; }

/* 历史 */
.history-list { max-height: 160px; overflow-y: auto; }
.hl-row { display: flex; align-items: center; gap: 6px; padding: 4px 0; border-bottom: 1px solid #0d1f33; }
.sev-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.sev-dot.danger { background: #ef5350; } .sev-dot.warn { background: #E6A23C; } .sev-dot.info { background: #409EFF; }
.pg-btn { cursor: pointer; color: #409EFF; padding: 0 6px; user-select: none; }
.pg-btn:hover { color: #66d9ff; }
</style>
