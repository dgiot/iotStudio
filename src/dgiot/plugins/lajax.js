/**
 * lajax
 * log + ajax 前端日志解决方案
 * Author: Sky.Sun
 * Date: 2017/08/15
 */

/**
 * 使 Error 对象支持 JSON 序列化
 */
window.console =
  window.console ||
  (function () {
    var c = {}
    c.log =
      c.warn =
      c.debug =
      c.info =
      c.error =
      c.time =
      c.dir =
      c.profile =
      c.clear =
      c.exception =
      c.trace =
      c.assert =
        function () {}
    return c
  })()
if (!('toJSON' in Error.prototype)) {
  /* eslint-disable no-extend-native */
  Object.defineProperty(Error.prototype, 'toJSON', {
    value() {
      const alt = {}
      Object.getOwnPropertyNames(this).forEach(function (key) {
        alt[key] = this[key]
      }, this)
      return alt
    },
    configurable: true,
    writable: true,
  })
  /* eslint-enable no-extend-native */
}

function performanceListener(type, fn) {
  if (window.addEventListener) {
    window.addEventListener(type, fn)
  } else {
    window.attachEvent('on' + type, fn)
  }
}
function getTiming() {
  try {
    var time = performance.timing
    var timingObj = {}

    var loadTime = (time.loadEventEnd - time.loadEventStart) / 1000

    if (loadTime < 0) {
      setTimeout(function () {
        getTiming()
      }, 200)
      return
    }

    timingObj['重定向时间'] = (time.redirectEnd - time.redirectStart) / 1000
    timingObj['DNS解析时间'] =
      (time.domainLookupEnd - time.domainLookupStart) / 1000
    timingObj['TCP完成握手时间'] = (time.connectEnd - time.connectStart) / 1000
    timingObj['HTTP请求响应完成时间'] =
      (time.responseEnd - time.requestStart) / 1000
    timingObj['DOM开始加载前所花费时间'] =
      (time.responseEnd - time.navigationStart) / 1000
    timingObj['DOM加载完成时间'] = (time.domComplete - time.domLoading) / 1000
    timingObj['DOM结构解析完成时间'] =
      (time.domInteractive - time.domLoading) / 1000
    timingObj['脚本加载时间'] =
      (time.domContentLoadedEventEnd - time.domContentLoadedEventStart) / 1000
    timingObj['onload事件时间'] =
      (time.loadEventEnd - time.loadEventStart) / 1000
    timingObj['页面完全加载时间'] =
      timingObj['重定向时间'] +
      timingObj['DNS解析时间'] +
      timingObj['TCP完成握手时间'] +
      timingObj['HTTP请求响应完成时间'] +
      timingObj['DOM结构解析完成时间'] +
      timingObj['DOM加载完成时间']

    for (item in timingObj) {
      console.info(
        'timingObj',
        'timingObj',
        item + ':' + timingObj[item] + '毫秒(ms)'
      )
    }
    console.info('performance', performance)
    console.info('timing', performance.timing)
  } catch (e) {
    console.warn('timingObj', timingObj)
    console.warn('timing', performance.timing)
    console.warn('performance', performance)
  }
}
class Lajax {
  /* eslint-disable no-console, no-bitwise*/
  constructor(param) {
    let config = param
    if (typeof config === 'undefined') {
      throw new Error('lajax初始化错误 - 构造函数的参数不能为空！')
    }
    if (typeof config === 'string') {
      config = {
        url: param,
      }
    } else if (typeof config === 'object') {
      if (typeof param.url !== 'string') {
        throw new Error(
          'lajax初始化错误 - 构造函数的参数 url 必须是一个字符串！'
        )
      } else if (
        param.logAjaxFilter != null &&
        typeof param.logAjaxFilter !== 'function'
      ) {
        throw new Error(
          'lajax初始化错误 - 构造函数的参数 logAjaxFilter 必须是一个函数！'
        )
      } else if (
        param.customDesc != null &&
        typeof param.customDesc !== 'function'
      ) {
        throw new Error(
          'lajax初始化错误 - 构造函数的参数 customDesc 必须是一个函数！'
        )
      }
    } else {
      throw new Error('lajax初始化错误 - 构造函数的参数格式不正确！')
    }

    // 服务端 url 地址
    this.url = config.url

    // 是否自动记录未捕获错误
    this.autoLogError = config.autoLogError == null ? true : config.autoLogError

    // 是否自动记录 Promise 错误
    this.autoLogRejection =
      config.autoLogRejection == null ? true : config.autoLogRejection

    // 是否自动记录 ajax
    this.autoLogAjax = config.autoLogAjax == null ? true : config.autoLogAjax

    // 默认的 ajax 自动记录情况过滤
    const defaultLogAjaxFilter = (ajaxUrl, ajaxMethod) => true

    // ajax 自动记录情况过滤，返回 true 代表要记录日志，false 代表不记录日志
    this.logAjaxFilter =
      config.logAjaxFilter == null ? defaultLogAjaxFilter : config.logAjaxFilter

    // 是否要格式化 console 打印的内容
    this.stylize = config.stylize == null ? true : config.stylize

    this.stylize = this.stylize && this._stylizeSupport()

    // 是否显示描述信息
    this.showDesc = config.showDesc == null ? true : config.showDesc

    // 自定义的描述信息内容
    this.customDesc = config.customDesc

    // 默认的间隔发送时间（毫秒）
    const defaultInterval = 10000

    // 间隔发送时间
    this.interval = config.interval == null ? defaultInterval : config.interval

    // 默认的最大请求出错次数
    const defaultMaxErrorReq = 5

    // 发送请求出错的最大次数，超过此次数则不再发送请求，但依然会记录请求到队列中
    this.maxErrorReq =
      config.maxErrorReq == null ? defaultMaxErrorReq : config.maxErrorReq

    // 当前请求出错次数
    this.errorReq = 0

    // 日志队列
    this.queue = []

    // 发送日志请求的 xhr 对象
    this.xhr = null

    // xhr 原生 open 方法
    this.xhrOpen = XMLHttpRequest.prototype.open

    // xhr 原生 send 方法
    this.xhrSend = XMLHttpRequest.prototype.send

    // 初始化
    this._init()
  }

