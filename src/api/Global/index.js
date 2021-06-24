import request from '@/utils/request'

export function tableDict(devType) {
  return request({
    url: `/classes/Product`,
    method: 'get',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    params: {
      where: { productSecret: devType },
    },
  })
}
