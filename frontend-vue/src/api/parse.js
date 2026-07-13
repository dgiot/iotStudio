/**
 * Parse CRUD 模块 — 对齐 iotView src/api/parse.js
 *
 * 四函数: queryObject / createObject / updateObject / deleteObject
 * URL 约定: /classes/{ClassName}[/{objectId}]
 */
import request from './request'

const Parse = {}

/**
 * 增 — POST /classes/{className}
 */
Parse.createObject = (url, data) => {
  return request({
    url,
    method: 'post',
    data,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * 删 — DELETE /classes/{className}[/{objectId}]
 */
Parse.deleteObject = (url, data, objectId) => {
  const newUrl = objectId ? `${url}/${objectId}` : url
  return request({ url: newUrl, method: 'delete', data })
}

/**
 * 改 — PUT /classes/{className}[/{objectId}]
 */
Parse.updateObject = (url, data, objectId) => {
  const newUrl = objectId ? `${url}/${objectId}` : url
  return request({
    url: newUrl,
    method: 'put',
    data,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * 查 — GET /classes/{className}[/{objectId}]?where=...
 */
Parse.queryObject = (url, params, objectId) => {
  const newUrl = objectId ? `${url}/${objectId}` : url
  return request({ url: newUrl, method: 'get', params })
}

// 批量操作
Parse.batch = (requests) => {
  return request({
    url: '/batch',
    method: 'post',
    data: { requests },
    headers: { 'Content-Type': 'application/json' },
  })
}

export default Parse
