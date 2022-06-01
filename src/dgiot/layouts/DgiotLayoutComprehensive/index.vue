<template>
  <!--综合布局 -->
  <div
    class="dgiot-layout-comprehensive"
    :class="{
      fixed: fixedHeader,
      'no-tabs-bar': !showTabs,
    }"
  >
    <dgiot-side-bar layout="comprehensive" />
    <div
      class="dgiot-main"
      :class="{
        'is-collapse-main': collapse,
      }"
    >
      <div
        class="dgiot-layout-header"
        :class="{
          'fixed-header': fixedHeader,
        }"
      >
        <dgiot-nav layout="comprehensive" />
        <dgiot-tabs v-show="showTabs" />
      </div>
      <dgiot-app-main />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DgiotLayoutComprehensive',
    props: {
      collapse: {
        type: Boolean,
        default() {
          return false
        },
      },
      fixedHeader: {
        type: Boolean,
        default() {
          return true
        },
      },
      showTabs: {
        type: Boolean,
        default() {
          return true
        },
      },
      device: {
        type: String,
        default() {
          return 'desktop'
        },
      },
    },
  }
</script>

<style lang="scss" scoped>
  .dgiot-layout-comprehensive {
    .fixed-header {
      left: $base-left-menu-width;
      z-index: 99;
      width: $base-right-content-width;
    }
  }
</style>
