//
// * @Author:
// * @Date: 2021-07-12 14:14:58
// * @LastEditors:
// * @LastEditTime: 2021-07-12 14:14:58
// * @Description: https://github.com/any86/be-full
// * @FilePath: src\vab\plugins\beFull.js
//

var exports = {}

function beFull(id) {
  function requesetFullScreen(elem) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen()
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen()
    } else if (elem.webkitRequestFullScreen) {
      elem.webkitRequestFullScreen()
    } else if (elem.msRequestFullScreen) {
      elem.msRequestFullScreen()
    } else {
      alert('当前浏览器不支持全屏，请更换浏览器')
      return false
    }
  }
  return requesetFullScreen(document.getElementById(`${id}`))
}

function screenfull(elemId) {
  let elem = document.querySelector(elemId) || document.documentElement
  if (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  ) {
    alert('当前窗口已全屏显示')
  } else {
    requesetFullScreen(elem)
  }
}

function exitFull(id) {
  function exitFullScreen(element) {
    console.log('exitFullscreen', element)
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    } else {
      alert('当前浏览器不支持全屏，请更换浏览器')
      return false
    }
  }

  return exitFullScreen(document.getElementById(`${id}`))
}

Vue.prototype.$beFull = beFull
Vue.prototype.$exitFull = exitFull
// Vue.prototype.$toggleFull = toggleFull
// Vue.prototype.$isFull = isFull
// Vue.prototype.$watchFull = watchFull
