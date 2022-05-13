<!--
* @Author: dgiot-fe <dgiot@foxmail.com>
* @Date: 2022-05-12 18:16:41
* @LastEditors: 18:16
* @LastEditTime: 2022-05-12 18:16:41
* @Description:
* @FilePath: src\views\CloudPressure\grafana.vue
* @DocumentLink: https://dev.iotn2n.com
* @github: https://github.com/dgiot/dgiot-dashboard.git
* @name: grafana
-->
<template>
  <div class="grafana-container">
    <div class="grafana">
      <iframe frameborder="0" src="http://101.32.99.133:3000/login"></iframe>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Grafana',
    components: {},
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
  .grafana-container {
    width: 100%;
    heigth: 100%;
    iframe {
      display: block; /* iframes are inline by default */
      background: #000;
      border: none; /* Reset default border */
      height: 100vh; /* Viewport-relative units */
      width: 100vw;
    }
  }
</style>
