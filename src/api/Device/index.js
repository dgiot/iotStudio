/*
 * @Author: h7ml
 * @Date: 2021-02-01 19:02:18
 * @LastEditTime: 2021-02-22 12:14:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dgiot-Dashboard\src\api\Device\index.js
 */
import request from '@/utils/request'
import {
  create_object,
  del_object,
  get_object,
  query_object,
  query_object_header,
  update_object,
} from '@/api/shuwa_parse'

export async function queryDevice(params) {
  return query_object('Device', params)
}

export async function querycompanyDevice(params, access_token) {
  return query_object_header('Device', params, {
    sessionToken: access_token,
    _company: true,
  })
}

export async function getDevice(ObjectId) {
  return get_object('Device', ObjectId)
}

export async function delDevice(ObjectId) {
  return del_object('Device', ObjectId)
}

export async function putDevice(ObjectId, params) {
  return update_object('Device', ObjectId, params)
}

export async function postDevice(params) {
  return create_object('Device', params)
}

// export async function changeDeviceStatus(multipleTable,isEnable){
//   return Promise.all([
//     multipleTable.map(item => {
//       var params = {
//         isEnable : isEnable
//       }
//       putDevice(item.id,params)
//     })
//   ])
// }
export async function getDeviceCountByProduct(productId) {
  const params = {
    count: 'objectId',
    skip: 0,
    limit: 1,
    where: {
      product: productId,
    },
  }
  const { count = -1 } = await query_object('Device', params)
  return count
}

export async function getTdDevice(objectId) {
  var initData = {
    include: 'product',
    order: '-createdAt',
    where: { objectId: objectId },
  }
  // console.info("params", initData)
  // console.log(new Date())
  return request({
    url: `device`,
    method: 'post',
    data: initData,
  })
}

// 获取设备时序数据
export async function getDabDevice(objectId, params) {
  return request({
    url: `echart/${objectId}`,
    method: 'get',
    params,
  })
}

// 获取卡片实时数据
export async function getCardDevice(objectId) {
  return request({
    url: `app/${objectId}`,
    method: 'get',
  })
}

export async function addimeidevice(params) {
  return request({
    url: `adddevice`,
    method: 'post',
    data: params,
  })
}
