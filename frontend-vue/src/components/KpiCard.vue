<template>
  <div class="kpi-card" :class="{ highlight: highlight }">
    <div class="kpi-icon" v-if="icon"><el-icon :size="20"><component :is="icon" /></el-icon></div>
    <div class="kpi-body">
      <div class="kpi-val" :style="{color}">{{ displayValue }}</div>
      <div class="kpi-label">{{ label }}</div>
      <div class="kpi-sub" v-if="sub">{{ sub }}</div>
    </div>
    <div class="kpi-trend" v-if="trend !== undefined">
      <el-icon :color="trend > 0 ? '#66bb6a' : '#ef5350'"><component :is="trend > 0 ? 'Top' : 'Bottom'" /></el-icon>
      <span :style="{color: trend > 0 ? '#66bb6a' : '#ef5350'}">{{ Math.abs(trend) }}%</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  value: [String, Number], label: String, sub: String,
  color: { type: String, default: '#4fc3f7' },
  icon: String, trend: Number, highlight: Boolean,
  unit: String
})
const displayValue = computed(() => {
  if (props.value === undefined || props.value === null) return '--'
  return props.unit ? `${props.value} ${props.unit}` : props.value
})
</script>

<style scoped>
.kpi-card {
  display: flex; align-items: center; gap: 12px;
  background: #0f1f3a; border: 1px solid #1a3a5c;
  border-radius: 8px; padding: 16px 20px; transition: all 0.3s;
}
.kpi-card.highlight { border-color: #4fc3f7; box-shadow: 0 0 12px rgba(79,195,247,0.1); }
.kpi-val { font-size: 28px; font-weight: bold; line-height: 1.2; }
.kpi-label { font-size: 13px; color: #c0d5e8; margin-top: 2px; }
.kpi-sub { font-size: 11px; color: #a0b8c8; }
.kpi-trend { display: flex; align-items: center; gap: 4px; font-size: 13px; margin-left: auto; }
</style>
