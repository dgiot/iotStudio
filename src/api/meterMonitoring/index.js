import request from '@/utils/request'

// 获取统计信息
export function getMeterStatistic(objectId, time) {
  return request({
    url: '/meter/statistic',
    method: 'get',
    params: {
      objectId,
      time,
    },
  })
}

// 获取电表信息
export function getElectricity(objectId, time, limit, skip, metertype) {
  return request({
    url: '/org/meter/info',
    method: 'get',
    params: {
      objectId,
      time,
      limit,
      skip,
      metertype,
    },
  })
}

// 获取集中器信息
export function getVcon(objectId, time, limit, skip) {
  return request({
    url: '/org/vcon/info',
    method: 'get',
    params: {
      objectId,
      time,
      limit,
      skip,
    },
  })
}

// 查询电表
export function QueryMeter(addr, online_status, time, limit, skip, metertype) {
  return request({
    url: '/south/meter/info',
    method: 'get',
    params: {
      addr,
      online_status,
      time,
      limit,
      skip,
      metertype,
    },
  })
}

// 查询集中器
export function QueryVcon(vcaddr, online_status, time, limit, skip) {
  return request({
    url: '/south/vcon/info',
    method: 'get',
    params: {
      vcaddr,
      online_status,
      time,
      limit,
      skip,
    },
  })
}
