'use strict'
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i]
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p]
        }
        return t
      }
    return __assign.apply(this, arguments)
  }
exports.__esModule = true
exports.dgiotlog = exports.initDgiotlog = exports.setConfig = void 0
var Qs = require('qs')
var NODE_ENV = process.env.NODE_ENV
var isProdEnv = NODE_ENV === 'production'
/**
 * 获取url querystring部分参数值
 * @param paramName 参数名称,不传则返回所有querystring参数
 * @param url       待解析的url,默认为location.href
 */
var getUrlParam = function (paramName, url) {
  var str = url || window.location.href
  var idx = str.indexOf('?')
  var hashIdx = str.indexOf('#')
  if (idx === -1) return undefined
  var urlParams =
    Qs.parse(str.substring(idx + 1, hashIdx !== -1 ? hashIdx : undefined)) || {}
  if (paramName) return urlParams[paramName]
  return urlParams
}
// /** 日志级别对应的样式 */
// const levelStyle = {
//   log: "color：black;",
//   info: "color：#1890ff;",
//   warn: "color：#faad14;",
//   error: "color：#f5222d;",
// };
// 内部配置
var innerConfig = {
  level: 'log',
  moduleNameRegExp: /.*/,
  defaultOption: {
    isPrint: true,
    moduleName: '',
    level: 'log',
  },
}
// 当前允许的日志级别
var allowedLevel = []
// 刷新当前允许的日志级别
function refreshAllowedLevel() {
  var level = innerConfig.level
  // ERROR > WARN > INFO > LOG
  var allLevel = ['log', 'info', 'warn', 'error']
  var idx = allLevel.findIndex(function (lvl) {
    return lvl === level
  })
  allowedLevel.push.apply(allowedLevel, allLevel.slice(idx))
}
// 初始化允许的日志级别
refreshAllowedLevel()
/**
 * 设置日志配置
 * @param conf 日志配置
 */
function setConfig(conf) {
  innerConfig = __assign(__assign({}, innerConfig), conf)
  if (isProdEnv) return
  dgiotlog.info('lib:dgiotlog:config', innerConfig)
  refreshAllowedLevel()
}
exports.setConfig = setConfig
/**
 * 根据window.location.href参数初始化Dgiotlog
 * @param defConf 默认配置
 */
