/**
 *
 * @type {{bind(*, *): void}}
 * @url https://juejin.cn/post/6963840401899782175#heading-4
 */
const ellipsis = {
  bind(el, binding) {
    el.style.width = `${binding.arg || 100}px`
    el.style.whiteSpace = 'nowrap'
    el.style.overflow = 'hidden'
    el.style.textOverflow = 'ellipsis'
  },
}

export default ellipsis
