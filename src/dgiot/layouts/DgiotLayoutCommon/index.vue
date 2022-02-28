<template>
  <!--常规布局 -->
  <div
    class="dgiot-layout-common"
    :class="{
      fixed: fixedHeader,
      'no-tabs-bar': !showTabs,
    }"
  >
    <div
      class="dgiot-layout-header"
      :class="{
        'fixed-header': fixedHeader,
      }"
    >
      <dgiot-header layout="common" />
      <div>
        <dgiot-side-bar layout="common" />
        <div
          v-show="showTabs"
          class="dgiot-main"
          :class="{
            'is-collapse-main': collapse,
          }"
        >
          <dgiot-tabs layout="common" />
        </div>
      </div>
    </div>
    <div
      class="dgiot-main main-padding"
      :class="{
        'is-collapse-main': collapse,
      }"
    >
      <dgiot-app-main />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DgiotLayoutCommon',
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
  .dgiot-layout-common {
    .dgiot-main {
      .fixed-header {
        left: $base-left-menu-width;
        width: $base-right-content-width;
      }
    }

    ::v-deep {
      .dgiot-tabs-content {
        width: calc(
          100% - #{$base-top-bar-height} - #{$base-font-size-default} - #{$base-padding} -
            2px
        ) !important;
      }

      .dgiot-header {
        .dgiot-main {
          width: 100%;
          margin: auto $base-margin;
        }
      }
    }
  }
</style>
