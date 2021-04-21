<template>
  <div class="grid-content">
    <div class="drawer">
      <el-drawer
        :with-header="false"
        size="40%"
        :visible.sync="drawer"
        direction="rtl"
      >
        <websocket />
      </el-drawer>
    </div>
    <div class="dialog">
      <el-dialog
        :visible.sync="showSetting"
        width="20%"
        :before-close="handleClose"
      >
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item
            label="mqtt地址"
            prop="url"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.url" autocomplete="off" />
          </el-form-item>
          <el-form-item
            label="topic"
            prop="topic"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.topic" autocomplete="off" />
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button type="primary" @click="submitForm('form')">
              立即订阅
            </el-button>
            <el-button @click="resetForm('form')">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- <span slot="footer" class="dialog-footer">
          <el-button @click="showSetting = false">取 消</el-button>
          <el-button type="primary" @click="showSetting = false">
            确 定
          </el-button>
        </span> -->
        <span slot="footer" class="dialog-footer" style="height: 30px">
          <el-switch
            v-model="stopValue"
            style="display: inline-block; margin-right: 10px"
            active-color="#13ce66"
            inactive-color="#ff4949"
            inactive-text="自动刷新"
            @change="stopsub"
          />
        </span>
      </el-dialog>
    </div>
    <div class="header">
      <el-row :gutter="24">
        <el-col :span="8">
          <el-input v-model="text" placeholder="请输入你要修改的内容">
            <template slot="append">
              <el-button
                type="primary"
                plain
                :disabled="!text.length"
                @click="_setText(text)"
              >
                setText
              </el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-input v-model="text" placeholder="请输入mqtt订阅id">
            <template slot="append">
              <el-button
                type="primary"
                plain
                :disabled="!text.length"
                @click="subscribe"
              >
                订阅mqtt
              </el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button
            type="warning"
            icon="el-icon-document-add"
            @click="_addRect"
          >
            绘制rete
          </el-button>
          <el-button
            type="warning"
            icon="el-icon-document-add"
            @click="_addText"
          >
            绘制text
          </el-button>
          <el-button
            type="success"
            icon="el-icon-setting"
            @click="drawer = !drawer"
          >
            tools
          </el-button>
          <el-button
            icon="el-icon-document-add"
            :disabled="text.length == 0"
            @click="handleCloseSub"
          >
            取消订阅mqtt
          </el-button>
        </el-col>
      </el-row>
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
  var subdialog
  import {
    Websocket,
    sendInfo,
    TOPIC_EMPTY,
    MSG_EMPTY,
    DISCONNECT_MSG,
  } from '@/utils/wxscoket.js'
  import createStage from '@/utils/konva/createStage'
  import createText from '@/utils/konva/createText'
  import createRect from '@/utils/konva/createRect'
  import createImg from '@/utils/konva/createImg'
  import setText from '@/utils/konva/setText'
  import konva from '@/api/Mock/konva'
  import websocket from '@/views/tools/websocket'
  export default {
    components: {
      websocket,
    },
    data() {
      return {
        textConfig: [],
        imgConfig: [],
        rectConfig: [],
        LayerData: [],
        drawer: false,
        subdialogtimer: null,
        rules: {
          url: [{ required: true, message: '请输入url', trigger: 'blur' }],
          topic: [{ required: true, message: '请输入topic', trigger: 'blur' }],
        },
        subdialogid: 'subdialogid',
        showSetting: false,
        layer: new Konva.Layer(),
        simpleText: {},
        stage: {},
        text: '',
        stopValue: '',
        form: {
          url: '',
          topic: '',
        },
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
      this.createKonva()
    },
    methods: {
      // 取消订阅mqtt
      handleCloseSub() {
        var text0 = JSON.stringify({ action: 'stop_logger' })
        var sendInfo = {
          topic: 'channel/' + this.subdialogid,
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
          topic: 'channel/' + this.subdialogid,
          text: text0,
          retained: true,
          qos: 2,
        }
        Websocket.sendMessage(sendInfo)
      },
      // mqtt订阅
      subscribe() {
        this.subdialogid = this.text
        var text0 = JSON.stringify({ action: 'start_logger' })
        var info = {
          topic: 'log/channel/' + this.subdialogid,
          qos: 2,
        }
        let _this = this
        Websocket.subscribe(info, function (res) {
          console.log('res', res)
          if (res.result) {
            var sendInfo = {
              topic: 'channel/' + this.subdialogid,
              text: text0,
              retained: true,
              qos: 2,
            }
            Websocket.sendMessage(sendInfo)
            _this.subdialogtimer = window.setInterval(() => {
              Websocket.sendMessage(sendInfo)
            }, 600000)
          }
        })
        var submessage = ''
        var channeltopic = new RegExp('log/channel/' + this.subdialogid)
        Websocket.add_hook(channeltopic, function (Msg) {
          console.log('mqtt Msg', Msg)
          // 判断长度
          if (subdialog.session.getLength() >= 1000) {
            submessage = ''
          } else {
            submessage += _this.nowtime() + Msg + `\n`
          }
          subdialog.setValue(submessage)
          subdialog.gotoLine(subdialog.session.getLength())
        })
        console.log(subdialog)
        this.showSetting = false
      },
      // 弹窗订阅日志
      nowtime() {
        var timestamp = Date.parse(new Date())
        var date = new Date(timestamp)
        var Y = date.getFullYear() + '年'
        var M =
          (date.getMonth() + 1 <= 10
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1) + '月'
        var D =
          (date.getDate() + 1 <= 10 ? '0' + date.getDate() : date.getDate()) +
          '日  '
        var h =
          (date.getHours() + 1 <= 10
            ? '0' + date.getHours()
            : date.getHours()) + ':'
        var m =
          (date.getMinutes() + 1 <= 10
            ? '0' + date.getMinutes()
            : date.getMinutes()) + ':'
        var s =
          date.getSeconds() + 1 <= 10
            ? '0' + date.getSeconds()
            : date.getSeconds()
        return h + m + s + ' '
      },
      // 配置mqtt信息订阅消息
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.subscribe()
          }
        })
      },
      // 清空表单
      resetForm(formName) {
        this.$refs[formName].resetFields()
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
      async _setText(text) {
        const { tween } = await setText(this.stage.find('#_text')[0], text)
        if (tween) this.$message('手动修改成功')
      },
      // js 绘制
      createKonva() {
        let _stateConfig = this.stageConfig
        if (konva) {
          const { data } = konva
          _stateConfig = Object.assign(this.stageConfig, data.Stage)
          this.LayerData = data.Layer
        } else {
        }
        this.stage = createStage(_stateConfig)

        this.LayerData.filter((item) => {
          switch (item.type) {
            case 'text':
              this.textConfig.push(item)
              this.layer.add(createText(item))
              break
            case 'image':
              this.imgConfig.push(item)
              this.layer.add(createImg(item))
              this.layer.batchDraw()
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
      },
      onError() {
        this.$message('非Json数据类型')
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
      height: 40px;
      padding: 10px;
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
