<template>
  <!--综合布局 -->
  <div
    :class="{
      fixed: fixedHeader,
      'no-tabs-bar': !showTabs,
    }"
    class="vab-layout-comprehensive"
  >
    <vab-side-bar layout="comprehensive" />
    <div
      :class="{
        'is-collapse-main': collapse,
      }"
      class="vab-main"
    >
      <div
        :class="{
          'fixed-header': fixedHeader,
        }"
        class="vab-layout-header"
      >
        <vab-nav layout="comprehensive" />
        <vab-tabs v-show="showTabs" />
      </div>
      <vab-app-main />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'VabLayoutComprehensive',
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
  .vab-layout-comprehensive {
    .fixed-header {
      left: $base-left-menu-width;
      z-index: 99;
      width: $base-right-content-width;
    }
  }
</style>
