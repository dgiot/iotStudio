/*
 * @Author: h7ml
 * @Date: 2021-02-22 10:31:17
 * @LastEditTime: 2021-03-03 15:23:10
 * @LastEditors: h7ml
 * @Description: In User Settings Edit
 * @FilePath: \dgiot-dashboard\src\api\Project\index.js
 */
import {
  create_object,
  del_object,
  get_object,
  query_object,
} from '@/api/shuwa_parse'
import request from '@/utils/request'

export async function queryProject(params) {
  return query_object('Project', params)
}

export async function getProject(ObjectId) {
  return get_object('Project', ObjectId)
}

export async function delProject(ObjectId) {
  return del_object('Project', ObjectId)
}

export async function putProject(ObjectId, params) {
  return request({
    url: `/classes/Project/${ObjectId}`,
    method: 'PUT',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: params,
  })
}

export async function postProject(params) {
  return create_object('Project', params)
}
