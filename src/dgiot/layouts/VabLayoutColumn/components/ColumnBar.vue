<template>
  <el-scrollbar
    class="column-bar-container"
    :class="{
      'is-collapse': collapse,
      ['column-bar-container-' + theme.columnStyle]: true,
    }"
  >
    <dgiot-logo />
    <el-tabs
      v-model="extra.first"
      tab-position="left"
      @tab-click="handleTabClick"
    >
      <el-tab-pane
        v-for="item in handleRoutes"
        :key="item.name"
        :name="item.name"
      >
        <template slot="label">
          <div
            class="column-grid"
            :class="{
              ['column-grid-' + theme.columnStyle]: true,
            }"
            :title="$translateTitle(`route.${item.meta.title}`)"
          >
            <div>
              <el-image
                v-if="item.meta.icon && item.meta.icon.includes('dgiot')"
                :alt="$FileServe"
                :src="$FileServe + item.meta.icon"
                style="float: left; width: 16px; height: 16px"
              >
                <img
                  slot="error"
                  :src="$FileServe + item.meta.icon"
                  style="float: left; width: 16px; height: 16px"
                  :title="$FileServe + item.meta.icon"
                />
              </el-image>
              <dgiot-icon
                v-else
                :alt="$FileServe"
                :icon="item.meta.icon"
                :is-custom-svg="item.meta.isCustomSvg"
              />
              <span>
                {{ $translateTitle(`route.${item.meta.title}`) }}
              </span>
            </div>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>

    <el-menu
      :background-color="variables['column-second-menu-background']"
      :default-active="activeMenu"
      :default-openeds="defaultOpeneds"
      mode="vertical"
      :unique-opened="uniqueOpened"
    >
      <el-divider>
        {{ $translateTitle(handleGroupTitle) }}
      </el-divider>
      <template v-for="route in handlePartialRoutes">
        <dgiot-menu v-if="!route.hidden" :key="route.path" :item="route" />
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script>
  import variables from '@/dgiot/styles/variables/variables.scss'
  import { mapGetters } from 'vuex'
  import { defaultOpeneds, openFirstMenu, uniqueOpened } from '@/config'
  import { handleActivePath } from '@/utils/router/routes'

  export default {
    name: 'ColumnBar',
    data() {
      return {
        activeMenu: '',
        groupTitle: '',
        defaultOpeneds,
        uniqueOpened,
        variables,
      }
    },
    computed: {
      ...mapGetters({
        collapse: 'settings/collapse',
        routes: 'routes/routes',
        theme: 'settings/theme',
        extra: 'settings/extra',
      }),
      handleRoutes() {
        return this.routes.filter((item) => item.hidden !== true && item.meta)
      },
      handlePartialRoutes() {
        const activeMenu = this.routes.find((_) => _.name === this.extra.first)
        return activeMenu ? activeMenu.children : []
      },
      handleGroupTitle() {
        const activeMenu = this.routes.find((_) => _.name === this.extra.first)
        return activeMenu ? activeMenu.meta.title : ''
      },
    },
    watch: {
      $route: {
        handler(route) {
          this.activeMenu = handleActivePath(route)
          const firstMenu = route.matched[0].name
          if (this.extra.first !== firstMenu) {
            this.extra.first = firstMenu
            this.handleTabClick(true)
          }
        },
        immediate: true,
      },
    },
    methods: {
      handleTabClick(handler) {
        if (handler !== true && openFirstMenu) {
          this.$router.push(this.handlePartialRoutes[0].path)
          this.$store.dispatch('settings/openSideBar')
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @mixin active {
    &:hover {
      color: $base-color-blue;
      background-color: $base-column-second-menu-background-active !important;

      i,
      svg {
        color: $base-color-blue;
      }
    }

    &.is-active {
      color: $base-color-blue;
      background-color: $base-column-second-menu-background-active !important;
    }
  }

  .column-bar-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: $base-left-menu-width;
    height: 100vh;
    overflow: hidden;
    background: $base-column-second-menu-background;
    box-shadow: $base-box-shadow;

    ::v-deep {
      * {
        transition: $base-transition;
      }
    }

    &-vertical,
    &-card {
      ::v-deep {
        .el-tabs + .el-menu {
          left: $base-left-menu-width-min;
          width: $base-left-menu-width - $base-left-menu-width-min;
          border: 0;
        }
      }
    }

    &-horizontal {
      ::v-deep {
        .logo-container-column {
          .logo {
            width: $base-left-menu-width-min * 1.3 !important;
          }

          .title {
            margin-left: $base-left-menu-width-min * 1.3 !important;
          }
        }

        .el-tabs + .el-menu {
          left: $base-left-menu-width-min * 1.3;
          width: $base-left-menu-width - $base-left-menu-width-min * 1.3;
          border: 0;
        }
      }
    }

    &-card {
      ::v-deep {
        .el-tabs {
          .el-tabs__item {
            padding: 5px !important;

            .column-grid {
              width: $base-left-menu-width-min - 10 !important;
              height: $base-left-menu-width-min - 10 !important;
              border-radius: 5px;
            }

            &.is-active {
              background: transparent !important;

              .column-grid {
                background: $base-color-blue;
              }
            }
          }
        }

        .el-tabs + .el-menu {
          left: $base-left-menu-width-min + 10;
          width: $base-left-menu-width - $base-left-menu-width-min - 20;
        }

        .el-submenu .el-submenu__title,
        .el-menu-item {
          min-width: 180px;
          border-radius: 5px;
        }
      }
    }

    .column-grid {
      display: flex;
      align-items: center;
      width: $base-left-menu-width-min;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;

      &-vertical,
      &-card {
        justify-content: center;
        height: $base-left-menu-width-min;

        > div {
          svg {
            position: relative;
            top: 8px;
            display: block;
            width: $base-font-size-default + 4;
            height: $base-font-size-default + 4;
          }

          [class*='ri-'] {
            display: block;
            height: 20px;
          }
        }
      }

      &-horizontal {
        justify-content: left;
        width: $base-left-menu-width-min * 1.3;
        height: $base-left-menu-width-min / 1.3;
        padding-left: $base-padding / 2;
      }
    }

    ::v-deep {
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }

      .el-tabs {
        position: fixed;

        .el-tabs__header.is-left {
          margin-right: 0 !important;

          .el-tabs__nav-wrap.is-left {
            margin-right: 0 !important;
            background: $base-column-first-menu-background;

            .el-tabs__nav-scroll {
              height: 100%;
              overflow-y: auto;

              &::-webkit-scrollbar {
                width: 0px;
                height: 0px;
              }
            }
          }
        }

        .el-tabs__nav {
          height: calc(100vh - #{$base-logo-height});
          background: $base-column-first-menu-background;
        }

        .el-tabs__item {
          height: auto;
          padding: 0;
          color: $base-color-white;
          text-align: center;

          .el-image {
            display: block;
            margin: 0 auto;
            text-align: center;
          }

          &.is-active {
            background: $base-color-blue;
          }
        }
      }

      .el-tabs__active-bar.is-left,
      .el-tabs--left .el-tabs__nav-wrap.is-left::after {
        display: none;
      }

      .el-menu {
        text-align: center;
        border: 0;

        .el-divider {
          margin: 0 0 $base-margin 0;
          background-color: #f6f6f6;

          &__text {
            color: $base-color-black;
          }
        }

        .el-menu-item,
        .el-submenu__title {
          height: $base-menu-item-height;
          overflow: hidden;
          line-height: $base-menu-item-height;
          text-overflow: ellipsis;
          white-space: nowrap;
          vertical-align: middle;

          @include active;
        }
      }
    }

    &.is-collapse {
      ::v-deep {
        width: 0;
      }
    }
  }
</style>
