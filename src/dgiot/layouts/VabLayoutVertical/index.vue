<template>
  <!-- 纵向布局 -->
  <div
    class="vab-layout-vertical"
    :class="{
      fixed: fixedHeader,
      'no-tabs-bar': !showTabs,
    }"
  >
    <vab-side-bar />
    <div
      v-if="device === 'mobile' && !collapse"
      class="v-modal"
      @click="handleFoldSideBar"
    />
    <div
      class="vab-main"
      :class="{
        'is-collapse-main': collapse,
      }"
    >
      <div
        class="vab-layout-header"
        :class="{
          'fixed-header': fixedHeader,
        }"
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
