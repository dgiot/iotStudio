import MQTTConnect from '@/utils/MQTTConnect'
const { options, iotMqtt } = MQTTConnect
let setting = {
  id: 'dgiot_' + new Date().getTime(),
  ip: options.host,
  port: options.port,
  userName: options.userName,
  passWord: options.passWord,
}
export function clientMqtt() {
  iotMqtt.init({
    ...setting,
    success: () => {
      console.log(`iotMqtt连接成功`)
    },
    error: function () {
      console.log(`iotMqtt连接失败`)
    },
    connectLost: function () {
      console.log('iotMqtt连接丢失')
    },
    onMessage: function (message) {
      console.log(`iotMqtt收到消息:${message.payloadString}`)
    },
  })
}
