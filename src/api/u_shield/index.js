import request from '@/utils/request/request'

export function getCert() {
  return request({
    url: '/cert',
    method: 'get',
    params: {},
  })
}
