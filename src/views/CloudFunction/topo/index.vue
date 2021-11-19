<!--eslint-disable-->
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
            :lg="isDevice ? 0 : 3"
            :md="isDevice ? 0 : 3"
            :sm="isDevice ? 0 : 4"
            :xl="isDevice ? 0 : 3"
            :xs="0"
            class="hidden-xs-only konva-container-main-allocation"
          >
            <Topo-tabs />
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
          <!--          <el-col-->
          <!--            :lg="isDevice ? 0 : 4"-->
          <!--            :md="isDevice ? 0 : 6"-->
          <!--            :sm="isDevice ? 0 : 6"-->
          <!--            :xl="isDevice ? 0 : 3"-->
          <!--            :xs="0"-->
          <!--            class="hidden-xs-only"-->
          <!--            hidden-xs-only-->
          <!--          >-->
          <!--            <el-aside class="konva-container-main-operationsSide">-->
          <!--              <TopoOperation ref="operation" @upconfig="saveKonvaitem" />-->
          <!--            </el-aside>-->
          <!--          </el-col>-->
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>
<script>
  import 'element-ui/lib/theme-chalk/display.css'
  import { requireModule } from '@/utils/file'
  import { mapGetters, mapMutations } from 'vuex'
  import { _getTopo } from '@/api/Topo'
  import { queryProduct } from '@/api/Product'
  import canvas from '@/utils/konva/core/canvas'

  export default {
    components: {
      ...requireModule(require.context('./components', true, /\.vue$/)),
    },
    data() {
      return {
        Stage: {},
        router: '',
        topicKey: '',
        isFullscreen: false,
        gutter: {
          gutter: 24,
          xs: 24,
          sm: 20,
          md: 21,
          lg: 21,
          xl: 21,
        },
        productid: this.$route.query.productid || '',
        viewid: this.$route.query.viewid || '',
      }
    },
    computed: {
      ...mapGetters({
        defaultKonva: 'topo/defaultKonva',
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
      this.Stage = _.isEmpty(localStorage.getItem('konvaStale'))
        ? localStorage.getItem('konvaStale')
        : this.defaultKonva
      this.router = this.$dgiotBus.router(this.$route.fullPath)
      this.$nextTick(() => {
        this.handleMqtt()
      })
    },
    destroyed() {
      localStorage.setItem('konvaStale', JSON.stringify(canvas.stageJson))
      this.$dgiotBus.$emit(
        'MqttUnbscribe',
        this.$dgiotBus.topicKey(this.router + this.topotopic),
        this.topotopic
      )
    },
    created() {},
    methods: {
      ...mapMutations({
        initKonva: 'topo/initKonva',
        createThing: 'topo/createThing',
      }),
      saveKonvaitem() {},
      async handleMqtt() {
        let _this = this
        if (_this.$route.query.type == 'device') {
          _this.productid = _this.$route.query.deviceid
        }
        const loading = _this.$baseColorfullLoading(3)
        try {
          const {
            productid,
            viewid = undefined,
            devaddr = undefined,
          } = _this.$route.query
          let params = {
            productid: productid,
            devaddr: devaddr,
            viewid: viewid,
          }
          const { message = '', data = {} } = await _getTopo(params)
          // 绘制前不光需要获取到组态数据，还需要获取产品数据
          const { results = [] } = await queryProduct({
            where: { objectId: _this.$route.query.productid },
          })
          _this.productconfig = results[0]
          // console.log(_this.productconfig)
          if (message == 'SUCCESS') {
            // console.log(this.$refs['edrawer'].$refs, 'edrawer')
            _this.$refs['operation']
              ? (_this.$refs['operation'].productconfig = results[0])
              : console.log(
                  " _this.$refs['operation']",
                  _this.$refs['operation']
                )
            _this.globalStageid = data.Stage.attrs.id
            // _this.createKonva(data, _this.globalStageid, 'create')
            _this.paramsconfig = { konva: data }
            //
            console.log(
              'topo info msg 请求数据有组态 就设置这个组态为请求回来的组态',
              data.Stage
            )
            await _this.initKonva({
              data: data.Stage,
              id: 'kevCurrent',
            })
          } else {
            this.$message.info('暂无组态。显示默认组态')
            console.log(
              'topo info msg 请求数据没有组态 就设置这个组态为默认',
              this.Stage
            )
            await _this.initKonva({
              data: this.Stage,
              id: 'kevCurrent',
            })
          }
          loading.close()
        } catch (e) {
          await this.initKonva({
            data: this.Stage,
            id: 'kevCurrent',
          })
          console.log('topo info msg 组态请求出错', e)
          loading.close()
        }
        // setTimeout(async() => {
        // //   // 默认创建一个,解决原有读取的text 组态无法使用事件问题
        //  await _this.createThing({productid:_this.$route.query.productid,hidden:true})
        // }, 1200)
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