function initDgiotlog(defConf) {
  if (defConf === void 0) {
    defConf = {}
  }
  var moduleName =
    getUrlParam('dgiotlogModule') ||
    (defConf === null || defConf === void 0 ? void 0 : defConf.moduleName) ||
    ''
  var dgiotlogLevel =
    getUrlParam('dgiotlogLevel') ||
    (defConf === null || defConf === void 0 ? void 0 : defConf.level) ||
    'log'
  // @ts-ignore
  var dgiotlogConfig = _.defaults(
    { moduleName: moduleName, level: dgiotlogLevel, enable: !!moduleName },
    defConf
  )
  setConfig(dgiotlogConfig)
}
exports.initDgiotlog = initDgiotlog
// 过滤日志打印信息
function filterLog(option) {
  // 打包环境不打印LOG
  if (isProdEnv) return false
  // 过滤不同级别的 LOG
  if (
    !allowedLevel.find(function (l) {
      return l === option.level
    })
  )
    return false
  // 根据传入的 moduleName 过滤日志
  var moduleNameRegExp = innerConfig.moduleNameRegExp
  return moduleNameRegExp.test(option.moduleName)
}
// 打印日志 - 实现
function printDgiotlog(option, message) {
  // 生产环境不打印日志
  if (isProdEnv) return
  var dgiotlogOption = __assign(__assign({}, innerConfig.defaultOption), option)
  var _a = dgiotlogOption.isPrint,
    isPrint = _a === void 0 ? true : _a,
    moduleName = dgiotlogOption.moduleName,
    level = dgiotlogOption.level
  if (!isPrint) return
  if (!filterLog({ level: level, moduleName: moduleName })) return
  var logArgs = [
    // `%c${_.repeat("%s", message.length + 1)}`,
    // levelStyle[level],
    // @ts-ignore
    ''
      .concat(level === 'log' || level === 'info' ? '✧' /*✦*/ : '', '[')
      .concat(dayjs(new Date()).format('HH:mm:ss'), '] ')
      .concat(_.padEnd(level.toLowerCase(), 5), ' | ')
      .concat(moduleName, ' - '),
  ]
  var log = Function.prototype.bind.call(
    console[level] || dgiotlog.log,
    console
  )
  log.apply(console, logArgs.concat(message))
}
function time(label, timeFn, dgiotlogOption) {
  var startTime = Date.now()
  var result = timeFn()
  var endTime = Date.now()
  printDgiotlog.call(null, dgiotlogOption, [
    ''.concat(label || '耗时', ': ').concat(endTime - startTime, 'ms'),
    result,
  ])
  return result
}
var dgiotlog = /** @class */ (function () {
  function Dgiotlog() {}
  Dgiotlog.prototype.log = function (moduleName) {
    var dgiotlogDetail = []
    for (var _i = 1; _i < arguments.length; _i++) {
      dgiotlogDetail[_i - 1] = arguments[_i]
    }
    printDgiotlog({ level: 'log', moduleName: moduleName }, dgiotlogDetail)
  }
  Dgiotlog.prototype.info = function (moduleName) {
    var dgiotlogDetail = []
    for (var _i = 1; _i < arguments.length; _i++) {
      dgiotlogDetail[_i - 1] = arguments[_i]
    }
    printDgiotlog({ level: 'info', moduleName: moduleName }, dgiotlogDetail)
  }
  Dgiotlog.prototype.warn = function (moduleName) {
    var dgiotlogDetail = []
    for (var _i = 1; _i < arguments.length; _i++) {
      dgiotlogDetail[_i - 1] = arguments[_i]
    }
    printDgiotlog({ level: 'warn', moduleName: moduleName }, dgiotlogDetail)
  }
  Dgiotlog.prototype.error = function (moduleName) {
    var dgiotlogDetail = []
    for (var _i = 1; _i < arguments.length; _i++) {
      dgiotlogDetail[_i - 1] = arguments[_i]
    }
    printDgiotlog({ level: 'error', moduleName: moduleName }, dgiotlogDetail)
  }
  /**
   * 获取一个Dgiotlog
   * @param moduleName  打印日志的模块名称
   * @param option      日志选项
   */
  Dgiotlog.prototype.getDgiotlog = function (moduleName, option) {
    var _this = this
    if (option === void 0) {
      option = {}
    }
    var dgiotlogOption = __assign(__assign({}, option), {
      moduleName: moduleName,
    })
    return {
      /**
       * 表达式满足条件才会打印日志
       * @param expression bool表达式
       */
      if: function (expression) {
        return _this.getDgiotlog(
          moduleName,
          __assign(__assign({}, option), { isPrint: expression })
        )
      },
      /**
       * 打印函数执行耗时
       * @param label   日志前缀Label
       * @param timeFn  目标函数
       */
      time: function (label, timeFn) {
        return time(label, timeFn, dgiotlogOption)
      },
      /** log日志 */
      log: function () {
        var message = []
        for (var _i = 0; _i < arguments.length; _i++) {
          message[_i] = arguments[_i]
        }
        return printDgiotlog(
          __assign(__assign({}, dgiotlogOption), { level: 'log' }),
          message
        )
      },
      /** info日志 */
      info: function () {
        var message = []
        for (var _i = 0; _i < arguments.length; _i++) {
          message[_i] = arguments[_i]
        }
        return printDgiotlog(
          __assign(__assign({}, dgiotlogOption), { level: 'info' }),
          message
        )
      },
      /** warn日志 */
      warn: function () {
        var message = []
        for (var _i = 0; _i < arguments.length; _i++) {
          message[_i] = arguments[_i]
        }
        return printDgiotlog(
          __assign(__assign({}, dgiotlogOption), { level: 'warn' }),
          message
        )
      },
      /** error日志 */
      error: function () {
        var message = []
        for (var _i = 0; _i < arguments.length; _i++) {
          message[_i] = arguments[_i]
        }
        return printDgiotlog(
          __assign(__assign({}, dgiotlogOption), { level: 'error' }),
          message
        )
      },
    }
  }
  return Dgiotlog
})()
var dgiotlog = new dgiotlog()
window.dgiotlog = dgiotlog
exports.dgiotlog = dgiotlog
