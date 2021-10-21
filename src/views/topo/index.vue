<template>
  <div
    :class="{ 'vab-fullscreen': isFullscreen, 'konva-fullscreen': isDevice }"
    class="konva"
  >
    <!--    <vab-xterm />-->
    <el-container class="konva-container">
      <el-header
        v-show="!isDevice"
        class="konva-container-header hidden-xs-only"
      >
        <topo-header />
      </el-header>

      <el-main class="konva-container-main">
        <el-row :gutter="gutter.gutter">
          <!--       明诚发布注释18 到 27 行-->
          <el-col
            :lg="isDevice ? 0 : 4"
            :md="isDevice ? 0 : 6"
            :sm="isDevice ? 0 : 6"
            :xl="isDevice ? 0 : 3"
            :xs="0"
            class="hidden-xs-only konva-container-main-allocation"
          >
            <Topo-allocation />
          </el-col>

          <el-col
            :lg="isDevice ? 24 : gutter.lg"
            :md="isDevice ? 24 : gutter.md"
            :sm="isDevice ? 24 : gutter.sm"
            :xl="isDevice ? 24 : gutter.xl"
            :xs="isDevice ? 24 : gutter.xs"
            class="konva-container-main-baseCol"
          >
            <el-container class="konva-container-baseCol-baseContainer">
              <Topo-base ref="topobase" />
              <div
                id="konva"
                ref="konva"
                class="konva, _center"
                style="display: none"
              ></div>
            </el-container>
          </el-col>
          <el-col
            :lg="isDevice ? 0 : 5"
            :md="isDevice ? 0 : 6"
            :sm="isDevice ? 0 : 6"
            :xl="isDevice ? 0 : 3"
            :xs="0"
            class="hidden-xs-only"
            hidden-xs-only
          >
            <el-aside class="konva-container-main-operationsSide">
              <TopoOperation
                ref="operation"
                @upconfig="saveKonvaitem"
              />
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
  import { mapActions, mapGetters } from 'vuex'

  export default {
    components: {
      ...requireModule(require.context('./components', true, /\.vue$/)),
    },
    data() {
      return {
        router: '',
        topicKey: '',
        isFullscreen: false,
        gutter: {
          gutter: 24,
          xs: 24,
          sm: 12,
          md: 12,
          lg: 15,
          xl: 18,
        },
        productid: this.$route.query.productid || '',
      }
    },
    computed: {
      ...mapGetters({
        graphColor: 'konva/graphColor',
        drawing: 'konva/drawing',
        graphNow: 'konva/graphNow',
        pointStart: 'konva/pointStart',
        draw: 'konva/draw',
        flag: 'konva/flag',
        drawParams: 'konva/drawParams',
      }),
      stageConfig() {
        let el = document.getElementsByClassName('konva')
        return {
          width: el[0].clientWidth,
          height: el[0].clientHeight,
          container: 'container',
          id: 'container',
        }
      },
      isDevice: function () {
        return this.$route.query.type == 'device' || this.$route.query.deviceid
          ? true
          : false
      },
    },
    watch: {},
    mounted() {
      this.router = this.$dgiotBus.router(this.$route.fullPath)
      this.handleMqtt()
      this.createdVuexKonva()
    },
    destroyed() {
      this.$dgiotBus.$emit(
        'MqttUnbscribe',
        this.$dgiotBus.topicKey(this.router + this.topotopic),
        this.topotopic,
      )
    },
    created() {
    },
    methods: {
      ...mapActions({
        setKonva: 'topo/setKonva',
      }),
      createdVuexKonva() {
        // 判断konva 的节点
        const json = {
          attrs: {
            width: 2382,
            height: 1200,
            draggable: true,
          },
          className: 'Stage',
          children: [
            {
              attrs: {
                hitGraphEnabled: false,
              },
              className: 'Layer',
              children: [
                {
                  attrs: {},
                  className: 'Image',
                },
                {
                  attrs: {
                    source: 'https://konvajs.org/assets/yoda.jpg',
                  },
                  className: 'Image',
                },
              ],
            },
            {
              attrs: {},
              className: 'Layer',
              children: [
                {
                  attrs: {
                    data: 'M358.4 307.2h307.2v61.44H358.4z',
                    originX: 'center',
                    originY: 'bottom',
                    id: '#icon-biaoqian-0',
                    x: 10,
                    y: 15,
                    angle: -30,
                    fill: '#FFDA00',
                    scaleX: 0.15,
                    scaleY: 0.15,
                    rotation: 0,
                  },
                  className: 'Path',
                },
                {
                  attrs: {
                    data: 'M798.72 153.6H184.32v716.8l61.44-35.47136 266.24-153.71264 266.24 153.71264L839.68 870.4V153.6h-40.96zM573.44 645.74464l-61.44-35.47136-61.44 35.47136-204.8 118.24128V215.04h532.48v548.94592L573.44 645.74464z',
                    originX: 'center',
                    originY: 'bottom',
                    id: '#icon-biaoqian-1',
                    x: 10,
                    y: 15,
                    angle: -30,
                    fill: '#4DC400',
                    scaleX: 0.15,
                    scaleY: 0.15,
                    rotation: 0,
                  },
                  className: 'Path',
                },
                {
                  attrs: {
                    draggable: true,
                    x: 306,
                    y: 303,
                    transformsEnabled: 'position',
                  },
                  className: 'Group',
                  children: [
                    {
                      attrs: {
                        data: 'M317.44 291.84h389.12v61.44H317.44zM317.44 404.48h389.12v61.44H317.44zM317.44 517.12h245.76v61.44H317.44z',
                        originX: 'center',
                        originY: 'bottom',
                        id: '#icon-bianjixiugai-0',
                        x: 10,
                        y: 15,
                        angle: -30,
                        fill: '#FFDA00',
                        scaleX: 0.15,
                        scaleY: 0.15,
                        rotation: 0,
                      },
                      className: 'Path',
                    },
                    {
                      attrs: {
                        data: 'M184.32 153.6v716.8h307.2v-61.44H245.76V215.04h532.48v179.2h61.44V153.6z',
                        originX: 'center',
                        originY: 'bottom',
                        id: '#icon-bianjixiugai-1',
                        x: 10,
                        y: 15,
                        angle: -30,
                        fill: '#4DC400',
                        scaleX: 0.15,
                        scaleY: 0.15,
                        rotation: 0,
                      },
                      className: 'Path',
                    },
                    {
                      attrs: {
                        data: 'M591.90272 787.4048l194.56-336.97792 53.20704 30.72-194.56 336.97792zM637.06112 832.55296l-53.20704-30.72L559.2576 870.4h40.96z',
                        originX: 'center',
                        originY: 'bottom',
                        id: '#icon-bianjixiugai-2',
                        x: 10,
                        y: 15,
                        angle: -30,
                        fill: '#FFDA00',
                        scaleX: 0.15,
                        scaleY: 0.15,
                        rotation: 0,
                      },
                      className: 'Path',
                    },
                  ],
                },
                {
                  attrs: {
                    draggable: true,
                    x: 490,
                    y: 557,
                    transformsEnabled: 'position',
                  },
                  className: 'Group',
                  children: [
                    {
                      attrs: {
                        radius: 20,
                        stroke: '#231fff',
                        strokeWidth: 4,
                        fill: '#ffffff',
                      },
                      className: 'Circle',
                    },
                    {
                      attrs: {
                        text: '2',
                        fontSize: 14,
                        originX: 'center',
                        originY: 'center',
                        fill: '#231fff',
                        x: -5,
                        y: -5,
                      },
                      className: 'Text',
                    },
                    {
                      attrs: {
                        data: '',
                        originX: 'center',
                        originY: 'bottom',
                        x: 10,
                        y: 15,
                        angle: -30,
                        fill: '#231fff',
                        scaleX: 0.15,
                        scaleY: 0.15,
                        rotation: -30,
                      },
                      className: 'Path',
                    },
                  ],
                },
              ],
            },
          ],
        }
        this.$refs.topobase.createTopo(json)
        // 往节点里加东西
      },
      saveKonvaitem() {

      },
      handleMqtt() {
      },
    },
  }
</script>
<style lang="scss" scoped>
  .konva-fullscreen {
    height: calc(100vh - #{$base-top-bar-height} * 3) !important;

    .konva-container {
      .konva-container-main {
        height: calc(100vh - #{$base-top-bar-height} * 3) !important;
      }
    }
  }

  .konva {
    height: calc(100vh - #{$base-top-bar-height} * 2.7);
    overflow-x: hidden;
    overflow-y: hidden;
    background: $base-color-white;
    transition: $base-transition;

    &-container {
      &-header {
        white-space: nowrap;
        background-color: #fff;
        border-bottom: 1px solid #e5e5e5;
      }

      &-main {
        height: calc(100vh - #{$base-top-bar-height} * 2.7 - 10px) !important;
        padding: 0 !important;

        &-allocation {
        }

        &-baseCol {
          padding: 0 !important;
          margin: 0;
          overflow: auto;

          &-baseContainer {
            height: calc(
              100vh - #{$base-top-bar-height} * 2.7 - #{$base-padding} * 2 -
              90px
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
          padding: 0 !important;
          margin: 0 !important;

          .el-col {
            padding: 0 !important;
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
