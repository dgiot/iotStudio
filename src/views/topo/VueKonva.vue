<template>
  <div class="grid-content">
    <div class="drawer">
      <el-drawer
        :with-header="false"
        size="40%"
        :visible.sync="drawer"
        direction="rtl"
      >
        <websocket :topic="topic" />
      </el-drawer>
    </div>
    <div class="header">
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
                @click="subscribeMqtt(LayerData)"
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
              <el-button
                icon="el-icon-document-brush"
                @click="handleKonvaStyle()"
              >
                {{ iskonvaBg ? '隐藏' : '显示' }}背景
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
    <div ref="konva" class="konva">
      <el-row :gutter="24">
        <el-col :span="24">
          <div id="container" ref="container"></div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import { Websocket, sendInfo } from '@/utils/wxscoket.js'
  import createStage from '@/utils/konva/createStage'
  import createGroup from '@/utils/konva/createGroup'
  import createText from '@/utils/konva/createText'
  import createRect from '@/utils/konva/createRect'
  import createImg from '@/utils/konva/createImg'
  import createShape from '@/utils/konva/createShape'
  import updateShape from '@/utils/konva/updateShape'
  import setText from '@/utils/konva/setText'
  import websocket from '@/views/tools/websocket'
  import { _getTopo } from '@/api/Topo'
  import { isBase64 } from '@/utils'
  export default {
    components: {
      websocket,
    },
    data() {
      return {
        iskonvaBg: true,
        activeNames: [],
        productid: this.$route.query.productid || '',
        konva: [],
        textConfig: [],
        imgConfig: [],
        rectConfig: [],
        LayerData: [],
        drawer: false,
        topic: '',
        stop_Mqtt: true,
        subdialogtimer: null,
        rules: {
          url: [{ required: true, message: '请输入url', trigger: 'blur' }],
          topic: [{ required: true, message: '请输入topic', trigger: 'blur' }],
        },
        subdialogid: 'subdialogid',
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
          id: '_container',
        }
      },
    },
    mounted() {
      this.handleCloseSub()
      if (this.productid) {
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
      // 订阅mqtt
      subscribeMqtt(data = []) {
        this.subscribe(this.productid)
        // data.forEach((item) => {
        //   if (item.id) {
        //     this.subscribe(item.id)
        //   }
        // })
      },
      // 处理mqtt信息
      handleMqttMsg(subdialogid) {
        var submessage = ''
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
      // 显示隐藏背景图
      handleKonvaStyle(iskonvaBg) {
        this.iskonvaBg = !this.iskonvaBg
        this.activeClass = this.iskonvaBg ? 'konva' : ''
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
          // this.subaction = 'start'
          text0 = JSON.stringify({ action: 'stop_logger' })
        } else {
          // this.subaction = 'stop'
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
          topic: `thing/${this.productid}/post`,
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
      handleClose() {},
      // 新增文本
      _addText() {
        let text = createText({})
        this.layer.add(text)
        this.stage.add(this.layer)
      },
      // 设置文本
      async _setText(id, text) {
        console.log(this.stage.find(`#${id}`)[0])
        const { tween } = await setText(this.stage.find(`#${id}`)[0], text)
        console.log(tween)
      },
      _initCreate() {
        let background =
          'http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/shuwa_tech/zh/frontend/konva/assets/taiti.png'
        this.$refs.konva.style.backgroundImage = `url(${background})`
        // let konvaConfig = this.konva
        // console.log('konvaConfig', konvaConfig)
        // let _stateConfig = this.stageConfig
        // if (konvaConfig) {
        //   const { data } = konvaConfig
        //   _stateConfig = Object.assign(this.stageConfig, data.Stage)
        //   this.LayerData = data.Layer
        // } else {
        // }
        // this.stage = createStage(_stateConfig)
        // this.LayerData.filter((item) => {
        //   switch (item.type) {
        //     case 'image':
        //       this.imgConfig.push(item)
        //       this.layer.add(createImg(item))
        //       this.layer.batchDraw()
        //       break
        //     case 'text':
        //       this.textConfig.push(item)
        //       this.layer.add(createText(item))
        //       break
        //     case 'rect':
        //       this.rectConfig.push(item)
        //       this.layer.add(createRect(item))
        //       break
        //     default:
        //       console.log(item.type, item)
        //       break
        //   }
        // })
        // this.stage.add(this.layer)
        // console.log(this.stage.toJSON())
      },
      // js 绘制
      async createKonva() {
        const { productid, devaddr = undefined } = this.$route.query
        let params = {
          productid: productid,
          devaddr: devaddr,
        }
        // const { msg = '' } = await _getTopo(params)
        const { message = '', data } = await _getTopo(params)
        if (message == 'SUCCESS') {
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
          this.stagedefault = Shape
          this.$refs.konva.style.backgroundImage = `url(${background})`
          this.stage = new Konva.Stage(Object.assign(this.stageConfig, Stage))
          let layer = new Konva.Layer(Layer)
          // create group
          let group = new Konva.Group(Group)
          // this.layer.add(createText(data.Layer))
          // create Shape
          let _Shape = createShape(group, Shape)
          layer.add(_Shape)
          // 鼠标事件
          group.on('mouseover', function () {
            document.body.style.cursor = 'pointer'
          })
          group.on('mouseout', function () {
            document.body.style.cursor = 'default'
          })
          group.on('click', function (e) {
            console.log('attrs', e.target.attrs)
          })
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
  .grid-content {
    ::v-deep .el-drawer__body {
      overflow-x: auto;
      overflow-y: auto;
    }
    width: 100%;
    height: calc(100vh - 211px);
    .konva {
      height: 100%;
      /* background-image: url('http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/shuwa_tech/zh/frontend/konva/assets/taiti.png'); */
      background-size: 100% 100%;
    }
  }
</style>
