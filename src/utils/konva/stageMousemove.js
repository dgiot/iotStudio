import store from '@/store'

function getKonva(type) {
  return store.getters[`konva/${type}`]
}

function Setkonva(key, value) {
  return store.commit(`konva/${key}`, value)
}

let graphNow = getKonva('graphNow')
let graphColor = getKonva('graphColor')
let draw = getKonva('draw')
let pointStart = getKonva('pointStart')
let flag = getKonva('flag')

/**
 * 铅笔
 * @param points 点数组
 * @param stroke 颜色
 * @param strokeWidth 线粗细
 */
function drawPencil(points, stroke, strokeWidth) {
  const line = new Konva.Line({
    name: 'line',
    points: points,
    stroke: stroke,
    strokeWidth: strokeWidth,
    lineCap: 'round',
    lineJoin: 'round',
    tension: 0.5,
    draggable: true,
  })
  // layer.add(line)
  // layer.draw()

  line.on('mouseenter', function () {
    stage.container().style.cursor = 'move'
  })

  line.on('mouseleave', function () {
    stage.container().style.cursor = 'default'
  })

  line.on('dblclick', function () {
    // 双击删除自己
    this.remove()
    stage.find('Transformer').destroy()
    // layer.draw()
  })
  Setkonva('setGraphNow', line)
  return line
}

/**
 * 椭圆
 * @param x x坐标
 * @param y y坐标
 * @param rx x半径
 * @param ry y半径
 * @param stroke 描边颜色
 * @param strokeWidth 描边大小
 */
function drawEllipse(x, y, rx, ry, stroke, strokeWidth) {
  const ellipse = new Konva.Ellipse({
    name: 'ellipse',
    x: x,
    y: y,
    radiusX: rx,
    radiusY: ry,
    stroke: stroke,
    strokeWidth: strokeWidth,
    draggable: true,
  })
  // graphNow = ellipse
  // layer.add(ellipse)
  // layer.draw()

  ellipse.on('mouseenter', function () {
    stage.container().style.cursor = 'move'
  })

  ellipse.on('mouseleave', function () {
    stage.container().style.cursor = 'default'
  })

  ellipse.on('dblclick', function () {
    // 双击删除自己
    this.remove()
    stage.find('Transformer').destroy()
    layer.draw()
  })
  Setkonva('setGraphNow', ellipse)
  return ellipse
}

/**
 * 矩形
 * @param x x坐标
 * @param y y坐标
 * @param w 宽
 * @param h 高
 * @param c 颜色
 * @param sw 该值大于0-表示空心矩形（描边宽），等于0-表示实心矩形
 */
function drawRect(x, y, w, h, c, sw) {
  const rect = new Konva.Rect({
    name: 'rect',
    x: x,
    y: y,
    width: w,
    height: h,
    fill: sw === 0 ? c : null,
    stroke: sw > 0 ? c : null,
    strokeWidth: sw,
    opacity: sw === 0 ? 0.5 : 1,
    draggable: true,
  })
  // graphNow = rect
  // layer.add(rect)
  // layer.draw()

  rect.on('mouseenter', function () {
    stage.container().style.cursor = 'move'
  })

  rect.on('mouseleave', function () {
    stage.container().style.cursor = 'default'
  })

  rect.on('dblclick', function () {
    // 双击删除自己
    this.remove()
    stage.find('Transformer').destroy()
    // layer.draw()
  })
  Setkonva('setGraphNow', rect)
  return rect
}

/**
 * 输入文字
 * @param x x坐标
 * @param y y坐标
 * @param fill 文字颜色
 * @param fs 文字大小
 */
function drawText(x, y, fill, fs) {
  var text = new Konva.Text({
    text: '双击编辑文字',
    x: x,
    y: y,
    fill: fill,
    fontSize: fs,
    width: 300,
    draggable: true,
  })
  // graphNow = text
  // layer.add(text)
  // layer.draw()

  text.on('mouseenter', function () {
    stage.container().style.cursor = 'move'
  })

  text.on('mouseleave', function () {
    stage.container().style.cursor = 'default'
  })

  text.on('dblclick', function () {
    // 在画布上创建具有绝对位置的textarea

    // 首先，我们需要为textarea找到位置

    // 首先，让我们找到文本节点相对于舞台的位置:
    let textPosition = this.getAbsolutePosition()

    // 然后让我们在页面上找到stage容器的位置
    let stageBox = stage.container().getBoundingClientRect()

    // 因此textarea的位置将是上面位置的和
    let areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y,
    }

    // 创建textarea并设置它的样式
    let textarea = document.createElement('textarea')
    document.body.appendChild(textarea)

    let T = this.text()
    if (T === '双击编辑文字') {
      textarea.value = ''
      textarea.setAttribute('placeholder', '请输入文字')
    } else {
      textarea.value = T
    }

    textarea.style.position = 'absolute'
    textarea.style.top = areaPosition.y + 'px'
    textarea.style.left = areaPosition.x + 'px'
    textarea.style.background = 'none'
    textarea.style.border = '1px dashed #000'
    textarea.style.outline = 'none'
    textarea.style.color = this.fill()
    textarea.style.width = this.width()

    textarea.focus()

    this.setAttr('text', '')
    // layer.draw()

    // 确定输入的文字
    let confirm = (val) => {
      this.text(val ? val : '双击编辑文字')
      // layer.draw()
      // 隐藏在输入
      if (textarea) document.body.removeChild(textarea)
    }
    // 回车键
    let keydown = (e) => {
      if (e.keyCode === 13) {
        textarea.removeEventListener('blur', blur)
        confirm(textarea.value)
      }
    }
    // 鼠标失去焦点
    let blur = () => {
      textarea.removeEventListener('keydown', keydown)
      confirm(textarea.value)
    }

    textarea.addEventListener('keydown', keydown)
    textarea.addEventListener('blur', blur)
  })
  Setkonva('setGraphNow', text)
  return text
}

/**
 * stage鼠标移动
 * @param flag 是否可绘制
 * @param ev 传入的event对象
 */

export default function stageMousemove(flag, ev, layer) {
  console.log('stageMousemove', flag, ev)
  let res
  switch (flag) {
    case 'pencil':
      // 铅笔
      pointStart.push(ev.evt.offsetX, ev.evt.offsetY)
      res = layer.setAttrs({
        points: pointStart,
      })
      break
    case 'ellipse':
      // 椭圆
      res = layer.setAttrs({
        radiusX: Math.abs(ev.evt.offsetX - pointStart[0]),
        radiusY: Math.abs(ev.evt.offsetY - pointStart[1]),
      })
      break
    case 'rect':
    case 'rectH':
      res = layer.setAttrs({
        width: ev.evt.offsetX - pointStart[0],
        height: ev.evt.offsetY - pointStart[1],
      })
      break
    default:
      break
  }

  layer.add(res)
  layer.draw()
  return layer
}
