/*
 * @Author: h7ml
 * @Date: 2021-03-18 10:18:03
 * @LastEditTime: 2021-03-18 10:19:01
 * @LastEditors: h7ml
 * @FilePath: \dgiot-dashboard\src\api\Exproto\index.js
 * @Description:拓展编程api整合
 */
import request from '@/utils/request'

export async function getExproto(params) {
  return request({
    url: 'exproto',
    method: 'get',
    params: params,
  })
}

export async function delExproto(params) {
  return request({
    url: 'exproto',
    method: 'DELETE',
    params: params,
  })
}

export async function putExproto(data) {
  return request({
    url: 'exproto',
    method: 'put',
    data: data,
  })
}

export async function postExproto(params) {
  return request({
    url: 'release_exproto',
    method: 'post',
    params: params,
  })
}
