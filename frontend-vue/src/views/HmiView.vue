<template>
  <div class="hmi-page">
    <div class="hmi-bar">
      <span :class="{active:tab==='topo'}" @click="tab='topo'">🔗 设备拓扑</span>
      <span :class="{active:tab==='scada'}" @click="tab='scada'">🎮 流程组态</span>
    </div>
    <TopologyView v-if="tab==='topo'" />
    <ScadaView v-else />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TopologyView from './TopologyView.vue'
import ScadaView from './ScadaView.vue'

const tab = ref('topo')
</script>

<style scoped>
.hmi-bar { display:flex; gap:0; padding:0 16px; background:#141520; border-bottom:1px solid #2d2e3b }
.hmi-bar span { padding:10px 20px; cursor:pointer; color:#909399; font-size:14px; border-bottom:2px solid transparent; transition:all 0.2s }
.hmi-bar span.active { color:#409EFF; border-bottom-color:#409EFF }
.hmi-bar span:hover { color:#c0c4cc }
</style>
