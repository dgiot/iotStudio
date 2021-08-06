/**
 *
 * @type {{bind(*, *): void}}
 * @url https://juejin.cn/post/6963840401899782175#heading-1
 */
const copy = {
  bind(el, binding) {
    // 双击触发复制
    if (binding.modifiers.dblclick) {
      el.addEventListener('dblclick', () => handleClick(el.innerText))
      el.style.cursor = 'copy'
    }
    // 点击icon触发复制
    else if (binding.modifiers.icon) {
      if (el.hasIcon) return
      const iconElement = document.createElement('i')
      iconElement.setAttribute('class', 'el-icon-document-copy')
      iconElement.setAttribute('style', 'margin-left:5px')
      el.appendChild(iconElement)
      el.hasIcon = true
      iconElement.addEventListener('click', () => handleClick(el.innerText))
      iconElement.style.cursor = 'copy'
    }
    // 单击触发复制
    else {
      el.addEventListener('click', () => handleClick(el.innerText))
      el.style.cursor = 'copy'
    }
  },
}

/**
 *
 * @param text
 */
function handleClick(text) {
  // 创建元素
  if (!document.getElementById('copyTarget')) {
    const copyTarget = document.createElement('input')
    copyTarget.setAttribute(
      'style',
      'position:fixed;top:0;left:0;opacity:0;z-index:-1000;'
    )
    copyTarget.setAttribute('id', 'copyTarget')
    document.body.appendChild(copyTarget)
  }

  // 复制内容
  const input = document.getElementById('copyTarget')
  input.value = text
  input.select()
  document.execCommand('copy')
  // alert('复制成功')
}

export default copy
