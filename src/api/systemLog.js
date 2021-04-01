import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/systemLog/getList',
    method: 'get',
    params,
  })
}
