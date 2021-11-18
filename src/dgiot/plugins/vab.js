import { messageDuration } from '@/config'
import { Loading, Message, MessageBox, Notification } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/token'
import i18n from '@/i18n'

const token = store.getters['user/token']

const language = store.getters['settings/language']

// console.info(`language in s ${language}`, i18n)
const loadingText = i18n.t(`vabI18n.${'developer.Data is loading'}`)
/**
 * @description 全局token
 */
Vue.prototype.$baseToken = () => {
  return token || getToken()
}

/**
 * @description 全局加载层
 * @param {*} index
 * @param {*} text
 */
Vue.prototype.$baseLoading = (index, text) => {
  let loading
  if (!index) {
    loading = Loading.service({
      lock: true,
      text: text || loadingText,
      background: 'hsla(0,0%,100%,.8)',
    })
  } else {
    loading = Loading.service({
      lock: true,
      text: text || loadingText,
      spinner: 'vab-loading-type' + index,
      background: 'hsla(0,0%,100%,0.8)',
    })
  }
  return loading
}

/**
 * @description 全局多彩加载层
 * @param {*} index
 * @param {*} text
 */
Vue.prototype.$baseColorfullLoading = (index, text) => {
  let loading
  if (!index) {
    loading = Loading.service({
      lock: true,
      text: text || loadingText,
      spinner: 'dots-loader',
      background: 'hsla(0,0%,100%,.8)',
    })
  } else {
    switch (index) {
      case 1:
        index = 'dots'
        break
      case 2:
        index = 'gauge'
        break
      case 3:
        index = 'inner-circles'
        break
      case 4:
        index = 'plus'
        break
    }
    loading = Loading.service({
      lock: true,
      text: text || loadingText,
      spinner: index + '-loader',
      background: 'hsla(0,0%,100%,.8)',
    })
  }
  return loading
}

/**
 * @description 全局Message
 * @param {*} message
 * @param {*} type
 * @param {*} dangerouslyUseHTMLString
 * @param {*} customClass
 */
Vue.prototype.$baseMessage = (
  message,
  type,
  dangerouslyUseHTMLString,
  customClass
) => {
  Message({
    showClose: true,
    message,
    type,
    dangerouslyUseHTMLString,
    duration: messageDuration,
    customClass,
  })
}

/**
 * @description 全局Alert
 * @author chuzhixin 1204505056@qq.com
 * @param {*} content
 * @param {*} title
 * @param {function} callback
 */
Vue.prototype.$baseAlert = (content, title, callback) => {
  MessageBox.alert(content, title || '温馨提示', {
    confirmButtonText: '确定',
    dangerouslyUseHTMLString: true,
    callback: () => {
      if (callback) {
        callback()
      }
    },
  }).then(() => {})
}

/**
 * @description 全局Confirm
 * @param {*} content
 * @param {*} title
 * @param {*} callback1
 * @param {*} callback2
 * @param {*} confirmButtonText
 * @param {*} cancelButtonText
 */
Vue.prototype.$baseConfirm = (
  content,
  title,
  callback1,
  callback2,
  confirmButtonText,
  cancelButtonText
) => {
  MessageBox.confirm(content, title || '温馨提示', {
    confirmButtonText: confirmButtonText || '确定',
    cancelButtonText: cancelButtonText || '取消',
    closeOnClickModal: false,
    type: 'warning',
    lockScroll: false,
  })
    .then(() => {
      if (callback1) {
        callback1()
      }
    })
    .catch(() => {
      if (callback2) {
        callback2()
      }
    })
}

/**
 * @description 全局Notification
 * @param message
 * @param title
 * @param type
 * @param position
 * @param duration
 */
Vue.prototype.$baseNotify = (message, title, type, position, duration) => {
  Notification({
    title: title,
    message: message,
    position: position || 'top-right',
    type: type || 'success',
    duration: duration || messageDuration,
  })
}

/**
 * @description 表格高度
 * @param {*} formType
 */
Vue.prototype.$baseTableHeight = (formType) => {
  // let height = window.innerHeight
  // let paddingHeight = 291
  // const formHeight = 60
  //
  // if ('number' == typeof formType) {
  //   height = height - paddingHeight - formHeight * formType
  // } else {
  //   height = height - paddingHeight
  // }
  // return height
}

/**
 * @description 全局事件总线
 */
Vue.prototype.$baseEventBus = new Vue()
