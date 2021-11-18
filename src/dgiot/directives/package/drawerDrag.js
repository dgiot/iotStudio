/**
 *
 * @type {{bind(*, *, *, *): void}}
 */
const drawerDrag = {
  bind(el, binding, vnode, oldVnode) {
    const minWidth = 400
    const dragDom = el.querySelector('.el-drawer')
    dragDom.style.overflow = 'auto'

    const resizeElL = document.createElement('div')
    const img = new Image(24, 38)
    img.src = require('../../../../public/assets/images/platform/assets/login_images/stretch.png')
    dragDom.appendChild(img)
    dragDom.appendChild(resizeElL)
    resizeElL.style.cursor = 'w-resize'
    resizeElL.style.position = 'absolute'
    resizeElL.style.height = '100%'
    resizeElL.style.width = '10px'
    resizeElL.style.left = '0px'
    resizeElL.style.top = '0px'
    img.style.position = 'absolute'
    img.style.left = '-12px'
    img.style.top = '50%'

    resizeElL.onmousedown = (e) => {
      const elW = dragDom.clientWidth
      const EloffsetLeft = dragDom.offsetLeft
      const clientX = e.clientX
      document.onmousemove = function (e) {
        e.preventDefault()
        // 左侧鼠标拖拽位置
        if (clientX > EloffsetLeft && clientX < EloffsetLeft + 10) {
          // 往左拖拽
          if (clientX > e.clientX) {
            dragDom.style.width = elW + (clientX - e.clientX) + 'px'
          }
          // 往右拖拽
          if (clientX < e.clientX) {
            if (dragDom.clientWidth >= minWidth) {
              dragDom.style.width = elW - (e.clientX - clientX) + 'px'
            }
          }
        }
      }
      // 拉伸结束
      document.onmouseup = function (e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  },
}
export default drawerDrag
