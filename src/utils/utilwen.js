import i18n from '@/i18n'
import { getToken, setToken, removeToken } from './vuex'
import globalConfig from './globalConfig'
import store from '@/store'
import { Message } from 'element-ui'
const { iotMqtt } = MQTTConnect
const Headers = {
  sessionToken: store ? store.getters['user/token'] : '',
}
import {
  query_object,
  get_object,
  del_object,
  update_object,
  create_object,
  query_object_header,
  shuwa_batch,
} from '@/api/shuwa_parse'

import {
  getBatchNumer,
  postDict,
  getIndustry,
  delDict,
  putDict,
} from '@/api/Dict/index'
import {
  queryDevice,
  postDevice,
  putDevice,
  delDevice,
  getDevice,
} from '@/api/Device/index'
import { queryProduct } from '@/api/Product/index'
import MQTTConnect from '@/utils/MQTTConnect'

// https://www.jianshu.com/p/abdee4e7875a
/**
 *
 * @param option
 * @returns {*}
 */
function moreHttp(option) {
  let arr = [],
    keys = []
  for (let key in option) {
    keys.push(key)
    arr.push(option[key])
  }
  return axios.all(arr).then(
    axios.spread(function () {
      let result = {}
      for (let i = 0; i < arguments.length; i++) {
        let item = arguments[i]
        if (item) {
          if (item.data && item.data.data) {
            result[keys[i]] = item.data.data
          } else {
            result[keys[i]] = item
          }
        }
      }
      return result
    })
  )
}

function objGet(data, path) {
  if (data == undefined) return ''

  const pathArr = path.split('.')
  let result = data

  for (let i = 0; i < pathArr.length; i++) {
    if (result[pathArr[i]] == undefined) return ''
    result = result[pathArr[i]]
  }
  return result
}

function getFirstKey(obj) {
  if (!obj) {
    return ''
  }
  var keyStr = Object.keys(obj)[0]
  var index = keyStr.lastIndexOf(':')
  return keyStr.substring(index + 1, keyStr.length)
}

function dateFormat(fmt, date) {
  // "YYYY-mm-dd HH:MM"
  let ret
  if (!date) {
    return ''
  }
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString(), // 秒
  }
  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
      )
    }
  }
  return fmt
}

function timestampToTime(timestamp, full) {
  if (!timestamp) {
    return ''
  }
  var date = new Date(timestamp * 1000) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-'
  var M =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-'
  var D = date.getDate() + ' '
  var h = date.getHours() + ':'
  var m = date.getMinutes() + ':'
  var s = date.getSeconds()

  if (full) {
    return Y + M + D + h + m + s
  } else {
    return Y + M + D
  }
}
export function translateTitle(title) {
  let pageTitle = ''
  if (i18n.te(`vabI18n.${title}`)) {
    pageTitle = i18n.t(`vabI18n.${title}`)
  } else {
    pageTitle = title.substr(title.lastIndexOf('.') + 1)
  }
  return pageTitle
}

export function aclObj(roles) {
  if (!roles) return
  let aclObj = {}
  roles.map((e) => {
    console.log(e.name, '')
    aclObj[`${'role' + ':' + e.name}`] = {
      read: true,
      write: true,
    }
  })
  return aclObj
}
// 针对数组、对象的深拷贝
export function deepClone(originObject) {
  var deepObject = Array.isArray(originObject) ? [] : {}
  if (originObject && typeof originObject === 'object') {
    for (var key in originObject) {
      // 如果子属性为引用数据类型，递归复制
      if (originObject.hasOwnProperty(key)) {
        if (originObject[key] && typeof originObject[key] === 'object') {
          deepObject[key] = deepClone(originObject[key])
        } else {
          deepObject[key] = originObject[key]
        }
      }
    }
  }
  return deepObject
}

