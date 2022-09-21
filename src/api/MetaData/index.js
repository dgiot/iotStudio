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

export async function queryMaterial(params) {
  return request({
    url: `/material`,
    method: 'get',
    params: params,
  })
}
export async function queryMetaData(params) {
  return request({
    url: `/classes/MetaData`,
    method: 'get',
    params: params,
  })
  // return query_object('MetaData', params)
}

export async function getMetaData(ObjectId) {
  return get_object('MetaData', ObjectId)
}

export async function delMetaData(ObjectId) {
  return del_object('MetaData', ObjectId)
}

export async function putMetaData(ObjectId, params) {
  return update_object('MetaData', ObjectId, params)
}

export async function postMetaData(params) {
  return create_object('MetaData', params)
}
