/**
 *
 * @type {{bind(*, *): void}}
 * @url https://juejin.cn/post/6963840401899782175#heading-0
 */
const expandClick = {
  bind(el, binding) {
    const s = document.styleSheets[document.styleSheets.length - 1]
    const DEFAULT = -10 // 默认向外扩展10px
    const [top, right, bottom, left] =
    (binding.expression && binding.expression.split(',')) || []
    const ruleStr = `content:"";position:absolute;top:-${
      top || DEFAULT
    }px;bottom:-${bottom || DEFAULT}px;right:-${right || DEFAULT}px;left:-${
      left || DEFAULT
    }px;`
    const classNameList = el.className.split(' ')
    el.className = classNameList.includes('expand_click_range')
      ? classNameList.join(' ')
      : [...classNameList, 'expand_click_range'].join(' ')
    el.style.position = el.style.position || 'relative'
    if (s.insertRule) {
      s.insertRule(
        '.expand_click_range::before' + '{' + ruleStr + '}',
        s.cssRules.length,
      )
    } else {
      /* IE */
      s.addRule('.expand_click_range::before', ruleStr, -1)
    }
  },
}

export default expandClick
