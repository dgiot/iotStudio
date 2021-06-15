const { hostname } = window.location
let localHost = [
  'tcloudbaseapp.com',
  'gitee.io',
  'github.io',
  'vercel.app',
  '127.0',
  '192.168',
]
function globalUrl(hostname = window.location.hostname, localHost) {
  // var result = localHost.some((i) => {
  //   return hostname.includes(i) > -1
  // })
  let result
  if (process.env.NODE_ENV !== 'development') {
    result = hostname
  } else {
    result = process.env.VUE_APP_URL.split(':')[1]
  }
  return result
}

import iotMqtt from '@/utils/iotMqtt'
export default {
  client: {},
  iotMqtt: iotMqtt,
  options: {
    host: globalUrl(hostname, localHost),
    port: window.location.protocol === 'https:' ? 8084 : 8083,
    username: '_test',
    isSSL: false,
    password: '_iotn2n',
    keepalive: 60,
    clean: true,
    clientId: '',
    subQos: 0,
    publishQos: 0,
    publishMessage: '{ "msg": "Hello, World!" }',
    subTopic: 'testtopic/#',
    publishTopic: 'testtopic',
    publishRetain: false,
    receivedMessages: [],
    publishedMessages: [],
    subscriptions: [],
  },
}
