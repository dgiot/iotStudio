/*
 * @Author: h7ml
 * @Date: 2021-03-01 10:03:27
 * @LastEditTime: 2021-03-01 10:22:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dgiot-dashboard\src\api\Platform\index.js
 */
import request from '@/utils/request/request'

export async function postRelation(data) {
  return request({
    url: 'relation',
    method: 'post',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: data,
  })
}

export async function delRelation(data) {
  return request({
    url: 'relation',
    method: 'delete',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: data,
  })
}

export async function queryRelation(params) {
  return request({
    url: 'relation',
    method: 'get',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    params: params,
  })
}
