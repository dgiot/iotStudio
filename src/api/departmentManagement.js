import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/departmentManagement/getList',
    method: 'get',
    params,
  })
}

export function doEdit(data) {
  return request({
    url: '/departmentManagement/doEdit',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/departmentManagement/doDelete',
    method: 'post',
    data,
  })
}
