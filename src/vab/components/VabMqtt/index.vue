<template>
  <div id="mqttws">
    <input id="msg" v-model="msg" type="text" />
    <input type="button" value="Send" @click="send" />
    <input type="button" value="Start" @click="start" />
    <input type="button" value="Stop" @click="stop" />
  </div>
</template>
<script>
  export default {
    name: 'VabMqtt',
    data() {
      return {
        host: '132.232.121.164',
        port: 8083,
        clientId: 'C_' + new Date().getTime(),
        userName: 'test',
        password: 'test123',
        keepAlive: null,
        cleanSession: true,
        useSSL: false,
        client: {},
        options: {},
        msg: 'order',
        count: 0,
      }
    },
    created() {
      console.log('route', this.$route)
      this.client = new Paho.MQTT.Client(this.host, this.port, this.clientId)
      console.log(this.client)
      var _client = this.client
      var opt = (this.options = {
        invocationContext: {
          host: this.host,
          port: this.port,
          path: _client.path,
          clientId: this.clientId,
        },
        timeout: 5,
        keepAliveInterval: 50,
        cleanSession: false,
        useSSL: false,
        userName: 'test',
        password: 'test123',
        onSuccess: function () {
          console.log('onConnected')
          _client.subscribe('001/in') //订阅主题
        },
        onFailure: function (e) {
          console.log(e)
        },
      })
      this.client.connect(opt) //连接服务器并注册连接成功处理事件
      this.client.onConnectionLost = this.onConnectionLost //注册连接断开处理事件
      this.client.onMessageArrived = this.onMessageArrived //注册消息接收处理事件
      //      console.log('after onlost');
    },
    mounted: function () {
      var opt = this.options
      this.client.connect(opt) //连接服务器并注册连接成功处理事件
      this.client.onConnectionLost = this.onConnectionLost //注册连接断开处理事件

      this.client.onMessageArrived = this.onMessageArrived //注册消息接收处理事件
      console.log('after onlost')
    },
    methods: {
      onConnectionLost: function (responseObject) {
        if (responseObject.errorCode !== 0) {
          console.log('onConnectionLost:' + responseObject.errorMessage)
          console.log('连接已断开')
        }
      },
      onMessageArrived: function (message) {
        console.log('收到消息:' + message.payloadString)
      },
      onConnect: function () {
        console.log('onConnected')
        this.client.subscribe('001/in') //订阅主题
      },
      send: function () {
        var s = this.msg
        if (s) {
          s = '{time:' + new Date() + ', content:' + s + ', from: web console}'
          var message = new Paho.MQTT.Message(s)
          message.destinationName = this.topic
          this.client.send(message)
          this.msg = ''
        }
      },
      start: function () {
        window.tester = window.setInterval(
          function () {
            if (this.client.isConnected) {
              var s =
                '{time:' +
                new Date() +
                ', content:' +
                this.count++ +
                ', from: web console}'
              var message = new Paho.MQTT.Message(s)
              message.destinationName = this.topic
              this.client.send(message)
            }
          }.bind(this),
          1000
        )
      },
      stop: function () {
        window.clearInterval(window.tester)
      },
    },
  }
</script>
