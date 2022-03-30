// <!--
// * @Author: h7ml
// * @Date: 2022-3-30 19:11:51
// * @LastEditors:
// * @LastEditTime: 2022-3-30 19:11:47
// * @Description: MasterData api
// * @FilePath: src\api\MasterData\index.js
// * @DocumentLink: https://docs.parseplatform.org/dotnet/guide/#push-MasterDatas
// -->

import request from '@/utils/request/request'
import {
  create_object,
  del_object,
  get_object,
  update_object,
  query_object,
} from '@/api/Parse'

export async function queryMasterData(params) {
  return request({
    url: `/classes/MasterData`,
    method: 'get',
    params: params,
  })
  // return query_object('MasterData', params)
}

export async function getMasterData(ObjectId) {
  return get_object('/MasterData', ObjectId)
}

export async function delMasterData(ObjectId) {
  return del_object('/MasterData', ObjectId)
}

export async function putMasterData(ObjectId, params) {
  return update_object('/MasterData', ObjectId, params)
}

export async function postMasterData(params) {
  return create_object('/MasterData', params)
}
