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
 * @description 获取dlink topic 列表
 * @returns {Promise<*>}
 */
export async function getDlinkTopic() {
  return request({
    url: 'topic',
    method: 'get',
  })
}
