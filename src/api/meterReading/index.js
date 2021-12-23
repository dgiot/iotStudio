import request from '@/utils/request/request'

// 获取抄表数据
export function getMeterDate(
  skip,
  limit,
  vcaddr,
  addr,
  start_date,
  end_date,
  di,
  resource
) {
  return request({
    url: '/meter/hisdata',
    method: 'get',
    params: {
      skip,
      limit,
      vcaddr,
      addr,
      start_date,
      end_date,
      di,
      resource,
    },
  })
}

export function getMeterListDate(
  skip,
  limit,
  vcaddr,
  addr,
  start_date,
  end_date,
  type,
  di
) {
  return request({
    url: '/result/meter/hisdata',
    method: 'get',
    params: {
      skip,
      limit,
      vcaddr,
      pn: addr,
      start_date,
      end_date,
      type,
      di,
    },
  })
}

export function getMeterListDate1(
  skip,
  limit,
  vcaddr,
  start_date,
  end_date,
  type,
  di
) {
  return request({
    url: '/result/meter/hisdata',
    method: 'get',
    params: {
      skip,
      limit,
      vcaddr,
      start_date,
      end_date,
      type,
      di,
    },
  })
}
