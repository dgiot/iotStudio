/**
 *
 * @type {{inserted: debounce.inserted}}
 * @url https://juejin.cn/post/6906028995133833230#heading-2
 */
const debounce = {
  inserted: function (el, binding) {
    let timer
    el.addEventListener('click', () => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        binding.value()
      }, 1000)
    })
  },
}

export default debounce
