import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/workflow/getList',
    method: 'get',
    params,
  })
}

export function doEdit(data) {
  return request({
    url: '/workflow/doEdit',
    method: 'post',
    data,
  })
}
