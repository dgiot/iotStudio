import FullScreenComponent from './assets/fullScreen'

const fullScreenID = 'clickID'
let index = 1
let nowClickID = ''
//屏幕全屏按esc 更改svg的状态
/**
 *
 * @param el
 * @param dom
 */
const changeFullScreen = (el, dom) => {
  if (!dom) {
    el.fullScreen.isFullScreen = false
  }
}
/**
 *
 * @param el
 */
//进入屏幕全屏
const intoScreenMode = (el) => {
  if (el.requestFullscreen) {
    el.requestFullscreen()
  } else if (el.webkitRequestFullScreen) {
    el.webkitRequestFullScreen()
  } else if (el.mozRequestFullScreen) {
    el.mozRequestFullScreen()
  } else if (el.msRequestFullscreen) {
    // IE11
    el.msRequestFullscreen()
  }
}
//退出屏幕全屏
const exitScreenMode = () => {
  if (document.fullscreenElement && document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  }
}
/**
 *
 * @param el
 * @param binding
 */
//update中处理屏幕全屏的函数
const toggleFullScreen = (el, binding) => {
  let isFullScreen, index
  const showIcon = (binding.value && binding.value.showIcon) || 'true'
  if (showIcon === 'true') {
    isFullScreen = el.fullScreen.isFullScreen
    index = el.fullScreen.index
  } else {
    isFullScreen = binding.value.updateFullScreen
    index = binding.value.index
  }

  const type = (binding.value && binding.value.type) || 'window'
  //浏览器全屏按esc退出浏览器全屏
  const escKeyDown = (e) => {
    if (Number(e.keyCode) === 27) {
      el.filter &&
        el.filter &&
        el.index.insertBefore(el.filter, el.filterNextSibling)
      el.classList.remove('full-screen')
      el.fullScreen.isFullScreen = false
    }
  }
  //如果此刻点击的全屏按钮和多次update中的el是同一个元素 那么就执行全屏操作
  if (nowClickID === fullScreenID + index) {
    //进入浏览器全屏
    if (isFullScreen && type === 'window') {
      //将筛选器插入到全屏的元素中
      el.filter && el.insertBefore(el.filter, el.firstChild)
      el.classList.remove('window-relative')
      el.classList.add('full-screen')
      if (showIcon === 'true') {
        window.addEventListener('keydown', escKeyDown)
      }
    } else if (!isFullScreen && type === 'window') {
      //退出浏览器全屏
      el.classList.remove('full-screen')
      el.classList.add('window-relative')
      //将筛选器还原到全屏前的位置
      el.filter && el.index.insertBefore(el.filter, el.filterNextSibling)
      if (showIcon === 'true') {
        window.removeEventListener('keydown', escKeyDown)
      }
    } else if (isFullScreen && type === 'screen') {
      //进入屏幕全屏
      //将筛选器插入到全屏的元素中
      el.filter && el.insertBefore(el.filter, el.firstChild)
      intoScreenMode(el)
    } else if (!isFullScreen && type === 'screen') {
      //退出屏幕全屏
      exitScreenMode()
      //将筛选器还原到全屏前的位置
      el.filter && el.index.insertBefore(el.filter, el.filterNextSibling)
    }
    //执行传入函数中的内容 用于定制化全屏后的一些操作
    binding.value && binding.value.fn ? binding.value.fn(el, binding) : ''
  }
}

/**
 *
 * @type {{bind: fullScreen.bind, inserted: fullScreen.inserted, unbind: fullScreen.unbind, update: fullScreen.update}}
 * @url https://github.com/lxjjjjjj/fullScreen/blob/master/index.js
 */
const fullScreen = {
  bind: (el, binding) => {
    const type = (binding.value && binding.value.type) || 'window'
    const showIcon = (binding.value && binding.value.showIcon) || 'true'
    //创建浏览器全屏的按钮容器
    const screenParent = document.createElement('div')
    screenParent.style.backgroundColor = '#fff'
    screenParent.classList.add('window-relative')
    //全屏按钮组件
    let fullScreen
    const clickFullScreen = (e) => {
      nowClickID = e.target.id
      toggleFullScreen(el, binding)
    }
    const gazelleClickFullScreen = (e) => {
      if (e.target.id.includes('clickID')) {
        nowClickID = e.target.id
      }
    }
    if (showIcon === 'true') {
      const FullScreenConstructor = Vue.extend(FullScreenComponent)
      fullScreen = new FullScreenConstructor({
        el: el,
        data: {
          index: ++index,
          top: binding.value.top,
          right: binding.value.right,
        },
      })
      //全屏按钮组件加入到按钮容器中
      screenParent.appendChild(fullScreen.$el)
      el.fullScreen = fullScreen
      el.clickFullScreen = clickFullScreen
      //每个全屏按钮设置点击监听事件 获取到此刻点击的元素
      el.fullScreen.$el.addEventListener('click', el.clickFullScreen, false)
    } else {
      el.clickFullScreen = gazelleClickFullScreen
      window.addEventListener('click', el.clickFullScreen, false)
    }
    //将按钮容器插入到全屏的元素中
    el.insertBefore(screenParent, el.firstChild)
    el.screenParent = screenParent
    if (type === 'screen') {
      const escExitEvent = () => {
        changeFullScreen(el, document.fullscreenElement)
      }
      el.escExitEvent = escExitEvent
      //绑定浏览器点击esc退出全屏事件
      window.addEventListener('fullscreenchange', el.escExitEvent, false)
    }
  },
  inserted: (el, binding) => {
    //在update之前保存筛选器组件的初始位置
    if (
      binding.value.insertNode &&
      document.getElementById(`${binding.value.insertNode}`)
    ) {
      el.filter = document.getElementById(`${binding.value.insertNode}`)
      el.filterNextSibling = el.filter.nextElementSibling
      el.index = document.getElementById(
        `${binding.value.insertNode}`
      ).parentNode
    }
  },
  update: (el, binding) => {
    toggleFullScreen(el, binding)
  },
  unbind: (el, binding) => {
    const type = (binding.value && binding.value.type) || 'window'
    const showIcon = (binding.value && binding.value.showIcon) || 'false'
    if (showIcon === 'true') {
      el.fullScreen.$el.removeEventListener('click', el.clickFullScreen)
      //移除监听事件
      if (type === 'screen') {
        window.addEventListener('fullscreenchange', el.escExitEvent, false)
      }
    } else {
      el.filter && el.index.insertBefore(el.filter, el.filterNextSibling)
      window.removeEventListener('click', el.clickFullScreen, false)
    }
  },
}

export default fullScreen
