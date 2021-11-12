const SUCCESS = '#72c140'
const ERROR = '#ed5b56'
const WARNING = '#f0af41'
const INFO = '#4091f7'
const HEIGHT = 20
let flag = false
/**
 *
 * @type {{update(*, *, *): void}}
 * @url https://juejin.cn/post/6963840401899782175#heading-7
 */
const badge = {
  update(el, binding, vnode) {
    const {
      modifiers,
      value,
    } = binding
    const modifiersKey = Object.keys(modifiers)
    let isDot = modifiersKey.includes('dot')
    let backgroundColor = ''
    if (modifiersKey.includes('success')) {
      backgroundColor = SUCCESS
    } else if (modifiersKey.includes('warning')) {
      backgroundColor = WARNING
    } else if (modifiersKey.includes('info')) {
      backgroundColor = INFO
    } else {
      backgroundColor = ERROR
    }

    const targetTemplate = isDot
      ? `<div style="position:absolute;top:-5px;right:-5px;height:10px;width:10px;border-radius:50%;background:${backgroundColor}"></div>`
      : `<div style="background:${backgroundColor};position:absolute;top:-${
        HEIGHT / 2
      }px;right:-${
        HEIGHT / 2
      }px;height:${HEIGHT}px;min-width:${HEIGHT}px;border-radius:${
        HEIGHT / 2
      }px;text-align:center;line-height:${HEIGHT}px;color:#fff;padding:0 5px;">${value}</div>`

    el.style.position = el.style.position || 'relative'
    const badge = Vue.extend({
      template: targetTemplate,
    })
    const component = new badge().$mount().$el
    if (flag) {
      el.removeChild(el.lastChild)
    }
    el.appendChild(component)
    flag = true
  },
}
export default badge
