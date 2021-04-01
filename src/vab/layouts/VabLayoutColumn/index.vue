<template>
  <!--分栏布局 -->
  <div
    :class="{
      fixed: fixedHeader,
      'no-tabs-bar': !showTabs,
    }"
    class="vab-layout-column"
  >
    <column-bar />
    <div
      :class="{
        ['vab-main-' + theme.columnStyle]: true,
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
  import { mapGetters } from 'vuex'

  export default {
    name: 'VabLayoutColumn',
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
  .vab-layout-column {
    .vab-main {
      .fixed-header {
        left: $base-left-menu-width;
        width: $base-right-content-width;
      }

      &.is-collapse-main {
        &.vab-main-horizontal {
          margin-left: $base-left-menu-width-min * 1.3;

          ::v-deep {
            .fixed-header {
              left: $base-left-menu-width-min * 1.3;
              width: calc(100% - #{$base-left-menu-width-min} * 1.3);
            }
          }
        }
      }
    }
  }
</style>
