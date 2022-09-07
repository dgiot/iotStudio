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
                  {{ $translateTitle('button.previous') }}
                </el-button>
                <el-button
                  :disabled="$route.query.page > $route.query.list.length"
                  type="primary"
                  size="mini"
                  icon="el-icon-arrow-right"
                  @click.native="nextPage('right')"
                  style="position: fixed; right: 30px"
                >
                  {{ $translateTitle('button.next') }}
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
        <el-drawer
          title="样式编辑"
          append-to-body
          :before-close="handleCloseEdit"
          :direction="direction"
          size="20%"
          :modal="false"
          :visible.sync="editFlag"
        >
          <!-- <div :style="{'text-align':'center','font-weight':'600'}">{{editNode.attrs.text}}</div> -->
          <el-form
            ref="form"
            :model="editForm"
            label-width="80px"
            style="margin-right: 10px"
          >
            <div v-if="editNode.attrs.name != 'sprite'">
              <el-form-item label="颜色">
                <el-input
                  v-model="editForm.fill"
                  @input="handleEditKonva"
                ></el-input>
                <el-color-picker
                  v-model="editForm.fill"
                  color-format="rgb"
                  :show-alpha="true"
                  @active-change="colorChange($event, 'fill', true)"
                ></el-color-picker>
              </el-form-item>
              <el-form-item label="宽度">
                <el-input
                  v-model="editForm.width"
                  type="number"
                  @input="handleEditKonva"
                ></el-input>
              </el-form-item>
              <el-form-item label="高度">
                <el-input
                  v-model="editForm.height"
                  type="number"
                  @input="handleEditKonva"
                ></el-input>
              </el-form-item>
              <el-form-item label="字体大小">
                <el-input
                  v-model="editForm.fontSize"
                  type="number"
                  @input="handleEditKonva"
                ></el-input>
              </el-form-item>
              <el-form-item label="纵向偏移">
                <el-input
                  v-model="editForm.lineHeight"
                  type="number"
                  :step="0.1"
                  @input="handleEditKonva"
                ></el-input>
              </el-form-item>
              <el-form-item label="描边颜色">
                <el-input
                  v-model="editForm.stroke"
                  @input="handleEditKonva"
                ></el-input>
                <el-color-picker
                  v-model="editForm.stroke"
                  color-format="rgb"
                  :show-alpha="true"
                  @active-change="colorChange($event, 'stroke', true)"
                ></el-color-picker>
              </el-form-item>
              <el-form-item label="描边宽度">
                <el-input
                  v-model="editForm.strokeWidth"
                  type="number"
                  :step="0.1"
                  @input="handleEditKonva"
                ></el-input>
              </el-form-item>
              <el-form-item
                v-if="editNode.attrs.name == 'vuecomponent'"
                label="绑定类型"
              >
                <el-select
                  v-model="editForm.text"
                  @change="handleEditKonva"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in dataTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-else label="文本内容">
                <el-input
                  v-model="editForm.text"
                  @input="handleEditKonva"
                ></el-input>
              </el-form-item>

              <el-form-item
                label="底部颜色"
                v-if="editNode.attrs.name != 'vuecomponent'"
              >
                <el-input
                  v-model="btmfill"
                  @input="handleEditbtmKonva"
                ></el-input>
                <el-color-picker
                  v-model="btmfill"
                  color-format="rgb"
                  :show-alpha="true"
                  @active-change="colorChange($event, 'btmfill', false)"
                ></el-color-picker>
              </el-form-item>
            </div>
            <el-form-item
              label="比例大小"
              v-if="editNode.attrs.name == 'sprite'"
            >
              <el-input
                v-model="scale"
                type="number"
                :step="0.1"
                @input="handleEditSacle"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-drawer>
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
  import { getProduct } from '@/api/Product'
  import { putView, getView, postView } from '@/api/View'

  import { isBase64 } from '@/utils'
  export default {
    components: {
      ...requiremodule(require.context('./components', true, /\.vue$/)),
    },
    data() {
      return {
        subtopic: '',
        editFlag: false,
        direction: 'rtl',
        editNode: {
          attrs: {},
        },
        dataTypeList: [
          {
            label: '产品数量',
            value: '产品数量',
          },
          {
            label: '设备数量',
            value: '设备数量',
          },
          {
            label: '在线设备',
            value: '在线设备',
          },
          {
            label: '离线设备',
            value: '离线设备',
          },
        ],
        router: '',
        viewInfo: {},
        defaultTopo: {
          konva: {
            Stage: {
              attrs: {
                height: 700,
                width: 1520,
              },
              children: [
                {
                  attrs: {
                    id: 'Layer_Thing',
                  },
                  children: [
                    {
                      attrs: {
                        height: '700',
                        id: 'bg',
                        src: '/dgiot_file/knova/knova_bg.png?timestamp=1635422987361',
                        type: 'bg-image',
                        width: '1200',
                      },
                      className: 'Image',
                    },
                    {
                      attrs: {
                        draggable: true,
                        id: 'f9dddd0eeb_amisBMK8t',
                        name: 'amis',
                        opacity: 0.75,
                        x: 323,
                        y: 84.95900920567532,
                      },
                      children: [],
                      className: 'Label',
                    },
                  ],
                  className: 'Layer',
                },
              ],
              className: 'Stage',
            },
          },
        },
        editForm: {
          fill: '', //字体颜色
          width: 42, //宽度
          height: 35, //高度
          lineHeight: 0, //纵向偏移
          fontSize: 14, //字体大小
          stroke: '', //描边颜色
          strokeWidth: 0, //描边宽度
          text: '', //文本内容
        },
        btmfill: '',
        scale: 1,
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
      isDevice: {
        get: function () {
          return this.$route.query.type == 'device' ||
            this.$route.query.deviceid
            ? true
            : false
        },
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.handleKonva()
      })
      this.$dgiotBus.$off('nodeEdit')
      this.$dgiotBus.$on('nodeEdit', async (node) => {
        console.log('接收到编辑节点消息', node)
        this.editNode = node
        this.editFlag = true
        // this.editNode.setAttrs({
        //   fill: '#091322',
        //   width: 80,
        //   height: 80,
        //   lineHeight: 2.2,
        //   fontSize: 28,
        //   // x: 20,
        //   // y: -0,
        // })
        this.editForm = {
          fill: node.attrs.fill || '',
          width: node.attrs.width || 42,
          height: node.attrs.height || 35,
          lineHeight: node.attrs.lineHeight || 0,
          fontSize: node.attrs.fontSize || 14,
          stroke: node.attrs.stroke || '', //描边颜色
          strokeWidth: node.attrs.strokeWidth || 0.1, //描边宽度
          text: node.attrs.text || '',
          // x: node.attrs.x || 0,
          // y: node.attrs.y || 0,
        }
        this.btmfill = node.parent.children[0].attrs.fill
        this.scale = node.attrs.scaleX
        // color: '',
      })
      this.$dgiotBus.$off('_busUpdata')
      this.$dgiotBus.$on('_busUpdata', async () => {
        if (this.viewInfo.objectId) {
          await this._updataTopo(this.viewInfo.objectId)
        }
      })
      this.subtopic = `$dg/user/konva/${this.$route.query.deviceid}/report` //组态订阅主题
      if (this.$route.query.type == 'device') {
        this.handleMqttMsg()
      }
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
    async destroyed() {
      console.log('this.topotopic', this.topotopic)
      this.$dgiotBus.$off('$dg/user/konva')
      if (!_.isEmpty(localStorage.getItem('konvaStale')))
        localStorage.setItem('konvaStale', JSON.stringify(canvas.stageJson))
      await this.$unSubscribe(this.topotopic)
    },
    methods: {
      ...mapMutations({
        deleteTopo: 'topo/deleteTopo',
        initKonva: 'topo/initKonva',
        createThing: 'topo/createThing',
        setTreeFlag: 'settings/setTreeFlag',
        createdEvidence: 'topo/createdEvidence',
      }),
      /**
       * 改变背景颜色
       */
      colorChange(e, type, flag) {
        // console.log(e, type)
        if (flag) {
          this.editForm[type] = e
          this.handleEditKonva()
        } else {
          type == 'btmfill' ? (this.btmfill = e) : ''
          this.handleEditbtmKonva()
        }
      },
      /**
       * 编辑组态节点
       */
      handleEditKonva() {
        // console.log(this.editForm)
        this.editForm.width = Number(this.editForm.width)
        this.editForm.height = Number(this.editForm.height)
        this.editForm.lineHeight = Number(this.editForm.lineHeight)
        this.editForm.fontSize = Number(this.editForm.fontSize)
        this.editForm.strokeWidth = Number(this.editForm.strokeWidth)
        // console.log(this.editForm)
        if (this.editNode.attrs.id == 'bg') {
          let editForm = {
            width: Number(this.editForm.width),
            height: Number(this.editForm.height),
          }
          console.log('这是修改背景大小', editForm)
          this.editNode.setAttrs(editForm)
          return
        }
        this.editNode.setAttrs(this.editForm)
      },
      /**
       * 编辑修改底部颜色
       */
      handleEditbtmKonva() {
        let params = {
          fill: this.btmfill,
        }
        this.editNode.parent.children[0].setAttrs(params)
      },
      handleEditSacle() {
        let params = {
          scaleX: Number(this.scale),
          scaleY: Number(this.scale),
        }
        this.editNode.setAttrs(params)
      },
      handleCloseEdit() {
        this.editFlag = false
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
        this.handleKonva()
      },
      guide() {
        this.driver.defineSteps(steps)
        this.driver.start()
      },
      async handleMqttMsg() {
        // console.error('this.topicKey', this.$mqttInfo.topicKey)
        // console.log('是否是pc端', this.$ispc())
        if (this.$route.query.type == 'device') {
          await this.$subscribe(this.subtopic)
        }
        this.$dgiotBus.$off('$dg/user/konva')
        this.$dgiotBus.$on('$dg/user/konva', (Msg) => {
          console.log('这是组态消息', Msg)
          if (Msg.payloadString) {
            let decodeMqtt = null
            // let updataId = []
            // console.log('非base64数据类型', JSON.parse(Msg.payloadString))
            if (!isBase64(Msg.payloadString)) {
              console.log('非base64数据类型', JSON.parse(Msg.payloadString))
              decodeMqtt = JSON.parse(Msg.payloadString)
            } else {
              decodeMqtt = JSON.parse(Base64.decode(Msg.payloadString))
              console.log('消息解密消息', decodeMqtt)
            }
            // decodeMqtt = Msg.payloadString
            console.log('decodeMqtt.konva', canvas.stage)
            console.log(decodeMqtt)
            // const Shape = decodeMqtt.konva
            // const Text = canvas.stage.find('Text')
            // console.log('text', Text)
            decodeMqtt.konva.forEach((item) => {
              // console.log(item)
              var info = konvaUtils.putNode(
                canvas.stage,
                item.id,
                item.text,
                item.type
              )
              // canvas.stage.find(item.id)[0].setAttrs(item.params)
            })
            // var info = konvaUtils.putNode(
            //   canvas.stage,
            //   decodeMqtt.id,
            //   decodeMqtt.params
            // )
            console.log('infokonvaUtils', konvaUtils)
            //  node.find(nodeid)[0].setAttrs(params)
            return
          }
        })
      },
      async _updataTopo(objectId) {
        this.viewInfo.data.konva = { Stage: JSON.parse(canvas.stage.toJSON()) }
        try {
          await putView(objectId, {
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
      async handleKonva() {
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
            _this.$refs['operation']
              ? (_this.$refs['operation'].productconfig = results[0])
              : console.log(
                  " _this.$refs['operation']",
                  _this.$refs['operation']
                )
            _this.globalStageid = data.Stage.attrs.id
            _this.paramsconfig = { konva: data }
            //
            console.log(
              'topo info msg 请求数据有组态 就设置这个组态为请求回来的组态',
              data.Stage,
              data.viewid
            )
            if (data.viewid) {
              this.viewInfo = await getView(data.viewid)
            }
            console.error(this.viewInfo)
            await _this.initKonva({
              data: data.Stage,
              id: 'kevCurrent',
            })
          } else {
            console.log(this.$route)
            if (!this.$route.query.deviceid) {
              let params = {
                data: this.defaultTopo,
                language: 'zh',
                class: 'Product',
                type: 'topo',
                title: '组态',
                key: this.$route.query.productid,
              }
              const res = await postView(params)
              console.log('这是新建', res)
              params.objectId = res.objectId
              this.viewInfo = params
              console.log('这是konva', this.viewInfo.data)
              await _this.initKonva({
                data: this.viewInfo.data.konva.Stage,
                id: 'kevCurrent',
              })
            } else {
              console.log('查看params', param)
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
                data: _this.initKonva,
                id: 'kevCurrent',
              })
            }
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
