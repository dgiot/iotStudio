<template>
  <div class="workbench-container">
    <el-row :gutter="20">
      <el-col :lg="8" :md="12" :sm="24" :xl="6" :xs="24">
        <order />
      </el-col>
      <el-col :lg="16" :md="12" :sm="24" :xl="18" :xs="24">
        <target />
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Order from './components/Order'
  import Target from './components/Target'

  export default {
    name: 'Workbench',
    components: {
      Order,
      Target,
    },
  }
</script>

<style lang="scss" scoped>
  .workbench-container {
    padding: 0 !important;
    background: $base-color-background !important;
  }
</style>
