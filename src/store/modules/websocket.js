// <!--
// * @Author: h7ml
// * @Date: 2021-07-08 09:28:13
// * @LastEditors: h7ml
// * @LastEditTime: 2021-07-08 09:28:13
// * @Description: Global mqtt webscorket management
// * @FilePath: src\store\modules\mqtt.js
// -->

// https://mcxiaoke.gitbook.io/mqtt/03-controlpackets
// https://www.jianshu.com/p/007b8ca7dc26
import { getToken } from '@/utils/vuex'
import { storage } from '@/config'

const state = () => ({
  _websocket: getToken('_websocket', storage, null),
  _url: getToken('_url', storage, ''),
  _lockReconnect: getToken('_lockReconnect', storage, false), //是否真正建立连接
  _timeout: getToken('_timeout', storage, 25 * 1000), //25秒一次心跳
  _timeoutObj: getToken('_timeoutObj', storage, null), //心跳心跳倒计时
  _serverTimeoutObj: getToken('_serverTimeoutObj', storage, null), //心跳倒计时
  _timeoutnum: getToken('_timeoutnum', storage, null), //断开 重连倒计时
  _message: getToken('_message', storage, {}),
})
const getters = {
  _tableDict: (state) => state._tableDict,
  message: (state) => state.message,
}
const mutations = {
  WEBSOCKET_INIT(state, url) {
    var that = this
    state._websocket = new WebSocket(url)
    state._url = url
    state._websocket.onopen = function () {
      console.info('websocket 连接成功') //发送用户JWT令牌 后端解析后自动绑定用户
      // state._websocket.send('id:123')
      // state._websocket.send('OpenBarScanner')
      //发送心跳包
      that.commit('websocket/start')
    }
    state._websocket.onmessage = function (callBack) {
      console.info('websocket 重置心跳', callBack.data)
      //重置心跳
      // console.info(callBack.data)
      that.commit('websocket/reset')
      if (callBack.data == 'heartCheck') {
        return
      }
      state._message = callBack.data
    }
    state._websocket.οnerrοr = function () {
      //e错误
      // console.info(e)
      console.info('websocket 錯誤信息', e)
      that.commit('websocket/reconnect')
    }
    state._websocket.onclose = function () {
      //e关闭
      // console.info(e)
      that.commit('websocket/reconnect')
    }
  },
  WEBSOCKET_SEND(state, _message) {
    state._websocket.send(message)
  },
  reconnect(state) {
    //重新连接
    // console.info("重新连接")
    var that = this
    if (state._lockReconnect) {
      return
    }
    state._lockReconnect = true
    //没连接上会一直重连，设置延迟避免请求过多
    state._timeoutnum && clearTimeout(state._timeoutnum)
    state._timeoutnum = setTimeout(function () {
      //新连接
      that.commit('websocket/WEBSOCKET_INIT', state._url)
      state._lockReconnect = false
    }, 5000)
  },
  reset(state) {
    //重置心跳
    //清除时间
    clearTimeout(state._timeoutObj)
    clearTimeout(state._serverTimeoutObj)
    //心跳
    this.commit('websocket/start')
  },
  start(state) {
    //开启心跳
    console.info('开启心跳')
    var that = this
    state._timeoutObj && clearTimeout(state._timeoutObj)
    state._serverTimeoutObj && clearTimeout(state._serverTimeoutObj)
    state._timeoutObj = setTimeout(function () {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      console.info(
        state._websocket,
        '这里发送一个心跳，后端收到后，返回一个心跳消息，',
      )
      if (state._websocket.readyState == 1) {
        //如果连接正常
        state._websocket.send('heartCheck')
      } else {
        //否则重连
        that.commit('websocket/reconnect')
      }
      state._serverTimeoutObj = setTimeout(function () {
        //超时关闭
        state._websocket.close()
      }, state._timeout)
    }, state._timeout)
  },
}
const actions = {
  WEBSOCKET_INIT(commit, url) {
    commit('WEBSOCKET_INIT', url)
  },
  WEBSOCKET_SEND(commit, message) {
    commit('WEBSOCKET_SEND', message)
  },
}
export default {
  state,
  getters,
  mutations,
  actions,
}
