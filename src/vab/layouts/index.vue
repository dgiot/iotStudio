<template>
  <div
    class="vue-admin-beautiful-wrapper"
    :class="classObj"
  >
    <component
      :is="'vab-layout-' + theme.layout"
      :collapse="collapse"
      :device="device"
      :fixed-header="theme.fixedHeader"
      :show-tabs="theme.showTabs"
    />
    <el-backtop target="#dgiot" />
    <!--  主题组件放到layouts下防止主题切换，导致主题组件重新加载 -->
    <vab-theme-drawer />
    <vab-theme-setting />
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'Layouts',
    data() {
      return {
        isMobile: false,
        oldLayout: '',
      }
    },
    computed: {
      ...mapGetters({
        device: 'settings/device',
        collapse: 'settings/collapse',
        theme: 'settings/theme',
      }),
      classObj() {
        return {
          mobile: this.device === 'mobile',
        }
      },
    },
    beforeMount() {
      this.oldLayout = this.theme.layout
      window.addEventListener('resize', this.handleLayouts)
    },
    // beforeUnmount已失效
    beforeDestroy() {
      window.removeEventListener('resize', this.handleLayouts)
      this.theme.layout = this.oldLayout
    },
    mounted() {
      this.handleLayouts()
    },
    methods: {
      ...mapActions({
        toggleDevice: 'settings/toggleDevice',
        foldSideBar: 'settings/foldSideBar',
        openSideBar: 'settings/openSideBar',
      }),
      handleLayouts() {
        const isMobile = document.body.getBoundingClientRect().width - 1 < 992
        if (this.isMobile !== isMobile) {
          if (isMobile) {
            this.oldLayout = this.theme.layout
            this.foldSideBar()
          } else this.openSideBar()
          this.theme.layout = isMobile ? 'vertical' : this.oldLayout
          this.toggleDevice(isMobile ? 'mobile' : 'desktop')
          this.isMobile = isMobile
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .vue-admin-beautiful-wrapper {
    position: relative;
    width: 100%;
    height: 100%;

    [class*='vab-layout-'] {
      position: relative;

      ::v-deep {
        .vab-layout-header {
          z-index: 99;
          box-shadow: $base-box-shadow;
        }
      }

      &.fixed {
        padding-top: $base-nav-height + $base-tabs-height;
      }

      &.fixed.no-tabs-bar {
        padding-top: $base-nav-height;
      }
    }

    ::v-deep {
      .fixed-header {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        z-index: $base-z-index - 1;
        width: 100%;
      }

      .vab-main {
        position: relative;
        width: auto;
        min-height: 100%;
        margin-left: $base-left-menu-width;

        &.is-collapse-main {
          margin-left: $base-left-menu-width-min;

          .fixed-header {
            left: $base-left-menu-width-min;
            width: calc(100% - #{$base-left-menu-width-min});
          }
        }
      }
    }

    /* 手机端开始 */
    &.mobile {
      ::v-deep {
        .vab-layout-vertical {
          z-index: 99;
          .el-scrollbar.vab-side-bar.is-collapse {
            width: 0;
          }

          .vab-main {
            .fixed-header {
              left: 0;
              width: 100%;
            }

            width: 100%;
            margin-left: 0;
          }
        }

        /* 隐藏分页和页码跳转 */
        .el-pager,
        .el-pagination__jump {
          display: none;
        }
      }
    }

    /* 手机端结束 */
  }
</style>
