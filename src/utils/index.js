/**
 * @description 格式化时间
 * @param time
 * @param cFormat
 * @returns {string|null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  return format.replace(/{([ymdhisa])+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
}

/**
 * @description 格式化时间
 * @param time
 * @param option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}
/**
 *
 * @param {*} url
 * @returns boolean
 */
export function isImage(url) {
  var reg = /\.(png|jpg|gif|jpeg|webp)$/
  return reg.test(url)
}
/**
 * @description 将url请求参数转为json格式
 * @param url
 * @returns {{}|any}
 */
export function paramObj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}
/**
 * @param duration (ms)
 * @return dd:hh:mm:ss
 */
export function getDateDiff(duration) {
  // get total seconds value (s)
  const dateDiff = Math.floor(duration / 1000)
  const days = Math.floor(dateDiff / (3600 * 24))

  const daysRemainder = dateDiff % (3600 * 24)
  const hours = Math.floor(daysRemainder / 3600)

  const minutes = Math.floor((dateDiff % 3600) / 60)
  const seconds = dateDiff % 60

  return [days, hours, minutes, seconds]
    .map((n) => (n > 10 ? n : `0${n}`))
    .join(':')
}
/**
 * @description 父子关系的数组转换成树形结构数据
 * @param data
 * @returns {*}
 */
export function translateDataToTree(data) {
  const parent = data.filter(
    (value) => value.parentId === 'undefined' || value.parentId == null
  )
  const children = data.filter(
    (value) => value.parentId !== 'undefined' && value.parentId !== null
  )
  const translator = (parent, children) => {
    parent.forEach((parent) => {
      children.forEach((current, index) => {
        if (current.parentId === parent.id) {
          const temp = JSON.parse(JSON.stringify(children))
          temp.splice(index, 1)
          translator([current], temp)
          typeof parent.children !== 'undefined'
            ? parent.children.push(current)
            : (parent.children = [current])
        }
      })
    })
  }
  translator(parent, children)
  return parent
}

/**
 * @description 树形结构数据转换成父子关系的数组
 * @param data
 * @returns {[]}
 */
export function translateTreeToData(data) {
  const result = []
  data.forEach((item) => {
    const loop = (data) => {
      result.push({
        id: data.id,
        name: data.name,
        parentId: data.parentId,
      })
      const child = data.children
      if (child) {
        for (let i = 0; i < child.length; i++) {
          loop(child[i])
        }
      }
    }
    loop(item)
  })
  return result
}

/**
 * @description 10位时间戳转换
 * @param time
 * @returns {string}
 */
export function tenBitTimestamp(time) {
  const date = new Date(time * 1000)
  const y = date.getFullYear()
  let m = date.getMonth() + 1
  m = m < 10 ? '' + m : m
  let d = date.getDate()
  d = d < 10 ? '' + d : d
  let h = date.getHours()
  h = h < 10 ? '0' + h : h
  let minute = date.getMinutes()
  let second = date.getSeconds()
  minute = minute < 10 ? '0' + minute : minute
  second = second < 10 ? '0' + second : second
  return y + '年' + m + '月' + d + '日 ' + h + ':' + minute + ':' + second //组合
}

/**
 * @description 13位时间戳转换
 * @param time
 * @returns {string}
 */
export function thirteenBitTimestamp(time) {
  const date = new Date(time / 1)
  const y = date.getFullYear()
  let m = date.getMonth() + 1
  m = m < 10 ? '' + m : m
  let d = date.getDate()
  d = d < 10 ? '' + d : d
  let h = date.getHours()
  h = h < 10 ? '0' + h : h
  let minute = date.getMinutes()
  let second = date.getSeconds()
  minute = minute < 10 ? '0' + minute : minute
  second = second < 10 ? '0' + second : second
  return y + '年' + m + '月' + d + '日 ' + h + ':' + minute + ':' + second //组合
}

/**
 * @description 获取随机id
 * @param length
 * @returns {string}
 */
export function uuid(length = 32) {
  const num = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
  let str = ''
  for (let i = 0; i < length; i++) {
    str += num.charAt(Math.floor(Math.random() * num.length))
  }
  return str
}

