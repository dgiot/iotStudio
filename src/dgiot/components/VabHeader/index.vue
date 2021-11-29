<template>
  <div class="vab-header">
    <div class="vab-main">
      <el-row :gutter="20">
        <el-col :span="6">
          <vab-logo />
        </el-col>
        <el-col :span="18">
          <div class="right-panel">
            <el-menu
              v-if="'horizontal' === layout"
              :active-text-color="variables['menu-color-active']"
              :background-color="variables['menu-background']"
              :default-active="activeMenu"
              menu-trigger="hover"
              mode="horizontal"
              :text-color="variables['menu-color']"
            >
              <template v-for="route in handleRoutes">
                <vab-menu
                  v-if="!route.hidden"
                  :key="route.path"
                  :item="route"
                  :layout="layout"
                />
              </template>
            </el-menu>
            <vab-role-switch
              :title="$translateTitle(`home.department switch`)"
            />
            <vab-error-log :title="$translateTitle(`home.error log`)" />
            <vab-search :title="$translateTitle(`home.search`)" />
            <vab-notice :title="$translateTitle(`home.notice`)" />
            <vab-full-screen :title="$translateTitle(`home.full screen`)" />
            <vab-language :title="$translateTitle(`home.language`)" />
            <vab-theme :title="$translateTitle(`home.theme`)" />
            <vab-refresh :title="$translateTitle(`home.refresh`)" />
            <vab-avatar :title="$translateTitle(`home.avatar`)" />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import variables from '@/dgiot/styles/variables/variables.scss'
  import { mapGetters } from 'vuex'
  import { handleActivePath } from '@/utils/routes'

  export default {
    name: 'VabHeader',
    props: {
      layout: {
        type: String,
        default: 'horizontal',
      },
    },
    data() {
      return {
        activeMenu: '',
        menuTrigger: 'hover',
      }
    },
    computed: {
      ...mapGetters({
        routes: 'routes/routes',
      }),
      variables() {
        return variables
      },
      handleRoutes() {
        return this.routes.flatMap((route) => {
          return route.menuHidden === true && route.children
            ? route.children
            : route
        })
      },
    },
    watch: {
      $route: {
        handler(route) {
          this.activeMenu = handleActivePath(route)
        },
        immediate: true,
      },
    },
  }
</script>

<style lang="scss" scoped>
  .vab-header {
    display: flex;
    align-items: center;
    justify-items: flex-end;
    height: $base-top-bar-height;
    background: $base-menu-background;

    .vab-main {
      padding: 0 $base-padding 0 $base-padding;

      .right-panel {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: $base-top-bar-height;

        ::v-deep {
          > .el-menu--horizontal.el-menu
            > .el-submenu
            > .el-submenu__title
            > .el-submenu__icon-arrow {
            float: right;
            margin-top: ($base-top-bar-height - 11) / 2 !important;
          }

          > .el-menu--horizontal.el-menu > .el-menu-item {
            .el-tag {
              margin-top: $base-top-bar-height / 2 - 7.5 !important;
              margin-left: 5px;
            }

            .vab-dot {
              float: right;
              margin-top: ($base-top-bar-height - 6) / 2 + 1;
            }

            @media only screen and (max-width: 1199px) {
              .el-tag {
                display: none;
              }
            }
          }

          .el-menu {
            text-align: center;

            &.el-menu--horizontal {
              display: flex;
              align-items: center;
              justify-content: flex-end;
              height: $base-top-bar-height;
              border-bottom: 0 solid transparent !important;

              .el-menu-item,
              .el-submenu__title {
                height: $base-top-bar-height/1.3;
                padding: 0 $base-padding;
                line-height: $base-top-bar-height/1.3;
              }

              > .el-menu-item,
              > .el-submenu {
                height: $base-top-bar-height;
                line-height: $base-top-bar-height;

                .el-submenu__icon-arrow {
                  float: right;
                  margin-top: ($base-menu-item-height - 16) / 2;
                }

                > .el-submenu__title {
                  height: $base-top-bar-height;
                  line-height: $base-top-bar-height;
                }
              }
            }

            [class*='ri-'] {
              margin-left: 0;
              color: rgba($base-color-white, 0.9);
              cursor: pointer;
            }

            .el-submenu,
            .el-menu-item {
              i {
                color: inherit;
              }

              &.is-active {
                border-bottom: 0 solid transparent;

                .el-submenu__title {
                  border-bottom: 0 solid transparent;
                }
              }
            }

            .el-menu-item {
              &.is-active {
                background: $base-color-blue !important;
              }
            }
          }

          .user-name {
            color: rgba($base-color-white, 0.9);
          }

          .user-name + i {
            color: rgba($base-color-white, 0.9);
          }

          [class*='ri-'] {
            margin-left: $base-margin;
            color: rgba($base-color-white, 0.9);
            cursor: pointer;
          }

          button {
            svg {
              margin-right: 0;
              color: rgba($base-color-white, 0.9);
              cursor: pointer;
              fill: rgba($base-color-white, 0.9);
            }
          }
        }
      }
    }
  }
</style>
