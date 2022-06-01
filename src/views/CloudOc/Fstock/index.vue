<!--
* @Author: dgiot-fe <dgiot@foxmail.com>
* @Date: 2022-03-29 20:03:26
* @LastEditors: 20:03
* @LastEditTime: 2022-03-29 20:03:26
* @Description:
* @FilePath: src\views\CloudOc\Fstock\index.vue
* @DocumentLink: https://dev.iotn2n.com
* @github: https://github.com/dgiot/dgiot-dashboard.git
* @name: index
-->
<template>
  <div class="index-container">
    <empty />
  </div>
</template>

<script>
  import empty from '@/views/DeviceCloud/empty/index.vue'

  export default {
    name: 'Index',
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
  .index-container {
    width: 100%;
    height: 100%;
  }
</style>
