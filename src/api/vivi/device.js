import request from '@/utils/request'

// 查设备
export async function getDevice(params) {
  return request({
    url: `/classes/Device`,
    method: 'get',
    params,
  })
}

// 修改设备

export async function editDevice(devid, data) {
  return request({
    url: `classes/Device/${devid}`,
    method: 'put',
    data,
  })
}

// 新增设备

export async function postDevice(data) {
  return request({
    url: `/classes/Device`,
    method: 'post',
    data,
  })
}

// 删除
export async function delDecice(id) {
  return request({
    url: `/classes/Device/${id}`,
    method: 'DELETE',
  })
}
