/*
 * @Description: Dlink 协议
 * @FilePath: src/api/Dlink/index.js
 */
// https://docs.parseplatform.org/rest/guide/#batch-operations
// http://prod.iotn2n.com/dgiot_swagger/#/Dlink/get_topic
import {
  create_object,
  del_object,
  get_object,
  query_object,
  update_object,
} from '@/api/Parse'
import request from '@/utils/request/request'
import dgiotBus from '@dgiot/dgiot-mqtt-dashboard/src/utils/bus'

/**
 * @description: 获取dlink json 列表
 * @param type
 * @returns {Promise<*>}
 */
export async function getDlinkJson(type = 'Topic') {
  return request({
    url: `dlinkjson?type=${type}`,
    method: 'get',
  })
}

export async function deleteTopic(
  Topic = '$dg/user/router/thing/111/cmd/delete'
) {
  console.warn(`${location.href} unSubscribe ${Topic}`)
  return {
    code: 200,
    msg: 'success',
    data: { info: 'success' },
  }
}

export async function getTopic(Topic = '$dg/user/router/thing/111/cmd/delete') {
  return request({
    url: `topic?topic=${Topic}`,
    method: 'get',
  })
}

export async function postTopic(Topic = '$dg/user/router/') {
  const submessage = request({
    url: `topic`,
    method: 'post',
    Headers: { 'Content-Type': 'application/json', accept: 'application/json' },
    data: { topic: Topic },
  })
  const mqttInfo = {
    href: location.href,
    topic: Topic,
    topicKey: Vue.prototype.$dgiotBus.getTopicKeyBypage(Topic.split('/')[2]),
    splitTopicKey: Topic.split('/')[2],
  }
  console.groupCollapsed(
    ` href: ${mqttInfo.href} \n topic: ${mqttInfo.topic} \n topicKey: ${mqttInfo.topicKey} \n splitTopicKey: ${mqttInfo.splitTopicKey}`
  )
  console.table(mqttInfo)
  console.groupEnd()
  // MqttSubscribe
  window.mqttInfo = window.dgiot.mqttInfo = mqttInfo
  Vue.prototype.$mqttInfo = mqttInfo
  return submessage
}
