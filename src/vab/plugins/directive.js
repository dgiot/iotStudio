/*
 * @Author: h7ml
 * @Date: 2021-03-17 11:39:20
 * @LastEditTime: 2021-03-17 11:39:59
 * @LastEditors: h7ml
 * @FilePath: \dgiot_dashboard\src\vab\plugins\directive.js
 * @Description:
 */
import { hasAccess } from '@/utils/hasAccess'

/**
 * @description 自定义指令v-permissions
 */
Vue.directive('permissions', {
  inserted(el, binding) {
    let { value } = binding
    if (value) {
      if (!hasAccess(value)) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  },
})

/**
 * @description 自定义指令v-drag-dialog
 */
Vue.directive('drag-dialog', {
  inserted(el, binding, vnode) {
    const dialogHeaderEl = el.querySelector('.el-dialog__header')
    const dragDom = el.querySelector('.el-dialog')
    dialogHeaderEl.style.cssText += ';cursor:move;'
    dragDom.style.cssText += ';top:0px;'

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const getStyle = (function () {
      if (window.document.currentStyle) {
        return (dom, attr) => dom.currentStyle[attr]
      } else {
        return (dom, attr) => getComputedStyle(dom, false)[attr]
      }
    })()

    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft
      const disY = e.clientY - dialogHeaderEl.offsetTop

      const dragDomWidth = dragDom.offsetWidth
      const dragDomHeight = dragDom.offsetHeight

      const screenWidth = document.body.clientWidth
      const screenHeight = document.body.clientHeight

      const minDragDomLeft = dragDom.offsetLeft
      const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth

      const minDragDomTop = dragDom.offsetTop
      const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomHeight

      // 获取到的值带px 正则匹配替换
      let styL = getStyle(dragDom, 'left')
      let styT = getStyle(dragDom, 'top')

      if (styL.includes('%')) {
        styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100)
        styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100)
      } else {
        styL = +styL.replace(/\px/g, '')
        styT = +styT.replace(/\px/g, '')
      }

      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离
        let left = e.clientX - disX
        let top = e.clientY - disY

        // 边界处理
        if (-left > minDragDomLeft) {
          left = -minDragDomLeft
        } else if (left > maxDragDomLeft) {
          left = maxDragDomLeft
        }

        if (-top > minDragDomTop) {
          top = -minDragDomTop
        } else if (top > maxDragDomTop) {
          top = maxDragDomTop
        }

        // 移动当前元素
        dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`

        // emit onDrag event
        // vnode.child.$emit('dragDialog')
      }

      document.onmouseup = function (e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  },
})

/**
 * @description 自定义指令v-drag
 */
Vue.directive('drag', {
  bind(el, binding, vNode) {
    if (
      el.querySelector('.el-dialog__header') &&
      el.querySelector('.el-dialog')
    ) {
      const dialogHeaderEl = el.querySelector('.el-dialog__header')
      const dragDom = el.querySelector('.el-dialog')
      dialogHeaderEl.style.cssText += ';cursor:move;'
      dragDom.style.cssText += ';top:0;'

      const getStyle = (function () {
        if (window.document.currentStyle) {
          return (dom, attr) => dom.currentStyle[attr]
        } else {
          return (dom, attr) => getComputedStyle(dom, null)[attr]
        }
      })()

      dialogHeaderEl.onmousedown = (e) => {
        const disX = e.clientX - dialogHeaderEl.offsetLeft
        const disY = e.clientY - dialogHeaderEl.offsetTop

        const dragDomWidth = dragDom.offsetWidth
        const dragDomHeight = dragDom.offsetHeight

        const screenWidth = document.body.clientWidth
        const screenHeight = document.body.clientHeight

        const minDragDomLeft = dragDom.offsetLeft
        const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth

        const minDragDomTop = dragDom.offsetTop
        const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomHeight

        let styL = getStyle(dragDom, 'left')
        let styT = getStyle(dragDom, 'top')

        if (styL.includes('%')) {
          styL = +document.body.clientWidth * (+styL / 100)
          styT = +document.body.clientHeight * (+styT / 100)
        } else {
          styL = +styL.slice(0, -2)
          styT = +styT.slice(0, -2)
        }

        document.onmousemove = function (e) {
          let left = e.clientX - disX
          let top = e.clientY - disY

          if (-left > minDragDomLeft) {
            left = -minDragDomLeft
          } else if (left > maxDragDomLeft) {
            left = maxDragDomLeft
          }

          if (-top > minDragDomTop) {
            top = -minDragDomTop
          } else if (top > maxDragDomTop) {
            top = maxDragDomTop
          }

          dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`

          vNode.child.$emit('drag-dialog')
        }

        document.onmouseup = function () {
          document.onmousemove = null
          document.onmouseup = null
        }
      }
    }
  },
})

/**
 * @description 自定义指令v-copy
 */
Vue.directive('copy', {
  bind(el, { value }) {
    el.$value = value // 用一个全局属性来存传进来的值，因为这个值在别的钩子函数里还会用到
    el.handler = () => {
      if (!el.$value) {
        // 值为空的时候，给出提示，我这里的提示是用的 ant-design-vue 的提示，你们随意
        console.log('无复制内容')
        return
      }
      // 动态创建 textarea 标签
      const textarea = document.createElement('textarea')
      // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
      textarea.readOnly = 'readonly'
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      // 将要 copy 的值赋给 textarea 标签的 value 属性
      textarea.value = el.$value
      // 将 textarea 插入到 body 中
      document.body.appendChild(textarea)
      // 选中值并复制
      textarea.select()
      textarea.setSelectionRange(0, textarea.value.length)
      const result = document.execCommand('Copy')
      if (result) {
        console.log('复制成功')
      }
      document.body.removeChild(textarea)
    }
    // 绑定点击事件，就是所谓的一键 copy 啦
    el.addEventListener('click', el.handler)
  },
  // 当传进来的值更新的时候触发
  componentUpdated(el, { value }) {
    el.$value = value
  },
  // 指令与元素解绑的时候，移除事件绑定
  unbind(el) {
    el.removeEventListener('click', el.handler)
  },
})
