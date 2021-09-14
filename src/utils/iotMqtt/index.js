// https://unpkg.com/browse/xhl-mqttx@1.0.2/mqttx.js
var isUseSSL = window.location.protocol === 'https:' ? true : false
const iotMqtt = {
  client: null,
  mqttStatus: false,
  options: {},
  onConnect: function () {
    iotMqtt.mqttStatus = true
    if (iotMqtt.options && iotMqtt.options.success) {
      iotMqtt.options.success()
    }
  },
  onFailure: function () {
    iotMqtt.mqttStatus = false
    if (iotMqtt.options && iotMqtt.options.error) {
      iotMqtt.options.error()
    }
  },
  onConnectionLost: function (responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage)
      console.log('连接已断开')
      iotMqtt.mqttStatus = false
      if (iotMqtt.options && iotMqtt.options.connectLost) {
        iotMqtt.options.connectLost(responseObject.errorMessage)
      }
    }
  },
  onMessageArrived: function (message) {
    if (iotMqtt.options && iotMqtt.options.onMessage) {
      // options.onMessage(message)
      iotMqtt.options.onMessage(message)
      // console.log('message', message)
      // // store.getters['mqttDB/setMqttInfo']
      // store.dispatch('mqttDB/resaveMqttInfo', message)
    }
  },
  sendMessage: function (topic, obj, qos = 0, retained = true) {
    if (iotMqtt.mqttStatus) {
      let message = new Paho.MQTT.Message(JSON.stringify(obj))
      message.destinationName = topic
      // var message = new Paho.MQTT.Message(obj)
      // message.destinationName = topic
      // message.qos = Number(qos)
      // message.retained = retained
      if (iotMqtt.client && iotMqtt.mqttStatus) {
        console.info('send msg', message)
        iotMqtt.client.send(message)
        return true
      }
    }
    return false
  },
  subscribe: function (topic, qos) {
    if (iotMqtt.client && iotMqtt.mqttStatus) {
      iotMqtt.client.subscribe(topic, { qos: qos || 0 })
      return true
    }
    return false
  },
  unsubscribe: function (topic) {
    console.log(`unsubscribe mqtt ${topic}`)
    if (iotMqtt.client && iotMqtt.mqttStatus) {
      iotMqtt.client.unsubscribe(topic) //取消订阅主题
      return true
    }
    return false
  },
  reconnect: function () {
    window.location.protocol === 'https:'
      ? (iotMqtt.options.useSSL = isUseSSL)
      : ''
    console.log(iotMqtt.client, iotMqtt.options, 'options')
    if (iotMqtt.client && iotMqtt.options) {
      iotMqtt.client.connect({
        onSuccess: this.onConnect,
        useSSL: isUseSSL,
        onFailure: this.onFailure,
        userName: iotMqtt.options.userName || 'admin',
        password: iotMqtt.options.passWord || 'password',
      })
      return true
    }
    return false
  },
  init: function (options1) {
    window.location.protocol === 'https:' ? (options1.useSSL = isUseSSL) : ''
    if (options1) {
      iotMqtt.options = options1
      iotMqtt.client = new Paho.MQTT.Client(
        iotMqtt.options.ip || '127.0.0.1',
        Number(iotMqtt.options.port || 61623),
        iotMqtt.options.id || '0'
      )
      iotMqtt.client.connect({
        onSuccess: this.onConnect,
        onFailure: this.onFailure,
        useSSL: isUseSSL,
        userName: iotMqtt.options.userName || 'admin',
        password: iotMqtt.options.passWord || 'password',
      })
      iotMqtt.client.onConnectionLost = this.onConnectionLost //注册连接断开处理事件
      iotMqtt.client.onMessageArrived = this.onMessageArrived //注册消息接收处理事件
    }
  },
}
window.iotMqtt = iotMqtt
export default iotMqtt
