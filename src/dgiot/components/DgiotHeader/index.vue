<template>
  <div class="dgiot-header">
    <div class="dgiot-main">
      <el-row :gutter="20">
        <el-col :span="6">
          <dgiot-logo />
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
                <dgiot-menu
                  v-if="!route.hidden"
                  :key="route.path"
                  :item="route"
                  :layout="layout"
                />
              </template>
            </el-menu>
            <dgiot-role-switch
              :title="$translateTitle(`home.department switch`)"
            />
            <dgiot-error-log :title="$translateTitle(`home.error log`)" />
            <dgiot-notice :title="$translateTitle(`home.notice`)" />
            <dgiot-doc :title="$translateTitle(`home.full screen`)" />
            <dgiot-full-screen :title="$translateTitle(`home.full screen`)" />
            <dgiot-language
              v-show="isShow"
              :title="$translateTitle(`home.language`)"
            />
            <dgiot-theme :title="$translateTitle(`home.theme`)" />
            <dgiot-refresh :title="$translateTitle(`home.refresh`)" />
            <dgiot-avatar
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
  import { mapActions, mapGetters } from 'vuex'
  import { CDN_URL, proxy, runTimeStatic } from '@/config'
  import { loadScript } from '@/utils/file/load'
  import variables from '@/dgiot/styles/variables/variables.scss'
  import { handleActivePath } from '@/utils/router/routes'
  export default {
    name: 'DgiotHeader',
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
        treeFlag: 'settings/treeFlag',
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
      await this.loadDgiotScript()
      // 写在页面公共组件里。确保全局只订阅一个mqtt。刷新则再次重新订阅
      const md5Info = {
        token: this.token,
        username: this.objectId,
        password: this.token,
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
      ...mapActions({ setTreeFlag: 'settings/setTreeFlag' }),
      /**
       * @Author: dext7r
       * @Date: 2021-12-30 14:56:41
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async loadDgiotScript() {
        try {
          const NODE_ENV =
            process.env.NODE_ENV == 'development'
              ? proxy[1].target + CDN_URL
              : CDN_URL
          console.info('NODE_ENV', NODE_ENV)
          const staticUrl = NODE_ENV ? `${CDN_URL}/assets/` : '/assets/'
          var _runTimeStatic = { js: [] }
          const { js: runTimejs } = runTimeStatic
          runTimejs.forEach((_js) => {
            _runTimeStatic.js.push(`${staticUrl}js/${_js}`)
            // _runTimeStatic.js.push(`${staticUrl}css/amis/sdk/sdk.js`)
          })
          const res = await loadScript(_runTimeStatic.js)
          this.$nextTick(async () => {
            await this.setTreeFlag(!this.treeFlag)
          })
          await this.setTreeFlag(!this.treeFlag)
          // console.log(res, 'loadDgiotScript success')
        } catch (error) {
          console.error(error, 'loadDgiotScript error')
        }
      },
      async Mqtt(md5Info) {
        const { VUE_APP_URL, NODE_ENV } = process.env
        const { hostname, protocol } = location
        const ip =
          NODE_ENV == 'development'
            ? VUE_APP_URL.split('//')[1].split(':')[0]
            : hostname.split(':')[0] // 修复代理带端口的问题
        this.option = {
          keepalive: 60,
          clientId: md5Info.token, // dlink 协议 user 认证改为user token
          ip,
          isSSL: protocol === 'https:' ? true : false,
          port: protocol == 'http:' ? 8083 : 8084,
          userName: md5Info.username,
          passWord: md5Info.password,
          connectTimeout: 10 * 1000,
          router: md5Info.router,
        }
        console.groupCollapsed(
          '%c option',
          'color:#009a61; font-size: 28px; font-weight: 300'
        )

        console.log(this.option)
        console.groupEnd()
        dgiotlogger.info('MqttConnect', this.option)
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
  .dgiot-header {
    display: flex;
    align-items: center;
    justify-items: flex-end;
    height: $base-top-bar-height;
    background: $base-menu-background;

    .dgiot-main {
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

            .dgiot-dot {
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
