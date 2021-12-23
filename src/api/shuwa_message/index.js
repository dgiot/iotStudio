const Vue = require('vue')
const ElementUI = require('element-ui')
var msgparam = {}
/**
 * 数蛙全局通用message消息提示
 * @param {*} msg
 */
Vue.prototype.$message = (msg) => {
  if (!msg) {
    return
  }
  if (typeof msg === 'object') {
    if (!msg.message) {
      var jsonString = JSON.stringify(msg)
    }
    msgparam = {
      type: msg.type ? msg.type : 'warn',
      message: msg.message ? msg.message : jsonString,
      duration: msg.duration ? msg.duration : 800,
      showClose: msg.showClose ? msg.showClose : true,
    }
  } else {
    msgparam = {
      message: msg,
      duration: 800,
      showClose: true,
    }
  }
  ElementUI.Message(msgparam)
}
