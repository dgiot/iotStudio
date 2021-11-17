<template>
  <div
    class="konva"
    :class="{ 'vab-fullscreen': isFullscreen, 'konva-fullscreen': isDevice }"
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
            class="hidden-xs-only konva-container-main-allocation"
            :lg="isDevice ? 0 : 4"
            :md="isDevice ? 0 : 6"
            :sm="isDevice ? 0 : 6"
            :xl="isDevice ? 0 : 3"
            :xs="0"
          >
            <Topo-allocation />
          </el-col>

          <el-col
            class="konva-container-main-baseCol"
            :lg="isDevice ? 24 : gutter.lg"
            :md="isDevice ? 24 : gutter.md"
            :sm="isDevice ? 24 : gutter.sm"
            :xl="isDevice ? 24 : gutter.xl"
            :xs="isDevice ? 24 : gutter.xs"
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
            class="hidden-xs-only"
            hidden-xs-only
            :lg="isDevice ? 0 : 5"
            :md="isDevice ? 0 : 6"
            :sm="isDevice ? 0 : 6"
            :xl="isDevice ? 0 : 3"
            :xs="0"
          >
            <el-aside class="konva-container-main-operationsSide">
              <TopoOperation ref="operation" @upconfig="saveKonvaitem" />
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
  import { mapGetters, mapMutations } from 'vuex'
  import { isBase64, uuid } from '@/utils'
  import { createState } from '@/utils/konva'
  import { _getTopo } from '@/api/Topo'
  import { putProduct, queryProduct } from '@/api/Product'

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
    },
    destroyed() {
      this.$dgiotBus.$emit(
        'MqttUnbscribe',
        this.$dgiotBus.topicKey(this.router + this.topotopic),
        this.topotopic
      )
    },
    created() {
      this.$dgiotBus.$off('removeShape')
      this.$dgiotBus.$on('removeShape', (topo) => {
        if (topo.attrs.id) this.removeShape(topo)
      })
      this.$baseEventBus.$on('busTopo', (type, data) => {
        this.newTopo(type, data)
      })
      // this.$baseEventBus.$on('busUpdata', () => {
      //   this.updataTopo()
      // })
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
      removeShape(node) {
        const topoid = node.attrs.id
        const lab = node.attrs.className
        var type = ''
        let _this = this
        const Layer = _this.stage.find('Layer')[0]
        const Path = _this.stage.find('Path')
        const Image = _this.stage.find('Image')
        const Text = _this.stage.find('Text')
        const Group = _this.stage.find('Group')
        const stage = _this.stage.find(node.attrs.id)
        var tweens = []
        for (var n = 0; n < tweens.length; n++) {
          tweens[n].destroy()
        }
        if (lab == 'Path') {
          type = 'Path'
          Path.forEach((shape) => {
            if (shape.attrs.id == topoid) {
              type = 'img'
              shape.remove()
              shape.destroy()
              node.remove()
              node.destroy()
              Layer.draw()
            }
          })
        }
        if (lab == 'Stage') {
          type = 'Stage'
          stage.forEach((shape) => {
            if (shape.attrs.id == topoid) {
              type = 'Stage'
              shape.remove()
              shape.destroy()
              node.remove()
              node.destroy()
              Layer.draw()
            }
          })
        }
        if (lab == 'Text') {
          type = 'Text'
          Text.forEach((shape) => {
            if (shape.attrs.id == topoid) {
              type = 'img'
              shape.remove()
              shape.destroy()
              node.remove()
              node.destroy()
              Layer.draw()
            }
          })
        }
        if (lab == 'Group') {
          type = 'Group'
          Group.forEach((shape) => {
            if (shape.attrs.id == topoid) {
              type = 'img'
              shape.remove()
              shape.destroy()
              node.remove()
              node.destroy()
              Layer.draw()
            }
          })
        }
        if (node?.attrs?.image) {
          Image.forEach((shape) => {
            console.log('图片相关', shape)
            if (shape.attrs.id == node.attrs.id) {
              type = 'img'
              shape.remove()
              shape.destroy()
              node.remove()
              node.destroy()
              Layer.draw()
            }
          })
        }
        _this.stage.find('Transformer').map((_Transformer) => {
          console.log(_Transformer, '_Transformer')
        })
        const tabInfo = {
          topoid: topoid,
          lab: lab,
          type: type,
          PathLen: Path.length,
          // node: node,
        }
        console.groupCollapsed(
          '%cTopo delete info',
          'color:#009a61; font-size: 28px; font-weight: 300'
        )
        console.table(tabInfo)
        console.groupEnd()
        console.log(_this.stage.find('Transformer'), _this.stage.find())
        // _this.stage.find('Transformer').destroy()
        node.remove()
        Layer.draw()
        Layer.batchDraw()
        _this.$refs.topobase.createTopo(
          _this.stage.toJSON(),
          moment(new Date()).valueOf()
        )
        _this.setGraphNow('')
        if (node.attrs.id == _this.$refs['operation'].Shapeconfig.attrs.id) {
          _this.$refs['operation'].Shapeconfig = []
        }
        _this.updataTopo(this.productid)
      },
      async updataTopo(productid = '') {
        let config = this.productconfig.config
        let stage = JSON.parse(this.$refs['topobase'].stage)
        console.log(stage, config)
        config.konva.Stage = stage
        this.paramsconfig.konva.Stage = stage
        let upconfig = _.merge(this.paramsconfig, config)
        console.log(upconfig, 'upconfig')
        let params = {
          config: upconfig,
        }
        await putProduct(this.productid, params)
          .then((res) => {
            // this.handleCloseSub()
            if (productid) {
              this.$message.success(this.$translateTitle('产品组态更新成功'))
            }
          })
          .catch((e) => {
            this.$message.error(this.$translateTitle(`${e.error}`))
          })
      },
      // saveKonvaitem
      saveKonvaitem(
        config,
        ShapeConfig = {
          index: 1,
          opacity: 1,
        }
      ) {
        // 首先找到他的类型
        const type = config.className
        let _this = this
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

        // 根据类型去找这个组态
        const shope = _this.stage.find(`${type}`)
        console.log(_this.stage.find(`#${config.attrs.id}`))
        console.log('shope', shope)
        shope.forEach((shape) => {
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

        Image.forEach((shape) => {
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
        Group.forEach((shape) => {
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
        Text.forEach((shape) => {
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
        console.log('upshape', upshape)
        _this.stage.batchDraw()
        if (_this.stage.attrs.id == config.attrs.id) {
          _this.kovaUpType = 'Layer'
          _this.stage = config
        }
        _this.$refs.topobase.createTopo(
          _this.stage.toJSON(),
          moment(new Date()).valueOf()
        )
        // console.clear()
        console.info(`updata type is ${_this.kovaUpType}`)
        // _this.ShapeVisible = false
        console.log('konva数据更新成功')
        _this.$dgiotBus.$emit('refresh', this.$route)
        _this.updataTopo(_this.productid)
      },
      newTopo(type, data) {
        const _this = this
        const group = new Konva.Group({
          x: data.coordinate.x,
          y: data.coordinate.y,
          id: `Group_${uuid(6)}`,
          draggable: true,
          // opacity: 1,
        })

        const Layer = _this.stage.find('Layer')[0]
        const { paths = [] } = data
        const __paths = JSON.parse(paths)
        console.log(paths, 'path')
        __paths.forEach((e) => {
          var path = new Konva.Path(e)
          group.add(path)
        })
        console.log(data, 'data')

        Layer.add(group)
        Layer.batchDraw()
        _this.$refs.topobase.createTopo(
          _this.stage.toJSON(),
          moment(new Date()).valueOf()
        )
        // 更新到数据库
        // this.upTopo()

        // Layer.draw()
        // Layer.batchDraw()
        // console.log(group)

        // if (type == 'path') {
        //   const Layer = _this.stage.find('Layer')[0]
        //   // console.log(data)
        //   groupchildren = children.concat(JSON.parse(data))
        //   group.children = groupchildren
        //   console.log(children)
        //
        // }
        // this.$refs.topobase.createTopo(
        //   this.stage.toJSON(),
        //   moment(new Date()).valueOf()
        // )
        // console.log(type, value, 'Group')
      },
      // 订阅mqtt
      async handleMqtt() {
        let _this = this
        if (_this.$route.query.type == 'device') {
          _this.productid = _this.$route.query.deviceid
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
          // console.log(this.$refs['edrawer'].$refs, 'edrawer')
          _this.$refs['operation']
            ? (_this.$refs['operation'].productconfig = results[0])
            : console.log(" _this.$refs['operation']", _this.$refs['operation'])
          console.error(data.Stage.attrs.id)
          _this.globalStageid = data.Stage.attrs.id
          _this.createKonva(data, _this.globalStageid, 'create')
          _this.paramsconfig = { konva: data }
          //
          // set backgroundImage
        }
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
                } else {
                  updataId.push(i.id)
                }
              })
            })
            if (updataId) {
              console.log('以下组态id未更新', updataId)
            }
            this.stage.batchDraw()
            console.log('konva数据更新成功')
          }
        })
      },
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
        console.log(_konvarow)
        const div = document.createElement('div')
        _konvarow.appendChild(div)
        div.setAttribute('id', globalStageid)
        console.log('globalStageid', globalStageid)
        // console.log(JSON.stringify(Stage), 'Stage')
        Stage.attrs.draggable = _this.isDevice ? false : true // 最初的那个 Stage
        _this.stage = Konva.Node.create(Stage, globalStageid)
        console.log('_this.$refs.topobase', _this.$refs.topobase)
        console.log('data', data)
        var Layer = _this.stage.find('Layer')[0]
        var allLayer = _this.stage.find('Layer')
        allLayer.forEach((layer) => {
          _this.unDraggable(layer)
        })
        _this.stage.on('click', (e) => {
          var node = e.target
          // _this.scaleCanvas(node, {})
          console.log(e, 'stage node')
          console.log(node, 'stage target')
          // 判断是否为产品界面
          _this.unDraggable(node)
          // 如果点击空白处 移除图形选择框
          // 移除图形选择框
          if (node == _this.stage) {
            // _this.stage.find('Transformer')?.length
            //   ? _this.stage.find('Transformer').destroy()
            //   : console.log(
            //       " _this.stage.find('Transformer')",
            //       _this.stage.find('Transformer')
            //     )
            Layer.draw()
          }
          // console.log(node.toJSON())
          if (_this.isDevice) return
          _this.setGraphNow(e.target)

          _this.$refs['operation'].Shapeconfig = JSON.parse(node.toJSON())
          if (!_this.flag) {
            return
          }
          console.log('类型', _this.flag)
          console.log('this.draw', _this.draw)
          console.log('color', _this.graphColor)
          console.error('drawParams', _this.drawParams)
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
          console.log('createState', state)
          _group.add(state)
          Layer.draw()
          Layer.batchDraw()
          _this.setFlag('')
          _this.setDraw(false)
          _this.$refs.topobase.createTopo(
            _this.stage.toJSON(),
            moment(new Date()).valueOf()
          )
          _this.updataTopo()
        })
        const Group = _this.stage.find('Group')
        Group.forEach(function (_G) {
          _this.unDraggable(_G)
        })
        const Text = _this.stage.find('Text')
        // console.clear()
        console.log(Text, 'Text')
        // if (!_this.isDevice && Text?.length) {
        if (!_this.isDevice && Text?.length) {
          Text.forEach((_G) => {
            _G.on('mouseenter', function (e) {
              console.log(e, 'Text mouseenter')
              _this.stage.container().style.cursor = 'move'
            })

            _G.on('mouseleave', function (e) {
              console.log(e, 'Text mouseleave')
              _this.stage.container().style.cursor = 'default'
            })
            _G.on('dblclick', function (e) {
              console.log(e, 'Text dblclick')
              console.log(_this.stage.find('Transformer'), _this.stage.find())
              _this.stage.find('Transformer')?.length
                ? _this.stage.find('Transformer').destroy()
                : console.log(
                    "_this.stage.find('Transformer')",
                    _this.stage.find('Transformer')
                  )
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
        //   _this.leftrow = _this.rightrow = 0
        // } else {
        //   // _this.leftrow = 3
        //   _this.rightrow = 6
        // }
        console.log(Group, 'Group')
        // https://github.com/xiongshuang/konva-palette/blob/master/palette/index.html
        if (!_this.isDevice && Group?.length) {
          Group.forEach(function (_G) {
            _this.unDraggable(_G)
            _G.on('dblclick', (e) => {
              console.log(e, 'Group dblclick')
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
              // console.log(e, '_G mouseup')
              if (!_this.isDevice && _this.productid) _this.headevisible = true
              document.body.style.cursor = 'pointer'
            })
            _G.on('mouseover', (e) => {
              // console.log(e, '_G mouseover')
              document.body.style.cursor = 'pointer'
            })
            _G.on('mouseout', (e) => {
              // console.log(e, '_G mouseout')
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
          const img = new Image()
          img.src = node.getAttr('source')
          node.draggable = false
          node.attrs.draggable = false
          _this.unDraggable(node)
          img.draggable = _this.isDevice ? false : true
          img.onload = () => {
            node.image(img)
            _this.stage.batchDraw()
          }
          node.on('mouseout', (e) => {
            const id = e.target.id()
            console.log(
              node,
              'images的移动事件',
              e.target,
              e.target.x(),
              e.target.y(),
              id,
              e
            )
            node.attrs.x = e.target.x()
            node.attrs.y = e.target.y()
            document.body.style.cursor = 'default'
          })
          node.on('dblclick', (e) => {
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
          })
        })
        // console.clear()
        // console.log(_this.stage.toJSON())
        if (!_this.isDevice && Group?.length) {
          Group.forEach(function (_G) {
            _this.unDraggable(_G)
            _G.on('dblclick', (e) => {
              console.log(e, 'Group dblclick')
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
              // console.log(e, 'Group mouseup')
              if (!_this.isDevice && _this.productid) _this.headevisible = true

              document.body.style.cursor = 'pointer'
            })
            _G.on('mouseover', (e) => {
              // console.log(e, 'Group mouseover')
              document.body.style.cursor = 'pointer'
            })
            _G.on('mouseout', (e) => {
              // console.log(e, 'Group mouseout')
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
        // console.clear()
        _this.$refs.topobase.createTopo(
          _this.stage.toJSON(),
          moment(new Date()).valueOf()
        )
        _this.subtopic = `thing/${_this.productid}/post`
        _this.topicKey = _this.$dgiotBus.topicKey(_this.router, _this.subtopic)
        // 订阅webscroket
        _this.$dgiotBus.$emit(`MqttSubscribe`, {
          router: this.router,
          topic: this.subtopic,
          qos: 0,
          ttl: 1000 * 60 * 60 * 3,
        })
        // console.error(_this.stage.toJSON())
        _this.handleMqttMsg()
        // 处理消息
      },
      /**
       *
       * @param Layer
       * @param x
       * @param y
       * @param zoomLevelx
       * @param zoomLevelY
       */
      scaleCanvas(
        Layer,
        { x = 1, y = 1, zoomLevelX = 1, zoomLevelY = 1 } = args
      ) {
        // Layer.x(x)
        // Layer.y(y)
        Layer.scale({
          x: zoomLevelX,
          y: zoomLevelY,
        })
      },
      /**
       * @description 将拖拽事件禁用
       * @param node
       */
      unDraggable(node) {
        node.draggable = this.isDevice ? false : true
        node.attrs.draggable = this.isDevice ? false : true
        console.log('node', node)
        // node.draggable = this.isDevice ? false : true
        // node.attrs.draggable = this.isDevice ? false : true
        // if (node.attrs.source) {
        //   node.draggable = false
        //   node.attrs.draggable = false
        // }
        this.stage.draw()
        this.stage.batchDraw()
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
