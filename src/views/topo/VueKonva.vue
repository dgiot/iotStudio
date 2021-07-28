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
        @removeShape="removeShape"
        @ImageTable="ImageTable"
      />
    </div>
    <div class="_mian">
      <el-row :gutter="gutter" class="_row">
        <transition name="fade">
          <el-col v-show="showTable" :span="leftrow">
            <div class="_left">
              <topo-allocation />
            </div>
          </el-col>
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
                @handleCloseSub="handleCloseSub"
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
  import { uuid } from '@/utils'
  const context = require.context('./components', true, /\.vue$/)
  let res_components = {}
  context.keys().forEach((fileName) => {
    let comp = context(fileName)
    res_components[fileName.replace(/^\.\/(.*)\.\w+$/, '$1')] = comp.default
  })

  import { createState } from '@/utils/konva'
  import { mapGetters, mapMutations } from 'vuex'
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
        topic: '',
        stop_Mqtt: true,
        tabsName: 'ShapeJson',
        globalStageid: '',
        value: false,
        kovaUpType: '',
        showTable: false,
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
        setDrawParams: 'konva/setDrawParams',
      }),
      _initCreate() {
        let background =
          'http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/shuwa_tech/zh/blog/study/opc/nf_taiti.png'
        this.$refs.konva.style.backgroundImage = `url(${background})`
      },
      // set_mqttflag
      set_mqttflag(v) {
        this.stop_Mqtt = v
      },
      // removeShape
      removeShape(node) {
        let _this = this
        const Layer = _this.stage.find('Layer')[0]
        console.log('删除的节点', node)
        var Image = _this.stage.find('Image')
        var tweens = []
        for (var n = 0; n < tweens.length; n++) {
          tweens[n].destroy()
        }
        if (node.attrs.image) {
          console.log('is img', node.attrs.id)
          console.log(node.target, 'node.target')
          Image.each((shape) => {
            console.log('图片相关', shape)
            if (shape.attrs.id == node.attrs.id) {
              console.log(shape, 'shape.target 找到了这个node 节点')
              console.log(node, 'shape.target 找到了这个node 节点')
              shape.remove()
              shape.destroy()
              node.remove()
              node.destroy()
              Layer.draw()
            }
          })
        }
        console.log('删除的节点', node.remove())
        _this.stage.find('Transformer').destroy()
        node.remove()
        Layer.draw()
        _this.setGraphNow('')
        if (node.attrs.id == _this.$refs['operation'].Shapeconfig.attrs.id)
          _this.$refs['operation'].Shapeconfig = []
        _this.updataProduct(this.productid)
      },
      // ImageTable
      ImageTable(type) {
        this.leftrow = type ? 3 : 0
        this.showTable = type
      },
      // saveKonvaitem
      saveKonvaitem(config, ShapeConfig = { index: 1, opacity: 1 }) {
        let _this = this
        console.log(_this.stage.find(`#${config.attrs.id}`))
        console.log('config.attrs.id', config.attrs.id)
        const Text = _this.stage.find('Text')
        const Image = _this.stage.find('Image')
        const Group = _this.stage.find('Group')
        const stage = _this.stage.find(config.attrs.id)
        const Layer = _this.stage.find('Layer')[0]
        let upshape = stage
        console.log('stage', stage)
        const tweens = []
        for (let n = 0; n < tweens.length; n++) {
          tweens[n].destroy()
          tweens[n].remove()
        }
        Image.each((shape) => {
          if (shape.attrs.id == config.attrs.id) {
            console.log('updata type is image', shape, config)
            upshape = shape
            _this.kovaUpType = 'Image'
            upshape.zIndex(ShapeConfig.zIndex)
            upshape.opacity(ShapeConfig.opacity)
            Layer.draw()
            tweens.push(
              new Konva.Tween({
                node: shape,
                Opacity: ShapeConfig.opacity,
                duration: 1,
                zIndex: ShapeConfig.zIndex,
                easing: Konva.Easings.ElasticEaseOut,
              }).play()
            )
          }
        })
        Group.each((shape) => {
          if (shape.attrs.id == config.attrs.id) {
            _this.kovaUpType = 'Group'
            upshape = shape
            tweens.push(
              new Konva.Tween({
                node: Object.assign(shape, config),
                Opacity: 0.8,
                duration: 1,
                easing: Konva.Easings.ElasticEaseOut,
              }).play()
            )
          }
        })
        Text.each((shape) => {
          if (shape.attrs.id == config.attrs.id) {
            _this.kovaUpType = 'Text'
            upshape = shape
            tweens.push(
              new Konva.Tween({
                node: Object.assign(shape, config),
                Opacity: 0.8,
                duration: 1,
                easing: Konva.Easings.ElasticEaseOut,
              }).play()
            )
          }
        })
        if (_this.kovaUpType != 'Image') {
          upshape.zIndex(ShapeConfig.index)
          upshape.opacity(ShapeConfig.opacity)
          Layer.draw()
        }
        _this.stage.batchDraw()
        if (_this.stage.attrs.id == config.attrs.id) {
          _this.kovaUpType = 'Layer'
          _this.stage = config
        }
        console.clear()
        console.info(`updata type is ${_this.kovaUpType}`)
        // _this.ShapeVisible = false
        console.log('konva数据更新成功')
        _this.updataProduct(_this.productid)
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
          this.leftrow = this.leftrow == 3 ? 0 : 3
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
        console.log('updatatopo')
        let config = this.productconfig.config
        let stage
        if (this.kovaUpType != 'Layer') {
          if (!this.stage.toJSON()) return
          stage = JSON.parse(this.stage.toJSON())
        } else {
          stage = this.stage
        }
        config.konva.Stage = stage
        // 提交前需要先对数据进行合并
        let upconfig = Object.assign(config, this.paramsconfig)
        let params = {
          config: upconfig,
        }
        // console.clear()
        // console.log('11111111')
        await putProduct(productid, params)
          .then((res) => {
            console.log(res, '产品组态更新成功')
            // this.handleCloseSub()
            this.$message.success(this.$translateTitle('产品组态更新成功'))
          })
          .catch((e) => {
            this.$message.error(this.$translateTitle(`${e.error}`))
          })
      },
      // 处理mqtt信息
      handleMqttMsg(subdialogid) {
        let _this = this

        var channeltopic = new RegExp('thing/' + subdialogid + '/post')
        Websocket.add_hook(channeltopic, (Msg) => {
          let decodeMqtt
          let updataId = []
          console.log('收到消息', Msg)
          if (!isBase64(Msg)) {
            console.log('非base64数据类型')
            return
          } else {
            decodeMqtt = JSON.parse(Base64.decode(Msg))
            console.log('消息解密消息', decodeMqtt)
          }

          console.log(decodeMqtt.konva)
          const Shape = decodeMqtt.konva
          // apply transition to all nodes in the array
          // Text.each(function (shape) {
          const Text = this.stage.find('Text')
          console.log(Text)
          const tweens = []
          for (var n = 0; n < tweens.length; n++) {
            tweens[n].destroy()
          }

          Shape.forEach((i) => {
            Text.each((shape) => {
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
              } else {
                updataId.push(i.id)
              }
            })
          })
          if (updataId) {
            console.log('以下组态id未更新', updataId)
          }
          _this.stage.batchDraw()
          console.log('konva数据更新成功')
          // _this.updataProduct(this.productid)
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
        console.log('sendInfo', sendInfo)
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
          _this.$refs['operation'].productconfig = results[0]
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
        let Stage
        let _this = this
        if (type != 'create') {
          Stage = data
        } else {
          Stage = data.Stage
        }
        console.log(data)
        console.log(Stage.attrs.height, Stage.attrs.width, '450')
        Stage.attrs.height = _this.stageConfig.height
        Stage.attrs.width = _this.stageConfig.width
        console.log(Stage.attrs.height, Stage.attrs.width, '453')
        var _konvarow = document.querySelectorAll('._center')[0]
        let div = document.createElement('div')
        _konvarow.appendChild(div)
        div.setAttribute('id', globalStageid)
        console.log('globalStageid', globalStageid)
        console.log(JSON.stringify(Stage), 'Stage')
        _this.stage = Konva.Node.create(Stage, globalStageid)
        console.log('data', data)
        var Layer = _this.stage.find('Layer')[0]
        _this.stage.on('click', (e) => {
          var node = e.target
          // 判断是否为产品界面
          if (_this.isDevice) {
            node.attrs.draggable = false
            console.log('isDevice', node)
          }
          // 如果点击空白处 移除图形选择框
          // 移除图形选择框
          if (node == _this.stage) {
            _this.stage.find('Transformer').destroy()
            Layer.draw()
          }
          console.log(node.toJSON())
          if (_this.isDevice) return
          _this.setGraphNow(e.target)

          _this.$refs['operation'].Shapeconfig = JSON.parse(node.toJSON())
          if (!_this.flag) {
            return
          }
          console.log('类型', _this.flag)
          console.log('this.draw', _this.draw)
          console.log('color', _this.graphColor)
          console.log('drawParams', _this.drawParams)
          const color = _this.graphColor
          const type = _this.flag
          console.log('params', _this.drawParams)
          const _group = _this.stage.find('Group')[0]
          const { offsetX, offsetY } = e.evt
          var state = createState(
            type,
            offsetX,
            offsetY,
            color,
            _this.drawParams
          )
          _group.add(state)
          Layer.draw()
          Layer.batchDraw()
          _this.setFlag('')
          _this.setDraw(false)
        })
        const Group = _this.stage.find('Group')
        const Text = _this.stage.find('Text')
        // console.clear()
        console.log(Text, 'Text')
        if (!_this.isDevice) {
          Text.each(function (_G) {
            _G.on('mouseenter', function () {
              _this.stage.container().style.cursor = 'move'
            })

            _G.on('mouseleave', function () {
              _this.stage.container().style.cursor = 'default'
            })
            _G.on('dblclick', function (e) {
              _this.stage.find('Transformer').destroy()
              // 在画布上创建具有绝对位置的textarea

              // 首先，我们需要为textarea找到位置

              // 首先，让我们找到文本节点相对于舞台的位置:
              let textPosition = this.getAbsolutePosition()

              // 然后让我们在页面上找到stage容器的位置
              let stageBox = _this.stage.container().getBoundingClientRect()

              // 因此textarea的位置将是上面位置的和
              console.log('eeeeeeeeeeeeeeeee', e)
              let areaPosition = {
                x: stageBox.left + textPosition.x,
                y: stageBox.top + textPosition.y,
                color: e.target.attrs.fill,
                text: e.target.attrs.text,
              }

              // 创建textarea并设置它的样式
              let textarea = document.createElement('textarea')
              document.body.appendChild(textarea)
              let T = this.text()
              if (T === '双击编辑文字') {
                textarea.value = ''
                textarea.setAttribute('placeholder', '请输入文字')
              } else {
                textarea.value = T
              }
              textarea.style.position = 'absolute'
              textarea.style.top = areaPosition.y + 'px'
              textarea.style.left = areaPosition.x + 'px'
              textarea.style.background = 'none'
              textarea.style.border = '1px dashed #000'
              textarea.style.outline = 'none'
              textarea.style.color = areaPosition.color
              textarea.focus()

              this.setAttr('text', '')
              Layer.draw()

              // 确定输入的文字
              let confirm = (val) => {
                this.text(val ? val : '双击编辑文字')
                Layer.draw()
                // 隐藏在输入
                if (textarea) document.body.removeChild(textarea)
              }
              // 回车键
              let keydown = (e) => {
                if (e.keyCode === 13) {
                  textarea.removeEventListener('blur', blur)
                  confirm(textarea.value)
                }
              }
              // 鼠标失去焦点
              let blur = () => {
                textarea.removeEventListener('keydown', keydown)
                confirm(textarea.value)
              }

              textarea.addEventListener('keydown', keydown)
              textarea.addEventListener('blur', blur)
            })
          })
        }
        // 设置页面是从设备界面进入 则不添加以下事件
        if (_this.isDevice && _this.productconfig) {
          _this.konvaClass.push('isDevice')
          _this.leftrow = _this.rightrow = 0
        } else {
          // _this.leftrow = 3
          _this.rightrow = 6
        }
        if (!_this.isDevice) {
          Group.each(function (_G) {
            _G.on('dblclick', (e) => {
              // 创建图形选框事件
              const tr = new Konva.Transformer({
                borderStroke: '#000', // 虚线颜色
                borderStrokeWidth: 1, //虚线大小
                borderDash: [5], // 虚线间距
                keepRatio: false, // 不等比缩放
                id: `Transformer_${uuid(6)}`,
              })
              Layer.add(tr)
              tr.attachTo(e.target)
              Layer.draw()
              // _this.ShapeVisible = true
              console.log(`#${e.target.attrs.id}`)
              var node = e.target
              console.log('当前图层层级', Number(node.zIndex()))
              _this.setGraphNow(e.target)
              _this.$refs['operation'].ShapeIndex = Number(node.zIndex())
              _this.$refs['operation'].ShapeOpacity = node.opacity()
              if (!_this.rightrow && !_this.isDevice) _this.rightrow = 6
              // _this.$refs['operation'].Shapeconfig = node.toJSON()
            })
            _G.on('mouseup', (e) => {
              console.log(e, 'mouseup')
              if (!_this.isDevice && _this.productid) _this.headevisible = true

              document.body.style.cursor = 'pointer'
            })
            _G.on('mouseover', (e) => {
              document.body.style.cursor = 'pointer'
            })
            _G.on('mouseout', (e) => {
              // _this.stage.find('Transformer').destroy() // 禁用后 无法拖动
              const id = e.target.id()
              const item = _this.stage.find((i) => i.id === id)
              item.x = e.target.x()
              item.y = e.target.y()
              document.body.style.cursor = 'default'
            })
          })
        }
        var Imgage = _this.stage.find('Image')
        Imgage.forEach((node) => {
          console.log('img node ', node)
          const img = new Image()
          img.src = node.getAttr('source')

          var img_url = node.getAttr('source') + Date.parse(new Date())
          // var _img = new Image()
          //
          // _img.src = img_url
          //
          // _img.onload = function () {
          //   // 打印
          //   img.with = _img.width ? _img.width:$('#current1').width()
          //   img.height =  _img.width ? _img.width:$('#current1').height()
          // }
          img.with = $('#current1').width()
          img.height = $('#current1').height()
          console.log('img', img, "$('#current1')", $('#current1'))
          $('#current1').css('background-image', `url(${img_url})`)
          $('#current1').css('background-size', '100%')
          $('#current1').css('width', $('.konvajs-content')[0].style.width)
          $('#current1').css('height', $('.konvajs-content')[0].style.height)

          // img.onload = () => {
          //   node.image(img)
          //   console.log(node.image(img), 'node.image(img)')
          //   _this.stage.batchDraw()
          // }
        })
        if (!_this.isDevice) {
          Group.each(function (_G) {
            _G.on('dblclick', (e) => {
              // 创建图形选框事件
              const tr = new Konva.Transformer({
                borderStroke: '#000', // 虚线颜色
                borderStrokeWidth: 1, //虚线大小
                borderDash: [5], // 虚线间距
                keepRatio: false, // 不等比缩放
                id: `Transformer_${uuid(6)}`,
              })
              Layer.add(tr)
              tr.attachTo(e.target)
              Layer.draw()
              // _this.ShapeVisible = true
              console.log(`#${e.target.attrs.id}`)
              var node = e.target
              console.log('当前图层层级', Number(node.zIndex()))
              _this.setGraphNow(e.target)
              _this.$refs['operation'].ShapeIndex = Number(node.zIndex())
              _this.$refs['operation'].ShapeOpacity = node.opacity()
              if (!_this.rightrow && !_this.isDevice) _this.rightrow = 6
              // _this.$refs['operation'].Shapeconfig = node.toJSON()
            })
            _G.on('mouseup', (e) => {
              console.log(e, 'mouseup')
              if (!_this.isDevice && _this.productid) _this.headevisible = true

              document.body.style.cursor = 'pointer'
            })
            _G.on('mouseover', (e) => {
              document.body.style.cursor = 'pointer'
            })
            _G.on('mouseout', (e) => {
              // _this.stage.find('Transformer').destroy() // 禁用后 无法拖动
              const id = e.target.id()
              const item = _this.stage.find((i) => i.id === id)
              item.x = e.target.x()
              item.y = e.target.y()
              document.body.style.cursor = 'default'
            })
          })
        }
        Layer.draw()
        Layer.batchDraw()
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
