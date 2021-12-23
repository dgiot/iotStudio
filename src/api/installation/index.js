import request from '@/utils/request/request'

export function Getdata(node, start, length, draw, search) {
  return request({
    url: '/logger/report?node=' + node,
    method: 'post',
    data: {
      draw: draw,
      start: start,
      length: length,
      'search[value]': search,
    },
  })
}

export function Getinstall(node) {
  return request({
    url: '/logger/get_loglevel?node=' + node,
    method: 'post',
    data: {
      handles: ['lager_console_backend', 'lager_shuwa_backend'],
    },
  })
}

export function Getdeveui(node, deveui) {
  return request({
    url: '/vconcentrator/get_dev_info',
    method: 'get',
    params: {
      node: node,
      deveui: deveui,
    },
  })
}

export function getLog() {
  return request({
    url: '/nodes',
    method: 'get',
    params: {},
  })
}

export function joinLog(action, node) {
  return request({
    url: '/cluster?action=' + action,
    method: 'post',
    data: {
      node: node,
    },
  })
}
