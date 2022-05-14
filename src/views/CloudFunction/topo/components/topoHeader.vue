<!-- 组件说明 -->
<template>
  <div class="topo-header">
    <el-drawer
      v-show="infoVisible"
      v-drawerDrag
      append-to-body
      size="100%"
      :visible.sync="infoVisible"
    >
      <div id="konva_preview" :key="konva_key" class="konva_preview"></div>
    </el-drawer>
    <div class="topo-header-drawer">
      <el-drawer
        append-to-body
        direction="rtl"
        size="40%"
        :visible.sync="drawer"
        :with-header="false"
      >
        <!--        <websocket :topic="topic" />-->
      </el-drawer>
    </div>
    <dgiot-input ref="uploadFinish" @fileInfo="fileInfo" />
    <div class="topo-header-top">
      <dgiot-query-form class="topo-header-top-query">
        <dgiot-query-form-left-panel class="topo-header-top-query-left-panel">
          <a-dropdown
            v-show="!noTools"
            class="topo-header-top-query-left-panel-dropdown"
            @click.native="ToggleView"
          >
            <a class="ant-dropdown-link">
              <a-icon type="tool" />
              <p>{{ $translateTitle('leftbar.tools') }}</p>
            </a>
          </a-dropdown>
          <a-dropdown class="topo-header-top-query-left-panel-dropdown">
            <a class="ant-dropdown-link" @click="saveTopo">
              <a-icon type="save" />
              <p>{{ $translateTitle('konva.save') }}</p>
            </a>
          </a-dropdown>
          <a-dropdown
            v-if="Boolean($route.query.noTools)"
            class="topo-header-top-query-left-panel-dropdown"
          >
            <a class="ant-dropdown-link" @click="preview">
              <a-icon type="eye" />
              <p>{{ $translateTitle('application.preview') }}</p>
            </a>
          </a-dropdown>
          <a-dropdown
            v-if="Boolean($route.query.noTools)"
            class="topo-header-top-query-left-panel-dropdown"
          >
            <a
              class="ant-dropdown-link"
              @click="$router.push({ path: '/cloudTest/report' })"
            >
              <a-icon type="home" />
              <p>{{ $translateTitle('cloudTest.report template') }}</p>
            </a>
          </a-dropdown>
          <a-dropdown
            v-show="!noTools"
            class="topo-header-top-query-left-panel-dropdown"
          >
            <a v-copyText="copyText" class="ant-dropdown-link">
              <a-icon type="share-alt" />
              <p>{{ $translateTitle('konva.share') }}</p>
            </a>
          </a-dropdown>
          <a-dropdown
            v-show="!noTools"
            class="topo-header-top-query-left-panel-dropdown"
          >
            <a class="ant-dropdown-link">
              <a-icon type="plus" />
              <p><topo-scale /></p>
            </a>
          </a-dropdown>
          <!--          <el-color-picker-->
          <!--            v-model="pickerColor"-->
          <!--            size="medium"-->
          <!--            @change="setColor"-->
          <!--          />-->
        </dgiot-query-form-left-panel>
        <dgiot-query-form-right-panel>
          <!--          <dgiot-icon-->
          <!--            style="cursor: pointer"-->
          <!--            :icon="-->
          <!--              $parent.$parent.$parent.isFullscreen-->
          <!--                ? 'fullscreen-exit-fill'-->
          <!--                : 'fullscreen-fill'-->
          <!--            "-->
          <!--            @click="handFullscreen"-->
          <!--          />-->
          <!--          <el-button-->
          <!--            style="margin-left: 16px"-->
          <!--            type="primary"-->
          <!--            @click.native="topoJson"-->
          <!--          >-->
          <!--            组态数据-->
          <!--          </el-button>-->
        </dgiot-query-form-right-panel>
      </dgiot-query-form>
      <el-drawer append-to-body :visible.sync="drawerTopo" :with-header="false">
        <dgiot-monaco-plus
          v-if="drawerTopo"
          ref="monacoCodeTopo"
          :codes="codes"
          :lang="'json'"
          :read-only="false"
          style="margin-top: 26px"
          :theme="'vs-dark'"
        />
      </el-drawer>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import TopoScale from './TopoScale'
  export default {
    name: 'TopoHeader',
    components: { TopoScale },
    props: {
      productid: {
        type: String,
        default: '',
      },
      stopMqtt: {
        type: Boolean,
        default: false,
      },
      noTools: {
        type: Boolean,
        default: false,
        required: false,
      },
      drawerflag: {
        type: Boolean,
        default: false,
      },
      value: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        codes: '',
        drawerTopo: false,
        konva_key: moment(new Date()).valueOf(),
        infoVisible: false,
        topic: '',
        isshow: true,
        pickerColor: this.graphColor,
        activeNames: [],
        switchvalue: this.value,
        drawer: this.drawerflag,
      }
    },
    computed: {
      copyText: function () {
        return location.href
      },
      ...mapGetters({
        graphColor: 'konva/graphColor',
        drawing: 'konva/drawing',
        graphNow: 'konva/graphNow',
        pointStart: 'konva/pointStart',
        draw: 'konva/draw',
        flag: 'konva/flag',
      }),
      // ...mapGetters({
      //   graphColor: 'konva/graphColor',
      //   drawing: 'konva/drawing',
      //   graphNow: 'konva/graphNow',
      //   pointStart: 'konva/pointStart',
      //   draw: 'konva/draw',
      //   flag: 'konva/flag',
      // }),
    },
    mounted() {
      this.$nextTick(() => {
        this.codes = canvas.stage.toJSON() ?? ''
        document.onkeydown = (e) => {
          if (e.keyCode == 46) {
            //这是delete健，当然也可以根据自己的需求更改
            this.removeFn() //操作方法
          }
        }
      })
    },
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    activated() {},
    methods: {
      ...mapMutations({
        initKonva: 'topo/initKonva',
        setDrawing: 'konva/setDrawing',
        setPointStart: 'konva/setPointStart',
        setDraw: 'konva/setDraw',
        setFlag: 'konva/setFlag',
        setGraphNow: 'konva/setGraphNow',
        setGraphColor: 'konva/setGraphColor',
        setDrawParams: 'konva/setDrawParams',
      }),
      topoJson() {
        // 自动格式化代码
        this.$nextTick(() => {
          this.codes = canvas.stage.toJSON()
          this.drawerTopo = true
          console.log('monacoCodeTopo 加载日志')
          console.log(this.$refs.monacoCodeTopo)
          if (this.$refs.monacoCodeTopo.monacoEditor)
            this.$refs.monacoCodeTopo.monacoEditor
              .getAction('editor.action.formatDocument')
              .run()
        })
      },
      ToggleView() {
        this.$baseEventBus.$emit('ToggleView')
      },
      saveTopo() {
        this.$dgiotBus.$emit('busUpdata')
        this.$dgiotBus.$emit('_busUpdata')
      },
      preview() {
        this.$nextTick(() => {
          this.infoVisible = !this.infoVisible
          this.initKonva({
            data: JSON.parse(canvas.stage.toJSON()),
            id: 'konva_preview',
          })
        })
        this.konva_key = moment(new Date()).valueOf()
      },
      handFullscreen() {
        this.$parent.$parent.$parent.isFullscreen =
          !this.$parent.$parent.$parent.isFullscreen
      },
      setColor(v) {
        this.setGraphColor(v)
      },
      // // flagFn
      // // 打开websocket
      // drawerFlag() {
      //   this.topic = `thing/${this.productid}/post`
      //   this.drawer = true
      // },
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
            this.$emit('messageData', this.stop_Mqtt)
          } else {
            this.$message('订阅失败,请手动订阅mqtt', 'error')
          }
        })
      },
      flagFn(v) {
        if (v == 'text') {
          this.setDrawParams({
            text: '请输入相关文字' + moment().format('x'),
          })
        }

        // this.$emit('createShape', v, this.graphColor)
        if (v) {
          this.setDraw(true)
          this.setFlag(v)
        }
        console.info('我要绘制', v)
      },
      removeFn() {
        console.log(this.graphNow)
        if (this.graphNow) {
          this.$dgiotBus.$emit('removeShape', this.graphNow)
        } else {
          this.$baseMessage('请选择图形', 'error', 'dgiot-hey-message-error')
        }
      },
      showImageTable(type) {
        this.$refs['uploadFinish'].$refs.uploader.dispatchEvent(
          new MouseEvent('click')
        )
        // this.isshow = !this.isshow
        // this.$emit('ImageTable', type)
      },
      destroyed() {
        console.log('取消订阅mqtt')
        this.handleCloseSub()
      },
      fileInfo(info) {
        info?.url?.length ? this.$emit('uploadFinish', info.url) : ''
      },
      CloseSub() {
        this.stop_Mqtt = true
        this.$emit('messageData', this.stop_Mqtt)
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
      // 取消订阅mqtt
      handleCloseSub(sendInfo) {
        Websocket.unsubscribe(sendInfo, (res) => {
          console.log('取消订阅mqtt', res.msg)
        })
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>
<style lang="scss" scoped>
  .topo-header {
    &-top {
      &-query {
        &-left-panel {
          &-dropdown {
            padding: 6px 8px;
            color: rgb(89, 89, 89);
            text-align: center;

            i {
              font-size: 18px !important;
            }
          }
        }
      }
    }
  }
</style>
