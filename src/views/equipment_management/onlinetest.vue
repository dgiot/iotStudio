<template>
  <div class="onlinetest">
    <div class="onlinetest_top">
      <div>
        <el-form
          :inline="true"
          :model="devices"
          size="mini"
        >
          <el-form-item label="请选择设备">
            <el-select
              v-model="devices.productid"
              @change="selsectProduct"
            >
              <el-option
                v-for="(item, index) in productlist"
                :key="index"
                :label="item.name"
                :value="item.objectId"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="devices.devicedevaddr"
              v-el-select-loadmore="loadmore"
            >
              <el-option
                v-for="(item, index) in devicelist"
                :key="index"
                :label="item.name"
                :value="item.devaddr"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="服务通道">
            <el-select v-model="devices.subtopic">
              <el-option
                v-for="(item, index) in channellist"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click.native="subTopic"
            >
              订阅
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="top_content">
        <span style="display: inline-block; font-size: 20px; font-weight: 900">
          实时日志
        </span>
        <span
          :class="status"
          class="status"
        />
        <!-- <span style="font-size:14px;color:grey">(未激活)真实设备</span> -->
        <div style="float: right">
          <el-switch
            v-model="value4"
            active-color="#13ce66"
            inactive-color="#ff4949"
            inactive-text="自动刷新"
            style="display: inline-block; margin-right: 10px"
            @change="isInterval"
          />
          <el-button
            size="mini"
            type="primary"
            @click="sendTrueInterval"
          >
            刷新
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="clearTopic"
          >
            清屏
          </el-button>
        </div>
        <div style="margin-top: 20px">
          <pre
            id="subprodevice"
            class="ace_editor"
            style="width: 100%; min-height: 300px"
          >
            <textarea
              class="ace_text-input"
              style="overflow:scroll"
            />
          </pre>
        </div>
      </div>
    </div>
    <div class="onlinetest_bottom">
      <el-tabs type="border-card">
        <el-tab-pane label="调试真实设备">
          <div class="bottom1_top">
            <!-- <el-button-group>
              <el-button
                :type="primary==true ? 'primary':'info'"
                @click="primary=true"
                size="mini"
                plain
              >属性调试</el-button>
              <el-button
                :type="primary==false ? 'primary':'info'"
                @click="primary=false"
                size="mini"
                plain
              >服务调用</el-button>
            </el-button-group> -->
            <div>
              <div class="editorheader">
                <el-form
                  :inline="true"
                  :model="editor1"
                  label-width="80px"
                  size="mini"
                >
                  <el-form-item label="调试功能">
                    <el-select
                      v-model="editor1.function"
                      @change="selectMessage"
                    >
                      <el-option
                        v-for="(item, index) in dataslist"
                        :key="index"
                        :label="item.data.name"
                        :value="item.objectId"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button
                      circle
                      icon="el-icon-plus"
                      type="primary"
                      @click="addMessage"
                    />
                    <el-button
                      :disabled="editor1.function == ''"
                      circle
                      icon="el-icon-delete"
                      type="danger"
                      @click="deleteMessage"
                    />
                  </el-form-item>
                  <div style="margin-top: 10px">
                    <el-tooltip
                      v-if="editor1.function == ''"
                      class="item"
                      content="请选择功能"
                      effect="dark"
                      placement="top-start"
                    >
                      <span>
                        <el-button
                          :disabled="editor1.function == ''"
                          size="mini"
                          type="primary"
                          @click="sendMessage1"
                        >
                          发送指令
                        </el-button>
                      </span>
                    </el-tooltip>
                    <el-button
                      v-else
                      :disabled="editor1.function == ''"
                      size="mini"
                      type="primary"
                      @click="sendMessage1"
                    >
                      发送指令
                    </el-button>
                    <el-button
                      :disabled="editor1.function == ''"
                      icon="el-icon-edit"
                      size="mini"
                      type="primary"
                      @click="editorMessage"
                    >
                      更新
                    </el-button>
                    <el-button
                      :disabled="editor1.function == ''"
                      plain
                      size="mini"
                      type="info"
                    >
                      重置
                    </el-button>
                  </div>
                </el-form>
              </div>
              <div style="background: #ffffff">
                <label id="plug-name" />
              </div>
              <pre
                id="editor1"
                class="ace_editor"
                style="min-height: 300px"
              ><textarea class="ace_text-input" /></pre>
            </div>
          </div>
        </el-tab-pane>
        <!--第二个tab页-->
        <el-tab-pane label="调试虚拟设备">
          <div class="editor2header">
            <div
              v-if="isactive == true"
              class="editor2show animated fadeIn"
            >
              <el-button-group>
                <el-button
                  :type="primary1 == 1 ? 'primary' : 'info'"
                  plain
                  size="mini"
                  @click="primary1 = 1"
                >
                  属性上报
                </el-button>
                <el-button
                  :type="primary1 == 2 ? 'primary' : 'info'"
                  plain
                  size="mini"
                  @click="primary1 = 2"
                >
                  事件上报
                </el-button>
                <el-button
                  :type="primary1 == 3 ? 'primary' : 'info'"
                  plain
                  size="mini"
                  @click="functionClick"
                >
                  属性调试
                </el-button>
                <el-button
                  :type="primary1 == 4 ? 'primary' : 'info'"
                  plain
                  size="mini"
                  @click="primary1 = 4"
                >
                  服务调用
                </el-button>
              </el-button-group>
              <!--属性上报-->
              <div
                v-show="primary1 == 1"
                class="primary1"
              >
                <el-form
                  :model="primary1form"
                  size="mini"
                >
                  <el-form-item label="lightStatus">
                    <el-select v-model="primary1form.status">
                      <el-option
                        label="11111"
                        value="2222"
                      />
                    </el-select>
                  </el-form-item>
                  <!--属性上报内容-->
                  <div class="primary1content" />
                  <div class="primary1bottom">
                    <el-button
                      size="mini"
                      type="primary"
                    >
                      推送
                    </el-button>
                    <el-button
                      plain
                      size="mini"
                      type="info"
                    >
                      策略推送
                    </el-button>
                    <el-button
                      plain
                      size="mini"
                      type="info"
                      @click="isactive = false"
                    >
                      关闭虚拟设备
                    </el-button>
                    <el-button
                      plain
                      size="mini"
                      type="info"
                    >
                      查看数据
                    </el-button>
                  </div>
                </el-form>
              </div>
              <!--事件上报-->
              <div
                v-show="primary1 == 2"
                class="primary2 animated fadeInUp"
              >
                <div
                  style="
                    margin-top: 20px;
                    margin-bottom: 20px;
                    font-size: 20px;
                    color: #73777a;
                  "
                >
                  暂无数据
                </div>
                <div>
                  <el-button
                    size="small"
                    type="primary"
                  >
                    编辑物模型
                  </el-button>
                  <el-button
                    size="small"
                    type="info"
                    @click="isactive = false"
                  >
                    关闭设备
                  </el-button>
                </div>
              </div>
              <div
                v-show="primary1 == 3 || primary1 == 4"
                class="primary3"
              >
                <div class="editorheader">
                  <el-form
                    :inline="true"
                    :model="editor2"
                    label-width="80px"
                    size="mini"
                  >
                    <el-form-item label="调试功能">
                      <el-select v-model="editor2.function">
                        <el-option
                          label="11111"
                          value="2222"
                        />
                      </el-select>
                    </el-form-item>
                    <div
                      v-if="primary1 == 3"
                      style="display: inline-block"
                    >
                      <el-form-item label="功能">
                        <el-select v-model="editor2.method">
                          <el-option />
                        </el-select>
                      </el-form-item>
                    </div>
                  </el-form>
                </div>
                <div style="background: #ffffff">
                  <label id="plug-name" />
                </div>
                <pre
                  id="editor2"
                  class="ace_editor"
                  style="min-height: 300px"
                ><textarea class="ace_text-input" /></pre>
                <div>
                  <el-tooltip
                    v-if="editor2.function == ''"
                    class="item"
                    content="请选择功能"
                    effect="dark"
                    placement="top-start"
                  >
                    <span>
                      <el-button
                        :disabled="editor2.function == ''"
                        plain
                        size="mini"
                        type="info"
                      >
                        发送指令
                      </el-button>
                    </span>
                  </el-tooltip>
                  <el-button
                    v-else
                    plain
                    size="mini"
                    type="info"
                  >
                    发送指令
                  </el-button>
                  <el-button
                    plain
                    size="mini"
                    type="info"
                  >
                    重置
                  </el-button>
                </div>
              </div>
            </div>
            <!--第二个tab-->
            <div
              v-else
              class="editor2hidden animated fadeInDown"
            >
              <div style="margin-top: 20px; font-size: 20px">
                调试虚拟设备
              </div>
              <div
                style="
                  margin-top: 8px;
                  margin-bottom: 20px;
                  font-size: 14px;
                  color: #73777a;
                  text-align: center;
                "
              >
                虚拟设备可以模拟真实设备在云端建立连接，上报定义的属性及事件处理，
                <br />
                这样可以不依赖真实设备快速开发应用
              </div>
              <el-button
                size="mini"
                type="primary"
                @click="isactive = true"
              >
                启动真实设备
              </el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="messageDialogVisible"
      title="新建功能"
      width="50%"
    >
      <el-form
        :inline="true"
        :model="messageform"
        size="small"
      >
        <el-form-item label="功能名称">
          <el-input
            v-model="messageform.name"
            type="text"
          />
        </el-form-item>
      </el-form>

      <label id="plug-name">消息体</label>
      <pre
        id="message"
        class="ace_editor"
        style="min-height: 300px"
      ><textarea class="ace_text-input" /></pre>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="messageDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click.native="addCmd"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { Websocket } from '@/utils/wxscoket.js'
  import { getProduct, queryProduct } from '@/api/Product/index'
  import { delDict, postDict, putDict, queryDict } from '@/api/Dict/index'
  import { getChannelCountByProduct } from '@/api/Channel/index'

  var editor1
  var editor2
  var subprodevice
  var submessage = ''
  var messageEditor
  export default {
    name: 'OnlineTest',
    directives: {
      'el-select-loadmore': {
        bind(el, binding) {
          // 获取element-ui定义好的scroll盒子
          const SELECTWRAP_DOM = el.querySelector(
            '.el-select-dropdown .el-select-dropdown__wrap',
          )
          SELECTWRAP_DOM.addEventListener('scroll', function () {
            /**
             * scrollHeight 获取元素内容高度(只读)
             * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
             * clientHeight 读取元素的可见高度(只读)
             * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
             * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
             */
            const condition =
              this.scrollHeight - this.scrollTop <= this.clientHeight
            if (condition) {
              binding.value()
            }
          })
        },
      },
    },
    data() {
      return {
        primary: true,
        status: 'active',
        value4: true,
        contentData: [],
        devices: {
          devicedevaddr: '',
          productid: '',
          subtopic: '',
        },
        editor1: {
          function: '',
          method: '',
        },
        editor2: {
          function: '',
          method: '',
        },
        messageDialogVisible: false,
        primary2active: true,
        primary1: 1,
        isactive: false,
        primary1form: {
          status: '',
        },
        productlist: [],
        devicelist: [],
        formData: {
          pageIndex: 1,
          pageSize: 20,
        },
        channellist: [],
        subdialogtimer: null,
        messageform: {
          name: '',
        },
        dataslist: [],
        sendindex: 0,
        detaildatas: {},
      }
    },
    mounted() {
      editor1 = ace.edit('editor1')
      editor1.session.setMode('ace/mode/json') // 设置语言
      editor1.setTheme('ace/theme/eclipse') // 设置主题
      editor1.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true, // 设置自动提示
      })
      subprodevice = ace.edit('subprodevice')
      subprodevice.session.setMode('ace/mode/text') // 设置语言
      subprodevice.setTheme('ace/theme/gob') // 设置主题
      subprodevice.setReadOnly(true)
      subprodevice.setOptions({
        enableBasicAutocompletion: false,
        enableSnippets: true,
        enableLiveAutocompletion: true, // 设置自动提示
      })
      this.getProduct()
    },
    beforeDestroy() {
      var info = {
        topic:
          'log/channel/' +
          this.devices.subtopic +
          '/' +
          this.devices.productid +
          '/' +
          this.devices.devicedevaddr,
        qos: 2,
      }
      Websocket.unsubscribe(info, function (res) {
        if (res.result) {
          console.log('取消订阅')
        }
      })
      subprodevice.setValue('')
      submessage = ''
    },
    methods: {
      // 发送指令
      sendZl() {
      },
      setJson() {
      },
      nowtime() {
        var timestamp3 = Date.parse(new Date())
        var date = new Date(timestamp3)
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
      subTopic() {
        this.sendindex++
        var info = {
          topic:
            'log/channel/' +
            this.devices.subtopic +
            '/' +
            this.devices.productid +
            '/' +
            this.devices.devicedevaddr,
          qos: 2,
        }
        var channeltopic = new RegExp(
          'log/channel/' +
          this.devices.subtopic +
          '/' +
          this.devices.productid +
          '/' +
          this.devices.devicedevaddr,
        )

        var _this = this
        Websocket.add_hook(channeltopic, function (Msg) {
          // 判断长度
          if (subprodevice.session.getLength() >= 1000) {
            submessage = ''
          } else {
            submessage += _this.nowtime() + Msg + `\n`
          }
          subprodevice.setValue(submessage)
          subprodevice.gotoLine(subprodevice.session.getLength())
        })
        // 订阅
        var text0 = JSON.stringify({ action: 'start_logger' })
        Websocket.subscribe(info, function (res) {
          if (res.result) {
            console.log(info)
            console.log('订阅成功')
            var sendInfo = {
              topic:
                'channel/' +
                _this.devices.subtopic +
                '/' +
                _this.devices.productid +
                '/' +
                _this.devices.devicedevaddr,
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
      },
      addMessage() {
        this.messageDialogVisible = true
        setTimeout(() => {
          messageEditor = ace.edit('message')
          messageEditor.session.setMode('ace/mode/json') // 设置语言
          messageEditor.setTheme('ace/theme/eclipse') // 设置主题
          messageEditor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true, // 设置自动提示
          })
          subprodevice = ace.edit('subprodevice')
          subprodevice.session.setMode('ace/mode/text') // 设置语言
          subprodevice.setTheme('ace/theme/gob') // 设置主题
          subprodevice.setOptions({
            enableBasicAutocompletion: false,
            enableSnippets: true,
            enableLiveAutocompletion: true, // 设置自动提示
          })
        })
      },
      // 挑选功能
      selectMessage(val) {
        this.dataslist.map((item) => {
          if (item.objectId == val) {
            editor1.setValue(JSON.stringify(item.data.commond))
            this.detaildatas = JSON.parse(JSON.stringify(item.data))
          }
        })
      },
      // 发送指令
      sendMessage1() {
        if (this.editor1.function == '') {
          this.$message('请挑选调试功能')
          return
        }
        if (this.sendindex == 0) {
          this.subTopic()
        }
        var _this = this
        var sendInfo = {
          topic:
            'thing/' +
            _this.devices.productid +
            '/' +
            _this.devices.devicedevaddr,
          text: editor1.getValue(),
          retained: true,
          qos: 2,
        }
        Websocket.sendMessage(sendInfo)
      },
      // 新增datasCMD
      addCmd() {
        if (this.messageform.name == '') {
          this.$message('请输入功能名称')
          return
        }
        if (messageEditor.getValue() == '') {
          this.$message('请输入功能')
          return
        }
        getProduct(this.devices.productid)
          .then((response) => {
            if (response) {
              var obj = {}

              obj = { ...obj, ...JSON.parse(messageEditor.getValue()) }
              var commond = {}
              var datasobj = {}
              datasobj.name = this.messageform.name
              datasobj.type = response.devType
              datasobj.productid = response.objectId
              datasobj.commond = obj

              const data = {
                ACL: response.ACL,
                data: datasobj,
                type: 'CMD',
              }
              postDict(data)
                .then((results) => {
                  if (results) {
                    this.$message('创建成功')
                    this.messageDialogVisible = false
                    this.getDict()
                  }
                })
                .catch((e) => {
                  console.log('postDict ', e.error)
                })
            }
          })
          .catch((e) => {
            console.log('getProduct ', e.error)
          })
      },
      // dataslist初始化数据
      getDict() {
        const params = {
          limit: 100,
          where: {
            type: 'CMD',
            'data.productid': this.devices.productid,
          },
        }
        queryDict(params)
          .then((results) => {
            if (results) {
              this.dataslist = results.results
            }
          })
          .catch((e) => {
            console.log('queryDict ', e.error)
          })
      },
      isInterval(val) {
        var text0 = ''
        var _this = this
        if (val == false) {
          text0 = JSON.stringify({ action: 'stop_logger' })
        } else {
          text0 = JSON.stringify({ action: 'start_logger' })
        }
        var sendInfo = {
          topic:
            'channel/' +
            _this.devices.subtopic +
            '/' +
            _this.devices.productid +
            '/' +
            _this.devices.devicedevaddr,
          text: text0,
          retained: true,
          qos: 2,
        }
        Websocket.sendMessage(sendInfo)
      },
      sendTrueInterval() {
        var _this = this

        var text0 = JSON.stringify({ action: 'start_logger' })
        var sendInfo = {
          topic:
            'channel/' +
            _this.devices.subtopic +
            '/' +
            _this.devices.productid +
            '/' +
            _this.devices.devicedevaddr,
          text: text0,
          retained: true,
          qos: 2,
        }
        Websocket.sendMessage(sendInfo)
      },
      clearTopic() {
        subprodevice.setValue('')
        submessage = ''
      },
      loadmore() {
        this.formData.pageIndex++
        this.selsectProduct(this.productid)
      },
      // 删除datas
      deleteMessage() {
        delDict(this.editor1.function)
          .then((deleteresponse) => {
            if (deleteresponse) {
              this.$message('删除成功')
              this.getDict()
              this.editor1.function = ''
              editor1.setValue('')
            }
          })
          .catch((e) => {
            console.log('delDict ', e.error)
          })
      },
      editorMessage() {
        this.detaildatas.commond = JSON.parse(editor1.getValue())
        const data = {
          data: this.detaildatas,
        }
        putDict(this.editor1.function, data)
          .then((resultes) => {
            if (resultes) {
              this.$message('编辑成功')
              this.getDict()
            }
          })
          .catch((e) => {
            console.log('putDict ' + e.error)
          })
      },
      getProduct() {
        const params = {
          limit: 100,
        }
        queryProduct(params)
          .then((productresultes) => {
            this.productlist = productresultes.results
            this.devices.productid = this.$route.query.productid
            this.getDevices(this.devices.productid, true)
            this.getChannel(this.devices.productid)
            this.getDict()
          })
          .catch((e) => {
            console.log('queryProduct ', e.error)
          })
      },
      getChannel(objectid) {
        const type = '1'
        const product = {
          __type: 'Pointer',
          className: 'Product',
          objectId: objectid,
        }
        getChannelCountByProduct(
          this.channellength,
          this.channelstart,
          product,
          type,
        )
          .then((res) => {
            if (res.count > 0) {
              this.channellist = res.results
              this.devices.subtopic = res.results[0].objectId
            } else {
              this.channellist = {}
              this.devices.subtopic = ''
            }
          })
          .catch((err) => {
            console.log(err)
            this.$baseMessage('请求出错', err.error, 3000)
          })
      },
      // 设备
      getDevices(productid, isfirst) {
        const params = {
          limit: this.formData.pageSize,
          skip: (this.formData.pageIndex - 1) * this.formData.pageSize,
          count: 'objectId',
          include: 'product',
          where: {
            product: productid,
          },
        }
        this.$queryDevice(params)
          .then((res) => {
            if (res.count > 0) {
              this.devicelist = res.results
              this.devices.devicedevaddr = res.results[0].devaddr
            }
            if (isfirst) {
              this.devices.devicedevaddr = this.$route.query.deviceid
            }
          })
          .catch((err) => {
            console.log(err)
            this.$baseMessage('请求出错', err.error, 3000)
          })
      },
      // 选择产品
      selsectProduct(value) {
        this.formData.pageIndex = 1
        this.devicelist = []
        this.devices.productid = value
        this.devices.devicedevaddr = ''
        this.getDevices(value)
        this.getChannel(value)
      },
      // 清空选择框1
      // clearEditor1(){
      //      this.editor1.function=''
      //      console.log(this.editor1.function)
      // },
      functionClick() {
        this.primary1 = 3
        setTimeout(() => {
          editor2 = ace.edit('editor2')
          editor2.session.setMode('ace/mode/json') // 设置语言
          editor2.setTheme('ace/theme/eclipse') // 设置主题
          editor2.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true, // 设置自动提示
          })
        }, 300)
      },
    },
  }
