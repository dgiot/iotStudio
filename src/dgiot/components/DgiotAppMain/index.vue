<template>
  <multipane
    :key="treeKey"
    :class="[treeFlag ? 'custom-resizer' : 'custom']"
    layout="vertical"
  >
    <div
      :class="[treeFlag ? 'node-tree pane' : 'pane']"
      :style="{
        width: treeFlag ? '20%' : '0',
        minWidth: treeFlag ? '15%' : '0',
        maxWidth: treeFlag ? '40%' : '0%',
      }"
    >
      <dgiot-role-tree />
    </div>
    <multipane-resizer />
    <div class="pane" :style="{ flexGrow: 1 }">
      <div class="dgiot-app-main">
        <section>
          <transition mode="out-in" name="fade-transform">
            <dgiot-keep-alive v-if="routerView" />
          </transition>
        </section>
      </div>
    </div>
  </multipane>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import DgiotProgress from 'nprogress'
  export default {
    name: 'DgiotAppMain',
    data() {
      return {
        routerView: true,
      }
    },
    computed: {
      ...mapGetters({
        theme: 'settings/theme',
        treeFlag: 'settings/treeFlag',
        extra: 'settings/extra',
        visitedRoutes: 'tabs/visitedRoutes',
        treeKey: 'user/treeKey',
      }),
      changeData() {
        return [
          ...new Set(
            this.visitedRoutes
              .filter(
                (item) =>
                  !item.meta.noKeepAlive &&
                  item.name !== this.extra.transferRouteName
              )
              .flatMap((item) => item.matched)
          ),
        ]
      },
    },
    watch: {
      changeData: {
        handler(visitedRoutes) {
          this.setCachedRoutes(visitedRoutes)
        },
      },
    },
    created() {
      this.$dgiotBus.$off('reload-router-view')
      const { showProgressBar } = this.theme
      // 单页面情况下重载路由
      this.$dgiotBus.$on('reload-router-view', () => {
        this.routerView = false
        if (showProgressBar) DgiotProgress.start()
        this.$nextTick(() => {
          this.routerView = true
          setTimeout(() => {
            if (showProgressBar) DgiotProgress.done()
          }, 200)
        })
      })
    },
    methods: {
      ...mapActions({
        setCachedRoutes: 'routes/setCachedRoutes',
      }),
    },
  }
</script>
<style scoped lang="scss">
  .node-tree {
    height: 85vh;
    margin: 12px 0 auto 12px;
    text-align: center;
  }
  .custom-resizer {
    width: 100%;
    height: 90vh;
  }
  .custom {
    width: auto;
    height: auto;
  }
  .custom-resizer > .pane {
    overflow: hidden;
  }
  .custom-resizer > .pane ~ .pane {
  }
  .custom-resizer > .multipane-resizer {
    position: relative;
    left: 0;
    margin: 0;
    &:before {
      position: absolute;
      top: 50%;
      left: 50%;
      display: block;
      width: 3px;
      height: 40px;
      margin-top: -20px;
      margin-left: -1.5px;
      content: '';
      border-right: 1px solid #ccc;
      border-left: 1px solid #ccc;
    }
    &:hover {
      &:before {
        border-color: #999;
      }
    }
  }
</style>
