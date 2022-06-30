<template>
  <div class="dgiot-nav">
    <el-row :gutter="15">
      <el-col :lg="12" :md="12" :sm="12" :xl="12" :xs="4">
        <div class="left-panel">
          <dgiot-fold />
          <el-tabs
            v-if="layout === 'comprehensive'"
            v-model="extra.first"
            tab-position="top"
            @tab-click="handleTabClick"
          >
            <el-tab-pane
              v-for="item in handleRoutes"
              :key="item.name"
              :name="item.name"
            >
              <template #label>
                <dgiot-icon
                  v-if="item.meta.icon"
                  :icon="item.meta.icon"
                  :is-custom-svg="item.meta.isCustomSvg"
                  style="min-width: 16px"
                />
                {{ $translateTitle(`route.${item.meta.title}`) }}
              </template>
            </el-tab-pane>
          </el-tabs>
          <dgiot-breadcrumb v-else class="hidden-xs-only" />
        </div>
      </el-col>
      <el-col :lg="12" :md="12" :sm="12" :xl="12" :xs="20">
        <div class="right-panel">
          <dgiot-role-switch
            :title="$translateTitle(`home.department switch`)"
          />
          <dgiot-error-log :title="$translateTitle(`home.error log`)" />
          <dgiot-notice :title="$translateTitle(`home.notice`)" />
          <dgiot-full-screen :title="$translateTitle(`home.full screen`)" />
          <dgiot-doc :title="$translateTitle(`home.full screen`)" />
          <dgiot-language :title="$translateTitle(`home.language`)" />
          <dgiot-theme :title="$translateTitle(`home.theme`)" />
          <dgiot-refresh :title="$translateTitle(`home.refresh`)" />
          <dgiot-avatar :title="$translateTitle(`home.avatar`)" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { openFirstMenu } from '@/config'
  import { mapActions, mapGetters } from 'vuex'
  import { CDN_URL, proxy, runTimeStatic } from '@/config'
  import { loadScript } from '@/utils/file/load'
  export default {
    name: 'DgiotNav',
    props: {
      layout: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        firstMenu: '',
        option: {},
      }
    },
    computed: {
      ...mapGetters({
        treeFlag: 'settings/treeFlag',
        mqttName: 'user/username',
        objectId: 'user/objectId',
        extra: 'settings/extra',
        routes: 'routes/routes',
        token: 'user/token',
        loginInfo: 'user/loginInfo',
      }),
      handleRoutes() {
        return this.routes.filter((item) => item.hidden !== true && item.meta)
      },
      handlePartialRoutes() {
        const activeMenu = this.routes.find((_) => _.name === this.extra.first)
        return activeMenu ? activeMenu.children : []
      },
    },
    watch: {
      $route: {
        handler(route) {
          const firstMenu = route.matched[0].name
          if (this.extra.first !== firstMenu) {
            this.extra.first = firstMenu
            this.handleTabClick(true)
          }
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
        } catch (error) {
          console.error(error, 'loadDgiotScript error')
        }
      },
      async Mqtt(md5Info) {
        console.error('src/dgiot/components/DgiotNav/index.vue', md5Info)
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
      handleTabClick(handler) {
        if (handler !== true && openFirstMenu) {
          this.$router.push(this.handlePartialRoutes[0].path)
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .dgiot-nav {
    position: relative;
    height: $base-nav-height;
    padding-right: $base-padding;
    padding-left: $base-padding;
    overflow: hidden;
    user-select: none;
    background: $base-color-white;
    box-shadow: $base-box-shadow;

    .left-panel {
      display: flex;
      align-items: center;
      justify-items: center;
      height: $base-nav-height;

      ::v-deep {
        .dgiot-breadcrumb {
          margin-left: $base-margin;
        }

        .el-tabs {
          margin-left: $base-margin;

          .el-tabs__header {
            margin: 0;
          }

          .el-tabs__item {
            > div {
              display: flex;
              align-items: center;

              i {
                margin-right: 3px;
              }
            }
          }
        }

        .el-tabs__nav-wrap::after {
          display: none;
        }
      }
    }

    .right-panel {
      display: flex;
      align-content: center;
      align-items: center;
      justify-content: flex-end;
      height: $base-nav-height;

      ::v-deep {
        [class*='ri-'] {
          margin-left: $base-margin;
          color: $base-color-gray;
          cursor: pointer;
        }

        button {
          [class*='ri-'] {
            margin-left: 0;
            color: $base-color-white;
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
