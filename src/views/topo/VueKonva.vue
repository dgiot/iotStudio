<template>
  <div class="_vuekonva">
    <div class="_dialog">
      <el-dialog :visible.sync="ShapeVisible" width="100vh" class="_shape">
        <el-tabs v-model="tabsName">
          <el-tab-pane
            :label="$translateTitle('product.config')"
            name="ShapeJson"
          >
            <span>
              <vue-json-editor v-model="Shapeconfig" :mode="'code'" lang="zh" />
            </span>
          </el-tab-pane>
        </el-tabs>
        <span v-if="tabsName == 'ShapeJson'" slot="footer">
          <el-button @click="ShapeVisible = false">
            {{ $translateTitle('developer.cancel') }}
          </el-button>
          <el-button type="primary" @click="saveKonvaitem(Shapeconfig)">
            {{ $translateTitle('developer.determine') }}
          </el-button>
        </span>
      </el-dialog>
    </div>
    <div
      :style="{
        display: headevisible ? 'block' : 'none',
      }"
      class="_header"
    >
      <topo-header
        ref="topoheader"
        :productid="productid"
        :drawerflag="drawer"
        :stop-mqtt="stop_Mqtt"
        :value="value"
        @messageData="set_mqttflag"
      />
    </div>
    <div class="_mian">
      <i
        v-show="arrowFlag"
        style="top: 1vh; right: 100vh"
        :class="[
          headevisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down',
          arrowClass,
        ]"
        @click="headevisible = !headevisible"
      ></i>
      <i
        v-show="arrowFlag"
        style="right: 100vh; bottom: 1vh"
        :class="[
          infoFlag ? 'el-icon-arrow-down' : 'el-icon-arrow-up',
          arrowClass,
        ]"
        @click="infoFlag = !infoFlag"
      ></i>
      <el-row :gutter="gutter" class="_row">
        <transition name="fade">
          <el-col :span="leftrow">
            <div class="_left">
              <topo-allocation
                @fatherMousedown="mousedown"
                @fatherMousemove="mousemove"
                @fatherMouseup="mouseup"
              />
            </div>
          </el-col>
        </transition>

        <el-col :span="gutter - leftrow - rightrow" class="_konvarow">
          <div
            ref="konva"
            :class="konvaClass"
            @mouseover="konvaMouseover(productid)"
            @mouseleave="konvaMouseleave(productid)"
          >
            <i
              v-show="arrowFlag"
              style="top: 35vh; left: 1vh"
              :class="[
                leftrow == 3 ? 'el-icon-arrow-left' : 'el-icon-arrow-right',
                arrowClass,
              ]"
              @click="toggleClass('leftrow')"
            ></i>
            <i
              v-show="arrowFlag"
              style="top: 35vh; right: 1vh"
              :class="[
                rightrow == 3 ? 'el-icon-arrow-right' : 'el-icon-arrow-left',
                arrowClass,
              ]"
              @click="toggleClass('rightrow')"
            ></i>
          </div>

          <div
            :style="{
              display: infoFlag ? 'block' : 'none',
            }"
            class="_info"
          >
            <el-row :gutter="10">
              <el-col :span="6">
                <el-button
                  type="success"
                  plain
                  :disabled="productid.length < 1"
                  @click="preview('save')"
                >
                  {{ $translateTitle('product.preservation') }}
                </el-button>
              </el-col>
              <el-col :span="6">
                <el-button
                  type="primary"
                  :disabled="productid.length < 1"
                  plain
                  @click="preview('info')"
                >
                  {{ $translateTitle('task.data') }}
                </el-button>
              </el-col>
              <el-col :span="6">
                <el-button
                  type="info"
                  plain
                  :disabled="productid.length < 1"
                  @click="preview('search')"
                >
                  {{ $translateTitle('product.share') }}
                </el-button>
              </el-col>
              <el-col :span="6">
                <vab-slider v-model="per" :min="0" :max="100" />
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="rightrow">
          <transition name="fade">
            <div class="_right">
              <topo-operation :img="konvaBg" @upImg="upProduct" />
            </div>
          </transition>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  const context = require.context('./components', true, /\.vue$/)
  let res_components = {}
  context.keys().forEach((fileName) => {
    let comp = context(fileName)
    res_components[fileName.replace(/^\.\/(.*)\.\w+$/, '$1')] = comp.default
  })
  import vueJsonEditor from 'vue-json-editor'
  import testjson from '@/views/topo/components/test'
  import {
    createShape,
    updateShape,
    setText,
    Position,
    dragBox,
  } from '@/utils/konva'

  import { isBase64, isImage } from '@/utils'
  import { Websocket } from '@/utils/wxscoket.js'
  import { _getTopo } from '@/api/Topo'
  import { putProduct, queryProduct } from '@/api/Product'
  import { json } from 'body-parser'
  export default {
    components: {
      vueJsonEditor,
      ...res_components,
    },
    data() {
      return {
        per: '100',
        paramsconfig: {},
        productconfig: {},
        gutter: 24,
        leftrow: 0,
        rightrow: 0,
        productid: this.$route.query.productid || '',
        isDevice: this.$route.query.type == 'device' ? true : false,
        konvaClass: ['konva', '_center'],
        konvaBg: '',
        drawer: false,
        ShapeVisible: false,
        arrowFlag: false,
        headevisible: false,
        infoFlag: false,
        arrowClass: 'arrowClass',
        Shapeconfig: { id: '' },
        topic: '',
        stop_Mqtt: true,
        tabsName: 'ShapeJson',
        globalStageid: '',
        value: false,
      }
    },
    computed: {
      stageConfig() {
        let el = document.getElementsByClassName('konva')
        return {
          width: el[0].clientWidth,
          height: el[0].clientHeight,
          container: 'container',
          id: 'container',
        }
      },
    },
    mounted() {
      if (this.productid) {
        this.handleCloseSub()
      } else {
        this._initCreate()
      }
    },
    destroyed() {
      //
      console.log('取消订阅mqtt')
      if (this.$refs.topoheader) this.handleCloseSub()
    },
    methods: {
      // @click//单击
      // @mousedown//按下
      // @mouseup//抬起
      // @dblclick//双击
      // @mousemove//移动
      // @mouseleave//离开
      // @mouseout //移出
      // @mouseenter//进入
      // @mouseover//在
      mousedown(item) {
        console.log(item)
        var _center = document.querySelectorAll('._center')[0]
        let oElement = document.querySelectorAll(`.${item}`)[0]
        console.log(Position(oElement))

        // dragBox(
        //   document.querySelectorAll(`.${item}`)[0],
        //   document.querySelectorAll('.konvajs-content')[0]
        // )
      },
      mousemove(item) {
        // let oElement = document.querySelectorAll(`.${item}`)[0]
        // console.log(Position(oElement))
      },
      mouseup(item) {
        // dragBox(
        //   document.querySelectorAll(`.${item}`)[0],
        //   document.querySelectorAll('.konvajs-content')[0]
        // )
        var _center = document.querySelectorAll('._center')[0]
        let oElement = document.querySelectorAll(`.${item}`)[0]
        console.log(Position(oElement))
      },
      // set_mqttflag
      set_mqttflag(v) {
        this.stop_Mqtt = v
      },
      // saveKonvaitem
      saveKonvaitem(config) {
        // console.log(e, 'mouseout')
        // find item in the data
        //  bug
        // const item = this.stage.find((i) => i.id === id)
        // for (var k in config) {
        //   console.log()
        //   item[`${k}`] = config[`${k}`]
        // }
        let _this = this
        var Text = _this.stage.find('Text')
        console.log(Text)
        var tweens = []
        for (var n = 0; n < tweens.length; n++) {
          tweens[n].destroy()
        }

        Text.each((shape) => {
          if (shape.attrs.id == config.id) {
            console.log(config)
            console.log(shape)
            shape.text(config.text)
            tweens.push(
              new Konva.Tween({
                node: shape,
                Opacity: 0.8,
                duration: 1,
                easing: Konva.Easings.ElasticEaseOut,
              }).play()
            )
          }
        })
        let toJSON = _this.stage.toJSON()
        console.log(toJSON)
        _this.ShapeVisible = false
        _this.createKonva(JSON.parse(toJSON), _this.globalStageid, 'update')
        console.log('konva数据更新成功')
        console.log(Konva.Node.create(toJSON))
        console.log('konva数据更新成功')
      },
      // 预览
      preview(type) {
        switch (type) {
          case 'save':
            this.updataProduct(this.$route.query.productid)
            break
          case 'info':
            alert(this.stage.toJSON())
            break
          case 'search':
            this.$message.success('开发中')
            break
        }
      },
      toggleClass(type) {
        if (type == 'rightrow') {
          this.rightrow = this.rightrow == 3 ? 0 : 3
        } else {
          this.leftrow = this.leftrow == 3 ? 0 : 3
        }
      },
      konvaMouseover(id) {
        if (id && !this.isDevice) {
          this.arrowFlag = true
        }
      },
      konvaMouseleave(id) {
        if (id && !this.isDevice) {
          this.arrowFlag = false
        }
      },
      async upProduct(img) {
        if (isImage(img)) {
          let config = this.productconfig.config
          config.konva.background = img
          let params = {
            config: config,
          }
          this.$refs.konva.style.backgroundImage = `url(${img})`
          let res = await putProduct(this.productid, params)
          console.log(res)
          if (res) {
            this.$message.success(this.$translateTitle('组态背景更新成功'))
          }
        } else {
          this.$message.error(this.$translateTitle('非图片类型'))
        }
      },
      // 更新产品
      async updataProduct(productid) {
        if (!this.stage.toJSON()) {
          return
        }
        console.log('updatatopo')
        let config = this.productconfig.config
        config.konva.Stage = JSON.parse(this.stage.toJSON())
        // 提交前需要先对数据进行合并
        // let upconfig = Object.assign(config, this.paramsconfig)
        let params = {
          config: config,
        }
        let res = await putProduct(productid, params)
        console.log(res)
        this.$message.success(this.$translateTitle('产品组态更新成功'))
      },
      // 处理mqtt信息
      handleMqttMsg(subdialogid) {
        var channeltopic = new RegExp('thing/' + subdialogid + '/post')
        Websocket.add_hook(channeltopic, (Msg) => {
          console.log('收到消息', Msg)
          if (!isBase64(Msg)) {
            console.log('非base64数据类型')
            return
          }
          let decodeMqtt = JSON.parse(Base64.decode(Msg))
          console.log(decodeMqtt.konva)
          const Shape = decodeMqtt.konva
          // apply transition to all nodes in the array
          // Text.each(function (shape) {
          var Text = this.stage.find('Text')
          console.log(Text)
          var tweens = []
          for (var n = 0; n < tweens.length; n++) {
            tweens[n].destroy()
          }

          Shape.forEach((i) => {
            Text.each((shape) => {
              if (i.id == shape.attrs.id) {
                console.log(i)
                console.log(shape)
                shape.text(i.text)
                tweens.push(
                  new Konva.Tween({
                    node: shape,
                    Opacity: 0.8,
                    duration: 1,
                    easing: Konva.Easings.ElasticEaseOut,
                  }).play()
                )
              }
            })
          })
          let toJSON = this.stage.toJSON()
          _this.createKonva(JSON.parse(toJSON), _this.globalStageid, 'edit')
          console.log('konva数据更新成功')
          // })
          // const stagedefault = this.stagedefault
          // if (Shape) {
          //   updateShape(Shape)
          //     .then((result) => {
          //       console.log(result)
          //       console.log('konva数据更新成功')
          //     })
          //     .catch((err) => {
          //       console.log('konva数据更新失败', err)
          //     })
          // }
        })
      },
      // 取消订阅mqtt
      async handleCloseSub() {
        let _this = this
        _this.stop_Mqtt = true
        var text0 = JSON.stringify({ action: 'stop_logger' })
        var sendInfo = {
          topic: 'thing/' + _this.productid + '/post',
          text: text0,
          retained: true,
          qos: 2,
        }
        if (_this.$refs.topoheader) {
          console.log('订阅mqtt')
          _this.$refs.topoheader.handleCloseSub(sendInfo)
        }
        const { productid, devaddr = undefined } = _this.$route.query
        let params = {
          productid: productid,
          devaddr: devaddr,
        }
        const { message = '', data } = await _getTopo(params)
        // 绘制前不光需要获取到组态数据，还需要获取产品数据
        const { results = [] } = await queryProduct({
          where: { objectId: _this.productid },
        })
        _this.productconfig = results[0]
        console.log(_this.productconfig)

        if (message == 'SUCCESS') {
          console.log(data.Stage.attrs.id)
          _this.globalStageid = data.Stage.attrs.id
          _this.createKonva(data, _this.globalStageid, 'create')
          _this.paramsconfig = { konva: data }
          //
          if (_this.$route.query.type == 'device') {
            _this.productid = _this.$route.query.deviceid
          }
          _this.handleMqttMsg(_this.productid)
          // set backgroundImage
        }
      },
      _initCreate() {
        let background =
          'http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/shuwa_tech/zh/blog/study/opc/nf_taiti.png'
        this.$refs.konva.style.backgroundImage = `url(${background})`
      },
      // js 绘制
      createKonva(data, globalStageid, type) {
        console.log('type', type)
        let Stage, background
        let _this = this
        if (type != 'create') {
          Stage = data
          background = _this.productconfig.config.konva.background
        } else {
          background = data.background
          Stage = data.Stage
        }
        console.log(data)
        _this.konvaBg = background
        console.log(Stage)
        console.log(Stage.attrs.height, Stage.attrs.width, '450')
        Stage.attrs.height = _this.stageConfig.height
        Stage.attrs.width = _this.stageConfig.width
        console.log(Stage.attrs.height, Stage.attrs.width, '453')
        var _konvarow = document.querySelectorAll('._center')[0]
        let div = document.createElement('div')
        _konvarow.appendChild(div)

        div.setAttribute('id', globalStageid)
        _this.$refs.konva.style.backgroundImage = `url(${background})`
        console.log(Stage)
        _this.stage = Konva.Node.create(Stage, globalStageid)
        var Group = _this.stage.find('Group')
        // 设置页面是从设备界面进入 则不添加以下事件
        if (_this.isDevice && _this.productconfig) {
          _this.konvaClass.push('isDevice')
          _this.leftrow = _this.rightrow = 0
        } else {
          _this.leftrow = _this.rightrow = 3
        }
        Group.each(function (_G) {
          console.log(_G, '_G')
          _G.on('click', (e) => {
            _this.ShapeVisible = true
            _this.Shapeconfig = e.target.attrs
          })
          _G.on('mouseup', (e) => {
            console.log(e, 'mouseup')
            document.body.style.cursor = 'pointer'
          })
          _G.on('mouseover', (e) => {
            document.body.style.cursor = 'pointer'
          })
          _G.on('mouseout', (e) => {
            const id = e.target.id()
            const item = _this.stage.find((i) => i.id === id)
            item.x = e.target.x()
            item.y = e.target.y()
            document.body.style.cursor = 'default'
          })
        })

        console.log('绘制完成')
        if (this.$refs.topoheader)
          this.$refs.topoheader.subscribe(_this.productid)
      },
    },
  }
