/**
 *
 * @type {{inserted: debounce.inserted}}
 * @url https://juejin.cn/post/6906028995133833230#heading-2
 * @date 2021-8-26 17:25:38
 * @description Vue function anti-shake request command
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
