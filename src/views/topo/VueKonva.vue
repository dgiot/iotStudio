<template>
  <div class="_vuekonva">
    <div class="_dialog">
      <el-dialog :visible.sync="ShapeVisible" width="100vh" class="_shape">
        <span v-if="tabsName == 'ShapeJson'" slot="footer"></span>
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
        @createShape="createShape"
      />
    </div>
    <div class="_mian">
      <el-row :gutter="gutter" class="_row">
        <transition name="fade">
          <!-- <el-col :span="leftrow">
            <div class="_left">
              <topo-allocation
                @fatherMousedown="mousedown"
                @fatherMousemove="mousemove"
                @fatherMouseup="mouseup"
              />
            </div>
          </el-col> -->
        </transition>

        <el-col :span="gutter - leftrow - rightrow" class="_konvarow">
          <div ref="konva" :class="konvaClass"></div>

          <div
            v-show="!isDevice && productid"
            :style="{
              display: infoFlag ? 'block' : 'block',
            }"
            class="_info"
          >
            <el-row :gutter="10" style="text-align: center">
              <el-col :span="24">
                <el-button
                  type="success"
                  plain
                  :disabled="productid.length < 1"
                  icon="el-icon-s-management"
                  @click="regulate('save')"
                >
                  {{ $translateTitle('konva.save') }}
                </el-button>

                <el-button
                  type="success"
                  icon="el-icon-arrow-up"
                  plain
                  @click="regulate('top')"
                >
                  {{
                    headevisible
                      ? $translateTitle('konva.hide')
                      : $translateTitle('konva.show')
                  }}{{ $translateTitle('konva.top') }}
                </el-button>

                <el-button
                  type="success"
                  icon="el-icon-arrow-right"
                  plain
                  @click="regulate('right')"
                >
                  {{
                    rightrow
                      ? $translateTitle('konva.hide')
                      : $translateTitle('konva.show')
                  }}{{ $translateTitle('konva.right') }}
                </el-button>

                <el-button
                  type="success"
                  icon="el-icon-arrow-left"
                  plain
                  @click="regulate('left')"
                >
                  {{
                    leftrow
                      ? $translateTitle('konva.hide')
                      : $translateTitle('konva.show')
                  }}{{ $translateTitle('konva.left') }}
                </el-button>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="rightrow">
          <transition name="fade">
            <div class="_right">
              <topo-operation
                ref="operation"
                @upImg="upProduct"
                @upconfig="saveKonvaitem"
                @clearImg="clearImg"
              />
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

  import {
    createShape,
    updateShape,
    setText,
    Position,
    dragBox,
    stageMousemove,
    stageMousedown,
  } from '@/utils/konva'
  import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
  import { isBase64, isImage } from '@/utils'
  import { Websocket } from '@/utils/wxscoket.js'
  import { _getTopo } from '@/api/Topo'
  import { putProduct, queryProduct } from '@/api/Product'
  export default {
    components: {
      ...res_components,
    },
    data() {
      return {
        per: '100',
        paramsconfig: {},
        productconfig: {},
        backgroundImage: '',
        gutter: 24,
        leftrow: 0,
        rightrow: 0,
        productid: this.$route.query.productid || '',
        isDevice: this.$route.query.type == 'device' ? true : false,
        konvaClass: ['konva', '_center'],
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
      ...mapState({
        graphColor: 'konva/graphColor',
        // drawing: 'konva/drawing',
        //   graphNow: 'konva/graphNow',
        pointStart: 'konva/pointStart',
        draw: 'konva/draw',
        //   flag: 'konva/flag',
      }),
      flag: {
        get() {
          return this.$store.state.konva.flag
        },
      },
      graphNow: {
        get() {
          return this.$store.state.konva.graphNow
        },
      },
      drawing: {
        get() {
          return this.$store.state.konva.drawing
        },
      },
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
    watch: {},
    mounted() {
      if (this.productid) {
        this.handleCloseSub()
      } else {
        this._initCreate()
      }
    },
    destroyed() {
      if (this.$refs.topoheader) this.handleCloseSub()
    },
    methods: {
      ...mapMutations({
        setDrawing: 'konva/setDrawing',
        setPointStart: 'konva/setPointStart',
        setDraw: 'konva/setDraw',
        setFlag: 'konva/setFlag',
        setGraphNow: 'konva/setGraphNow',
        setGraphColor: 'konva/setGraphColor',
      }),
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
      _initCreate() {
        let background =
          'http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/shuwa_tech/zh/blog/study/opc/nf_taiti.png'
        this.$refs.konva.style.backgroundImage = `url(${background})`
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
      // 创建图层
      createShape(v, color) {
        console.log('类型', v)
        var state
        var _group = this.stage.find('Group')[0]
        var Layer = this.stage.find('Layer')[0]
        switch (v) {
          case 'pencil':
            state = new Konva.Line({
              name: 'line',
              id: `line_${Mock.mock('@string')}`,
              points: [5, 70, 140, 23, 250, 60, 300, 20],
              stroke: color,
              strokeWidth: 15,
              lineCap: 'round',
              lineJoin: 'round',
              tension: 0.5,
              draggable: true,
            })
            break
          case 'ellipse':
            // 椭圆
            state = new Konva.Ellipse({
              name: 'ellipse',
              id: `ellipse_${Mock.mock('@string')}`,
              x: 40,
              y: 40,
              radiusX: 20,
              radiusY: 20,
              stroke: color,
              strokeWidth: 4,
              draggable: true,
            })
            break
          case 'rect':
          case 'rectH':
            state = new Konva.Rect({
              name: 'rect',
              x: 20,
              id: `rect_${Mock.mock('@string')}`,
              y: 20,
              width: 100,
              height: 50,
              fill: color,
              stroke: 'black',
              strokeWidth: 4,
              opacity: 1,
              draggable: true,
            })
            break
          case 'text':
            state = new Konva.Text({
              text: '双击编辑文字',
              id: `text_${Mock.mock('@string')}`,
              x: 20,
              y: 20,
              fill: color,
              fontSize: 12,
              width: 300,
              draggable: true,
            })
            break
          case 'image':
            let imgsrc =
              'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2234238213,2776120128&fm=26&gp=0.jpg'
            var imageObj = new Image()
            state = new Konva.Image({
              x: 50,
              y: 50,
              source: imgsrc,
              id: `image_${Mock.mock('@string')}`,
              image: imageObj,
              width: 106,
              height: 118,
              draggable: true,
            })

            imageObj.src = imgsrc
            imageObj.crossOrigin = 'Anonymous'
            // alternative API:
            break
          default:
            break
        }

        _group.add(state)
        Layer.draw()
        Layer.batchDraw()
        this.stage.add(Layer)
      },
      // saveKonvaitem
      saveKonvaitem(config) {
        // console.log(e, 'mouseout')
        // find item in the data
        //  bug
        // const item = this.stage.find((i) => i.id === id)
        // for (var k in config) {
        //   console.log(config[`${k}`])
        // }
        let _this = this
        console.log(_this.stage.find(`#${config.id}`))
        console.log('config.idconfig.id')

        var Text = _this.stage.find('Text')
        console.log(Text)
        var tweens = []
        for (var n = 0; n < tweens.length; n++) {
          tweens[n].destroy()
        }
        var Imgage = _this.stage.find('Imgage')
        Imgage.each((shape) => {
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
        var Group = _this.stage.find('Group')
        Group.each((shape) => {
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
        _this.stage.batchDraw()
        console.log('konva数据更新成功')
        _this.updataProduct(_this.productid)
        // _this.updataProduct(_this.productid)
      },
      // 预览
      regulate(type) {
        switch (type) {
          case 'save':
            this.updataProduct(this.$route.query.productid)
            break
          case 'info':
            alert(this.stage.toJSON())
            break
          case 'top':
            this.headevisible = !this.headevisible
            break
          case 'right':
            this.toggleClass('rightrow')
            break
          case 'left':
            this.toggleClass('leftrow')
            break
          case 'search':
            this.$message.success('开发中')
            break
        }
      },
      toggleClass(type) {
        if (type == 'rightrow') {
          this.rightrow = this.rightrow == 6 ? 0 : 6
        } else {
          // this.leftrow = this.leftrow == 3 ? 0 : 3
        }
      },
      clearImg(isVisible) {
        let img = ' '
        if (isVisible) {
          img = this.backgroundImage
        }
        console.log(isVisible)
        console.log(this.backgroundImage)
        this.$refs['operation'].bachgroundurl = img
      },
      async upProduct(img) {
        if (isImage(img)) {
          let config = this.productconfig.config
          config.konva.background = img
          let params = {
            config: config,
          }
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
        const { updatedAt, error } = await putProduct(productid, params)
        if (updatedAt) {
          this.handleCloseSub()
          this.$message.success(this.$translateTitle('产品组态更新成功'))
        } else {
          this.$message.error(this.$translateTitle(`error`))
        }
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
          _this.stage.batchDraw()
          console.log('konva数据更新成功')
          _this.updataProduct(this.productid)
        })
      },
      // 取消订阅mqtt
      async handleCloseSub() {
        let _this = this
        if (_this.$route.query.type == 'device') {
          _this.productid = _this.$route.query.deviceid
        }
        _this.handleMqttMsg(_this.productid)
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
          where: { objectId: _this.$route.query.productid },
        })
        _this.productconfig = results[0]
        console.log(_this.productconfig)

        if (message == 'SUCCESS') {
          console.log(data.Stage.attrs.id)
          _this.globalStageid = data.Stage.attrs.id
          _this.createKonva(data, _this.globalStageid, 'create')
          _this.paramsconfig = { konva: data }
          //
          // set backgroundImage
        }
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
        _this.$refs['operation'].bachgroundurl = background
        console.log(Stage.attrs.height, Stage.attrs.width, '450')
        Stage.attrs.height = _this.stageConfig.height
        Stage.attrs.width = _this.stageConfig.width
        console.log(Stage.attrs.height, Stage.attrs.width, '453')
        var _konvarow = document.querySelectorAll('._center')[0]
        let div = document.createElement('div')
        _konvarow.appendChild(div)
        div.setAttribute('id', globalStageid)
        console.log('globalStageid', globalStageid)
        console.log(Stage, 'Stage')
        _this.stage = Konva.Node.create(Stage, globalStageid)
        // 2 create layer
        _this.stage.find('Image').each((node) => {
          const img = new Image()
          img.src = node.getAttr('source')
          _this.backgroundImage = img.src
          this.$refs['operation'].bachgroundurl = img.src
          img.onload = () => {
            node.image(img)
            _this.stage.batchDraw()
          }
        })
        // _this.stage.on('click', (e) => {
        //   // _this.ShapeVisible = true
        //   let Shapeconfig = e.target.attrs
        //   var json = _this.stage.find(`$&{e.target.attrs.id}`)
        //   console.log(json)
        //   console.log('click stage info', e.target.attrs) // 这里为dom 对象 临时解决方式是将其赋值为空。否则json解析会报错
        //   Shapeconfig['container'] = ''
        //   if (!_this.rightrow) _this.rightrow = 6
        //   _this.$refs['operation'].Shapeconfig = Shapeconfig
        // })
        var Group = _this.stage.find('Group')
        // 设置页面是从设备界面进入 则不添加以下事件
        if (_this.isDevice && _this.productconfig) {
          _this.konvaClass.push('isDevice')
          _this.leftrow = _this.rightrow = 0
        } else {
          // _this.leftrow = 3
          _this.rightrow = 6
        }
        Group.each(function (_G) {
          console.log(_G, '_G')
          _G.on('click', (e) => {
            // _this.ShapeVisible = true
            console.log(
              Group.find(`$&{e.target.attrs.id}`),
              `${e.target.attrs.id}`
            )
            console.log(e.target.attrs)
            if (!_this.rightrow) _this.rightrow = 6
            _this.$refs['operation'].Shapeconfig = e.target.attrs
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
