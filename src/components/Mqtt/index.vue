<template>
  <div id="Mqtt"></div>
</template>
<script>
  import MQTTConnect from '@/components/MQTTConnect/index'
  const { options, iotMqtt } = MQTTConnect
  export default {
    name: 'Mqtt',
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
        default: options.subTopic,
      },
      reconnection: {
        type: Boolean,
        default: true,
      },
      connect: {
        type: Boolean,
        default: false,
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
              `clientId为${_this.clientId},iotMqtt连接成功,订阅toppic为${this.topic}`
            )
            iotMqtt.subscribe(_this.topic)
          },
          error: function () {
            console.log(`topic:${_this.topic}连接失败,自动重连`)
            if (_this.reconnection) {
              _this.clientMqtt()
            }
          },
          connectLost: function () {
            console.log(`topic:${_this.topic}连接丢失`)
          },
          onMessage: function (message) {
            console.log(`topic:${_this.topic}收到消息:${message.payloadString}`)
            _this.$emit('mqttMsg', message.payloadString)
          },
        })
      },
    },
  }
</script>
