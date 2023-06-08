import request from '@/utils/request/request'

export function Getmodule(app) {
  return request({
    url: '/plugin/' + app,
    method: 'post',
    params: {
      Action: 'modules',
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
