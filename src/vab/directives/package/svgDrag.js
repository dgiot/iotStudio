/**
 *
 * @type {{bind(*, *, *): void}}
 */
const svgDrag = {
  bind: function (el) {
    el.onmousedown = (e) => {
      //算出鼠标相对元素的位置
      let disX = e.clientX - el.offsetLeft
      let disY = e.clientY - el.offsetTop

      document.onmousemove = (e) => {
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = e.clientX - disX
        let top = e.clientY - disY

        //绑定元素位置到positionX和positionY上面
        // this.positionX = top
        // this.positionY = left
        console.log(top, left)
        //移动当前元素
        el.style.left = left + 'px'
        el.style.top = top + 'px'
      }
      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  },
}
export default svgDrag
