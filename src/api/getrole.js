import request from '@/utils/request'

export function getcontrol() {
  return request({
    url: '/permission',
    method: 'get',
    data: {},
  })
}
