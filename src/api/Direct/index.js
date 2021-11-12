/*
 * @Author: h7ml
 * @Date: 2021-02-22 17:25:16
 * @LastEditTime: 2021-02-22 17:26:57
 * @LastEditors: h7ml
 * @Description: In User Settings Edit
 * @FilePath: \dgiot-dashboard\src\api\Direct\index.js
 */
import {
  create_object,
  del_object,
  get_object,
  query_object,
  update_object,
} from '@/api/shuwa_parse'

export async function queryDict(params) {
  return query_object('Dict', params)
}

export async function getDict(ObjectId) {
  return get_object('Dict', ObjectId)
}

export async function delDict(ObjectId) {
  return del_object('Dict', ObjectId)
}

export async function putDict(ObjectId, params) {
  return update_object('Dict', ObjectId, params)
}

export async function postDict(params) {
  return create_object('Dict', params)
}

export async function getDictCount(params) {
  return query_object('Dict', params)
}
