import { create_object, del_object, get_object, query_object, update_object } from '@/api/shuwa_parse'
import request from '@/utils/request'

export async function queryLicense(params) {
  return query_object('License', params)
}

export async function getLicense(ObjectId) {
  return get_object('License', ObjectId)
}

export async function delLicense(ObjectId) {
  return del_object('License', ObjectId)
}

export function putLicense(ObjectId, params) {
  return update_object('License', ObjectId, params)
}

export async function postLicense(params) {
  return create_object('License', params)
}

export function hardInfo() {
  return request({
    url: '/hardinfo',
    method: 'get',
    params: {},
  })
}

export function license() {
  return request({
    url: '/license',
    method: 'get',
    params: {},
  })
}

export function SiteDefault() {
  return request({
    url: '/classes/Site/default',
    method: 'get',
    params: {},
  })
}

export function iotHub(type, license, addr) {
  return request({
    url: '/iothub',
    method: 'get',
    params: {
      type,
      license,
      addr,
    },
  })
}

export function uploadLicense(appid, appsecret, shuwa_iot_software) {
  return request({
    url: `lictool`,
    method: 'get',
    params: {
      appid: appid,
      appsecret: appsecret,
    },
  })
}

export function uploadServer(license) {
  return request({
    url: `licsetup`,
    method: 'get',
    params: {
      license: license,
    },
  })
}

export function offlineServer(license) {
  return request({
    url: `licupdate`,
    method: 'get',
    params: {
      license: license,
    },
  })
}

export function setUpLictool(appname) {
  return request({
    url: 'iotapp',
    method: 'post',
    data: {
      appname: appname,
    },
  })
}

// 万亿零转换
export function handleZero(value) {
  // console.log(value);
  // console.log(typeof(value));
  if (typeof value === 'number') {
    value = String(value)
    const Y = /0{8}$/
    const W = /0{4}$/
    if (Y.test(value)) {
      return value.replace(Y, '亿')
    } else if (W.test(value)) {
      return value.replace(W, '万')
    }
    return value
  } else if (typeof value === 'string') {
    const W = /万+$/
    const Y = /亿+$/
    if (Y.test(value)) {
      return value.replace(Y, '00000000')
    } else if (W.test(value)) {
      return value.replace(W, '0000')
    }
    return value
  }
}

// 查询应用信息
export function getProject({
  order,
  limit,
  skip,
  keys,
  include,
  where,
}) {
  return request({
    url: `/classes/Project`,
    method: 'get',
    params: {
      order,
      limit,
      skip,
      keys,
      include,
      where,
    },
  })
}
