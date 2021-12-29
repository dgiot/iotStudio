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
            <vab-notice :title="$translateTitle(`home.notice`)" />
            <vab-full-screen :title="$translateTitle(`home.full screen`)" />
            <vab-language
              v-show="isShow"
              :title="$translateTitle(`home.language`)"
            />
            <vab-theme v-show="isShow" :title="$translateTitle(`home.theme`)" />
            <vab-refresh :title="$translateTitle(`home.refresh`)" />
            <vab-avatar
              v-show="isShow"
              :title="$translateTitle(`home.avatar`)"
            />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import variables from '@/dgiot/styles/variables/variables.scss'
  import { mapGetters } from 'vuex'
  import { handleActivePath } from '@/utils/router/routes'
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
        isShow: window.name != 'dgiot_iframe',
        activeMenu: '',
        menuTrigger: 'hover',
      }
    },
    computed: {
      ...mapGetters({
        mqttName: 'user/username',
        objectId: 'user/objectId',
        extra: 'settings/extra',
        token: 'user/token',
        loginInfo: 'user/loginInfo',
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
    async mounted() {
      // 写在页面公共组件里。确保全局只订阅一个mqtt。刷新则再次重新订阅
      const md5Info = {
        token: md5(this.token),
        username: this.mqttName,
        password: md5(this.loginInfo.password),
        router: md5(this.$route.fullPath),
      }
      console.groupCollapsed(
        '%c md5Info',
        'color:#009a61; font-size: 28px; font-weight: 300'
      )
      console.log(md5Info)
      console.groupEnd()
      await this.Mqtt(md5Info)
    },
    methods: {
      async Mqtt(md5Info) {
        const { VUE_APP_URL, NODE_ENV } = process.env
        const { hostname, protocol } = location
        const ip =
          NODE_ENV == 'development'
            ? VUE_APP_URL.split('//')[1].split(':')[0]
            : hostname.split(':')[0] // 修复代理带端口的问题
        this.option = {
          keepalive: 60,
          clientId: 'dgiot_mqtt_' + md5(this.token),
          ip,
          isSSL: protocol === 'https:' ? true : false,
          port: protocol == 'http:' ? 8083 : 8084,
          userName: md5Info.username,
          passWord: await dcodeIO.bcrypt.hash(
            this.objectId + moment().format('YYYY:MM:DD'),
            3
          ),
          connectTimeout: 10 * 1000,
          router: md5Info.router,
        }
        console.groupCollapsed(
          '%c option',
          'color:#009a61; font-size: 28px; font-weight: 300'
        )

        console.log(this.option)
        console.groupEnd()
        await this.$dgiotBus.$emit('MqttConnect', this.option)
        // this.$dgiotBus.$emit('MqttSubscribe', {
        //   router: md5(this.$route.fullPath),
        //   topic: 'h7ml/topic/test/1',
        //   ttl: 1000 * 60 * 60 * 3,
        //   created: Math.round(new Date() / 1000),
        //   qos: 0,
        // })
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
