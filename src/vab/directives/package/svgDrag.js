/**
 *
 * @type {{bind(*, *, *): void}}
 */
var left, top, disX, disY
const svgDrag = {
  bind: function (el, binding, vnode) {
    const { arg, expression } = binding
    function clickHandler(e) {
      // 这里判断点击的元素是否是本身，是本身，则返回
      if (el.contains(e.target)) {
        return false
      }
      // 判断指令中是否绑定了函数
      if (expression) {
        // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
        // binding.value(e);
        // 这里进行了修改， 使用arg 传递函数名称， 使用value 传递 变量值
        // console.log("接收到 的arg为: " + funcName)
        // console.log("接收到的 value 为: " +  binding.value)

        let that = vnode.context
        that[arg](e)
      }
    }

    el.onmousedown = (e) => {
      // 给点击的元素添加拖动属性
      // https://www.w3school.com.cn/html5/att_global_draggable.asp
      el.setAttribute('draggable', true)
      //算出鼠标相对元素的位置
      disX = e.clientX - el.offsetLeft
      disY = e.clientY - el.offsetTop

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
      document.onmouseover = (e) => {
        disX = e.clientX - el.offsetLeft
        disY = e.clientY - el.offsetTop
        left = e.clientX - disX
        top = e.clientY - disY
      }
      document.onmouseup = (e) => {
        disX = e.clientX - el.offsetLeft
        disY = e.clientY - el.offsetTop
        left = e.clientX - disX
        top = e.clientY - disY
        document.onmousemove = null
        document.onmouseup = null
      }
      el.__vuesvgDrag__ = clickHandler({ left: left, top: top })
      document.addEventListener('click', clickHandler)
      document.addEventListener(`${arg}`, clickHandler)
    }
    el.onmousedown = (e) => {
      // 给点击的元素添加拖动属性
      // https://www.w3school.com.cn/html5/att_global_draggable.asp
      el.setAttribute('draggable', true)
      //算出鼠标相对元素的位置
      disX = e.clientX - el.offsetLeft
      disY = e.clientY - el.offsetTop

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
      document.onmouseover = (e) => {
        disX = e.clientX - el.offsetLeft
        disY = e.clientY - el.offsetTop
        left = e.clientX - disX
        top = e.clientY - disY
      }
      document.onmouseup = (e) => {
        disX = e.clientX - el.offsetLeft
        disY = e.clientY - el.offsetTop
        left = e.clientX - disX
        top = e.clientY - disY
        document.onmousemove = null
        document.onmouseup = null
      }
      el.__vuesvgDrag__ = clickHandler({ left: left, top: top })
      document.addEventListener('click', clickHandler)
      document.addEventListener(`${arg}`, clickHandler)
    }
    el.onmousedown = (e) => {
      // 给点击的元素添加拖动属性
      // https://www.w3school.com.cn/html5/att_global_draggable.asp
      el.setAttribute('draggable', true)
      //算出鼠标相对元素的位置
      disX = e.clientX - el.offsetLeft
      disY = e.clientY - el.offsetTop

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
      document.onmouseover = (e) => {
        disX = e.clientX - el.offsetLeft
        disY = e.clientY - el.offsetTop
        left = e.clientX - disX
        top = e.clientY - disY
      }
      document.onmouseup = (e) => {
        disX = e.clientX - el.offsetLeft
        disY = e.clientY - el.offsetTop
        left = e.clientX - disX
        top = e.clientY - disY
        document.onmousemove = null
        document.onmouseup = null
      }
      el.__vuesvgDrag__ = clickHandler({ left: left, top: top })
      document.addEventListener('click', clickHandler)
      document.addEventListener(`${arg}`, clickHandler)
    }
  },
  update: function (el, binding) {},
  unbind: function (el, { arg }) {
    delete el.__vuesvgDrag__
    if (arg) delete el[`__vuesvgDrag__`]
  },
}
export default svgDrag
