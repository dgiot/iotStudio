/*
 * @Author: h7ml
 * @Date: 2021-02-22 10:31:17
 * @LastEditTime: 2021-03-03 15:23:10
 * @LastEditors: h7ml
 * @Description: Hash Api
 * @FilePath: \dgiot-dashboard\src\api\Product\index.js
 */
// http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/web/getHash.png
import { Message } from 'element-ui'

function toMd5(string) {
  return {
    objectId: md5(string).substring(0, 10),
    code: 200,
  }
}

/**
 *
 * @param classNmae
 * @param keys
 * @param data
 * @returns {boolean}
 * @description 验证参数是否符合
 */
function verifyRule(classNmae, keys, data) {
  let results = true
  for (const key in keys) {
    // eslint-disable-next-line no-prototype-builtins
    if (!data.hasOwnProperty(keys[key])) {
      Message({
        message: `class为 ${classNmae} 的 key不符合: ${keys[key]}`,
        type: 'warning',
        duration: 6 * 1000,
        showClose: true,
      })
      dgiotlog.warn(`class为 ${classNmae} 的 key不符合:`, keys[key])
    }
    // eslint-disable-next-line no-prototype-builtins
    results = results && data.hasOwnProperty(keys[key])
  }
  return results
}

/**
 *
 * @param classNmae
 * @param data
 * @returns {Promise<{code: number, objectId: string}|{code: number, objectId: string}>}
 */
export async function getHashClass(classNmae, data) {
  let keys = []
  let response = []
  let errorRes = {
    code: 500,
    objectId: '',
  }
  switch (classNmae) {
    case 'Product':
      keys = ['category', 'devType', 'name']
      if (verifyRule(classNmae, keys, data)) {
        response = toMd5(
          `${classNmae}${data.category}${data.devType}${data.name}`
        )
      } else {
        response = errorRes
      }
      // return response
      break
    case 'Device':
      keys = ['productid', 'devaddr']
      if (verifyRule(classNmae, keys, data)) {
        response = toMd5(`${classNmae}${data.productid}${data.devaddr}`)
      } else {
        response = errorRes
      }
      // return response
      break
    case 'Evidence':
      keys = ['ukey', 'timestamp']
      if (verifyRule(classNmae, keys, data)) {
        response = toMd5(`${classNmae}${data.ukey}${data.timestamp}`)
      } else {
        response = errorRes
      }
      // return response
      break
    case 'Channel':
      keys = ['name', 'type', 'ctype']
      if (verifyRule(classNmae, keys, data)) {
        response = toMd5(`${classNmae}${data.name}${data.type}${data.ctype}`)
      } else {
        response = errorRes
      }
      // return response
      break
    case 'Dict':
      keys = ['key', 'type']
      if (verifyRule(classNmae, keys, data)) {
        response = toMd5(`${classNmae}${data.key}${data.type}`)
      } else {
        response = errorRes
      }
      // return response
      break
    case 'Instruct':
      keys = ['deviceid', 'pn', 'di']
      if (verifyRule(classNmae, keys, data)) {
        response = toMd5(`${classNmae}${data.deviceid}${data.pn}${data.di}`)
      } else {
        response = errorRes
      }
      // return response
      break
    case 'Menu':
      keys = ['name', 'url']
      if (verifyRule(classNmae, keys, data)) {
        response = toMd5(`${classNmae}${data.name}${data.url}`)
      } else {
        response = errorRes
      }
      // return response
      break
    case 'Permission':
      keys = ['name']
      if (verifyRule(classNmae, keys, data)) {
        response = toMd5(`${classNmae}${data.name}`)
      } else {
        response = errorRes
      }
      // return response
      break
    case 'Crond':
      keys = ['name']
      if (verifyRule(classNmae, keys, data)) {
        response = toMd5(`${classNmae}${data.name}`)
      } else {
        response = errorRes
      }
      // return response
      break
    default:
      Message({
        message: `该class生成md5方法为实现,class为 ${classNmae}`,
        type: 'warning',
        showClose: true,
        duration: 6 * 1000,
      })
      return errorRes
  }
  return response
}
