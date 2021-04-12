import i18n from '@/i18n'
import { getToken, setToken, removeToken } from './vuex'
import globalConfig from './globalConfig'
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

export default {
  install(Vue, options) {
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

    Vue.prototype.$queryProduct = queryProduct
  },
}
