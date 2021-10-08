<template>
  <!--常规布局 -->
  <div
    class="vab-layout-common"
    :class="{
      fixed: fixedHeader,
      'no-tabs-bar': !showTabs,
    }"
  >
    <div
      class="vab-layout-header"
      :class="{
        'fixed-header': fixedHeader,
      }"
    >
      <vab-header layout="common" />
      <div>
        <vab-side-bar layout="common" />
        <div
          v-show="showTabs"
          class="vab-main"
          :class="{
            'is-collapse-main': collapse,
          }"
        >
          <vab-tabs layout="common" />
        </div>
      </div>
    </div>
    <div
      class="vab-main main-padding"
      :class="{
        'is-collapse-main': collapse,
      }"
    >
      <vab-app-main />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'VabLayoutCommon',
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
  .vab-layout-common {
    .vab-main {
      .fixed-header {
        left: $base-left-menu-width;
        width: $base-right-content-width;
      }
    }

    ::v-deep {
      .vab-tabs-content {
        width: calc(
          100% - #{$base-top-bar-height} - #{$base-font-size-default} - #{$base-padding} -
            2px
        ) !important;
      }

      .vab-header {
        .vab-main {
          width: 100%;
          margin: auto $base-margin;
        }
      }
    }
  }
</style>
