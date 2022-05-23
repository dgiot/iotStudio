<!--eslint-disable-->
<template>
  <div
    :class="{ 'dgiot-fullscreen': isFullscreen, 'konva-fullscreen': isDevice }"
    class="konva"
  >
    <!--    <dgiot-xterm />-->
    <el-container class="konva-container">
      <el-header
        v-show="!isDevice"
        class="konva-container-header hidden-xs-only"
      >
        <topo-header :noTools="Boolean($route.query.noTools)" />
      </el-header>

      <el-main class="konva-container-main">
        <el-row :gutter="gutter.gutter" class="user-content">
          <el-col
            :lg="isDevice || isFull ? 0 : 3"
            :md="isDevice || isFull ? 0 : 3"
            :sm="isDevice || isFull ? 0 : 4"
            :xl="isDevice || isFull ? 0 : 3"
            :xs="0"
            class="hidden-xs-only konva-container-main-allocation"
          >
            <Topo-tabs
              class="tabs"
              :isDirver="Boolean($route.query.isDirver)"
            />
          </el-col>

          <el-col
            :lg="isDevice || isFull ? 24 : gutter.lg"
            :md="isDevice || isFull ? 24 : gutter.md"
            :sm="isDevice || isFull ? 24 : gutter.sm"
            :xl="isDevice || isFull ? 24 : gutter.xl"
            :xs="isDevice || isFull ? 24 : gutter.xs"
            class="konva-container-main-baseCol"
          >
            <el-main class="konva-container-baseCol-baseContainer">
              <topo-base
                ref="topobase"
                style="position: absolute; width: 100%"
              />
              <div v-if="Boolean($route.query.guide)">
                <el-button
                  size="mini"
                  type="primary"
                  :disabled="$route.query.page < 0"
                  icon="el-icon-arrow-left"
                  style="position: relative; left: 0"
                  @click.native="nextPage('left')"
                >
                  {{ $translateTitle("button.previous") }}
                </el-button>
                <el-button
                  :disabled="$route.query.page > $route.query.list.length"
                  type="primary"
                  size="mini"
                  icon="el-icon-arrow-right"
                  @click.native="nextPage('right')"
                  style="position: fixed; right: 30px"
                >
                  {{ $translateTitle("button.next") }}
                </el-button>
              </div>
              <div
                id="konva"
                ref="konva"
                class="konva, _center"
                style="display: none"
              ></div>
            </el-main>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>
