/**
 *
 * @type {{bind(*, *, *): void}}
 */
var left, top
const svgDrag = {
  bind: function (el, binding) {
    el.onmousedown = (e) => {
      console.log(binding, 'binding')
      // 给点击的元素添加拖动属性
      // https://www.w3school.com.cn/html5/att_global_draggable.asp
      el.setAttribute('draggable', true)
      //算出鼠标相对元素的位置
      let disX = e.clientX - el.offsetLeft
      let disY = e.clientY - el.offsetTop

      document.onmousemove = (e) => {
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
      document.onmouseover = () => {
        console.log(top, left)
      }
      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
    if (binding.arg === 'move') el._svgDrag_move = binding.value
    else el._svgDrag_end = binding.value
  },
  update: function (el, binding) {
    if (binding.arg === 'move') el._svgDrag_move = binding.value
    else el._svgDrag_end = binding.value
  },
  unbind: function (el, binding) {
    if (binding.arg === 'move') delete el._svgDrag_move
    else delete el._svgDrag_end
  },
}
export default svgDrag
