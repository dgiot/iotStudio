/**
 *
 * @param {*} drag
 * @param {*} wrap
 */
function getCss(ele, prop) {
  return parseInt(window.getComputedStyle(ele)[prop])
}

export default function dragBox(drag, wrap) {
  console.log(drag, wrap)
  var initX,
    initY,
    dragable = false,
    wrapLeft = getCss(wrap, 'left'),
    wrapRight = getCss(wrap, 'top')

  drag.addEventListener(
    'mousedown',
    function (e) {
      dragable = true
      initX = e.clientX
      initY = e.clientY
    },
    false,
  )

  document.addEventListener('mousemove', function (e) {
    if (dragable === true) {
      var nowX = e.clientX,
        nowY = e.clientY,
        disX = nowX - initX,
        disY = nowY - initY
      wrap.style.left = wrapLeft + disX + 'px'
      wrap.style.top = wrapRight + disY + 'px'
    }
  })

  drag.addEventListener(
    'mouseup',
    function (e) {
      dragable = false
      wrapLeft = getCss(wrap, 'left')
      wrapRight = getCss(wrap, 'top')
    },
    false,
  )
}
