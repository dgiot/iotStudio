/*
 * @Author: h7ml
 * @Date: 2021-03-01 10:03:27
 * @LastEditTime: 2021-03-01 10:22:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dgiot-dashboard\src\api\Platform\index.js
 */
import request from '@/utils/request'

export async function postRelation(params) {
  return request({
    url: 'relation',
    method: 'post',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    params: params,
  })
}
