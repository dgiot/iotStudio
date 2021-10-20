<template>
  <div class="nodelist">
    <div class="operation">
      <el-button
        icon="el-icon-search"
        type="primary"
      />
      <el-button
        icon="el-icon-delete"
        type="danger"
      />
      <el-button
        icon="el-icon-date"
        type="danger"
      />
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {}
    },
    mounted() {},
    methods: {},
  }
</script>
<style scoped>
  .nodelist {
    box-sizing: border-box;
    width: 100%;
    min-height: 875px;
    padding-left: 10px;
    background: #ffffff;
  }
</style>
