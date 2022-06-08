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
      <iframe frameborder="0" :src="iframeSrc"></iframe>
    </div>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex'
  export default {
    name: 'Grafana',
    components: {},
    props: {},
    data() {
      return {
        iframeSrc:
          process.env.NODE_ENV !== 'development'
            ? location.protocol + '//' + location.hostname + ':3000'
            : 'http://101.32.99.133:3000/login',
      }
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {
      this.setTreeFlag(false)
    },
    destroyed() {},
    methods: {
      ...mapMutations({
        setTreeFlag: 'settings/setTreeFlag',
      }),
    },
  }
</script>

<style lang="scss" scoped>
  .grafana-container {
    width: 100%;
    heigth: 100%;
    iframe {
      display: block; /* iframes are inline by default */
      width: 100vw;
      height: 100vh; /* Viewport-relative units */
      background: #000;
      border: none; /* Reset default border */
    }
  }
</style>