/**
 * @description m到n的随机数
 * @param m
 * @param n
 * @returns {number}
 */
export function random(m, n) {
  return Math.floor(Math.random() * (m - n) + n)
}

/**
 * @description addEventListener
 * @type {function(...[*]=)}
 */
export const on = (function () {
  return function (element, event, handler, useCapture = false) {
    if (element && event && handler) {
      element.addEventListener(event, handler, useCapture)
    }
  }
})()

/**
 * @description removeEventListener
 * @type {function(...[*]=)}
 */
export const off = (function () {
  return function (element, event, handler, useCapture = false) {
    if (element && event) {
      element.removeEventListener(event, handler, useCapture)
    }
  }
})()

/**
 * @description 数组打乱
 * @param array
 * @returns {*}
 */
export function shuffle(array) {
  let m = array.length,
    t,
    i
  while (m) {
    i = Math.floor(Math.random() * m--)
    t = array[m]
    array[m] = array[i]
    array[i] = t
  }
  return array
}
export const intercept = (text, len) => {
  if (text && text.length > len) {
    return `${text.substring(0, len)}...`
  }
  return text
}
/**
 * Created by jiachenpan on 16/11/18.
 */
const Vue = require('vue')

export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  )
}
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function timestampToTime(timestamp) {
  var date = new Date(timestamp * 1000)
  var Y = date.getFullYear() + '-'
  var M =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-'
  var D =
    (date.getDate() + 1 <= 10 ? '0' + date.getDate() : date.getDate()) + ' '
  var h =
    (date.getHours() + 1 <= 10 ? '0' + date.getHours() : date.getHours()) + ':'
  var m =
    (date.getMinutes() + 1 <= 10
      ? '0' + date.getMinutes()
      : date.getMinutes()) + ':'
  var s =
    date.getSeconds() + 1 <= 10 ? '0' + date.getSeconds() : date.getSeconds()
  return Y + M + D + h + m + s
}

export function unixtime() {
  var date = new Date()
  var Y = date.getFullYear() + '-'
  var M =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-'
  var D =
    (date.getDate() + 1 < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  var h = date.getHours() + ':'
  var m = date.getMinutes() + ':'
  var s = date.getSeconds()
  if (s > 9) {
    s = date.getSeconds()
  } else {
    s = '0' + date.getSeconds()
  }
  return Y + M + D + h + m + s
}

export function timetounix(val) {
  var nowTime = val
  var date = new Date(nowTime)
  var time = date.getTime()
  time = time / 1000
  return time
}

Vue.prototype.$utc2beijing = (utc_datetime) => {
  // 转为正常的时间格式 年-月-日 时:分:秒
  var date = new Date(utc_datetime)
  var Y = date.getFullYear() + '-'
  var M =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-'
  var D =
    (date.getDate() + 1 <= 10 ? '0' + date.getDate() : date.getDate()) + ' '
  var h =
    (date.getHours() + 1 <= 10 ? '0' + date.getHours() : date.getHours()) + ':'
  var m =
    (date.getMinutes() + 1 <= 10
      ? '0' + date.getMinutes()
      : date.getMinutes()) + ':'
  var s =
    date.getSeconds() + 1 <= 10 ? '0' + date.getSeconds() : date.getSeconds()
  return Y + M + D + h + m + s
}

export function utc2beijing(utc_datetime) {
  // 转为正常的时间格式 年-月-日 时:分:秒
  var date = new Date(utc_datetime)
  var Y = date.getFullYear() + '-'
  var M =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-'
  var D =
    (date.getDate() + 1 <= 10 ? '0' + date.getDate() : date.getDate()) + ' '
  var h =
    (date.getHours() + 1 <= 10 ? '0' + date.getHours() : date.getHours()) + ':'
  var m =
    (date.getMinutes() + 1 <= 10
      ? '0' + date.getMinutes()
      : date.getMinutes()) + ':'
  var s =
    date.getSeconds() + 1 <= 10 ? '0' + date.getSeconds() : date.getSeconds()
  return Y + M + D + h + m + s
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
/*
 * @description 随机生成十六进制颜色
 */

export function randomHexColor() {
  var hex = Math.floor(Math.random() * 16777216).toString(16) //生成ffffff以内16进制数
  while (hex.length < 6) {
    //while循环判断hex位数，少于6位前面加0凑够6位
    hex = '0' + hex
  }
  return '#' + hex //返回‘#'开头16进制颜色
}
/*
 * @description 生成从minNum到maxNum的随机数
 */
export function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10)
      break
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
      break
    default:
      return 0
      break
  }
}

