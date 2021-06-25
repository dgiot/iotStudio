import request from '@/utils/request'

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
