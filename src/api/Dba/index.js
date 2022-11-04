/*
 * @Author: h7ml
 * @Date: 2021-02-01 19:02:18
 * @LastEditTime: 2021-02-22 12:14:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dgiot-dashboard\src\api\Device\index.js
 */
import request from '@/utils/request/request'

export async function getTable() {
  return request({
    url: '/dlinkjson?type=Table',
    method: 'get',
  })
}
export async function getViews() {
  return request({
    url: '/dlinkjson?type=Views',
    method: 'get',
  })
}
