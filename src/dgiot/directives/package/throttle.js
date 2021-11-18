/**
 *
 * @type {{bind: throttle.bind, unbind: throttle.unbind}}
 * @url https://juejin.cn/post/6953879183600648229#heading-2
 */
const throttle = {
  bind: function (el, { value: { fn, time } }) {
    if (typeof fn !== 'function') return
    el._flag = true //开关默认为开
    el._timer = null
    el.handler = function () {
      if (!el._flag) return
      //执行之后开关关闭
      el._flag && fn()
      el._flag = false
      if (el._timer !== null) {
        clearTimeout(el._timer)
        el._timer = null
      }
      el._timer = setTimeout(() => {
        el._flag = true //三秒后开关开启
      }, time)
    }
    el.addEventListener('click', el.handler)
  },
  unbind: function (el, binding) {
    el.removeEventListener('click', el.handler)
  },
}

export default throttle
