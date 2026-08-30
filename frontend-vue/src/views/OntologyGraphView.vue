<!--
  OntologyGraphView — 本体图谱 Force 图（合并自 plugins-base/ontology_view.html）
  独立静态页 public/ontology_graph.html（ECharts force 布局，CDN 加载），iframe 内嵌。
  与 public/ontology.html（DLAS 树形浏览器）互补：树形看层级，Force 看全貌关系。
-->
<template>
  <div class="ogv">
    <iframe :src="graphUrl" class="ogv-frame" title="本体图谱 Force 图" />
  </div>
</template>

<script setup>
// hash 路由下 location.pathname 不变，相对路径指向 public/ 产物
const graphUrl = './ontology_graph.html'
</script>

<style scoped>
.ogv {
  height: calc(100vh - 64px);
  background: #0f1720;
}
.ogv-frame {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}
</style>
