import request from '@/utils/request'
export async function _getTopo(params) {
  return request({
    url: '/get_topo',
    method: 'get',
    params: params,
  })
}
