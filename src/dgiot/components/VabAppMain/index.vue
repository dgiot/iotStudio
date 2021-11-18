<template>
  <multipane
    :key="treeKey"
    :class="[treeFlag ? 'custom-resizer' : 'custom']"
    layout="vertical"
  >
    <div
      :class="[treeFlag ? 'node-tree pane' : 'pane']"
      :style="{
        width: treeFlag ? '12%' : '0',
        minWidth: treeFlag ? '10%' : '0',
        maxWidth: treeFlag ? '30%' : '0%',
      }"
    >
      <vab-role-tree :show-filter="true" :tree="roleTree" />
    </div>
    <multipane-resizer />
    <div class="pane" :style="{ flexGrow: 1 }">
      <div class="vab-app-main">
        <section>
          <transition mode="out-in" name="fade-transform">
            <vab-keep-alive v-if="routerView" />
          </transition>
        </section>
        <vab-footer />
      </div>
    </div>
  </multipane>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import VabProgress from 'nprogress'

  export default {
    name: 'VabAppMain',
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
        roleTree: 'user/roleTree',
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
      const { showProgressBar } = this.theme
      // 单页面情况下重载路由
      this.$baseEventBus.$on('reload-router-view', () => {
        this.routerView = false
        if (showProgressBar) VabProgress.start()
        this.$nextTick(() => {
          this.routerView = true
          setTimeout(() => {
            if (showProgressBar) VabProgress.done()
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
    margin: 0;
    left: 0;
    position: relative;
    &:before {
      display: block;
      content: '';
      width: 3px;
      height: 40px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -20px;
      margin-left: -1.5px;
      border-left: 1px solid #ccc;
      border-right: 1px solid #ccc;
    }
    &:hover {
      &:before {
        border-color: #999;
      }
    }
  }
</style>
