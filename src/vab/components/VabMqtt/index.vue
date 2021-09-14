<template>
  <div id="Mqtt"></div>
</template>
<script>
  import MQTTConnect from '@/utils/MQTTConnect'
  const { options, iotMqtt } = MQTTConnect
  export default {
    name: 'VabMqtt',
    components: {},
    props: {
      userName: {
        type: String,
        default: options.username,
      },
      passWord: {
        type: String,
        default: options.passWord,
      },
      host: {
        type: String,
        default: options.host,
      },
      clientId: {
        type: String,
        default: 'c_' + new Date().getTime(),
      },
      port: {
        type: Number,
        default: options.port,
      },
      topic: {
        type: String,
        default: options.publishTopic,
      },
      reconnection: {
        type: Boolean,
        default: false,
      },
      connect: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {}
    },
    watch: {
      topic: {
        handler(newName, oldName) {
          console.info(newName, oldName)
          if (newName !== oldName) iotMqtt.unsubscribe(oldName)
        },
      },
    },
    mounted() {
      if (this.connect) {
        this.clientMqtt()
      }
    },
    methods: {
      clientMqtt() {
        let _this = this
        iotMqtt.init({
          id: _this.clientId,
          ip: _this.host,
          port: _this.port,
          userName: _this.userName,
          passWord: _this.passWord,
          success: () => {
            console.log(
              `clientId为${_this.clientId},iotMqtt连接成功,订阅toppic为${_this.topic}`
            )
            _this.$emit('mqttSuccess', _this.clientId)
            iotMqtt.subscribe(_this.topic)
          },
          error: function () {
            console.log(`topic:${_this.topic}连接失败,自动重连`)
            _this.$emit('mqttError', _this.clientId)
          },
          connectLost: function () {
            _this.$emit('mqttConnectLost', _this.clientId)
            console.log(`topic:${_this.topic}连接丢失`)
          },
          onMessage: function (message) {
            // console.log(`topic:${_this.topic}收到消息:${message.payloadString}`)
            let key = moment(new Date()).valueOf()
            _this.$parent.mqttDB / (message.payloadString, key, message)
            // _this.$emit('mqttMsg', message.payloadString, key)
            _this.$bus.$emit('onMessage', message)
          },
        })
      },
    },
  }
</script>
