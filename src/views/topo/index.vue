<template>
  <div class="konva">
    <el-container class="konva-container">
      <el-header class="konva-container-header hidden-xs-only">
        <topo-header />
      </el-header>

      <el-main class="konva-container-main">
        <el-row :gutter="24">
          <el-col
            class="hidden-xs-only konva-container-main-allocation"
            :xs="0"
            :sm="6"
            :md="6"
            :lg="4"
            :xl="3"
          >
            <Topo-allocation />
          </el-col>

          <el-col
            :xs="24"
            :sm="12"
            :md="12"
            :lg="15"
            :xl="18"
            class="konva-container-main-baseCol"
          >
            <el-container class="konva-container-main-baseContainer">
              <TopoBase />
            </el-container>
          </el-col>
          <el-col
            class="hidden-xs-only"
            hidden-xs-only
            :xs="0"
            :sm="6"
            :md="6"
            :lg="5"
            :xl="3"
          >
            <el-aside class="konva-container-main-operationsSide">
              <TopoOperation />
            </el-aside>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>
<script>
  import 'element-ui/lib/theme-chalk/display.css'
  import { requireModule } from '@/utils/file'
  export default {
    components: {
      ...requireModule(require.context('./components', true, /\.vue$/)),
    },
    data() {
      return {}
    },
    computed: {},
    watch: {},
    mounted() {},
    destroyed() {},
    methods: {},
  }
</script>
<style lang="scss" scoped>
  .konva {
    height: calc(100vh - #{$base-top-bar-height}* 2.7);
    overflow-x: hidden;
    overflow-y: scroll;
    background: $base-color-white;
    transition: $base-transition;
    &-container {
      &-header {
        white-space: nowrap;
        background-color: #fff;
        border-bottom: 1px solid #e5e5e5;
      }
      &-main {
        height: calc(100vh - #{$base-top-bar-height}* 2.7 - 70px) !important;
        padding: 0 !important;
        &-allocation {
        }
        &-baseCol {
          padding: 0 !important;
          margin: 0;
          overflow: auto;
          &-baseContainer {
            height: calc(
              100vh - #{$base-top-bar-height}* 2.7 - 90px
            ) !important;
          }
        }
        &-operationsSide {
          width: auto !important;
        }
      }
      ::v-deep {
        .el-header {
          height: 50px !important;
        }
        .el-row {
          //padding: 0 !important;
          margin: 0 !important;
          .el-col {
            //padding: 0 !important;
            margin: 0 !important;
          }
        }
        .hidden-xs-only {
          border: 1px solid #ddd !important;
        }
        .el-aside {
          color: #333 !important;
        }
      }
    }
  }
</style>
