import request from '@/utils/Request/request'

export function getdata(addr, count, di) {
  return request({
    url: '/readMeterData',
    method: 'get',
    params: {
      addr: addr,
      count: Number(count),
      di: di,
    },
  })
}
