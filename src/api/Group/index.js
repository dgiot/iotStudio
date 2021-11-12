import {
  create_object,
  del_object,
  get_object,
  query_object,
  update_object,
} from '@/api/shuwa_parse'
import request from '@/utils/request'

// 获取虚拟设备分组
/**
 * <<"nodeType">> => 0 是设备，<<"nodeType">> => 1 是网关，<<"nodeType">> => 2 是虚拟分组
 */
export async function queryGroup(params) {
  params = {
    where: {
      nodeType: 2,
    },
  }
  return query_object('Product', params)
}

export async function getGroup(ObjectId) {
  return get_object('Product', ObjectId)
}

export async function delGroup(ObjectId) {
  return del_object('Product', ObjectId)
}

export async function putGroup(ObjectId, params) {
  return update_object('Product', ObjectId, params)
}

export async function postGroup(params) {
  return create_object('Product', params)
}

// 新建虚拟设备分组
export function addGroup(name) {
  return request({
    url: 'group',
    method: 'post',
    data: {
      devType: 'shuwa_iot_hub',
      name: name,
      topo: 'group_topo',
    },
  })
}
