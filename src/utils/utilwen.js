import i18n from '@/i18n'
import Bus from './eventBus'
import dgiotBus from '@dgiot/dgiot-mqtt-dashboard/src/utils/bus'
import dgiotMixin from '@dgiot/dgiot-mqtt-dashboard/src/mixins/mqtt'
import { getToken, removeToken, setToken } from './vuex'
import globalConfig from './globalConfig'
import store from '@/store'
import { Message } from 'element-ui'
import dgiotlog from './dgiotlog'
import {
  create_object,
  del_object,
  get_object,
  query_object,
  query_object_header,
  shuwa_batch,
  update_object,
} from '@/api/shuwa_parse'
import {
  delDict,
  getBatchNumer,
  getIndustry,
  postDict,
  putDict,
} from '@/api/Dict/index'
import {
  delDevice,
  getDevice,
  postDevice,
  putDevice,
  queryDevice,
} from '@/api/Device/index'
import { queryProduct } from '@/api/Product/index'
import { getMqttEventId, getTopicEventId } from '@/utils'

// https://www.jianshu.com/p/abdee4e7875a
/**
 *
 * @param option
 * @returns {*}
 */
import o2Log from './o2Console'

const { CDN_URL } = require('../config')

Vue.use(dgiotBus)
Vue.mixin(dgiotMixin)
Vue.use(Bus)

const Headers = {
  sessionToken: store ? store.getters['user/token'] : '',
}

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
      // eslint-disable-next-line no-prototype-builtins
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

/**
 *
 * @description 下载二进制数据流文件
 * @param res
 * @document https://blog.csdn.net/Cris_are/article/details/108173681
 */
function downBinary(res) {
  if (!res) return false
  const { data, headers } = res
  let blob = new Blob([data], { type: headers['content-type'] }) // 这里标识下载文件类型
  console.log(blob, res.data)
  let downloadElement = document.createElement('a')
  let href = window.URL.createObjectURL(blob) // 创建下载的链接
  downloadElement.href = href
  downloadElement.download =
    headers['content-disposition'].match(/filename=(.*)/)[1] // 下载后文件名
  document.body.appendChild(downloadElement)
  downloadElement.click() // 点击下载
  document.body.removeChild(downloadElement) // 下载完成移除元素
  window.URL.revokeObjectURL(href) // 释放掉blob对象
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

/**
 *
 * @param link
 * @param name
 */
function downLink(link, name) {
  if (!name) {
    name = link.slice(link.lastIndexOf('/') + 1)
  }
  let eleLink = document.createElement('a')
  eleLink.download = name
  eleLink.style.display = 'none'
  eleLink.href = link
  document.body.appendChild(eleLink)
  eleLink.click()
  document.body.removeChild(eleLink)
}

/**
 * 浏览器下载静态文件
 * @param {String} name 文件名
 * @param {String} content 文件内容
 */
function downloadFile(name, content) {
  if (typeof name == 'undefined') {
    throw new Error('The first parameter name is a must')
  }
  if (typeof content == 'undefined') {
    throw new Error('The second parameter content is a must')
  }
  if (!(content instanceof Blob)) {
    content = new Blob([content])
  }
  const link = URL.createObjectURL(content)
  download(link, name)
}

/**
 *
 * @param link
 * @param name
 */
function download(link, name) {
  if (!name) {
    name = link.slice(link.lastIndexOf('/') + 1)
  }
  let eleLink = document.createElement('a')
  eleLink.download = name
  eleLink.style.display = 'none'
  eleLink.href = link
  document.body.appendChild(eleLink)
  eleLink.click()
  document.body.removeChild(eleLink)
}

/**
 *
 * @param link
 * @param fileName
 */
function downloadByLink(link, fileName) {
  axios
    .request({
      url: link,
      responseType: 'blob', //关键代码，让axios把响应改成blob
    })
    .then((res) => {
      const link = URL.createObjectURL(res.data)
      download(link, fileName)
    })
}

/**
 *
 * @param {*} func 要进行debouce的函数
 * @param {*} wait 等待时间,默认500ms
 * @param {*} immediate 是否立即执行
 */
export function debounce(func, wait = 500, immediate = false) {
  var timeout
  return function () {
    var context = this
    var args = arguments

    if (timeout) clearTimeout(timeout)
    if (immediate) {
      // 如果已经执行过，不再执行
      var callNow = !timeout
      timeout = setTimeout(function () {
        timeout = null
      }, wait)
      if (callNow) func.apply(context, args)
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args)
      }, wait)
    }
  }
}

/**
 * 节流，多次触发，间隔时间段执行
 * @param {Function} func
 * @param {Int} wait
 * @param {Object} options
 */
export function throttle(func, wait = 500, options) {
  //container.onmousemove = throttle(getUserAction, 1000);
  var timeout, context, args
  var previous = 0
  if (!options) {
    options = {
      leading: false,
      trailing: true,
    }
  }

  var later = function () {
    previous = options.leading === false ? 0 : new Date().getTime()
    timeout = null
    func.apply(context, args)
    if (!timeout) context = args = null
  }

  var throttled = function () {
    var now = new Date().getTime()
    if (!previous && options.leading === false) previous = now
    var remaining = wait - (now - previous)
    context = this
    args = arguments
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func.apply(context, args)
      if (!timeout) context = args = null
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining)
    }
  }
  return throttled
}

/**
 *
 * @param value
 * @return {boolean|boolean}
 */
export const isFalsy = (value) => (value === 0 ? false : !value)
/**
 *
 * @param value
 * @return {boolean}
 */
export const isVoid = (value) =>
  value === undefined || value === null || value === ''

/**
 *
 * @param object
 * @return {{}|*}
 */
export const cleanObject = (object) => {
  // Object.assign({}, object)
  if (!object) return {}
  const result = { ...object }
  Object.keys(result).forEach((key) => {
    const value = result[key]
    if (isVoid(value)) delete result[key]
  })
  return result
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
    Vue.prototype.$moment = moment
    Vue.prototype.$queryProduct = queryProduct
    Vue.prototype.$aclObj = aclObj
    Vue.prototype.$deepClone = deepClone
    Vue.prototype.$ajax = ajax
    Vue.prototype.$loadsh = _
    Vue.prototype.$convertRes2Blob = convertRes2Blob
    Vue.prototype.$bus = Bus
    Vue.prototype.$o2Log = o2Log
    // https://shufei021.github.io/rutils/library/
    // Vue.prototype.$dg
    // otUtils = rutils
    // https://shufei021.github.io/rdate/
    // Vue.prototype.$dgiotRdate = rdate
    Vue.prototype.$getMqttEventId = getMqttEventId
    Vue.prototype.$getTopicEventId = getTopicEventId
    Vue.prototype.$downBinary = downBinary
    Vue.prototype.$FileServe = Cookies.get('fileServer')
    Vue.prototype.$dgiotlog = dgiotlog
  },
}
