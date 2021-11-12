/* eslint-disable no-console */
import { register } from 'register-service-worker'
// import Vue from 'vue'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB',
      )
    },
    registered() {
      console.log('Service worker has been registered.')
    },
    cached() {
      console.log('Content has been cached for offline use.')
    },
    updatefound() {
      console.log('New content is downloading.')
      Vue.prototype.$baseNotify(
        '检测到新版本，正在更新，请稍后...',
        '温馨提示',
        'success',
        'bottom-right',
        8000,
      )
    },
    updated() {
      console.log('New content is available; please refresh.')
      Vue.prototype.$baseNotify(
        '更新版本完成，10秒后刷新本页面',
        '温馨提示',
        'success',
        'bottom-right',
        8000,
      )
      setTimeout(() => {
        window.location.reload()
      }, 10000)
    },
    offline() {
      console.log(
        'No internet connection found. App is running in offline mode.',
      )
    },
    error(error) {
      console.error('Error during service worker registration:', error)
    },
  })
}
