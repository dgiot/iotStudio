import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/roleManagement/getList',
    method: 'get',
    params,
  })
}

export function doEdit(data) {
  return request({
    url: '/roleManagement/doEdit',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/roleManagement/doDelete',
    method: 'post',
    data,
  })
}
