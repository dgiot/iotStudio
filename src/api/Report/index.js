import request from '@/utils/request'

export async function postRelation(params) {
  return request({
    url: 'report',
    method: 'Delete',
    params: params,
  })
}

export function postreport(data) {
  return request({
    url: 'report',
    method: 'post',
    data,
  })
}
