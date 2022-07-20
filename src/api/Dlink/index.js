/*
 * @Description: Dlink 协议
 * @FilePath: src/api/Dlink/index.js
 */
// https://docs.parseplatform.org/rest/guide/#batch-operations
// http://prod.iotn2n.com/dgiot_swagger/#/Dlink/get_topic
import request from '@/utils/request/request'

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

/**
 * @description: 通知后台客户端信息
 * @param UserSession
 * @returns {Promise<*>}
 */
export async function postCookie(UserSession) {
  /**
   * @description: 客户端信息
   * @type {{mapType: string}}
   */
  const clientInfo = { mapType: 'baidu' }
  return request({
    url: `/cookie`,
    method: 'post',
    Headers: { 'Content-Type': 'application/json', accept: 'application/json' },
    data: { UserSession: UserSession, cookie: clientInfo },
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
    topicKey:
      typeof Topic == 'string'
        ? Vue.prototype.$dgiotBus.getTopicKeyBypage(Topic.split('/')[2])
        : Topic,
    splitTopicKey: typeof Topic == 'string' ? Topic.split('/')[2] : Topic,
  }
  // MqttSubscribe
  window.mqttInfo = window.dgiot.mqttInfo = mqttInfo
  Vue.prototype.$mqttInfo = mqttInfo
  return submessage
}
