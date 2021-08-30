<!-- 组件说明 -->
<template>
  <div class="topo-header">
    <div class="topo-header-drawer">
      <el-drawer
        :with-header="false"
        size="40%"
        :visible.sync="drawer"
        append-to-body
        direction="rtl"
      >
        <websocket :topic="topic" />
      </el-drawer>
    </div>
    <vab-input ref="uploadFinish" @fileInfo="fileInfo" />
    <div class="topo-header-top">
      <vab-query-form class="topo-header-top-query">
        <vab-query-form-left-panel class="topo-header-top-query-left-panel">
          <a-dropdown class="topo-header-top-query-left-panel-dropdown">
            <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
              <a-icon type="tool" />
              <p>{{ $translateTitle('konva.socket') }}</p>
            </a>
            <a-menu slot="overlay">
              <a-sub-menu key="websocket" title="websocket">
                <a-menu-item @click="drawerFlag">
                  {{ $translateTitle('konva.socket') }}
                </a-menu-item>
              </a-sub-menu>

              <a-sub-menu key="mqtt" title="mqtt">
                <a-menu-item
                  :disabled="productid.length < 0"
                  @click="subscribe(productid)"
                >
                  {{ $translateTitle('leftbar.subscriptions') }} mqtt
                </a-menu-item>
                <a-menu-item :disabled="stopMqtt" @click="CloseSub()">
                  {{ $translateTitle('leftbar. cancel') }} mqtt
                </a-menu-item>
              </a-sub-menu>

              <a-menu-item key="test" title="sub menu">
                <el-switch
                  v-model="switchvalue"
                  :disabled="productid.length < 0"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-text="$translateTitle('tagsView.close')"
                  :inactive-text="$translateTitle('tagsView.open')"
                  @change="stopsub"
                />
              </a-menu-item>
            </a-menu>
          </a-dropdown>

          <a-dropdown class="topo-header-top-query-left-panel-dropdown">
            <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
              <a-icon type="edit" />
              <p>
                {{ $translateTitle('konva.edit') }}
              </p>
            </a>
            <a-menu slot="overlay">
              <a-menu-item @click="flagFn('pencil')">铅笔</a-menu-item>
              <a-menu-item>
                <el-link @click="flagFn('ellipse')">椭圆-空心</el-link>
              </a-menu-item>
              <a-menu-item>
                <el-link @click="flagFn('rect')">矩形</el-link>
              </a-menu-item>
              <a-menu-item>
                <el-link @click="flagFn('rectH')">矩形-空心</el-link>
              </a-menu-item>
              <a-menu-item>
                <el-link @click="flagFn('text')">文字</el-link>
              </a-menu-item>
            </a-menu>
          </a-dropdown>

          <a-dropdown class="topo-header-top-query-left-panel-dropdown">
            <a class="ant-dropdown-link" @click="removeFn()">
              <a-icon type="delete" />
              <p>{{ $translateTitle('konva.delete') }}</p>
            </a>
          </a-dropdown>
          <a-dropdown class="topo-header-top-query-left-panel-dropdown">
            <a class="ant-dropdown-link" @click="$message.success('开发中')">
              <a-icon type="save" theme="filled" />
              <p>{{ $translateTitle('konva.save') }}</p>
            </a>
          </a-dropdown>
          <a-dropdown class="topo-header-top-query-left-panel-dropdown">
            <a v-copyText="copyText" class="ant-dropdown-link">
              <a-icon type="share-alt" />
              <p>{{ $translateTitle('konva.share') }}</p>
            </a>
          </a-dropdown>

          <!--          <el-color-picker-->
          <!--            v-model="pickerColor"-->
          <!--            size="medium"-->
          <!--            @change="setColor"-->
          <!--          />-->
        </vab-query-form-left-panel>
        <vab-query-form-right-panel>
          <vab-icon
            style="cursor: pointer"
            :icon="isFullscreen ? 'fullscreen-exit-fill' : 'fullscreen-fill'"
            @click="handFullscreen"
          />
          <vab-help
            trigger="click"
            src="https://tech.iotn2n.com/w/docs/details?id=6"
            title="组态文档"
          />
        </vab-query-form-right-panel>
      </vab-query-form>
    </div>
  </div>
</template>

<script>
  import { Websocket } from '@/utils/wxscoket.js'
  import websocket from '@/views/tools/websocket'
  import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
  export default {
    name: 'TopoHeader',
    components: { websocket },
    props: {
      productid: {
        type: String,
        default: '',
      },
      stopMqtt: {
        type: Boolean,
        default: false,
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
    mounted() {},
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    activated() {},
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
      handFullscreen() {
        this.$parent.$parent.$parent.isFullscreen =
          !this.$parent.$parent.$parent.isFullscreen
      },
      setColor(v) {
        this.setGraphColor(v)
      },
      // flagFn
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
            this.$emit('messageData', this.stop_Mqtt)
          } else {
            this.$message('订阅失败,请手动订阅mqtt', 'error')
          }
        })
      },
      flagFn(v) {
        if (v == 'text') this.setDrawParams({ text: '请输入相关文字' })
        this.setFlag(v)
        // this.$emit('createShape', v, this.graphColor)
        if (v) this.setDraw(true)
      },
      removeFn() {
        console.log(this.graphNow)
        if (this.graphNow) {
          this.$emit('removeShape', this.graphNow)
        } else {
          this.$message.error('请选择图形')
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
<style scoped lang="scss">
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
