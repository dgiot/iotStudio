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
            <el-col :span="6">
              <el-button
                type="success"
                icon="el-icon-setting"
                @click="drawerFlag"
              >
                websocket
              </el-button>
              <el-button
                icon="el-icon-document-add"
                :disabled="deviceid.length < 0"
                @click="subscribeMqtt(LayerData)"
              >
                订阅mqtt
              </el-button>
              <el-button
                icon="el-icon-document-add"
                :disabled="stop_Mqtt"
                @click="handleCloseSub(LayerData)"
              >
                取消订阅mqtt
              </el-button>
            </el-col>
            <el-col :span="4">
              自动刷新
              <el-switch
                v-model="value"
                :disabled="deviceid.length < 0"
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
    <div class="konva">
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
  import setText from '@/utils/konva/setText'
  import konva from '@/api/Mock/konva'
  import websocket from '@/views/tools/websocket'
  import { _getTopo } from '@/api/Topo'
  export default {
    components: {
      websocket,
    },
    data() {
      return {
        activeNames: [],
        deviceid: this.$route.query.deviceid || '',
        konva: konva,
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
        layer: new Konva.Layer(),
        simpleText: {},
        stage: {},
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
      if (this.deviceid) {
        console.log(this.deviceid)
        this.createKonva()
      } else {
        this._initCreate()
      }
    },
    methods: {
      // 订阅mqtt
      subscribeMqtt(data = []) {
        this.subscribe(this.deviceid)
        // data.forEach((item) => {
        //   if (item.id) {
        //     this.subscribe(item.id)
        //   }
        // })
      },
      // 处理mqtt信息
      handleMqttMsg(subdialogid) {
        this.LayerData = []
        var submessage = ''
        var channeltopic = new RegExp('thing/' + subdialogid + '/post')
        Websocket.add_hook(channeltopic, (Msg) => {
          let decodeMqtt = Base64.decode(Msg + '')
          console.log(decodeMqtt, 'decodeMqtt')
          let LayerData = this.LayerData
          console.log(LayerData)
          if (decodeMqtt) {
            let _stateConfig = this.stageConfig
            const {
              konva = {
                Group: { id: 'group_9c5930e565', rotation: 20, x: 120, y: 40 },
                Layer: {
                  fill: '#e579f2',
                  fontFamily: 'Calibri',
                  fontSize: 26,
                  id: 'layer_9c5930e565',
                  text: '16',
                  x: 480,
                  y: 21,
                },
                Shape: [
                  {
                    fill: '#e579f2',
                    fontFamily: 'Calibri',
                    fontSize: 26,
                    id: 'Acrel',
                    text: '16',
                    x: 480,
                    y: 21,
                  },
                ],
                Stage: { height: 248, id: 'stage_9c5930e565', width: 1643 },
              },
            } = decodeMqtt
            if (konva) {
              console.log(konva)
              _stateConfig = Object.assign(this.stageConfig, konva.Stage)
              this.textConfig.push(konva.Layer)
              this.layer.add(createText(konva.Layer))
              this.stage = createStage(_stateConfig)
              this.stage.add(this.layer)
              console.log(this.stage.toJSON(), '绘制完成')
            }
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
          }
        })
      },
      // 取消订阅mqtt
      handleCloseSub(data) {
        this.stop_Mqtt = true
        var text0 = JSON.stringify({ action: 'stop_logger' })
        var sendInfo = {
          topic: 'thing/' + this.deviceid + '/post',
          text: text0,
          retained: true,
          qos: 2,
        }
        Websocket.sendMessage(sendInfo)
        window.clearInterval(this.subdialogtimer)
        this.subdialogtimer = null
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
          topic: 'thing/' + this.deviceid + '/post',
          text: text0,
          retained: true,
          qos: 2,
        }
        Websocket.sendMessage(sendInfo)
      },
      // 打开websocket
      drawerFlag() {
        this.topic = `thing/${this.deviceid}/post`
        this.drawer = true
      },
      // mqtt订阅
      subscribe(subdialogid) {
        var info = {
          topic: `thing/${this.deviceid}/post`,
          qos: 2,
        }
        Websocket.subscribe(info, (res) => {
          console.log(res)
          if (res.result) {
            // thing/9c5930e565/9CA525B343F0/post
            this.$message(`订阅成功 topic: ${info.topic}`, 'sussess')
            this.stop_Mqtt = false
            this.handleMqttMsg(subdialogid)
          } else {
            this.$message('订阅失败,请手动订阅mqtt', 'error')
            this.subscribeMqtt([])
          }
        })
      },
      handleClose() {},
      // 新增rect
      _addRect() {
        let randomNum = Mock.mock({
          'number|1-300': 200,
        }).number
        let rect = createRect(
          randomNum,
          randomNum,
          randomNum,
          randomNum,
          Mock.mock('@rgb'),
          randomNum,
          {
            x: randomNum,
            y: randomNum,
          },
          true,
          Mock.mock({
            'string|1-5': '★',
          })
        )
        this.layer.add(rect)
        this.stage.add(this.layer)
      },
      // 新增文本
      _addText() {
        let text = createText({})
        this.layer.add(text)
        this.stage.add(this.layer)
      },
      // 设置文本
      async _setText(id, text) {
        const { tween } = await setText(this.stage.find(`#${id}`)[0], text)
      },
      _initCreate() {
        let konvaConfig = this.konva
        console.log('konvaConfig', konvaConfig)
        let _stateConfig = this.stageConfig
        if (konvaConfig) {
          const { data } = konvaConfig
          _stateConfig = Object.assign(this.stageConfig, data.Stage)
          this.LayerData = data.Layer
        } else {
        }
        this.stage = createStage(_stateConfig)

        this.LayerData.filter((item) => {
          switch (item.type) {
            case 'image':
              this.imgConfig.push(item)
              this.layer.add(createImg(item))
              this.layer.batchDraw()
              break
            case 'text':
              this.textConfig.push(item)
              this.layer.add(createText(item))
              break
            case 'rect':
              this.rectConfig.push(item)
              this.layer.add(createRect(item))
              break
            default:
              console.log(item.type, item)
              break
          }
        })
        this.stage.add(this.layer)
        console.log(this.stage.toJSON())
      },
      // js 绘制
      async createKonva() {
        console.log(this.$route.query)
        const { deviceid, type } = this.$route.query
        let params = {
          objectId: deviceid,
          type: type,
        }
        // const { msg = '' } = await _getTopo(params)
        const { message = '' } = await _getTopo(params)
        if (message == 'SUCCESS') {
          this.subscribe(this.deviceid)
          console.log('订阅mqtt消息')
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
    .header {
      /* height: 40px;
      padding: 10px; */
    }
    .konva {
      /* width: 100vh; */
      height: 100%;
      background: url('http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/shuwa_tech/zh/frontend/konva/assets/taiti.png')
        no-repeat;
      background-size: 100% 100%;
    }
  }
</style>
