/*
 * @Author: h7ml
 * @Date: 2021-02-22 10:31:17
 * @LastEditTime: 2021-03-03 15:23:10
 * @LastEditors: h7ml
 * @Description: In User Settings Edit
 * @FilePath: \dgiot_dashboard\src\api\Product\index.js
 */
import {
  query_object,
  get_object,
  del_object,
  update_object,
  create_object,
} from '@/api/shuwa_parse'

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
