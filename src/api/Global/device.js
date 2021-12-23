import request from '@/utils/request/request'

export function tableDict(devType = 'sinmahe_PeriodicInformation') {
  let res = request({
    url: `/classes/Product`,
    method: 'get',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    params: {
      where: { devType: devType },
    },
  })
  return res
}

export function RunData(objectId) {
  return request({
    url: `app/${objectId}`,
    method: 'get',
  })
}
