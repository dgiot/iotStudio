/* eslint-disable indent */

import request from '@/utils/request/request'

export function report(start, length, concentrator) {
  return request({
    url: '/shuwa_device/data_source/MSC/devs',
    method: 'get',
    params: {
      draw: 1,
      start: start,
      length: length,
      'search[regex]': concentrator,
    },
  })
}

export function connectlist(start, length, concentrator) {
  return request({
    url: '/data_source/MSC/devs',
    method: 'get',
    params: {
      draw: 1,
      start: start,
      length: length,
      'search[regex]': concentrator,
    },
  })
}
