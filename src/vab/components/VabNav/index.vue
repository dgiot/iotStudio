<template>
  <div class="vab-nav">
    <el-row :gutter="15">
      <el-col
        :lg="12"
        :md="12"
        :sm="12"
        :xl="12"
        :xs="4"
      >
        <div class="left-panel">
          <vab-fold />
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
                <vab-icon
                  v-if="item.meta.icon"
                  :icon="item.meta.icon"
                  :is-custom-svg="item.meta.isCustomSvg"
                  style="min-width: 16px"
                />
                {{ $translateTitle(`route.${item.meta.title}`) }}
              </template>
            </el-tab-pane>
          </el-tabs>
          <vab-breadcrumb
            v-else
            class="hidden-xs-only"
          />
        </div>
      </el-col>
      <el-col
        :lg="12"
        :md="12"
        :sm="12"
        :xl="12"
        :xs="20"
      >
        <div class="right-panel">
          <vab-error-log />
          <vab-search />
          <vab-notice />
          <vab-full-screen />
          <vab-language />
          <vab-theme />
          <vab-refresh />
          <vab-avatar />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { openFirstMenu } from '@/config'

  export default {
    name: 'VabNav',
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
    mounted() {
      // 写在页面公共组件里。确保全局只订阅一个mqtt。刷新则再次重新订阅
      const md5Info = {
        token: md5(this.token),
        username: this.mqttName,
        password: md5(this.loginInfo.password),
        router: md5(this.$route.fullPath),
      }
      this.Mqtt(md5Info)
    },
    methods: {
      async Mqtt(md5Info) {
        const {
          VUE_APP_URL,
          NODE_ENV,
        } = process.env
        const {
          hostname,
          protocol,
        } = location
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
            this.objectId + moment()
              .format('YYYY:MM:DD'),
            3,
          ),
          connectTimeout: 10 * 1000,
          router: md5Info.router,
        }
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
  .vab-nav {
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
        .vab-breadcrumb {
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
