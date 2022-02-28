<template>
  <el-col :span="24">
    <div class="top-panel">
      <slot />
    </div>
  </el-col>
</template>

<script>
  export default {
    name: 'DgiotQueryFormTopPanel',
  }
</script>
