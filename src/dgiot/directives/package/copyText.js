/**
 *
 * @type {{bind(*, *): void}}
 * @url https://blog.csdn.net/CSDN_sadan/article/details/115513254
 */
const copyText = {
  bind(el, { value }) {
    el.$value = value
    el.handler = () => {
      el.style.position = 'relative'
      if (!el.$value) {
        // 值为空的时候，给出提示
        Vue.prototype.$baseMessage(
          Vue.prototype.$translateTitle('alert.Copy error') + `${el.$value}`,
          'error',
          false,
          'dgiot-hey-message-error'
        )
        return
      }
      // 动态创建 textarea 标签
      const textarea = document.createElement('textarea')
      // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
      textarea.readOnly = 'readonly'
      textarea.style.position = 'absolute'
      textarea.style.top = '0px'
      textarea.style.left = '-9999px'
      textarea.style.zIndex = '-9999'
      // 将要 copy 的值赋给 textarea 标签的 value 属性
      textarea.value = el.$value
      // 将 textarea 插入到 el 中
      el.appendChild(textarea)
      // 兼容IOS 没有 select() 方法
      if (textarea.createTextRange) {
        textarea.select() // 选中值并复制
      } else {
        textarea.setSelectionRange(0, el.$value.length)
        textarea.focus()
      }
      const result = document.execCommand('Copy')
      if (result) {
        Vue.prototype.$baseMessage(
          Vue.prototype.$translateTitle('alert.Copy successfully') +
            `${el.$value}`,
          'success',
          false,
          'dgiot-hey-message-success'
        )
      }
      el.removeChild(textarea)
    }
    el.addEventListener('click', el.handler) // 绑定点击事件
  },
  // 当传进来的值更新的时候触发
  componentUpdated(el, { value }) {
    el.$value = value
  },
  // 指令与元素解绑的时候，移除事件绑定
  unbind(el) {
    el.removeEventListener('click', el.handler)
  },
}

export default copyText
