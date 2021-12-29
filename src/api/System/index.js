import request from '@/utils/request/request'
export async function Startdashboard(data) {
  return request({
    url: `dashboard`,
    method: 'post',
    data: data,
  })
}
export async function post_tree(params) {
  return request({
    url: 'tree',
    method: 'post',
    data: params,
  })
}

export function getNode() {
  return request({
    url: 'nodes',
    method: 'get',
    params: {},
  })
}

export function joinNode(action, node) {
  return request({
    url: 'cluster?action=' + action,
    method: 'post',
    data: {
      node: node,
    },
  })
}

export function Getapp(node, start, length) {
  return request({
    url: 'plugin',
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
    url: 'plugin/' + app,
    method: 'post',
    params: {
      Action: 'modules',
    },
  })
}

export function Getstart(app) {
  return request({
    url: 'plugin/' + app,
    method: 'post',
    params: {
      Action: 'start',
    },
  })
}

export function Getstop(app) {
  return request({
    url: 'plugin/' + app,
    method: 'post',
    params: {
      Action: 'stop',
    },
  })
}

export function GetReload(app) {
  return request({
    url: 'plugin/' + app,
    method: 'post',
    params: {
      Action: 'reload',
    },
  })
}

export function Compile(code) {
  return request({
    url: 'compile',
    method: 'post',
    data: {
      code: code,
    },
  })
}

export function subupadte(channelId, action) {
  return request({
    url: `control/channel`,
    method: 'post',
    params: {
      id: channelId,
      action: action,
    },
  })
}

/**
 * @api http://114.117.171.233/swagger/#/System/post_trace
 * @param params
 * @return {*}
 */
export function postTrace(params) {
  return request({
    url: `trace`,
    method: 'post',
    data: params,
  })
}
