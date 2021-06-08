let Paho = require('./mqttws31.js')
Paho = Paho.default
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
      iotMqtt.options.onMessage(message)
    }
  },
  sendMessage: function (topic, obj) {
    if (iotMqtt.mqttStatus) {
      let message = new Paho.MQTT.Message(JSON.stringify(obj))
      message.destinationName = topic
      if (iotMqtt.client && iotMqtt.mqttStatus) {
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
    if (iotMqtt.client && iotMqtt.mqttStatus) {
      iotMqtt.client.unsubscribe(topic) //取消订阅主题
      return true
    }
    return false
  },
  reconnect: function () {
    if (iotMqtt.client && options) {
      iotMqtt.client.connect({
        onSuccess: this.onConnect,
        onFailure: this.onFailure,
        userName: options.userName || 'admin',
        password: options.passWord || 'password',
      })
      return true
    }
    return false
  },
  init: function (options1) {
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
        userName: iotMqtt.options.userName || 'admin',
        password: iotMqtt.options.passWord || 'password',
      })
      iotMqtt.client.onConnectionLost = this.onConnectionLost //注册连接断开处理事件
      iotMqtt.client.onMessageArrived = this.onMessageArrived //注册消息接收处理事件
    }
  },
}
export default iotMqtt
