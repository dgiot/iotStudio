import request from '@/utils/request'

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