/**
 * 获取日期
 * @param day
 * @returns {string}
 * @deprecated
 * 废弃，建议用moment
 */
export function getDay(day) {
  var today = new Date()
  var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
  today.setTime(targetday_milliseconds)
  var tYear = today.getFullYear()
  var tMonth = today.getMonth()
  var tDate = today.getDate()
  tMonth = doHandleMonth(tMonth + 1)
  tDate = doHandleMonth(tDate)
  return tYear + '-' + tMonth + '-' + tDate
}

/**
 * 获取2位数月份
 * @param month
 * @returns {*}
 * @deprecated
 * 废弃，建议用moment
 */
function doHandleMonth(month) {
  var m = month
  if (month.toString().length == 1) {
    m = '0' + month
  }
  return m
}

/**
 * 获取页面列表最大行数，避免滚动条
 * @param offsetHeight
 * @returns {number}
 */
export function getPageSize(offsetHeight) {
  let pageHeight =
    document.documentElement.clientHeight - 220 - (offsetHeight || 0)
  let pageRows = parseInt(pageHeight / 33)
  pageRows = pageRows ? pageRows : 20
  return pageRows
}

/**
 * 获取页面高度
 * @param offsetHeight
 * @returns {number}
 */
export function getPageHeight(offsetHeight) {
  if (isNaN(offsetHeight)) {
    offsetHeight = 0
  }
  let pageHeight =
    document.documentElement.clientHeight - (120 + Number(offsetHeight))
  return pageHeight
}

/**
 * 拷贝对象
 * @param obj
 * @returns {*[] | Function | {} | *}
 */
export function clone(obj) {
  let temp = null
  if (obj instanceof Array) {
    temp = obj.concat()
  } else if (obj instanceof Function) {
    temp = obj
  } else {
    temp = {}
    for (let item in obj) {
      let val = obj[item]

      temp[item] = typeof val == 'object' ? clone(val) : val
    }
  }
  return temp
}

/**
 * 深度拷贝
 * @param obj
 * @returns {*}
 */
export function deepCopy(obj) {
  let result = Array.isArray(obj) ? [] : {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object') {
        result[key] = deepCopy(obj[key]) //递归复制
      } else {
        result[key] = obj[key]
      }
    }
  }
  return result
}

/**
 * 检查数据类型
 * @param val
 * @returns {array/object/date/number/string}
 */
export function objType(val) {
  if (!val) {
    return null
  } else if (val instanceof Array) {
    return 'array'
  } else if (val instanceof Object) {
    return 'object'
  } else if (val instanceof Date) {
    return 'date'
  } else if (val instanceof Number) {
    return 'number'
  } else if (typeof val == 'string') {
    return 'string'
  }
}

/**
 * 流量格式
 * @param flow
 * @returns {{flow: any, unit: *}}
 */
export function formatFlow(flow) {
  flow = isNaN(flow) || !flow ? 0 : Number(flow)
  var unit
  if (flow / 1024 < 1) {
    flow = flow.toFixed(1)
    unit = 'B'
  } else if (flow / 1024 / 1024 < 1) {
    flow = (flow / 1024).toFixed(1)
    unit = 'KB'
  } else if (flow / 1024 / 1024 / 1024 < 1) {
    flow = (flow / 1024 / 1024).toFixed(1)
    unit = 'MB'
  } else if (flow / 1024 / 1024 / 1024 / 1024 < 1) {
    flow = (flow / 1024 / 1024 / 1024).toFixed(1)
    unit = 'GB'
  }
  flow = flow % 1.0 == 0 ? parseInt(flow) : flow
  return { flow: flow, unit: unit }
}

