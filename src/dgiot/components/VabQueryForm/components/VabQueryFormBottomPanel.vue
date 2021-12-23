<template>
  <el-col :span="24">
    <div class="bottom-panel">
      <slot />
    </div>
  </el-col>
</template>

<script>
  export default {
    name: 'VabQueryFormBottomPanel',
  }
</script>
