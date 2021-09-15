<template>
  <div class="websocket-view">
    <el-card
      :key="momentKey"
      class="el-card--self"
      @keyup.enter.native="mqttConnect"
    >
      <div slot="header">
        <span>{{ $translateTitle('websocket.connect') }}</span>
      </div>
      <el-form size="mini" disabled>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="$translateTitle('websocket.host')">
              <el-input v-model="host" />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item :label="$translateTitle('websocket.port')">
              <el-input v-model.number="port" />
            </el-form-item>
          </el-col>

          <el-col v-show="false" :span="8">
            <el-form-item :label="$translateTitle('developer.path')">
              <el-input v-model="path" />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item :label="$translateTitle('websocket.clientID')">
              <el-input v-model="clientId" />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item :label="$translateTitle('websocket.username')">
              <el-input v-model="username" />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item :label="$translateTitle('websocket.password')">
              <el-input v-model="password" />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item :label="$translateTitle('websocket.keepAlive')">
              <el-input v-model.number="keepalive" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item class="check-area">
              <el-checkbox v-model="clean">
                {{ $translateTitle('websocket.cleanSession') }}
              </el-checkbox>
              <el-checkbox
                v-model="isSSL"
                style="margin-left: 50px"
                @change="handleSSL"
              >
                SSL
              </el-checkbox>
              <span style="margin: 5px 0 20px 50px; color: #42d885">
                {{ connectURL }}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="operation-area">
        <el-button
          type="success"
          class="confirm-btn"
          :disabled="loading || client.connected"
          @keyup.enter.native="mqttConnect"
          @click="mqttConnect"
        >
          {{ $translateTitle('websocket.connect') }}
        </el-button>

        <el-button
          type="danger"
          :loading="loading && client.connected"
          :disabled="!loading && !client.connected"
          style="margin-left: 20px"
          @keyup.enter.native="disconnectSwitch"
          @click="disconnectSwitch"
        >
          {{ $translateTitle('websocket.disconnect') }}
        </el-button>

        <div class="connect-state">
          {{ $translateTitle('websocket.currentState') }}:
          <span :style="client.connected ? 'color: #42d885' : 'color: #ff6d6d'">
            {{ $translateTitle(`websocket.${getStatus}`) }}:
          </span>
        </div>
      </div>
    </el-card>

    <el-card class="el-card--self" style="max-height: 450px">
      <div slot="header">
        <span>{{ $translateTitle('websocket.subscribe') }}</span>
      </div>
      <el-form size="medium">
        <el-row :gutter="20" @keyup.enter.native="MqttSubscribe">
          <el-col :span="12">
            <el-form-item :label="$translateTitle('websocket.topic')">
              <el-select v-model="subTopic">
                <el-option
                  v-for="item in subscriptions"
                  :key="item.topic"
                  :label="item.topic"
                  :value="item.topic"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$translateTitle('websocket.qoS')">
              <el-select v-model.number="subQos">
                <el-option :value="0" />
                <el-option :value="1" />
                <el-option :value="2" />
              </el-select>
            </el-form-item>
            <div class="operation-area">
              <el-button
                class="confirm-btn"
                type="success"
                @keyup.enter.native="MqttSubscribe"
                @click="MqttSubscribe"
              >
                {{ $translateTitle('websocket.subscribe') }}
              </el-button>
            </div>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$translateTitle('websocket.subscribe')">
              <el-table :data="subscriptions" :max-height="320">
                <el-table-column
                  prop="topic"
                  min-width="150"
                  :label="$translateTitle('websocket.topic')"
                />
                <el-table-column
                  prop="qos"
                  min-width="120"
                  :label="$translateTitle('websocket.qoS')"
                />
                <el-table-column
                  prop="time"
                  min-width="180"
                  :label="$translateTitle('websocket.time')"
                />
                <el-table-column
                  width="90"
                  :label="$translateTitle('websocket.oper')"
                >
                  <template slot-scope="props">
                    <i
                      title="Unsubscribe"
                      class="unsubscribe el-icon-close"
                      @click="mqttCacheScuscribe(props.row.topic)"
                    ></i>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card
      class="el-card--self"
      style="max-height: 800px; padding-bottom: 20px"
    >
      <div slot="header">
        <span>{{ $translateTitle('websocket.messages') }}</span>
      </div>
      <el-form size="medium">
        <el-row :gutter="20" @keyup.enter.native="MqttPublish">
          <el-col :span="6">
            <el-form-item :label="$translateTitle('websocket.topic')">
              <el-input v-model="publishTopic" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$translateTitle('websocket.messages')">
              <el-input v-model="publishMessage" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$translateTitle('websocket.qoS')">
              <el-select v-model.number="publishQos">
                <el-option :value="0" />
                <el-option :value="1" />
                <el-option :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col style="margin-top: 33px" :span="6">
            <el-form-item>
              <el-checkbox v-model="publishRetain">
                {{ $translateTitle('websocket.retained') }}
              </el-checkbox>
              <el-button
                class="confirm-btn"
                type="success"
                style="float: right; margin-top: 4px"
                @click="MqttPublish"
                @keyup.enter.native="MqttPublish"
              >
                {{ $translateTitle('websocket.send') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form size="medium" style="margin-top: 20px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              :label="$translateTitle('websocket.messagesAlreadySent')"
            >
              <i
                title="clear message"
                class="el-icon-refresh"
                @click="clearMessage(false)"
              ></i>
              <el-table border :data="publishedMessages" :max-height="600">
                <el-table-column
                  prop="message"
                  min-width="100"
                  :label="$translateTitle('websocket.messages')"
                />
                <el-table-column
                  prop="topic"
                  :label="$translateTitle('websocket.topic')"
                />
                <el-table-column
                  prop="qos"
                  min-width="120"
                  :label="$translateTitle('websocket.qoS')"
                />
                <el-table-column
                  prop="time"
                  min-width="180"
                  :label="$translateTitle('websocket.time')"
                />
              </el-table>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$translateTitle('websocket.messagesReceived')"
            >
              <i
                title="clear message"
                class="el-icon-refresh"
                @click="clearMessage"
              ></i>
              <el-table border :data="receivedMessages" :max-height="600">
                <el-table-column
                  prop="message"
                  min-width="100"
                  :label="$translateTitle('websocket.messages')"
                />
                <el-table-column
                  prop="topic"
                  :label="$translateTitle('websocket.topic')"
                />
                <el-table-column
                  prop="qos"
                  min-width="120"
                  :label="$translateTitle('websocket.qoS')"
                />
                <el-table-column
                  prop="time"
                  width="180"
                  :label="$translateTitle('websocket.time')"
                />
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import { Map2Json } from '@/utils'
  import { mapGetters, mapActions } from 'vuex'
  import MQTTConnect from '@/utils/MQTTConnect'
  import { _scokethost } from '@/utils/wxscoket'
  export default {
    name: 'Mqtt',
    beforeRouteLeave(to, from, next) {
      if (this.client.connected) {
        this.stashConnect()
      }
      next()
    },
    data() {
      return {
        count: 0,
        eventMqttMsg: {},
        getStatus: '',
        momentKey: moment().format('x'),
        retryTimes: 0,
        settings: {},
        allTopics: {},
        loading: false,
        sending: false,
        host: _scokethost,
        port: 8083,
        path: '/mqtt',
        username: '',
        isSSL: false,
        password: '',
        keepalive: 60,
        clean: true,
        clientId: `mqttjs_${Math.random().toString(16).substr(2, 10)}`,
        subQos: 0,
        publishQos: 0,
        publishMessage: '{ "msg": "Hello, World!" }',
        subTopic: 'test/subscribe/post/#',
        publishTopic: 'test/subscribe/post',
        publishRetain: false,
        receivedMessages: [],
        publishedMessages: [],
        subscriptions: [],
        client: {},
      }
    },
    computed: {
      ...mapGetters({
        mqttSettings: 'mqttDB/mqttSettings',
        MqttTopic: 'mqttDB/MqttTopic',
        pathRouter: 'mqttDB/pathRouter',
      }),
      connectOptions() {
        const { clientId, ip, port, passWord, userName } = this.settings
        return {
          password: passWord,
          clientId: clientId,
          host: ip,
          port: port,
          username: userName,
        }
      },
      connectURL() {
        const path =
          this.path && this.path.startsWith('/') ? this.path : `/${this.path}`
        return `${this.isSSL ? 'wss' : 'ws'}:${this.mqttSettings.ip}:${
          this.port
        }${path}`
      },
    },
    watch: {
      MqttTopic: {
        handler(val) {
          if (_.isMap(val)) {
            this.MqttSubscribeAll(Map2Json(val))
          }
        },
        deep: true,
        immediate: true,
      },
      settings: {
        handler(val) {
          if (val) {
            console.error(val)
            const { clientId, ip, port, passWord, userName } = val
            this.clientId = clientId
            this.password = passWord
            this.host = ip
            // this.port = port
            this.momentKey = moment().format('x') + 'time'
            this.username = userName
            if (this.password) this.mqttConnect()
            this.loading = false
          }
        },
        deep: true,
        immediate: true,
      },
    },
    created() {
      const router = md5(this.$route.fullPath)
      this.$bus.$off(router)
      this.$bus.$on(router, (res) => {
        if (res) {
          this.eventMqttMsg = res
          const { connectStatus, settings } = res
          this.getStatus = connectStatus
          this.settings = settings
        }
      })
      this.$bus.$emit(`MqttStatus`, md5(this.$route.fullPath))
    },
    mounted() {
      this.setSSL()
      // this.loadConnect()
    },
    methods: {
      ...mapActions({
        setConnectStatus: 'mqttDB/setConnectStatus',
      }),
      handleSSL() {
        this.port = this.isSSL ? 8084 : 8083
      },
      now() {
        return moment().format('YYYY-MM-DD')
      },
      disconnectSwitch() {
        this.$bus.$emit('MqttDisconnect', '1')
        // connecting
        if (this.loading && !this.client.connected) {
          this.loading = false
          NProgress.done()
          this.client.end()
          this.client = {}
        } else {
          this.mqttDisconnect()
        }
      },
      mqttConnect() {
        if (!window.WebSocket) {
          this.$message.error(this.$translateTitle('websocket.notSupport'))
          return
        }
        // prevent the connect from keyboard event
        if (this.client.connected || this.loading) {
          return
        }
        NProgress.start()
        this.loading = true
        this.retryTimes = 0
        const options = {
          keepalive: this.keepalive,
          username: this.username,
          password: this.password,
          clientId: this.clientId,
          clean: this.clean,
          connectTimeout: 10 * 1000,
        }
        console.error(options, 'options')
        try {
          this.client = mqtt.connect(this.connectURL, options)
          this.client.on('MqttConnect', () => {
            this.loading = false
            NProgress.done()
          })
          this.client.on('reconnect', this.handleReconnect)
          this.client.on('error', (error) => {
            this.mqttError(error)
            this.$message.error(
              error.toString() || this.$translateTitle('error.networkError')
            )
            // to prevent reconnect
            this.retryTimes = 0
            this.client.end()
            this.sending = false
            this.loading = false
            NProgress.done()
          })
          this.client.on('message', (topic, message, packet) => {
            this.onMessage(message)
            this.receivedMessages.unshift({
              topic,
              message: message.toString(),
              qos: packet.qos,
              time: this.now(),
            })
          })
          //  订阅
          const topic = `test/subscribe/post`
          const topicKey = md5('test/subscribe/post' + '/dashboard/mqtt/test')
          const ttl = 1000 * 60 * 60 * 3
          this.$bus.$emit('MqttSubscribe', {
            topicKey,
            topic,
            ttl,
            qos: 0,
          })
          this.momentKey = moment().format('x') + 'time'
        } catch (error) {
          this.loading = false
          NProgress.done()
          this.$message.error(error.toString())
        }
      },
      mqttDisconnect() {
        if (this.client.connected) {
          NProgress.start()
          this.client.end()
          this.client.on('close', () => {
            this.loading = false
            this.reset()
            this.client = {}
            NProgress.done()
          })
        } else {
          this.$message.error(this.$translateTitle('websocket.connectLeave'))
        }
      },
      MqttSubscribe() {
        if (this.client.connected || this.subTopic) {
          this.subscriptions.forEach((x, index) => {
            if (x.topic === this.subTopic) {
              this.subscriptions.splice(index, index + 1)
            }
          })
          NProgress.start()
          this.client.subscribe(
            this.subTopic,
            { qos: this.subQos },
            (error, granted) => {
              if (
                error ||
                (granted[0] && ![0, 1, 2].includes(granted[0].qos))
              ) {
                NProgress.done()
                this.$message.error(
                  error
                    ? error.message
                    : this.$translateTitle('websocket.subscribeFailure')
                )
              } else {
                this.subscriptions.unshift({
                  topic: this.subTopic,
                  qos: this.subQos,
                  time: this.now(),
                })
                this.subscriptions = _.uniqWith(this.subscriptions, _.isEqual)
                this.$message.success(
                  this.$translateTitle('websocket.subscribeSuccess')
                )
                NProgress.done()
              }
            }
          )
        } else {
          this.$message.error(this.$translateTitle('websocket.connectLeave'))
        }
      },
      MqttPublish() {
        if (this.client.connected) {
          NProgress.start()
          const options = {
            qos: this.publishQos,
            retain: this.publishRetain,
          }
          // to mark which trigger the reconnect
          this.sending = true
          this.client.publish(
            this.publishTopic,
            this.publishMessage,
            options,
            (error) => {
              if (error) {
                NProgress.done()
                this.$message.error(error.toString())
              } else {
                this.publishedMessages.unshift({
                  message: this.publishMessage,
                  topic: this.publishTopic,
                  qos: this.publishQos,
                  time: this.now(),
                })
                this.$message.success(
                  this.$translateTitle('websocket.messageSendOut')
                )
                NProgress.done()
              }
            }
          )
        } else {
          this.$message.error(this.$translateTitle('websocket.connectLeave'))
        }
      },
      mqttCacheScuscribe(topic) {
        if (!this.client.connected) {
          this.$message.error(this.$translateTitle('websocket.connectLeave'))
          return
        }
        this.client.unsubscribe(topic, (error) => {
          if (error) {
            this.$message.error(
              `${this.$translateTitle(
                'websocket.unsubscribeFailure'
              )} ${error.toString()}!`
            )
            return
          }
          this.subscriptions.forEach((element, index) => {
            if (element.topic === topic) {
              this.subscriptions.splice(index, 1)
              // clear message which in this topic
            }
          })
        })
      },
      handleReconnect() {
        if (this.retryTimes > 1) {
          try {
            if (this.sending) {
              this.$message.error(
                this.$translateTitle('websocket.connectError')
              )
            } else {
              this.$message.error(
                `${this.$translateTitle('websocket.connectFailure')} ${
                  this.host
                }:${this.port}`
              )
            }
          } catch (e) {
            this.retryTimes = 0
            this.sending = false
            this.loading = false
            NProgress.done()
            this.client.end()
            this.client = {}
          }
          this.retryTimes = 0
          this.sending = false
          this.loading = false
          NProgress.done()
          this.client.end()
          this.client = {}
          return
        }
        // trigger by sending illegal topic
        if (this.sending) {
          this.$message.error(this.$translateTitle('websocket.connectError'))
        }
        this.retryTimes += 1
      },
      reset() {
        this.subscriptions = []
        this.receivedMessages = []
        this.publishedMessages = []
        this.publishMessage = '{ "msg": "Hello, World!" }'
        this.subTopic = 'test/subscribe/post/#'
        this.publishTopic = 'test/subscribe/post'
      },
      clearMessage(received = true) {
        if (received) {
          this.receivedMessages = []
        } else {
          this.publishedMessages = []
        }
      },
      loadConnect() {
        if (this.topic) {
          this.subTopic = this.topic
          this.publishTopic = this.topic
          this.mqttConnect()
          this.MqttSubscribe()
        }
        if (MQTTConnect.client && MQTTConnect.client.connected) {
          this.client = MQTTConnect.client
          Object.keys(MQTTConnect.options).forEach((item) => {
            this[item] = MQTTConnect.options[item]
          })
        }
      },
      stashConnect() {
        MQTTConnect.client = this.client
        Object.keys(MQTTConnect.options).forEach((item) => {
          MQTTConnect.options[item] = this[item]
        })
      },
      setSSL() {
        if (location.protocol === 'https:') {
          this.isSSL = true
          this.port = 8084
        }
      },
      MqttSubscribeAll(mapTopic) {
        const subscriptions = []
        if (mapTopic) {
          for (let topicKey in mapTopic) {
            subscriptions.push({
              topic: mapTopic[topicKey].topic,
              qos: this.subQos,
              time: this.now(),
            })
          }

          subscriptions.forEach((i) => {
            this.subTopic = i.topic
            this.subQos = i.qos
            setTimeout(() => {
              this.MqttSubscribe()
            }, 1200)
          })
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .websocket-view {
    .el-form-item--small.el-form-item {
      margin-bottom: 2px;
    }
    .check-area {
      .el-form-item__content {
        line-height: 20px !important;
      }
    }
    .operation-area {
      margin-top: 10px !important;
    }
    .el-input .el-input--medium {
      margin-bottom: 10px !important;
    }
    .el-select {
      width: 100%;
    }
    .refresh-btn {
      margin-left: 8px;
      font-size: 12px;
      cursor: pointer;
    }
    .connect-state {
      display: inline-block;
      margin-left: 20px;
      font-size: 14px;
      color: #a7a7a7;
      span {
        margin-left: 4px;
      }
    }
    .el-table {
      margin-top: 5px;
      /* 增加内边距 */
      border-width: 0 !important;
    }
    .el-card {
      margin-top: 24px;
    }
    .el-input,
    .el-checkbox {
      margin: 5px 0 20px;
    }
  }
</style>
