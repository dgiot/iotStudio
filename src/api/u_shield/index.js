import request from '@/utils/Request/request'

export function getCert() {
  return request({
    url: '/cert',
    method: 'get',
    params: {},
  })
}