/**
 * 字符串转16进制
 * @param str
 * @returns {string}
 */
export function strToHex(str) {
  if (str === '') {
    return ''
  }
  let hexCharCode = []
  hexCharCode.push('0x')
  for (let i = 0; i < str.length; i++) {
    hexCharCode.push(str.charCodeAt(i).toString(16))
  }
  return hexCharCode.join('')
}

/**
 * 16进制转字符串
 * @param hexCharCodeStr
 * @returns {string}
 */
export function hexToStr(hexCharCodeStr) {
  let trimedStr = hexCharCodeStr.trim()
  let rawStr =
    trimedStr.substr(0, 2).toLowerCase() === '0x'
      ? trimedStr.substr(2)
      : trimedStr
  let len = rawStr.length
  if (len % 2 !== 0) {
    alert('Illegal Format ASCII Code!')
    return ''
  }
  let curCharCode
  let resultStr = []
  for (let i = 0; i < len; i = i + 2) {
    curCharCode = parseInt(rawStr.substr(i, 2), 16) // ASCII Code Value
    resultStr.push(String.fromCharCode(curCharCode))
  }
  return resultStr.join('')
}

/**
 * 获取指定范围N个随机数
 * @param min
 * @param max
 * @param size
 * @returns {Array}
 */
export function randomVal(min, max, size) {
  let result = []
  for (let i = 0; i < size; i++) {
    result.push(Math.floor(Math.random() * (max - min + 1) + min))
  }
  return result
}

/**
 * 生成随机id
 * @returns {string}
 */
export function uid() {
  var length = 20
  var soupLength = genUid.soup_.length
  var id = []
  for (var i = 0; i < length; i++) {
    id[i] = genUid.soup_.charAt(Math.random() * soupLength)
  }
  return id.join('')
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)
}

export function json2params(json, slice = '&') {
  return Object.keys(json)
    .reduce((acc, item) => {
      return String(acc) + item + '=' + json[item] + slice
    }, '')
    .slice(0, -1)
}

export function tree2Array(treeObj, rootid) {
  const temp = [] // 设置临时数组，用来存放队列
  const out = [] // 设置输出数组，用来存放要输出的一维数组
  temp.push(treeObj)
  // 首先把根元素存放入out中
  let pid = rootid
  const obj = deepCopy(treeObj)
  obj.pid = pid
  delete obj['children']
  out.push(obj)
  // 对树对象进行广度优先的遍历
  while (temp.length > 0) {
    const first = temp.shift()
    const children = first.children
    if (children && children.length > 0) {
      pid = first.id
      const len = first.children.length
      for (let i = 0; i < len; i++) {
        temp.push(children[i])
        const obj = deepCopy(children[i])
        obj.pid = pid
        delete obj['children']
        out.push(obj)
      }
    }
  }
  return out
}

export function isBase64(str) {
  if (str === '' || str.trim() === '') {
    return false
  }
  try {
    return btoa(atob(str)) == str
  } catch (err) {
    return false
  }
}
export default function () {
  return (
    s4() +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    s4() +
    s4()
  )
}

/**
 *
 * @param map
 * @return {null}
 * @constructor
 */
export function Map2Json(map) {
  let obj = Object.create(null)
  for (let [k, v] of map) {
    // console.log(k, v)
    obj[k] = v
  }
  return obj
}

/**
 *
 * @param json
 * @return {Map<any, any>}
 * @constructor
 */
export function Json2Map(json) {
  let strMap = new Map()
  for (let k of Object.keys(json)) {
    strMap.set(k, json[k])
  }
  return strMap
}

/**
 *
 * @param type ['subscribe','publish','unsubscribe']
 * @return {string}
 */
export function getMqttEventId(type, Identifier = 'dmmd34r23fdew') {
  return type + Identifier
}

/**
 * @param topic
 * @param fullPath
 * @return {*}
 */
export function getTopicEventId(topic, fullPath) {
  return md5(topic + fullPath)
}