  /**
   * 初始化方法
   *
   * @memberof Lajax
   */
  _init() {
    // 获取唯一请求id
    this._getReqId()

    // 加载之前未发送的历史日志
    this._loadFromStorage()

    // 页面加载时长
    this.handleAddListener()

    // 打印描述信息
    this._printDesc()

    // 自动记录异常
    this._exceptionHandler()

    // 自动记录 ajax 请求
    this._ajaxHandler()

    // 绑定页面卸载事件
    this._storageUnsendData()

    // 定时发送日志请求
    this.timer = setInterval(() => {
      this._send()
    }, this.interval)
  }

  /**
   * 获取或者生成唯一请求 id
   *
   * @memberof Lajax
   */
  _getReqId() {
    this.reqId = document.querySelector('[name="_reqId"]')
      ? document.querySelector('[name="_reqId"]').content
      : ''
    if (!this.reqId) {
      this.reqId = window._reqId
    }
    if (this.reqId) {
      // 存在 reqId，说明这是一个服务器端生成的页面，设置一个标示
      this.idFromServer = true
    } else {
      // 如果不存在 reqId，说明这是一个纯前端的页面，就自己生成一个 reqId https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/8809472#8809472
      let time = Date.now()
      if (
        typeof performance !== 'undefined' &&
        typeof performance.now === 'function'
      ) {
        // 使用更高精度的时间
        time += performance.now()
      }
      this.reqId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        (char) => {
          const rand = (time + Math.random() * 16) % 16 | 0
          time = Math.floor(time / 16)
          return (char === 'x' ? rand : (rand & 0x3) | 0x8).toString(16)
        }
      )
      this.idFromServer = false
    }
  }

  /**
   * 默认的描述信息方法
   *
   * @param {number} lastUnsend - 上次页面卸载前未发送的日志数
   * @param {string} reqId - 请求id
   * @param {boolean} idFromServer - 请求id是否来自服务器
   * @returns 最终的描述信息
   * @memberof Lajax
   */
  _defaultDesc(lastUnsend, reqId, idFromServer) {
    return `🚀 lajax 前端日志模块加载完成。
自动记录页面错误：      ${this.autoLogError ? '✔' : '✘'}
自动记录Promise异常：   ${this.autoLogRejection ? '✔' : '✘'}
自动记录Ajax请求：      ${this.autoLogAjax ? '✔' : '✘'}
当前页面请求id：${reqId}${idFromServer ? ' (来自服务端)' : ' (自动生成)'}`
  }

  /**
   * 打印描述信息
   *
   * @memberof Lajax
   */
  _printDesc() {
    if (console && this.showDesc) {
      let desc
      if (this.customDesc) {
        // 自定义描述
        desc = this.customDesc(this.lastUnsend, this.reqId, this.idFromServer)
      } else {
        // 默认描述
        desc = this._defaultDesc(this.lastUnsend, this.reqId, this.idFromServer)
      }
      if (this.stylize) {
        console.log(
          `%c${desc}`,
          `color: ${Lajax.colorEnum.desc}; font-family: 宋体; line-height: 1.5;`
        )
      } else {
        console.log(desc)
      }
    }
  }

  /**
   *
   */
  handleAddListener() {
    performanceListener('load', getTiming)
  }
  /**
   * 是否开启了无痕模式
   *
   * @returns
   * @memberof Lajax
   */
  _isSecret() {
    try {
      const testKey = 'lajax-test'
      window.localStorage.setItem(testKey, '1')
      window.localStorage.removeItem(testKey)
      return false
    } catch (error) {
      return true
    }
  }

  /**
   * 从 localStorage 加载之前未发送的历史日志
   *
   * @memberof Lajax
   */
  _loadFromStorage() {
    if (!this._isSecret()) {
      const lastData = JSON.parse(window.localStorage.getItem('lajax'))
      if (Array.isArray(lastData) && lastData.length) {
        this.lastUnsend = lastData.length
        this.queue = lastData

        // 立即发送一次
        this._send()
      }
      window.localStorage.removeItem('lajax')
    }
  }

  /**
   * 自动记录异常
   *
   * @memberof Lajax
   */
  _exceptionHandler() {
    // 页面未捕获异常
    if (this.autoLogError) {
      window.addEventListener('error', (err) => {
        this.error('[OnError]', err.message, `(${err.lineno}行${err.colno}列)`)
      })
    }

    // Promise 未捕获异常
    if (this.autoLogRejection) {
      window.addEventListener('unhandledrejection', (err) => {
        this.error('[OnRejection]', err.reason)
      })
    }
  }

  /**
   * 是否支持格式化 console 打印的内容
   * 只有 Chrome 和 firefox 浏览器开启
   *
   * @memberof Lajax
   */
  _stylizeSupport() {
    const isChrome = !!window.chrome
    const isFirefox = navigator.userAgent.indexOf('Firefox') !== -1
    return isChrome || isFirefox
  }

  /**
   * 解析 url
   *
   * @param {string} url
   * @returns
   * @memberof Lajax
   */
  _resolveUrl(url) {
    const link = document.createElement('a')
    link.href = url
    return `${link.protocol}//${link.host}${link.pathname}${link.search}${link.hash}`
  }

  /**
   * 自动记录 ajax 请求
   *
   * @memberof Lajax
   */
  _ajaxHandler() {
    if (this.autoLogAjax) {
      const that = this

      // 重写 open 方法
      XMLHttpRequest.prototype.open = function (...args) {
        this._lajaxMethod = args[0]
        this._lajaxUrl = that._resolveUrl(args[1])
        that.xhrOpen.apply(this, args)
      }

      // 重写 send 方法
      XMLHttpRequest.prototype.send = function (data) {
        // 请求开始时间
        const startTime = new Date()

        // 排除掉用户自定义不需要记录日志的 ajax
        if (that.logAjaxFilter(this._lajaxUrl, this._lajaxMethod)) {
          // 添加一条日志到队列中
          that._pushToQueue(
            startTime,
            Lajax.levelEnum.info,
            `[ajax] 发送${this._lajaxMethod.toLowerCase()}请求：${
              this._lajaxUrl
            }`
          )

          // // 请求头中添加请求 id
          // this.setRequestHeader('X-Request-Id', that.reqId)
        }

        // 添加 readystatechange 事件
        this.addEventListener('readystatechange', function () {
          // 排除掉用户自定义不需要记录日志的 ajax
          if (that.logAjaxFilter(this._lajaxUrl, this._lajaxMethod)) {
            try {
              if (this.readyState === XMLHttpRequest.DONE) {
                // 这里将发送接口请求的日志打印到控制台和添加到队列分开执行
                if (console && console.group && that.stylize) {
                  console.group(
                    '%cajax请求',
                    `color: ${Lajax.colorEnum.ajaxGroup};`
                  )
                }
                that._printConsole(
                  startTime,
                  Lajax.levelEnum.info,
                  `[ajax] 发送${this._lajaxMethod.toLowerCase()}请求：${
                    this._lajaxUrl
                  }`
                )

                // 请求结束时间
                const endTime = new Date()

                // 请求耗时
                const costTime = (endTime - startTime) / 1000

                const msgs = []
                if (this.status >= 200 && this.status < 400) {
                  msgs.push('接口请求成功。')
                } else {
                  msgs.push('接口请求失败！')
                }
                msgs.push(
                  `请求耗时：${costTime}s URL：${this._lajaxUrl} 请求方式：${this._lajaxMethod}`
                )
                if (this._lajaxMethod.toLowerCase() === 'post') {
                  msgs.push('表单数据：', data)
                }
                msgs.push(`状态码：${this.status}`)
                if (this.status >= 200 && this.status < 400) {
                  that.info('[ajax]', ...msgs)
                } else {
                  that.error('[ajax]', ...msgs)
                }

                if (console && console.group) {
                  console.groupEnd()
                }
              }
            } catch (err) {
              const msgs = []
              msgs.push('接口请求出错！')
              msgs.push(`URL：${this._lajaxUrl} 请求方式：${this._lajaxMethod}`)
              if (this._lajaxMethod.toLowerCase() === 'post') {
                msgs.push('表单数据：', data)
              }
              msgs.push(`状态码：${this.status}`)
              msgs.push(`ERROR：${err}`)
              that.error('[ajax]', ...msgs)
            }
          }
        })

        that.xhrSend.call(this, data)
      }
    }
  }

  /**
   * 页面卸载前检查是否还有未发送的日志
   *
   * @memberof Lajax
   */
  _storageUnsendData() {
    window.onunload = () => {
      // 处理未发送的数据
      if (this.queue.length) {
        if (
          navigator.sendBeacon &&
          navigator.sendBeacon(this.url, JSON.stringify(this.queue))
        ) {
          // 如果客户端支持sendBeacon，且预计能够成功发送数据，则清空队列
          this.queue = []
        } else if (!this._isSecret()) {
          // 不支持sendBeacon，且不是无痕模式，则存入localStorage，下次进入页面时会自动发送一次日志
          window.localStorage.setItem('lajax', JSON.stringify(this.queue))
        } else {
          // 是无痕模式，只能尝试发送日志，成不成功就看造化了
          this._send()
        }
      }
    }
  }

  /**
   * 发送日志请求
   *
   * @memberof Lajax
   */
  _send() {
    const logCount = this.queue.length
    if (logCount) {
      // 如果存在 this.xhr，说明上一次的请求还没有结束，就又准备发送新的请求了，则直接终止上次请求
      if (this.xhr) {
        // 这里必须将上次的回调设为null，否则会打印出请求失败
        this.xhr.onreadystatechange = null
        this.xhr.abort()
      }

      try {
        this.xhr = new XMLHttpRequest()
        this.xhrOpen.call(this.xhr, 'POST', this.url, true)
        this.xhr.setRequestHeader(
          'Content-Type',
          'application/json; charset=utf-8'
        )
        this.xhrSend.call(this.xhr, JSON.stringify(this.queue))
        this.xhr.onreadystatechange = () => {
          if (this.xhr.readyState === XMLHttpRequest.DONE) {
            if (this.xhr.status >= 200 && this.xhr.status < 400) {
              // 日志发送成功，从队列中去除已发送的
              this.queue.splice(0, logCount)

              // 重置请求出错次数
              this.errorReq = 0

              // 显示日志发送成功
              if (console) {
                if (this.stylize) {
                  console.log(
                    `%c[${this._getTimeString(
                      null
                    )}] - ${logCount}条日志发送成功！`,
                    `color: ${Lajax.colorEnum.sendSuccess}`
                  )
                } else {
                  console.log(`${logCount}条日志发送成功！`)
                }
              }
            } else {
              this._printConsole(
                null,
                Lajax.levelEnum.error,
                `发送日志请求失败！配置的接口地址：${this.url} 状态码：${this.xhr.status}`
              )
              this._checkErrorReq()
            }
            this.xhr = null
          }
        }
      } catch (err) {
        this._printConsole(
          null,
          Lajax.levelEnum.error,
          `发送日志请求失败！配置的接口地址：${this.url}`
        )
        this._checkErrorReq()
        this.xhr = null
      }
    }
  }

  /**
   * 检查请求出错次数
   *
   * @memberof Lajax
   */
  _checkErrorReq() {
    // 将出错次数 +1
    this.errorReq++

    // 超过最大次数则认为服务器不可用，停止定时器
    if (this.errorReq >= this.maxErrorReq) {
      clearInterval(this.timer)
      this._printConsole(
        null,
        Lajax.levelEnum.warn,
        `发送日志请求的连续失败次数过多，已停止发送日志。请检查日志接口 ${this.url} 是否正常！`
      )
    }
  }

  /**
   * 获取时间字符串
   *
   * @param {Date} time - 记录时间
   * @returns
   * @memberof Lajax
   */
  _getTimeString(time) {
    const now = time === null ? new Date() : time

    // 时
    let hour = String(now.getHours())
    if (hour.length === 1) {
      hour = `0${hour}`
    }

    // 分
    let minute = String(now.getMinutes())
    if (minute.length === 1) {
      minute = `0${minute}`
    }

    // 秒
    let second = String(now.getSeconds())
    if (second.length === 1) {
      second = `0${second}`
    }

    // 毫秒
    let millisecond = String(now.getMilliseconds())
    if (millisecond.length === 1) {
      millisecond = `00${millisecond}`
    } else if (millisecond.length === 2) {
      millisecond = `0${millisecond}`
    }

    return `${hour}:${minute}:${second}.${millisecond}`
  }

  /**
   * 获取日期时间字符串
   *
   * @param {Date} time - 记录时间
   * @returns
   * @memberof Lajax
   */
  _getDateTimeString(time) {
    const now = time === null ? new Date() : time

    // 年
    const year = String(now.getFullYear())

    // 月
    let month = String(now.getMonth() + 1)
    if (month.length === 1) {
      month = `0${month}`
    }

    // 日
    let day = String(now.getDate())
    if (day.length === 1) {
      day = `0${day}`
    }

    return `${year}-${month}-${day} ${this._getTimeString(now)}`
  }

  /**
   * 调用系统 console 打印日志
   *
   * @param {any} time
   * @param {any} level
   * @param {any} args
   * @memberof Lajax
   */
  _printConsole(time, level, ...args) {
    if (console) {
      if (this.stylize) {
        console[level](
          `%c[${this._getTimeString(time)}] [${level.toUpperCase()}] -`,
          `color: ${Lajax.colorEnum[level]}`,
          ...args
        )
      } else {
        console[level](...args)
      }
    }
  }

  /**
   * 将日志添加到队列中
   *
   * @param {any} time
   * @param {any} level
   * @param {any} args
   * @memberof Lajax
   */
  _pushToQueue(time, level, ...args) {
    args.unshift(`{${this.reqId}}`)
    this.queue.push({
      time: this._getDateTimeString(time),
      level,
      messages: args,
      url: window.location.href,
      agent: navigator.userAgent,
    })
  }

  /**
   * 将日志打印到控制台并添加到队列
   *
   * @param {Date} time - 记录时间
   * @param {Lajax.levelEnum} level - 日志级别
   * @param {any} args - 日志内容
   * @memberof Lajax
   */
  _log(time, level, ...args) {
    // 调用系统 console 打印日志
    this._printConsole(time, level, ...args)

    // 将日志添加到队列中
    this._pushToQueue(time, level, ...args)
  }

  /**
   * 记录一条信息日志
   *
   * @param {any} args - 日志内容
   * @memberof Lajax
   */
  info(...args) {
    this._log(null, Lajax.levelEnum.info, ...args)
  }

  /**
   * 记录一条普通日志
   * info 方法的别名
   *
   * @param {any} args
   * @memberof Lajax
   */
  log(...args) {
    this.info(...args)
  }

  /**
   * 记录一条警告日志
   *
   * @param {any} args - 日志内容
   * @memberof Lajax
   */
  warn(...args) {
    this._log(null, Lajax.levelEnum.warn, ...args)
  }

  /**
   * 记录一条错误日志
   *
   * @param {any} args - 日志内容
   * @memberof Lajax
   */
  error(...args) {
    this._log(null, Lajax.levelEnum.error, ...args)
  }
  /* eslint-enable no-console, no-bitwise*/
}

/**
 * 日志级别枚举
 */
Lajax.levelEnum = {
  /**
   * 信息
   */
  info: 'info',

  /**
   * 警告
   */
  warn: 'warn',

  /**
   * 错误
   */
  error: 'error',
}

/**
 * 日志颜色枚举
 */
Lajax.colorEnum = {
  /**
   * 信息日志颜色，默认宝蓝色
   */
  info: 'DodgerBlue',

  /**
   * 警告日志颜色，默认橘黄色
   */
  warn: 'orange',

  /**
   * 错误日志颜色，默认红色
   */
  error: 'red',

  /**
   * ajax分组颜色，默认紫色
   */
  ajaxGroup: '#800080',

  /**
   * 日志发送成功颜色，默认绿色
   */
  sendSuccess: 'green',

  /**
   * 描述文字颜色，默认粉红色
   */
  desc: '#d30775',
}

export default Lajax
window.Lajax = Lajax
