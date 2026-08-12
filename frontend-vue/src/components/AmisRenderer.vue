<!-- AMIS 低代码渲染器 — 插件解耦核心
===========================================
Product.thing → AMIS Schema → 自动生成页面
新设备类型只需定义 Product.thing，零前端代码
-->
<template>
  <div ref="container" class="amis-renderer" />
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'

const container = ref(null)
const props = defineProps({
  schema: { type: Object, default: () => ({ type: 'page', body: 'Loading...' }) },
  data: { type: Object, default: () => ({}) },
})

let amisInstance = null

async function loadAmis() {
  if (window.amisRequire) return window.amisRequire
  return new Promise((resolve) => {
    const script = document.createElement('script')
    // 优先本地, 离线可用
    script.src = '/amis-sdk.js'
    script.onerror = () => { script.src = 'https://unpkg.com/amis@6.11.0/sdk/sdk.js' }
    script.onload = () => resolve(window.amisRequire)
    document.head.appendChild(script)
  })
}

async function render() {
  const amis = await loadAmis()
  if (!container.value) return
  if (amisInstance) amisInstance.unmount()
  amisInstance = amis.embed(container.value, props.schema, props.data, {
    theme: 'dark',
  })
}

// 从 Product.thing 生成 AMIS Schema
function thingToSchema(thing, productId) {
  const props = (thing?.properties || []).map(p => ({
    type: 'input-number',
    name: p.identifier,
    label: p.name,
    unit: p.dataType?.specs?.unit || '',
    min: p.dataType?.specs?.min,
    max: p.dataType?.specs?.max,
    readOnly: true,
  }))
  const events = (thing?.events || []).map(e => ({
    label: e.name,
    body: e.desc,
    level: e.type === 'alarm' ? 'danger' : 'info',
  }))
  return {
    type: 'page',
    title: productId,
    body: [
      { type: 'grid', columns: [
        { body: [{ type: 'card', header: { title: '实时测点' }, body: { type: 'form', body: props } }] },
        { body: [{ type: 'card', header: { title: '告警规则' }, body: events }] },
      ]},
    ],
  }
}

defineExpose({ thingToSchema })

watch(() => [props.schema, props.data], () => nextTick(render), { deep: true })
onMounted(() => nextTick(render))
</script>

<style scoped>
.amis-renderer { min-height: 200px; }
</style>
