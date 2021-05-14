<!-- 组件说明 -->
<template>
  <div class="topoHeader">
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
    <div>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-button type="success" icon="el-icon-setting" @click="drawerFlag">
            websocket
          </el-button>
          <el-button
            icon="el-icon-document-add"
            :disabled="productid.length < 0"
            @click="subscribe(productid)"
          >
            {{ $translateTitle('leftbar.subscriptions') }} mqtt
          </el-button>
          <el-button
            icon="el-icon-document-add"
            :disabled="stopMqtt"
            @click="CloseSub()"
          >
            {{ $translateTitle('leftbar. cancel') }} mqtt
          </el-button>
          {{ $translateTitle('tagsView.refresh') }}
          <el-switch
            v-model="switchvalue"
            :disabled="productid.length < 0"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-text="$translateTitle('tagsView.close')"
            :inactive-text="$translateTitle('tagsView.open')"
            @change="stopsub"
          />
        </el-col>
        <el-col :span="16">
          <div class="tools">
            <div id="btnList">
              <el-button @click="flagFn('pencil')">铅笔</el-button>
              <el-button @click="flagFn('ellipse')">椭圆-空心</el-button>
              <el-button @click="flagFn('rect')">矩形</el-button>
              <el-button @click="flagFn('rectH')">矩形-空心</el-button>
              <el-button @click="flagFn('text')">文字</el-button>
              <el-button @click="flagFn('image')">图片</el-button>
              <el-button @click="removeFn()">删除</el-button>
              <el-color-picker
                v-model="graphColor"
                size="medium"
                @change="setColor"
              />
            </div>
          </div>
        </el-col>
      </el-row>
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
        activeNames: [],
        switchvalue: this.value,
        drawer: this.drawerflag,
      }
    },
    computed: {
      ...mapState({
        // graphColor: 'konva/graphColor',
        drawing: 'konva/drawing',
        // graphNow: 'konva/graphNow',
        pointStart: 'konva/pointStart',
        draw: 'konva/draw',
        flag: 'konva/flag',
      }),
      graphColor: {
        get() {
          return this.$store.state.konva.graphColor
        },
        set(val) {
          this.$store.commit('konva/setGraphColor', val)
        },
      },
      graphNow: {
        get() {
          return this.$store.state.konva.graphNow
        },
      },
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
      }),
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
      destroyed() {
        console.log('取消订阅mqtt')
        this.handleCloseSub()
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
