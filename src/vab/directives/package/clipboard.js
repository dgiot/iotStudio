/**
 * @url https://github.com/Ray-56/vue-element-utils#%E5%89%AA%E5%88%87%E6%9D%BFclipboard
 * @type {{addHandler(*, *=, *=): void, removeHandler(*, *=, *=): void}}
 */
const eventUtil = {
  addHandler(element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false)
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, handler)
    } else {
      element['on' + type] = handler
    }
  },
  removeHandler(element, type, handler) {
    if (element.removeEventListener) {
      element.removeEventListener(type, handler, false)
    } else if (element.detachEvent) {
      element.detachEvent('on' + type, handler)
    } else {
      element['on' + type] = null
    }
  },
}

function clipboard(text) {
  return new Promise((reslove, reject) => {
    const input = document.createElement('input')
    input.setAttribute('readonly', 'readonly')
    input.setAttribute('value', text)
    document.body.appendChild(input)
    input.select()
    input.setSelectionRange(0, text.length)
    if (document.execCommand('copy')) {
      document.execCommand('copy')
      reslove(text)
    } else {
      reject(new Error('复制失败'))
    }
    document.body.removeChild(input)
  })
}
const $clipboard = clipboard

export { $clipboard }

export default {
  bind: function (el, binding, vnode) {
    if (binding.arg === 'success') {
      el._clipboard_success = binding.value
    } else if (binding.arg === 'error') {
      el._clipboard_error = binding.value
    } else {
      el._clipboard_message = binding.value
      eventUtil.addHandler(el, 'click', () => {
        // log(el._clipboard_message);
        clipboard(el._clipboard_message)
          .then((msg) => {
            el._clipboard_success(msg)
          })
          .catch((err) => {
            el._clipboard_error(err)
          })
      })
    }
  },
  update: function (el, binding) {
    if (binding.arg === 'success') {
      el._clipboard_success = binding.value
    } else if (binding.arg === 'error') {
      el._clipboard_error = binding.value
    } else {
      el._clipboard_message = binding.value
    }
  },
  unbind: function (el, binding) {
    if (binding.arg === 'success') {
      delete el._clipboard_success
    } else if (binding.arg === 'error') {
      delete el._clipboard_error
    } else {
      delete el._clipboard_message
      eventUtil.removeHandler(el, 'click')
    }
  },
}
