<template>
  <div class="comprehensive-table-container">
    {{ '物联卡管理 敬请期待！！！' }}
  </div>
</template>

<script>
  import {
    putDevice,
    querycompanyDevice,
    postDevice,
    delDevice,
  } from '@/api/Device'
  export default {
    data() {
      return {}
    },
    computed: {},
    created() {},
    mounted() {},
    methods: {},
  }
</script>
<style lang="scss" scoped>
  .dialog-map,
  .map {
    display: block;
    width: 100%;
    height: 300px;
  }
  .wrap_konva {
    box-sizing: border-box !important;
    position: relative;
    .vue_component {
      position: absolute;
      z-index: 99999;
      // background-color: #0077b8;
    }
  }
</style>
