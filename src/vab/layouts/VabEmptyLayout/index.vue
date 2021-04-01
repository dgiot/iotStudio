/* 多级路由时空白外框可调用，子组件不支持缓存子级路由 */
<template>
  <vab-keep-alive />
</template>

<script>
  export default {
    name: 'VabEmptyLayout',
  }
</script>
