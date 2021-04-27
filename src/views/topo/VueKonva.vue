<template>
  <div class="_vuekonva">
    <div class="_dialog">
      <el-dialog :visible.sync="ShapeVisible" width="100vh" class="_shape">
        <el-tabs v-model="tabsName">
          <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
          <el-tab-pane label="配置管理" name="ShapeJson">
            <span>
              <vue-json-editor v-model="Shapeconfig" :mode="'code'" lang="zh" />
            </span>
          </el-tab-pane>
        </el-tabs>
        <span v-if="tabsName == 'ShapeJson'" slot="footer">
          <el-button @click="ShapeVisible = false">取 消</el-button>
          <el-button type="primary" @click="ShapeVisible = false">
            确 定
          </el-button>
        </span>
      </el-dialog>
    </div>
    <div class="_drawer">
      <el-drawer
        :with-header="false"
        size="40%"
        :visible.sync="drawer"
        direction="rtl"
      >
        <websocket :topic="topic" />
      </el-drawer>
    </div>
    <div class="_header">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <el-row :gutter="24">
            <el-col :span="8">
              <el-button
                type="success"
                icon="el-icon-setting"
                @click="drawerFlag"
              >
                websocket
              </el-button>
              <el-button
                icon="el-icon-document-add"
                :disabled="productid.length < 0"
                @click="subscribe(productid)"
              >
                订阅mqtt
              </el-button>
              <el-button
                icon="el-icon-document-add"
                :disabled="stop_Mqtt"
                @click="handleCloseSub()"
              >
                取消订阅mqtt
              </el-button>
            </el-col>
            <el-col :span="4">
              自动刷新
              <el-switch
                v-model="value"
                :disabled="productid.length < 0"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="关闭"
                inactive-text="开启"
                @change="stopsub"
              />
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="_mian">
      <el-row :gutter="gutter" class="_row">
        <el-col :span="leftrow">
          <div class="_left"><topo-allocation /></div>
        </el-col>
        <el-col :span="gutter - leftrow - rightrow" class="_konvarow">
          <div ref="konva" :class="konvaClass"></div>
          <div v-if="!isDevice && !productconfig.length" class="_info">
            <el-row :gutter="10">
              <el-col :span="6">
                <el-button
                  type="success"
                  plain
                  :disabled="productid.length < 1"
                  @click="preview('save')"
                >
                  保存
                </el-button>
              </el-col>
              <el-col :span="6">
                <el-button
                  type="primary"
                  :disabled="productid.length < 1"
                  plain
                  @click="preview('info')"
                >
                  当前数据
                </el-button>
              </el-col>
              <el-col :span="6">
                <el-button type="info" plain @click="preview('search')">
                  分享
                </el-button>
              </el-col>
              <el-col :span="6">
                <vab-slider v-model="per" :min="0" :max="100" />
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="rightrow">
          <div class="_right"><topo-operation /></div>
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
  import { createShape, updateShape, setText } from '@/utils/konva'
  import websocket from '@/views/tools/websocket'
  import { isBase64 } from '@/utils'
  import { Websocket } from '@/utils/wxscoket.js'
  import { _getTopo } from '@/api/Topo'
  import { putProduct, queryProduct } from '@/api/Product'
  export default {
    components: {
      websocket,
      vueJsonEditor,
      ...res_components,
    },
    data() {
      return {
        per: '100',
        paramsconfig: {},
        productconfig: {},
        activeNames: [],
        gutter: 24,
        leftrow: 0,
        rightrow: 0,
        productid: this.$route.query.productid || '',
        isDevice: this.$route.query.type ? true : false,
        konva: [],
        konvaClass: ['konva', '_center'],
        textConfig: [],
        imgConfig: [],
        rectConfig: [],
        LayerData: [],
        drawer: false,
        ShapeVisible: false,
        Shapeconfig: { id: '' },
        topic: '',
        stop_Mqtt: true,
        subdialogtimer: null,
        rules: {
          url: [{ required: true, message: '请输入url', trigger: 'blur' }],
          topic: [{ required: true, message: '请输入topic', trigger: 'blur' }],
        },
        subdialogid: 'subdialogid',
        tabsName: 'ShapeJson',
        layer: {},
        group: {},
        stagedefault: [],
        simpleText: {},
        text: '',
        stopValue: '',
        form: {
          url: '',
          topic: '',
        },
        value: false,
        formLabelWidth: '80px',
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
        this.createKonva()
        console.log('订阅mqtt消息')
      } else {
        this._initCreate()
      }
    },
    destroyed() {
      this.handleCloseSub()
    },
    methods: {
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
      // 更新产品
      async updataProduct(productid) {
        console.log('updatatopo')
        const { config } = this.productconfig
        // 提交前需要先对数据进行合并
        let upconfig = Object.assign(config, this.paramsconfig)
        let params = {
          config: upconfig,
        }
        let res = await putProduct(productid, params)
        console.log(res)
        this.$message.success('产品组态更新成功')
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
          const Shape = decodeMqtt.konva.Shape
          const stagedefault = this.stagedefault
          if (Shape) {
            updateShape(Shape)
              .then((result) => {
                console.log(result)
                console.log('konva数据更新成功')
              })
              .catch((err) => {
                console.log('konva数据更新失败', err)
              })
          }
        })
      },
      // 取消订阅mqtt
      handleCloseSub() {
        this.stop_Mqtt = true
        var text0 = JSON.stringify({ action: 'stop_logger' })
        var sendInfo = {
          topic: 'thing/' + this.productid + '/post',
          text: text0,
          retained: true,
          qos: 2,
        }
        Websocket.unsubscribe(sendInfo, (res) => {
          console.log('取消订阅mqtt', res.msg)
        })
      },
      // 是否自动刷新mqtt消息
      stopsub(value) {
        var text0
        if (value == false) {
          text0 = JSON.stringify({ action: 'stop_logger' })
        } else {
          text0 = JSON.stringify({ action: 'start_logger' })
        }
        var sendInfo = {
          topic: 'thing/' + this.productid + '/post',
          text: text0,
          retained: true,
          qos: 2,
        }
        Websocket.sendMessage(sendInfo)
      },
      // 打开websocket
      drawerFlag() {
        this.topic = `thing/${this.productid}/post`
        this.drawer = true
      },
      // mqtt订阅
      subscribe(subdialogid) {
        var info = {
          topic: `thing/${subdialogid}/post`,
          qos: 2,
        }
        Websocket.subscribe(info, (res) => {
          if (res.result) {
            // thing/9c5930e565/9CA525B343F0/post
            this.$message(`订阅成功 topic: ${info.topic}`, 'sussess')
            this.stop_Mqtt = false
          } else {
            this.$message('订阅失败,请手动订阅mqtt', 'error')
            this.subscribeMqtt([])
          }
        })
      },
      _initCreate() {
        let background =
          'http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/shuwa_tech/zh/frontend/konva/assets/taiti.png'
        this.$refs.konva.style.backgroundImage = `url(${background})`
      },
      // js 绘制
      async createKonva() {
        const { productid, devaddr = undefined } = this.$route.query
        let params = {
          productid: productid,
          devaddr: devaddr,
        }
        const { message = '', data } = await _getTopo(params)
        // 绘制前不光需要获取到组态数据，还需要获取产品数据
        const { results = [] } = await queryProduct({
          where: { objectId: this.productid },
        })
        this.productconfig = results[0]
        console.log(this.productconfig)
        if (message == 'SUCCESS') {
          console.log(data)
          this.paramsconfig = { konva: data }
          //
          if (this.$route.query.type == 'device') {
            this.productid = this.$route.query.deviceid
          }
          this.handleMqttMsg(this.productid)
          // set backgroundImage
          console.log(data)
          const {
            background = '',
            Shape = [],
            Group = {},
            Layer = {},
            Stage = {},
          } = data
          // 生成页面canvas组
          console.log(Stage, 'container')
          var _konvarow = document.querySelectorAll('._center')[0]
          let div = document.createElement('div')
          div.setAttribute('id', Stage.container)
          _konvarow.append(div)
          this.stagedefault = Shape
          this.$refs.konva.style.backgroundImage = `url(${background})`
          this.stage = new Konva.Stage(Object.assign(this.stageConfig, Stage))
          let _this = this
          let layer = new Konva.Layer(Layer)
          // create group
          let group = new Konva.Group(Group)
          // this.layer.add(createText(data.Layer))
          // create Shape
          createShape(group, Shape)
          // function
          // 设置页面是从设备界面进入 则不添加以下事件
          if (this.isDevice && this.productconfig) {
            this.konvaClass.push('isDevice')
            this.leftrow = this.rightrow = 0
          } else {
            this.leftrow = this.rightrow = 3
            group.on('click', (e) => {
              _this.ShapeVisible = true
              console.log(e)
              _this.Shapeconfig = e.target.attrs
            })
          }
          group.on('mouseover', () => {
            document.body.style.cursor = 'pointer'
          })
          group.on('mouseout', () => {
            document.body.style.cursor = 'default'
          })
          // views
          layer.add(group)
          layer.batchDraw()
          this.stage.add(layer)
          console.log('绘制完成')
          this.$nextTick(() => {
            this.subscribe(this.productid)
          })
        } else {
          this._initCreate()
        }
      },
    },
  }
</script>
<style lang="scss" scoped>
  ._vuekonva {
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
      ._row {
        ._konvarow {
          padding: 0 !important;
          // border: 1px solid red;
          box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
          .konva {
            min-width: 100vh;
            min-height: calc(100vh - 262px);
            // background-image: url('http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/shuwa_tech/zh/frontend/konva/assets/taiti.png');
            background-size: 100% 100%;
            border-bottom: 1px solid #ebeef5;
          }
          .isDevice {
            min-height: calc(100vh - 211px);
          }
        }
        ._info {
          height: 40px;
          line-height: 40px;
          background-color: white;
        }
      }
    }
  }
</style>
