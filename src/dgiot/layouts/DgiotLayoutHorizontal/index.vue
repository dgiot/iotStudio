<template>
  <!-- 横向布局 -->
  <div
    class="dgiot-layout-horizontal"
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
      <dgiot-header />
      <div
        v-show="showTabs"
        :class="{
          'dgiot-tabs-horizontal': showTabs,
        }"
      >
        <div class="dgiot-main">
          <dgiot-tabs />
        </div>
      </div>
    </div>
    <div class="dgiot-main main-padding">
      <dgiot-app-main />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DgiotLayoutHorizontal',
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
  .dgiot-layout-horizontal {
    ::v-deep {
      .dgiot-main {
        width: 100% !important;
        margin: auto;
        margin-left: 0px !important;
      }
    }

    .dgiot-tabs-horizontal {
      background: $base-color-white;
      box-shadow: $base-box-shadow;
    }

    .dgiot-nav {
      .fold-unfold {
        //display: none;
      }
    }
    .main-padding {
      margin-left: 0 !important;
    }
  }
</style>
