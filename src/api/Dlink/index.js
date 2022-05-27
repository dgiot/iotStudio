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
  return request({
    url: `topic?topic=${Topic}`,
    method: 'delete',
  })
}

export async function getTopic(Topic = '$dg/user/router/thing/111/cmd/delete') {
  return request({
    url: `topic?topic=${Topic}`,
    method: 'get',
  })
}

export async function postTopic(
  Topic = '$dg/user/router/thing/111/cmd/delete'
) {
  return request({
    url: `topic`,
    method: 'post',
    Headers: { 'Content-Type': 'application/json', accept: 'application/json' },
    data: { topic: Topic },
  })
}
