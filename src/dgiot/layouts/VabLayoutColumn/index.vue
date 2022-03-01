<template>
  <!--分栏布局 -->
  <div
    class="dgiot-layout-column"
    :class="{
      fixed: fixedHeader,
      'no-tabs-bar': !showTabs,
    }"
  >
    <column-bar />
    <div
      class="dgiot-main"
      :class="{
        ['dgiot-main-' + theme.columnStyle]: true,
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
  import { mapGetters } from 'vuex'

  export default {
    name: 'DgiotLayoutColumn',
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
    },
    computed: {
      ...mapGetters({
        theme: 'settings/theme',
      }),
    },
  }
</script>

<style lang="scss" scoped>
  .dgiot-layout-column {
    .dgiot-main {
      .fixed-header {
        //left: $base-left-menu-width;
        //width: $base-right-content-width;
      }

      &.is-collapse-main {
        &.dgiot-main-horizontal {
          z-index: 99;
          margin-left: $base-left-menu-width-min * 1.3;

          ::v-deep {
            .fixed-header {
              //left: $base-left-menu-width-min * 1.3;
              //width: calc(100% - #{$base-left-menu-width-min} * 1.3);
            }
          }
        }
      }
    }
  }
</style>