</script>
<style lang="scss" scoped>
  ._vuekonva {
    /* 可以设置不同的进入和离开动画 */
    /* 设置持续时间和动画函数 */
    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 2.5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active, 2.1.8 版本以下 */ {
      opacity: 0;
    }
    width: 100%;
    background-size: 100% 100%;
    ::v-deep .el-drawer__body {
      overflow-x: auto;
      overflow-y: auto;
    }
    ._dialog {
      ::v-deep .el-dialog__footer {
        margin: 0 auto;
        text-align: center;
      }
    }
    ._drawer {
      width: 100%;
    }
    ._header {
      width: 100%;
    }
    ._mian {
      position: relative;
      .arrowClass {
        position: absolute;
        z-index: 999;
        width: 40px;
        height: 40px;
        padding: 7px;
        font-size: 24px;
        font-weight: 700;
        color: #1890ff;
        color: #fff;
        cursor: pointer;
        background: #e8f4ff;
        background-color: #409eff;
        border-color: #409eff;
        border-radius: 50%;
      }
      ._row {
        ._konvarow {
          padding: 0 !important;
          // border: 1px solid red;
          box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
          .konva {
            position: relative;
            min-width: 100vh;
            min-height: calc(100vh - 163px);
            // background-image: url('http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/shuwa_tech/zh/blog/study/opc/nf_taiti.png');
            background-size: 100% 100%;
            border-bottom: 1px solid #ebeef5;
          }
          .isDevice {
            min-height: calc(100vh - 163px);
          }
          .arrowClass {
            position: absolute;
            z-index: 999;
            width: 40px;
            height: 40px;
            padding: 7px;
            font-size: 24px;
            font-weight: 700;
            color: #1890ff;
            color: #fff;
            cursor: pointer;
            background: #e8f4ff;
            background-color: #409eff;
            border-color: #409eff;
            border-radius: 50%;
          }
        }
        ._info {
          height: 40px;
          margin: 0 50px;
          line-height: 40px;
          background-color: white;
        }
      }
    }
  }
</style>