<script>
  import steps from './js/guide'
  import 'element-ui/lib/theme-chalk/display.css'
  import requiremodule from '@/utils/file/requiremodule'
  import { mapGetters, mapMutations } from 'vuex'
  import { _getTopo } from '@/api/Topo'
  import { putProduct, queryProduct, getProduct } from '@/api/Product'
  import { putView, getView } from '@/api/View'
  import { isBase64 } from '@/utils'

  export default {
    components: {
      ...requiremodule(require.context('./components', true, /\.vue$/)),
    },
    data() {
      return {
        subtopic: '',
        router: '',
        viewInfo: {},
        driver: null,
        Stage: {},
        isFull: false,
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
      isDevice: {
        get: function () {
          return this.$route.query.type == 'device' ||
            this.$route.query.deviceid
            ? true
            : false
        },
      },
    },
    watch: {
      '$route.query.page': {
        handler(route) {
          console.error(route)
        },
        immediate: true,
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.handleMqtt()
      })
      this.$dgiotBus.$off('_busUpdata')
      this.$dgiotBus.$on('_busUpdata', async () => {
        if (this.viewInfo.objectId) {
          await this._updataTopo(this.viewInfo.objectId)
        }
      })
      this.driver = new this.$Driver({
        className: 'vue-admin-beautiful-wrapper', // className to wrap driver.js popover
        animate: true, // Animate while changing highlighted element
        opacity: 0.75, // Background opacity (0 means only popovers and without overlay)
        padding: 10, // Distance of element from around the edges
        allowClose: true, // Whether clicking on overlay should close or not
        overlayClickNext: false, // Should it move to next step on overlay click
        doneBtnText: '完成', // Text on the final button
        closeBtnText: '关闭', // Text on the close button for this step
        nextBtnText: '下一步', // Next button text for this step
        prevBtnText: '上一步', // Previous button text for this step
        // Called when moving to next step on any step
      })
      if (
        this?.$router?.query?.guide &&
        Boolean(this.$router.query.guide) == true
      )
        this.guide()

      this.$baseEventBus.$off('ToggleView')
      this.$baseEventBus.$on('ToggleView', () => {
        this.isFull = !this.isFull
      })
      this.Stage = _.isEmpty(localStorage.getItem('konvaStale'))
        ? localStorage.getItem('konvaStale')
        : this.defaultKonva
      this.router = this.$dgiotBus.router(this.$route.fullPath)
      this.setTreeFlag(false)
    },
    destroyed() {
      if (!_.isEmpty(localStorage.getItem('konvaStale')))
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
        deleteTopo: 'topo/deleteTopo',
        initKonva: 'topo/initKonva',
        createThing: 'topo/createThing',
        setTreeFlag: 'settings/setTreeFlag',
        createdEvidence: 'topo/createdEvidence',
      }),
      handleDrop(e) {
        console.log(e, 'handleDrop')
        e.preventDefault()
        e.stopPropagation()
        const index = e.dataTransfer.getData('index')
        const rectInfo = this.editor.getBoundingClientRect()
        if (index) {
          const component = deepCopy(componentList[index])
          component.style.top = e.clientY - rectInfo.y
          component.style.left = e.clientX - rectInfo.x
          component.id = generateID()
          this.$store.commit('addComponent', { component })
          this.$store.commit('recordSnapshot')
        }
      },

      handleDragOver(e) {
        console.log(e, 'handleDragOver')
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy'
      },
      handleMouseDown(e) {
        console.log(e, 'handleMouseDown')
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy'
      },
      deselectCurComponent(e) {
        console.log(e, 'deselectCurComponent')
        e.preventDefault()
      },
      nextPage(type) {
        let query = JSON.parse(JSON.stringify(this.$route.query))
        const list = JSON.parse(this.$route.query.list)
        const length = query.length
        query.page = Number(query.page)
        query.page =
          type == 'left'
            ? query.page-- >= -1
              ? query.page > 0
                ? query.page
                : length
              : length
            : query.page++ >= length
            ? 0
            : query.page
        query.viewid = list[query.page].viewid
        this.$router.push({ path: this.$route.path, query })
        this.handleMqtt()
      },
      guide() {
        this.driver.defineSteps(steps)
        this.driver.start()
      },
      saveKonvaitem() {},
      async _updataTopo(objectId) {
        this.viewInfo.data.konva = { Stage: JSON.parse(canvas.stage.toJSON()) }
        try {
          const res = await putView(objectId, {
            // data: _.merge(
            //   {
            //     konva: { Stage: JSON.parse(canvas.stage.toJSON()) },
            //   },
            //   this.viewInfo.data
            // ),
            data: this.viewInfo.data,
          })
          this.$baseMessage(
            this.$translateTitle('user.update completed'),
            'success',
            'dgiot-hey-message-success'
          )
          console.error('this.viewInfo.data', this.viewInfo.data)
        } catch (e) {
          console.log(e)
        }
      },
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
          const { results = [] } = await getProduct(
            _this.$route.query.productid
          )
          _this.productconfig = results
          // console.log(_this.productconfig)
          console.groupCollapsed(
            '%c productconfig',
            'color:#009a61; font-size: 28px; font-weight: 300'
          )
          console.info('productconfig ->\n', _this.productconfig)
          console.groupEnd()
          if (message == 'SUCCESS') {
            console.groupCollapsed(
              '%c _getTopo',
              'color:#009a61; font-size: 28px; font-weight: 300'
            )
            console.info('data ->\n', data)
            console.groupEnd()
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
              data.Stage,
              data.viewid
            )
            if (data.viewid) {
              const res = await getView(data.viewid)
              this.viewInfo = res
            }
            console.error(this.viewInfo)
            await _this.initKonva({
              data: data.Stage,
              id: 'kevCurrent',
            })
          } else {
            _this.$baseMessage(
              '暂无组态。显示默认组态',
              'info',
              'dgiot-hey-message-error'
            )
            console.log(
              'topo info msg 请求数据没有组态 就设置这个组态为默认',
              _this.Stage
            )
            await _this.initKonva({
              // data: _this.Stage,
              data: _this.initKonva,
              id: 'kevCurrent',
            })
          }
          loading.close()
        } catch (e) {
          await _this.initKonva({
            data: this.Stage,
            id: 'kevCurrent',
          })
          console.log('topo info msg 组态请求出错', e)
          loading.close()
        }
        setTimeout(() => {
          const icon = {
            icon: 'timeline',
            type: 'delete',
            path: 'M23,8c0,1.1-0.9,2-2,2c-0.18,0-0.35-0.02-0.51-0.07l-3.56,3.55C16.98,13.64,17,13.82,17,14c0,1.1-0.9,2-2,2s-2-0.9-2-2 c0-0.18,0.02-0.36,0.07-0.52l-2.55-2.55C10.36,10.98,10.18,11,10,11s-0.36-0.02-0.52-0.07l-4.55,4.56C4.98,15.65,5,15.82,5,16 c0,1.1-0.9,2-2,2s-2-0.9-2-2s0.9-2,2-2c0.18,0,0.35,0.02,0.51,0.07l4.56-4.55C8.02,9.36,8,9.18,8,9c0-1.1,0.9-2,2-2s2,0.9,2,2 c0,0.18-0.02,0.36-0.07,0.52l2.55,2.55C14.64,12.02,14.82,12,15,12s0.36,0.02,0.52,0.07l3.55-3.56C19.02,8.35,19,8.18,19,8 c0-1.1,0.9-2,2-2S23,6.9,23,8z',
          }
          _this.createdEvidence(
            _.merge(icon, {
              index: 7,
              // blue表示取证阶段，黄色表示审核阶段，绿色标识审核通过，红色标识审核不过
              fill: 'orange',
              productid: _this.$route.query.productid,
            })
          )
          _this.deleteTopo(window.deletePath)
        }, 1000)
        // https://gitee.com/dgiiot/dgiot_dlink/wikis/dgiot-dashboard%20toppic%20%E5%AF%B9%E6%8E%A5dgiot_dlink
        _this.subtopic = `thing/${_this.productid}/post`
        // const deviceId = this?.$route?.query?.deviceid || 'test'
        // _this.subtopic = `$dg/konva/${deviceId}/properties/report`
        _this.topicKey = _this.$dgiotBus.topicKey(_this.router, _this.subtopic)
        //
        console.warn('订阅mqtt', _this.subtopic)
        // 订阅webscroket
        _this.$dgiotBus.$emit(`MqttSubscribe`, {
          router: this.router,
          topic: this.subtopic,
          qos: 0,
          ttl: 1000 * 60 * 60 * 3,
        })
        _this.handleMqttMsg()
      },
      // 处理mqtt信息
      handleMqttMsg() {
        console.error('this.topicKey', this.topicKey)
        this.$dgiotBus.$off(this.topicKey)
        this.$dgiotBus.$on(this.topicKey, (Msg) => {
          console.log('收到消息', Msg)
          if (Msg.payload) {
            let decodeMqtt
            let updataId = []
            if (!isBase64(Msg.payload)) {
              console.log('非base64数据类型')
              decodeMqtt = Msg.payload
            } else {
              decodeMqtt = JSON.parse(Base64.decode(Msg.payload))
              console.log('消息解密消息', decodeMqtt)
            }
            console.log('decodeMqtt.konva')
            console.log(decodeMqtt.konva)
            const Shape = decodeMqtt.konva
            // apply transition to all nodes in the array
            // Text.each(function (shape) {
            const Text = canvas.stage.find('Text')
            console.log(Text)
            const tweens = []
            for (var n = 0; n < tweens.length; n++) {
              tweens[n].destroy()
            }

            Shape.forEach((i) => {
              Text.forEach((shape) => {
                if (i.id == shape.attrs.id) {
                  console.log('更新节点', i)
                  console.log(shape)
                  shape.text(i.text)
                  tweens.push(
                    new Konva.Tween({
                      node: shape,
                      duration: 1,
                      easing: Konva.Easings.ElasticEaseOut,
                    }).play()
                  )
                } else updataId.push(i.id)
              })
            })

            updataId ? console.log('以下组态id未更新', updataId) : ''

            console.log('konva数据更新成功')
          }
        })
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
            width: 100%;
            height: calc(
              100vh - #{$base-top-bar-height} * 2.7 - #{$base-padding} * 2 -
                90px
            ) !important;
            overflow: auto;
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
