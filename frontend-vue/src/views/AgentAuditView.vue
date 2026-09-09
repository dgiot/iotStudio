<!--
  AgentAuditView — 质量审计 Agent (R4: 六维检查 / 评分 / 提案审批闭环)
  后端: /api/graphrag/aip/agent/{audit,proposals,runs}
  铁律: 提案绝不自动执行 — 仅管理员 approve (执行+审计回执) / dismiss (留痕)
-->
<template>
  <div class="aav">
    <div class="topbar">
      <h3 class="title">🛡️ 质量审计 Agent</h3>
      <div class="topbar-right">
        <el-switch v-model="withLlm" active-text="LLM 归因" size="small" />
        <el-button type="primary" size="small" :loading="auditing" @click="runAudit">
          运行审计
        </el-button>
      </div>
    </div>

    <!-- ═══ 审计报告 ═══ -->
    <el-row :gutter="12" v-if="report">
      <el-col :span="8">
        <el-card shadow="never" class="panel">
          <div ref="gaugeEl" class="gauge" />
          <div class="grade-line">
            等级 <el-tag :type="gradeType" effect="dark" size="large">{{ report.grade }}</el-tag>
            <el-tag v-if="report.with_llm" type="success" size="small" style="margin-left:8px">LLM 归因</el-tag>
          </div>
          <div class="sum-line" v-if="report.summary">
            发现 {{ report.summary.total }} 项:
            <el-tag type="danger" size="small" effect="plain">高 {{ report.summary.severity.high }}</el-tag>
            <el-tag type="warning" size="small" effect="plain">中 {{ report.summary.severity.medium }}</el-tag>
            <el-tag type="info" size="small" effect="plain">低 {{ report.summary.severity.low }}</el-tag>
          </div>
          <div class="sum-line note">{{ report.llm_note }}</div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card shadow="never" class="panel">
          <template #header><span class="card-title">发现清单</span></template>
          <el-table :data="report.findings" size="small" max-height="300" stripe>
            <el-table-column label="级别" width="70">
              <template #default="{ row }">
                <el-tag size="small" :type="sevType[row.severity]" effect="dark">{{ row.severity }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="kind" label="类型" width="170" show-overflow-tooltip />
            <el-table-column prop="target" label="目标" width="140" show-overflow-tooltip />
            <el-table-column prop="message" label="说明" show-overflow-tooltip />
          </el-table>
          <el-collapse style="margin-top:10px">
            <el-collapse-item title="Agent Trace (ReAct 步骤)">
              <div v-for="s in report.trace" :key="s.tool" class="trace-step">
                <el-tag size="small" effect="plain">{{ s.tool }}</el-tag>
                <span class="trace-obs">{{ s.observation }}</span>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
    </el-row>

    <el-empty v-else description="点击「运行审计」开始六维检查" class="empty-hint" />

    <!-- ═══ 提案审批 ═══ -->
    <el-card shadow="never" class="panel" style="margin-top:12px">
      <template #header>
        <div class="card-head">
          <span class="card-title">修复提案审批 <span class="iron-rule">⚠ 绝不自动执行</span></span>
          <el-radio-group v-model="prpStatus" size="small" @change="loadProposals">
            <el-radio-button value="pending">待审批</el-radio-button>
            <el-radio-button value="approved">已批准</el-radio-button>
            <el-radio-button value="dismissed">已驳回</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <el-table :data="proposals" size="small" stripe>
        <el-table-column prop="id" label="ID" width="130" show-overflow-tooltip />
        <el-table-column prop="kind" label="类型" width="110">
          <template #default="{ row }">
            <el-tag size="small" :type="row.kind === 'delete_link' ? 'danger' : 'success'" effect="plain">
              {{ row.kind }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="内容" min-width="200">
          <template #default="{ row }">
            <span class="payload">{{ JSON.stringify(row.payload) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="rationale" label="理由" min-width="160" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag size="small" :type="row.status === 'pending' ? 'warning' : row.status === 'approved' ? 'success' : 'info'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="decided_by" label="审批人" width="90" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <template v-if="row.status === 'pending'">
              <el-button size="small" type="success" plain @click="approve(row)">批准执行</el-button>
              <el-button size="small" type="info" plain @click="dismiss(row)">驳回</el-button>
            </template>
            <span v-else class="decided-at">{{ row.decided_at?.slice(0, 16) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="report && report.proposals" class="fresh-hint">
        本次审计新增提案 {{ report.proposals.length }} 条 (上方表格待审批页签可见)
      </div>
    </el-card>

    <!-- ═══ 运行史 ═══ -->
    <el-card shadow="never" class="panel" style="margin-top:12px">
      <template #header><span class="card-title">审计运行史 (trace 落库 = 可追溯数据资产)</span></template>
      <el-table :data="runs" size="small" stripe>
        <el-table-column prop="id" label="运行" width="130" />
        <el-table-column prop="started_at" label="时间" width="180" />
        <el-table-column prop="score" label="得分" width="80" />
        <el-table-column prop="grade" label="等级" width="70" />
        <el-table-column prop="finding_count" label="发现数" width="90" />
        <el-table-column label="LLM" width="70">
          <template #default="{ row }">
            <el-tag size="small" :type="row.with_llm ? 'success' : 'info'" effect="plain">
              {{ row.with_llm ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '../api/graphrag'

const withLlm = ref(false)
const auditing = ref(false)
const report = ref(null)
const gaugeEl = ref(null)
const sevType = { high: 'danger', medium: 'warning', low: 'info' }

const proposals = ref([])
const prpStatus = ref('pending')
const runs = ref([])

const gradeType = computed(() => {
  const g = report.value?.grade
  return g === 'A' ? 'success' : g === 'B' ? 'primary' : g === 'C' ? 'warning' : 'danger'
})

async function runAudit() {
  auditing.value = true
  try {
    report.value = await api.agentAudit(withLlm.value)
    await nextTick()
    drawGauge()
    ElMessage.success(`审计完成: ${report.value.score} 分 (${report.value.grade})`)
    await Promise.all([loadProposals(), loadRuns()])
  } catch (e) {
    ElMessage.error(e.response?.data?.detail || '审计失败 (需管理员)')
  } finally { auditing.value = false }
}

function drawGauge() {
  if (!gaugeEl.value) return
  if (!gaugeEl.value.__chart) gaugeEl.value.__chart = echarts.init(gaugeEl.value)
  const score = report.value.score
  const color = score >= 90 ? '#67c23a' : score >= 75 ? '#409eff' : score >= 60 ? '#e6a23c' : '#f56c6c'
  gaugeEl.value.__chart.setOption({
    series: [{
      type: 'gauge', startAngle: 210, endAngle: -30, min: 0, max: 100,
      progress: { show: true, width: 14, itemStyle: { color } },
      axisLine: { lineStyle: { width: 14, color: [[1, '#24384a']] } },
      axisTick: { show: false }, splitLine: { show: false },
      axisLabel: { color: '#8aa0b4', distance: 18, fontSize: 10 },
      pointer: { show: false },
      detail: { valueAnimation: true, offsetCenter: [0, '10%'],
                formatter: '{value}', fontSize: 30, color },
      title: { offsetCenter: [0, '45%'], color: '#8aa0b4', fontSize: 12 },
      data: [{ value: score, name: '本体健康分' }],
    }],
  }, true)
}

async function loadProposals() {
  try {
    const r = await api.agentProposals(prpStatus.value, 100)
    proposals.value = r.proposals || []
  } catch { proposals.value = [] }
}

async function loadRuns() {
  try {
    const r = await api.agentRuns(20)
    runs.value = r.runs || []
  } catch { runs.value = [] }
}

async function approve(row) {
  try {
    await ElMessageBox.confirm(
      `批准执行 ${row.kind}? ${row.kind === 'delete_link' ? '将删除关系边 ' + row.payload.link_id : '将新增关系边'}`,
      '人工审批', { type: 'warning', confirmButtonText: '批准', cancelButtonText: '取消' })
  } catch { return }
  try {
    await api.agentApprove(row.id)
    ElMessage.success('已批准并执行 (回执已落审计库)')
    await Promise.all([loadProposals(), loadRuns()])
  } catch (e) {
    ElMessage.error(e.response?.data?.detail || '执行失败')
  }
}

async function dismiss(row) {
  let note = ''
  try {
    const r = await ElMessageBox.prompt('驳回理由 (留痕)', '驳回提案', {
      confirmButtonText: '驳回', cancelButtonText: '取消', inputValue: '',
    })
    note = r.value || ''
  } catch { return }
  try {
    await api.agentDismiss(row.id, note)
    ElMessage.success('已驳回 (理由已留痕)')
    loadProposals()
  } catch (e) {
    ElMessage.error(e.response?.data?.detail || '驳回失败')
  }
}

onMounted(() => { loadProposals(); loadRuns() })
</script>

<style scoped>
.aav { padding: 16px; }
.topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.title { margin: 0; font-size: 16px; color: #dfe7ee; }
.topbar-right { display: flex; gap: 14px; align-items: center; }
.panel { background: #16222e; border: 1px solid #24384a; }
.panel :deep(.el-card__header) { padding: 10px 16px; border-bottom: 1px solid #24384a; }
.panel :deep(.el-card__body) { padding: 14px 16px; }
.card-title { color: #dfe7ee; font-size: 13px; }
.card-head { display: flex; justify-content: space-between; align-items: center; }
.iron-rule { color: #e6a23c; font-size: 12px; margin-left: 8px; }
.gauge { width: 100%; height: 190px; }
.grade-line { text-align: center; color: #dfe7ee; margin: 4px 0 8px; }
.sum-line { text-align: center; color: #8aa0b4; font-size: 12px; margin: 6px 0; display: flex; gap: 6px; justify-content: center; }
.sum-line.note { font-size: 11px; opacity: .8; }
.trace-step { display: flex; gap: 8px; align-items: center; padding: 3px 0; }
.trace-obs { color: #8aa0b4; font-size: 12px; }
.payload { color: #8aa0b4; font-size: 11px; word-break: break-all; }
.decided-at { color: #8aa0b4; font-size: 11px; }
.fresh-hint { color: #8aa0b4; font-size: 12px; margin-top: 8px; }
.empty-hint { margin-top: 40px; }
</style>
