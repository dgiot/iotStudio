import request from '@/utils/request'

export function Addapp(expries, desc, secret, param) {
  return request({
    url: 'iotapi/classes/App',
    method: 'post',
    data: {
      config: {
        expires: expries,
        file: param.file,
        graphql: param.graphql,
        rest: param.rest,
        topo: param.topo,
      },
      desc: desc,
      name: desc,
      secret: secret,
    },
  })
}

export function createRole(appid, secret, desc) {
  return request({
    url: '/approle',
    method: 'post',
    data: {
      appid: appid,
      desc: desc,
      secret: secret,
    },
  })
}

export function pumpToken() {
  return request({
    url: '/pump_token',
    method: 'get',
    params: {},
  })
}

export function getServer(pro) {
  return request({
    url: '/apihub',
    method: 'get',
    params: {
      appname: pro,
    },
  })
}
