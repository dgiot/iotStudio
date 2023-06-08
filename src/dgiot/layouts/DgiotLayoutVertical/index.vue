<template>
  <!-- 纵向布局 -->
  <div
    class="dgiot-layout-vertical"
    :class="{
      fixed: fixedHeader,
      'no-tabs-bar': !showTabs,
    }"
  >
    <dgiot-side-bar />
    <div
      v-if="device === 'mobile' && !collapse"
      class="v-modal"
      @click="handleFoldSideBar"
    />
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
        <dgiot-nav />
        <dgiot-tabs v-show="showTabs" />
      </div>
      <dgiot-app-main />
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'DgiotLayoutVertical',
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
    methods: {
      ...mapActions({
        handleFoldSideBar: 'settings/foldSideBar',
      }),
    },
  }
</script>

<style lang="scss" scoped>
  .dgiot-layout-vertical {
    z-index: 99;

    .fixed-header {
      left: $base-left-menu-width;
      width: $base-right-content-width;
    }
  }
</style>
