/*
 * @Description: Python相关接口
 * @FilePath: src/api/Python/index.js
 */
// https://docs.parseplatform.org/rest/guide/#batch-operations
// http://39.104.86.18/dgiot_swagger/#/Python/post_python_sinmahe_statistics
import {
  create_object,
  del_object,
  get_object,
  query_object,
  update_object,
} from '@/api/Parse'
import request from '@/utils/request/request'

/**
 *
 * @param params
 * @returns {Promise<*>}
 */
export async function getStatistics(params) {
  return request({
    url: `python_device_statistics`,
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
  })
}
