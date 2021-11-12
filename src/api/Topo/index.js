import request from '@/utils/request'

export async function _getTopo(params) {
  return request({
    url: '/topo',
    method: 'get',
    params: params,
  })
}

export async function get_konva_thing(params) {
  return request({
    url: '/konva_thing',
    method: 'get',
    params: params,
  })
}

export async function edit_konva_thing(params) {
  return request({
    url: '/konva_thing',
    method: 'post',
    data: params,
  })
}