</script>
<style lang="scss" scoped>
  .onlinetest {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 10px;
    background: #f0f2f5;

    .onlinetest_top {
      box-sizing: border-box;
      width: 100%;
      height: 370px;
      padding: 20px;
      background: white;

      ::v-deep .el-form-item__label {
        text-align: left;
      }

      .status {
        display: inline-block;
        width: 5px;
        height: 5px;
        margin-left: 10px;
        vertical-align: middle;
        border-radius: 50%;
      }

      .active {
        background: green;
      }

      .notonline {
        background: red;
      }
    }

    .onlinetest_bottom {
      box-sizing: border-box;
      width: 100%;
      height: auto;
      padding: 20px;
      margin-top: 20px;
      background: white;

      ::v-deep .editorheader {
        box-sizing: border-box;
        padding: 8px;
        margin-top: 10px;
        background: #f9f9f9;
        border-top: 1px solid rgb(235, 236, 236);
        border-right: none;
        border-bottom: 1px solid rgb(235, 236, 236);
        border-left: none;
        border-image: initial;

        ::v-deep .el-form-item {
          margin-bottom: 0;
        }

        ::v-deep .ace_editor {
          margin-top: 0;
        }
      }

      ::v-deep .editor2header {
        .editor2hidden {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 300px;
          overflow: hidden auto;
        }

        .editor2show {
          .primary1 {
            margin-top: 10px;
          }

          .primary2 {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 300px;
          }
        }

        ::v-deep .primary1content {
          height: 220px;
          margin-bottom: 10px;
          border-bottom: 1px solid #cccccc;
        }
      }
    }
  }
</style>
