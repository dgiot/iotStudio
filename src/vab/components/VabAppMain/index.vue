<template>
  <multipane class="custom-resizer" layout="vertical">
    <div
      class="node-tree pane"
      :style="{
        width: tree ? '12%' : '0',
        minWidth: tree ? '10%' : '0',
        maxWidth: tree ? '30%' : '0%',
      }"
    >
      <vab-role-tree :show-filter="true" />
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
        tree: 'settings/tree',
        extra: 'settings/extra',
        visitedRoutes: 'tabs/visitedRoutes',
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
<style>
  .node-tree {
    height: 85vh;
    margin: 12px 0 auto 12px;
    text-align: center;
  }
  .custom-resizer {
    width: 100%;
    height: 90vh;
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
