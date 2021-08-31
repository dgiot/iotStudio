/**
 *
 * @type {{bind(*, *, *): void}}
 */
var left,
  top,
  disX,
  disY,
  isDraggable = false
const svgDrag = {
  bind: function (el, bind) {
    el.$value = bind.value
    el.onmousedown = (e) => {
      // console.log(el, bind)
      isDraggable = false
      //算出鼠标相对元素的位置
      disX = e.clientX - el.offsetLeft
      disY = e.clientY - el.offsetTop
      // 给点击的元素添加拖动属性
      // https://www.w3school.com.cn/html5/att_global_draggable.asp
      el.setAttribute('draggable', true)
      el.onmousemove = (e) => {
        isDraggable = true
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        left = e.clientX - disX
        top = e.clientY - disY

        //绑定元素位置到positionX和positionY上面
        // this.positionX = top
        // this.positionY = left
        //移动当前元素
        el.style.left = left + 'px'
        el.style.top = top + 'px'
      }
      el.onmouseleave = (e) => {
        if (isDraggable) el.$value.callback(e)
        isDraggable = false
      }
      el.onmouseup = (e) => {
        isDraggable = false
        document.onmouseleave = null
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  },
  // 当传进来的值更新的时候触发
  componentUpdated: function (el, binding) {
    isDraggable = false
    el.$value = binding.value
  },
  // 指令与元素解绑的时候，移除事件绑定
  unbind(el) {
    isDraggable = false
    document.onmouseleave = null
    document.onmousemove = null
    document.onmouseup = null
  },
}
export default svgDrag
