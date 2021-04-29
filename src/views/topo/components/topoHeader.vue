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
              {{ $translateTitle('leftbar.subscriptions') }} mqtt
            </el-button>
            <el-button
              icon="el-icon-document-add"
              :disabled="stopMqtt"
              @click="CloseSub()"
            >
              {{ $translateTitle('leftbar. cancel') }} mqtt
            </el-button>
          </el-col>
          <el-col :span="4">
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
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  import { Websocket } from '@/utils/wxscoket.js'
  import websocket from '@/views/tools/websocket'
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
    computed: {},
    mounted() {},
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    activated() {},
    methods: {
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
