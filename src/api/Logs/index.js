// * @Author: h7ml
// * @Date: 2021-08-24 10:02:54
// * @LastEditors:
// * @LastEditTime: 2021-8-26 17:51:56
// * @Description:
// * @FilePath: src\api\LogLevel\index.js
// * @DocumentLink: http://prod.iotn2n.com/swagger/#/LogLevel
import {
  create_object,
  del_object,
  query_object,
  update_object,
} from '@/api/shuwa_parse'
import request from '@/utils/Request/request'

export async function post_tree(params) {
  return request({
    url: 'tree',
    method: 'post',
    data: params,
  })
}

/**
 * @document http://prod.iotn2n.com/swagger/#/System/get_log_level
 * @param params
 * @return {Promise<*>}
 */
export async function getLogLevel(params) {
  return request({
    url: 'log/level',
    method: 'get',
    params,
  })
}

/**
 * @document http://prod.iotn2n.com/swagger/#/System/put_log_level
 * @param params
 * @return {Promise<*>}
 */
export async function putLogLevel(params) {
  return request({
    url: 'log/level',
    method: 'put',
    data: params,
  })
}

/**
 * @document http://114.117.171.233/swagger/#/System/get_traces
 * @return {Promise<*>}
 */
export async function getTraces() {
  return request({
    url: 'tree',
    method: 'get',
  })
}

/**
 * @document http://114.117.171.233/swagger/#/System/post_traces
 * @return {Promise<*>}
 */
export async function actionTraces(params) {
  return request({
    url: 'tree',
    method: 'post',
    data: params,
  })
}

export async function queryLog(params) {
  return query_object('Log', params)
}

export async function postIndustry(params) {
  return create_object('LogLevel', params)
}

export async function delIndustry(ObjectId) {
  return del_object('LogLevel', ObjectId)
}

export async function updateIndustry(ObjectId, params) {
  return update_object('LogLevel', ObjectId, params)
}
