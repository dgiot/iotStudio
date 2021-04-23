import request from '@/utils/request'

export function getCert() {
  return request({
    url: '/cert',
    method: 'get',
    params: {},
  })
}
