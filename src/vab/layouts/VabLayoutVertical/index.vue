<template>
  <!-- 纵向布局 -->
  <div
    :class="{
      fixed: fixedHeader,
      'no-tabs-bar': !showTabs,
    }"
    class="vab-layout-vertical"
  >
    <vab-side-bar />
    <div
      v-if="device === 'mobile' && !collapse"
      class="v-modal"
      @click="handleFoldSideBar"
    />
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
        <vab-nav />
        <vab-tabs v-show="showTabs" />
      </div>
      <vab-app-main />
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'VabLayoutVertical',
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
  .vab-layout-vertical {
    z-index: 99;
    .fixed-header {
      left: $base-left-menu-width;
      width: $base-right-content-width;
    }
  }
</style>
