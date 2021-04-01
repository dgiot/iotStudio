import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/goods/getList',
    method: 'get',
    params,
  })
}