export function returnLogin(error) {
  if (error.code == '209') {
    Message({
      message: '您权限过期,请重新登录',
      type: 'error',
      duration: 2 * 1000,
    })
    sessionStorage.removeItem('roles')
    sessionStorage.removeItem('username')
    sessionStorage.removeItem('token')
    localStorage.removeItem('list')
    setToken('username', '-1', 'sessionStorage')
    setToken('sessionToken', '-1', 'sessionStorage')
    location.href = '/#/login'
  } else if (error.code == 119) {
    Message({
      message: '没有操作权限 e',
      type: 'warning',
      duration: 2 * 1000,
    })
  } else {
    Message({
      message: error.message,
      type: 'error',
    })
  }
}

/**
 *
 * @param response
 * @return
 * @description export file
 * @document https://zhuanlan.zhihu.com/p/77672133
 */
function convertRes2Blob(response) {
  // 提取文件名
  const filename =
    response.headers['content-disposition'].match(/filename=(.*)/)[1]
  console.log('fileName', filename)
  // 将二进制流转为blob
  const blob = new Blob([response.data], {
    type: 'application/octet-stream',
  })
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
    window.navigator.msSaveBlob(blob, decodeURI(filename))
  } else {
    // 创建新的URL并指向File对象或者Blob对象的地址
    const blobURL = window.URL.createObjectURL(blob)
    // 创建a标签，用于跳转至下载链接
    const tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = blobURL
    tempLink.setAttribute('download', decodeURI(filename))
    // 兼容：某些浏览器不支持HTML5的download属性
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank')
    }
    // 挂载a标签
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
    // 释放blob URL地址
    window.URL.revokeObjectURL(blobURL)
  }
}

// 针对数组、对象的深拷贝
export function ajax(url, method, datas) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: method,
      contentType: 'application/json',
      dataType: 'json',
      headers: Headers,
      data: datas,
      url: Cookies.get('apiserver') + url,
      success: (response) => {
        if (response) {
          resolve(response)
        }
      },
      fail: (error) => {
        reject(error)
      },
    })
  })
}
export function globalUrl(hostname = window.location.hostname, localHost) {
  var result = localHost.some((i) => {
    return hostname.indexOf(i) > -1
  })
  if (result) {
    return process.env.VUE_APP_URL.split(':')[1]
  } else {
    return ''
  }
}
export default {
  install(Vue, options) {
    Vue.prototype.$axios = axios
    Vue.prototype.$moreHttp = moreHttp
    Vue.prototype.$globalConfig = globalConfig
    Vue.prototype.$getToken = getToken
    Vue.prototype.$setToken = setToken
    Vue.prototype.$removeToken = removeToken
    Vue.prototype.$shuwa_batch = shuwa_batch
    Vue.prototype.$translateTitle = translateTitle
    Vue.prototype.$getIndustry = getIndustry
    Vue.prototype.$query_object_header = query_object_header
    Vue.prototype.$getBatchNumer = getBatchNumer
    Vue.prototype.$postDict = postDict
    Vue.prototype.$deleteDict = delDict
    Vue.prototype.$create_object = create_object
    Vue.prototype.$update_object = update_object
    Vue.prototype.$putDict = putDict
    Vue.prototype.$del_object = del_object
    Vue.prototype.$get_object = get_object
    Vue.prototype.$query_object = query_object
    Vue.prototype.$objGet = objGet
    // Vue.prototype.$qs = qs
    Vue.prototype.$dateFormat = dateFormat
    Vue.prototype.$getFirstKey = getFirstKey
    Vue.prototype.$timestampToTime = timestampToTime
    Vue.prototype.$queryDevice = queryDevice
    Vue.prototype.$postDevice = postDevice
    Vue.prototype.$putDevice = putDevice
    Vue.prototype.$getDevice = getDevice
    Vue.prototype.$deleteDevice = delDevice
    Vue.prototype.$iotMqtt = iotMqtt
    Vue.prototype.$moment = moment
    Vue.prototype.$queryProduct = queryProduct
    Vue.prototype.$aclObj = aclObj
    Vue.prototype.$deepClone = deepClone
    Vue.prototype.$ajax = ajax
    Vue.prototype.$convertRes2Blob = convertRes2Blob
  },
}
