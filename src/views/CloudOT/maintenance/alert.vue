<!--
* @Author: dgiot-fe <dgiot@foxmail.com>
* @Date: 2022-03-29 19:59:21
* @LastEditors: 19:59
* @LastEditTime: 2022-03-29 19:59:21
* @Description:
* @FilePath: src\views\CloudOT\maintenance\alert.vue
* @DocumentLink: https://dev.iotn2n.com
* @github: https://github.com/dgiot/dgiot-dashboard.git
* @name: alert
-->
<template>
  <div class="alert-container">
    <empty />
  </div>
</template>

<script>
  import empty from '@/views/DeviceCloud/empty/index.vue'

  export default {
    name: 'Alert',
    components: { empty },
    props: {},
    data() {
      return {}
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {},
    destroyed() {},
    methods: {},
  }
</script>

<style lang="scss" scoped>
  .alert-container {
    width: 100%;
    height: 100%;
  }
</style>
