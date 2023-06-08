// * @Author: h7ml
// * @Date: 2021-08-16 12:07:36
// * @LastEditors: h7ml
// * @LastEditTime: 2021-08-16 12:07:36
// * @Description: Category api
// * @FilePath: src\api\Category\index.js
// * @DocumentLink: http://prod.iotn2n.com/swagger/#/category
import request from '@/utils/request/request'
import {
  create_object,
  del_object,
  get_object,
  update_object,
} from '@/api/Parse'

export async function queryCategory(params) {
  return request({
    url: `/classes/Category`,
    method: 'get',
    params: params,
  })
}

export async function getCategory(ObjectId) {
  return get_object('Category', ObjectId)
}

export async function delCategory(ObjectId) {
  return del_object('Category', ObjectId)
}

export async function putCategory(ObjectId, params) {
  return update_object('Category', ObjectId, params)
}

export async function postCategory(params) {
  return create_object('Category', params)
}
