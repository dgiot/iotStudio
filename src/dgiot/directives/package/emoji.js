/**
 *
 * @param parent
 * @param type
 * @return {*}
 */
let findEle = (parent, type) => {
  return parent.tagName.toLowerCase() === type
    ? parent
    : parent.querySelector(type)
}
/**
 *
 * @param el
 * @param type
 */
const trigger = (el, type) => {
  const e = document.createEvent('HTMLEvents')
  e.initEvent(type, true, true)
  el.dispatchEvent(e)
}

/**
 *
 * @type {{bind: emoji.bind, unbind: emoji.unbind}}
 * @url https://juejin.cn/post/6906028995133833230#heading-3
 */
const emoji = {
  bind: function (el, binding, vnode) {
    // 正则规则可根据需求自定义
    var regRule =
      /[^\u4E00-\u9FA5|\d|\a-zA-Z|\r\n\s,.?!，。？！…—&$=()-+/*{}[\]]|\s/g
    let $inp = findEle(el, 'input')
    el.$inp = $inp
    $inp.handle = function () {
      let val = $inp.value
      $inp.value = val.replace(regRule, '')

      trigger($inp, 'input')
    }
    $inp.addEventListener('keyup', $inp.handle)
  },
  unbind: function (el) {
    el.$inp.removeEventListener('keyup', el.$inp.handle)
  },
}

export default emoji
