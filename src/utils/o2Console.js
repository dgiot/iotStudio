/**
 * @author panxinwu
 * @date 2016-8-8
 * var o2Log = new o2Log({
 *   debug: true
 * });
 * 远程开启： window.locaiton.href?debug=true
 */
'use strict'
//fixed to IE
const methods = [
  'assert',
  'cd',
  'clear',
  'count',
  'countReset',
  'debug',
  'dir',
  'dirxml',
  'error',
  'exception',
  'group',
  'groupCollapsed',
  'groupEnd',
  'info',
  'log',
  'markTimeline',
  'profile',
  'profileEnd',
  'select',
  'table',
  'time',
  'timeEnd',
  'timeStamp',
  'timeline',
  'timelineEnd',
  'trace',
  'warn',
]
let length = methods.length
const console = (window.console = window.console || {})
let method
const noop = function () {}
while (length--) {
  method = methods[length]
  // define undefined methods as noops to prevent errors
  if (!console[method]) console[method] = noop
}
//URL是否远程开启
const urlDebug = getUrlParams(window.location.href)

function o2Log(arg) {
  // this.debug = urlDebug || arg.debug
  this.debug = true
}

o2Log.prototype = {
  log: function (obj) {
    if (this.debug) console.log(obj)
  },
  warn: function (obj) {
    if (this.debug) console.warn(obj)
  },
  error: function (obj) {
    if (this.debug) console.error(obj)
  },

  debug: function (obj) {
    if (this.debug) console.debug(obj)
  },
  info: function (obj) {
    if (this.debug) console.debug(obj)
  },
}
//错误上报
o2Log.prototype.errorReport = function (api, message) {
  //Todo
}

/**
 * 过滤URL中debug参数
 * @param url
 * @returns {true|false}
 */
function getUrlParams(url) {
  let result = false,
    params = url.split('?')[1]
  if (!params) {
    result = false
  } else {
    params = params.split('#')[0]
    if (!params) {
      result = false
    } else {
      params = params.split('&')
      for (var i = 0, j = params.length; i < j; i++) {
        var param = params[i].split('=')
        if (param.length !== 2) {
          result = false
        } else if (param[0] === 'debug' && param[1] === 'true') {
          result = true
        } else {
          result = false
        }
      }
    }
  }

  return result
}

export default o2Log
