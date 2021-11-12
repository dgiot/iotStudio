// * @Author: h7ml
// * @Date: 2021-08-17 12:09:24
// * @LastEditors: h7ml
// * @LastEditTime: 2021-08-17 12:09:24
// * @Description: api ProductTemplet
// * @FilePath: src\api\ProductTemplet\index.js
// * @DocumentLink: http://prod.iotn2n.com/swagger/#/ProductTemplet
import request from '@/utils/request'
import {
  create_object,
  del_object,
  get_object,
  update_object,
} from '@/api/shuwa_parse'

export async function queryProductTemplet(params) {
  return request({
    url: `classes/ProductTemplet`,
    method: 'get',
    params: params,
  })
}

export async function getProductTemplet(ObjectId) {
  return get_object('ProductTemplet', ObjectId)
}

export async function delProductTemplet(ObjectId) {
  return del_object('ProductTemplet', ObjectId)
}

export async function putProductTemplet(ObjectId, params) {
  return update_object('ProductTemplet', ObjectId, params)
}

export async function postProductTemplet(params) {
  return create_object('ProductTemplet', params)
}
