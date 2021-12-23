import request from '@/utils/request/request'

export function Getapp(node, start, length) {
  return request({
    url: '/plugin',
    method: 'get',
    params: {
      node: node,
      start: start,
      length: length,
    },
  })
}

export function Getmodule(app) {
  return request({
    url: '/plugin/' + app,
    method: 'post',
    params: {
      Action: 'modules',
    },
  })
}

export function Getmodule1(app) {
  return request({
    url: '/plugin/' + app,
    method: 'post',
    params: {
      Action: 'modules',
    },
  })
}

export function Getstart(app) {
  return request({
    url: '/plugin/' + app,
    method: 'post',
    params: {
      Action: 'start',
    },
  })
}

export function Getstop(app) {
  return request({
    url: '/plugin/' + app,
    method: 'post',
    params: {
      Action: 'stop',
    },
  })
}

export function GetReload(app) {
  return request({
    url: '/plugin/' + app,
    method: 'post',
    params: {
      Action: 'reload',
    },
  })
}

export function Compile(code) {
  return request({
    url: '/compile',
    method: 'post',
    data: {
      code: code,
    },
  })
}

export function getDev(addr, productId) {
  return request({
    url: `/device/${productId}/${addr}?keys=last_row(*)`,
    method: 'get',
    params: {},
  })
}

export function subupadte(channelId, action) {
  return request({
    url: `/control/channel`,
    method: 'post',
    params: {
      id: channelId,
      action: action,
    },
  })
}
