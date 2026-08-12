/**
 * validate.js — 对齐 iotView src/utils/validate.js
 */

/** 验证用户名 (iotView: 手机号格式) */
export function validUsername(str) {
  const validMap = ['admin', 'dgiot_dev', 'editor']
  // 开发环境允许预设用户名
  if (validMap.includes(str?.trim())) return true
  // 否则按手机号格式验证
  return /^1[3-9]\d{9}$/.test(str)
}

/** 验证密码 8-64 位 */
export function validPassword(str) {
  return str && str.length >= 8 && str.length <= 64
}

/** 是否为外部链接 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/** 是否为数组 */
export function isArray(arg) {
  if (!Array.isArray) {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/** 是否为字符串 */
export function isString(str) {
  return typeof str === 'string' || str instanceof String
}

/** 是否为有效的 URL */
export function isValidURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}
