<!--
  CloseLoop — DGAIOT 业务闭环 PDCA 链路（业务系统化组件）

  业务系统判据：有数据（指标）+ 有流程（环节贯通闭环）。
  PDCA 四阶段（P 计划 / D 执行 / C 检查 / A 处置），每阶段一个环节卡片：
  指标（数据）+ 入口（流程跳转 tab），A→P 回环箭头表示闭环。

  配置项：
    phases [{ key, icon, title, desc, metric, tab }]
      key     'P'|'D'|'C'|'A' 阶段标识
      icon    Shell 图标池 key（grid/bolt/card/bell/terminal/trophy/globe/cog/net/layers/search/users/clipboard/chart/building/box）
      title   环节名称（如 计费模型 / 充电交易 / 结算监控 / 处置闭环）
      desc    一句话（环节做什么）
      metric  指标（数字或字符串，来自业务 API，体现"有数据"）
      tab     流程入口（点击跳到对应业务 tab，体现"有流程"）
    sub      可选，阶段下方补充说明（如 协议/采集链路）
  emit:
    goto(tabKey)  流程入口跳转
-->
<template>
  <div class="cl">
    <div class="cl-head">
      <h3>{{ title }}</h3>
      <p>{{ subtitle }}</p>
    </div>
    <div class="cl-chain">
      <div v-for="(ph, i) in phases" :key="ph.key" class="cl-phase">
        <div class="ph-top">
          <span class="ph-badge" :class="'k' + ph.key">{{ ph.key }}</span>
          <span class="ph-name">{{ ph.title }}</span>
        </div>
        <svg class="ph-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path v-for="(d, di) in ICONS[ph.icon] || ICONS.grid" :key="di" :d="d" />
        </svg>
        <div class="ph-desc">{{ ph.desc }}</div>
        <div class="ph-metric">{{ ph.metric }}</div>
        <button v-if="ph.tab" class="ph-go" @click="$emit('goto', ph.tab)">进入 →</button>
        <svg v-if="i < phases.length - 1" class="ph-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 12h18" /><path d="M15 6l6 6-6 6" />
        </svg>
      </div>
      <!-- A→P 回环 -->
      <div class="cl-loop">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 3a9 9 0 1 0 4 7" /><path d="M17 3v5h-5" />
        </svg>
        <span>闭环回环</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ICONS } from '../../assets/base-icons.js'
const props = defineProps({
  title: { type: String, default: '业务闭环 PDCA' },
  subtitle: { type: String, default: '物联网 → 数据采集 → 协议解析 → 业务流程，四阶段贯通闭环（数据指标 + 流程入口）' },
  phases: { type: Array, required: true },
})
defineEmits(['goto'])
</script>

<style scoped>
.cl-head h3 { font-size: 15px; color: #c9d1d9; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; }
.cl-head h3::before { content: ''; width: 4px; height: 16px; background: #58a6ff; border-radius: 2px; }
.cl-head p { font-size: 11px; color: #6e7681; margin-bottom: 14px; }
.cl-chain { position: relative; display: flex; align-items: stretch; gap: 0; }
.cl-phase {
  position: relative; flex: 1; background: #161b22; border: 1px solid #30363d;
  border-radius: 10px; padding: 14px; display: flex; flex-direction: column; gap: 6px;
  min-width: 0;
}
.ph-top { display: flex; align-items: center; gap: 6px; }
.ph-badge {
  width: 22px; height: 22px; border-radius: 6px; font-size: 12px; font-weight: 700;
  display: inline-flex; align-items: center; justify-content: center;
  color: #fff; flex-shrink: 0;
}
.ph-badge.kP { background: #1f6feb; }
.ph-badge.kD { background: #3fb950; }
.ph-badge.kC { background: #d29922; }
.ph-badge.kA { background: #f85149; }
.ph-name { font-size: 13px; font-weight: 600; color: #e6edf3; }
.ph-ic { width: 34px; height: 34px; color: #58a6ff; margin: 4px 0 2px; }
.ph-desc { font-size: 11px; color: #8b949e; line-height: 1.6; min-height: 34px; }
.ph-metric {
  font-size: 13px; color: #7ee787; font-weight: 700; white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis;
}
.ph-go {
  margin-top: 2px; align-self: flex-start; font-size: 11px; color: #58a6ff;
  background: transparent; border: 1px solid #30363d; border-radius: 6px;
  padding: 3px 10px; cursor: pointer; transition: all .15s;
}
.ph-go:hover { border-color: #1f6feb; background: rgba(31, 111, 235, .12); }
.ph-arrow { position: absolute; right: -14px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: #484f58; z-index: 2; }
.cl-loop {
  position: absolute; right: -8px; bottom: -22px; display: flex; align-items: center; gap: 4px;
  font-size: 10px; color: #484f58;
}
.cl-loop svg { width: 16px; height: 16px; }
@media (max-width: 1100px) {
  .cl-chain { flex-direction: column; gap: 8px; }
  .ph-arrow { transform: rotate(90deg); right: auto; left: 50%; top: auto; bottom: -17px; }
  .cl-loop { right: 8px; bottom: auto; top: -20px; }
}
</style>
