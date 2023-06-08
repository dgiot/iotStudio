// <!--
// * @Author: h7ml
// * @Date: 2022-3-30 19:11:20
// * @LastEditors:
// * @LastEditTime: 2022-3-30 19:11:20
// * @Description: MetaData api
// * @FilePath: src\api\MetaData\index.js
// * @DocumentLink: https://docs.parseplatform.org/dotnet/guide/#push-MetaDatas
// -->

import request from '@/utils/request/request'
import {
  create_object,
  del_object,
  get_object,
  update_object,
  query_object,
} from '@/api/Parse'

export async function queryRoleTree() {
  return request({
    url: `/roletree`,
    method: 'get',
    // params: params,
  })
  // return query_object('MetaData', params)
}
//iotapi/classes/Dict
export async function queryDictTemp(params) {
  return request({
    url: `/classes/Dict`,
    method: 'get',
    params: params,
  })
  // return query_object('MetaData', params)
}

// export async function getMetaData(ObjectId) {
//   return get_object('MetaData', ObjectId)
// }

// export async function delMetaData(ObjectId) {
//   return del_object('MetaData', ObjectId)
// }

// export async function putMetaData(ObjectId, params) {
//   return update_object('MetaData', ObjectId, params)
// }

export async function postRole(params) {
  return request({
    url: `/role`,
    method: 'post',
    data: params,
  })
  // return create_object('role', params)
}
