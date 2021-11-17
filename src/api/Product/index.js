/*
 * @Author: h7ml
 * @Date: 2021-02-22 10:31:17
 * @LastEditTime: 2021-03-03 15:23:10
 * @LastEditors: h7ml
 * @Description: In User Settings Edit
 * @FilePath: \dgiot-Dashboard\src\api\Product\index.js
 */
import {
  create_object,
  del_object,
  get_object,
  query_object,
  update_object,
} from '@/api/shuwa_parse'
import request from '@/utils/request'

export async function queryProduct(params) {
  return query_object('Product', params)
}

export async function getProduct(ObjectId) {
  return get_object('Product', ObjectId)
}

export async function delProduct(ObjectId) {
  return del_object('Product', ObjectId)
}

export async function putProduct(ObjectId, params) {
  return update_object('Product', ObjectId, params)
}

export async function postProduct(params) {
  return create_object('Product', params)
}

export function postThing(data) {
  return request({
    url: 'thing',
    method: 'post',
    data,
  })
}

export function putThing(data) {
  return request({
    url: 'thing',
    method: 'put',
    data,
  })
}

export function deleteThing(data) {
  return request({
    url: 'thing',
    method: 'delete',
    data,
  })
}
