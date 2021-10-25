// * @Author: h7ml
// * @Date: 2021-10-20 18:22:35
// * @LastEditors: h7ml
// * @LastEditTime: 2021-10-20 18:22:35
// * @Description: 将konva封装到自己的js里 方便管理
// * @FilePath: src\utils\konva\core\index.js
// * @DocumentLink: https://konvajs.org/docs/index.html
// * @Demo http://39.97.252.98:3000
import konva from 'konva'
import { uuid } from '@/utils'

// konva画布默认参数
let konvaAttr = {
  width: 1200, // 布局宽度
  height: 700, // 布局宽度
  scale: 100, // 缩放比例
}
// EventKey 操作konva对象的属性
let EventKey = 'clickNode'

// 创建konva
/**
 *
 * @param attr
 * @param json
 */
export function createKonvaDom(attr, json, setattrs = konvaAttr) {
  const { hash } = location
  console.log('当前路由hash', hash)
  if (!hash.includes('Topo')) return false
  console.log(setattrs)
  const konvaDom = new Konva.Stage({
    container: attr,
    width: setattrs.width ? setattrs.width : konvaAttr.width,
    height: setattrs.height ? setattrs.height : konvaAttr.height,
  })
  topo.layer = new Konva.Layer({})
  topo.stage = konvaDom
  // 设置背景图片 不可被拖动 不可被点击
  const imageObj = new Image()
  imageObj.onload = function () {
    const bgCanvas = new Konva.Image({
      id: 'bg',
      image: imageObj,
      width: setattrs.width ? setattrs.width : konvaAttr.width,
      height: setattrs.height ? setattrs.height : konvaAttr.height,
    })
    // add the shape to the layer
    topo.layer.add(bgCanvas)
  }
  imageObj.src = localStorage.getItem('konvaBg') ? localStorage.getItem('konvaBg') : 'https://konvajs.org/assets/darth-vader.jpg'
  // 图片置于底层
  //https://github.com/jiechud/fast-image-editor/blob/3d1feb9e8d1a809f79bd57fc85bf8568c5ba99e8/src/core/Canvas.ts#L178
  setTimeout(() => {
    const bgNode = topo.layer.findOne('#bg')
    // https://konvajs.org/api/Konva.Node.html#setAttrs
    console.log(bgNode.attrs, 'bgNode')
    bgNode.moveToBottom() // TODO: 放到最底层
  }, 800)
  const Text = new Konva.Text({
    x: 20,
    y: 60,
    text:
      '双击编辑文字',
    fontSize: 18,
    fontFamily: 'Calibri',
    fill: '#555',
    width: 300,
    padding: 20,
    draggable: true,
    align: 'center',
  })
  Text.scale({
    x: setattrs.scaleX ? setattrs.scaleX : 1,
    y: setattrs.scaleY ? setattrs.scaleY : 1,
  })
  topo.layer.add(Text)
  // 辅助线
  topo.layer.on('dblclick', (e) => {
    console.log('双击添加辅助线', e)
    // 创建图形选框事件
    const tr = new Konva.Transformer({
      borderStroke: '#000', // 虚线颜色
      borderStrokeWidth: 1, //虚线大小
      borderDash: [5], // 虚线间距
      keepRatio: false, // 不等比缩放
      id: `Transformer_${uuid(6)}`,
    })
    topo.layer.add(tr)
    tr.attachTo(e.target)
    topo.layer.draw()
  })
  topo.layer.on('click', (e) => {
    console.log('e', e)
    // create textarea and style it
    // 在画布上创建具有绝对位置的textarea

    // 首先，我们需要为textarea找到位置

    // 首先，让我们找到文本节点相对于舞台的位置:
    let textPosition = topo.layer.getAbsolutePosition()
    console.log('textPosition', textPosition)
    // 然后让我们在页面上找到stage容器的位置
    let stageBox = topo.stage.container()
      .getBoundingClientRect()

    // 因此textarea的位置将是上面位置的和
    console.log('eeeeeeeeeeeeeeeee', e)
    let areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y,
      color: e.target.attrs.fill,
      text: e.target.attrs.text,
    }

    // 创建textarea并设置它的样式
    const textarea = document.createElement('textarea')
    document.body.appendChild(textarea)
    let T = '双击编辑文字'
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
    textarea.style.color = areaPosition.color
    textarea.focus()

    this.setAttr('text', '')
    Layer.draw()

    // 确定输入的文字
    let confirm = (val) => {
      this.text(val ? val : '双击编辑文字')
      Layer.draw()
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

// topo.layer.draw()
  })
  topo.layer.on('mousedown', (e) => {
    console.log('e mousedown', e)
    e.draggable = true
  })
  topo.layer.on('dragend', (e) => {
    console.log('e dragend', e)
  })
  const Rect = new Konva.Rect({
    x: 20,
    y: 20,
    width: 100,
    height: 50,
    fill: 'green',
    stroke: 'black',
    strokeWidth: 4,
    draggable: true,
    id: 'greenTest',
  })
  Rect.scale({
    x: setattrs.scaleX ? setattrs.scaleX : 1,
    y: setattrs.scaleY ? setattrs.scaleY : 1,
  })
  topo.layer.add(Rect)
// 重绘
  topo.layer.draw()
  console.log('将传入的json添加到layer里', json)
  topo.stage.add(topo.layer)
  console.log('节点存在', $(`#${attr}`)[0], konvaDom)
  console.log(topo.layer.toJSON())
  console.log(topo.stage.toJSON())
}

// window.onload = isKonvaDom('kevCurrent')
function selectBg() {
  const bg = topo.layer.find('#bg')
  if (bg.length > 0) {
    console.log(bg[0])
    // this.emit('clickNode', bg[0].attrs)
  }
}

const topo = {
  konva,
  konvaAttr: konvaAttr,
  activeShape: {},
  stage: konva.stage,
  layer: konva.layer,
  Transformer: konva.Transformer,
  data: [],
  listener: function () {
    return 'listener res'
  },
}
window.topo = topo

function updateCanvasAttr(scale) {
  const {
    width,
    height,
  } = topo.konvaAttr
  const newWidth = scale / 100
  const newHeight = scale / 100
  const canvasAttr = {
    width: width,
    height: height,
    scale: scale,
  }
  topo.konvaAttr = canvasAttr
  topo.stage.setAttrs({
    width: newWidth,
    height: newHeight,
    scaleX: scale,
    scaleY: scale,
  })
  //
  console.log(topo.stage.setAttrs({
    width: newWidth,
    height: newHeight,
    scaleX: scale,
    scaleY: scale,
  }))
  // 重绘
  topo.layer.draw()
}

const state = () => ({
  Sale: topo.konvaAttr.scale ? topo.konvaAttr.scale : 300,
  konva: topo.konva,
  initKonva: createKonvaDom('dgiot', {}),
  // 当前操作的组态
  activeShape: {},
})
const getters = {
  Sale: (state) => state.Sale,
  activeShape: (state) => state.activeShape,
}
const mutations = {
  initKonva(state, id, json) {
    //  初始化konva
    state.initKonva = createKonvaDom(id, json)
  },
  setSale(state, size) {
    topo.konvaAttr.scale = size
    const {
      width,
      height,
    } = topo.konvaAttr
    const newWidth = width * size / 100
    const newHeight = width * size / 100
    const canvasAttr = {
      width: width,
      height: height,
      scale: size,
    }
    topo.konvaAttr = canvasAttr
    createKonvaDom('kevCurrent', {}, {
      width: newWidth,
      height: newHeight,
      scaleX: size * 0.01,
      scaleY: size * 0.01,
    })
    // 重绘
    topo.layer.draw()
    state.Sale = size
    console.error('缩放大小', topo.konvaAttr.scale)
    console.table('topo', topo)
  },
  setKonva(state, attr) {
    state.konva = attr
    topo.konva = attr
  },
  activeShape(state, shape) {
    state.activeShape = shape
    topo.activeShape = shape
  },
}
const actions = {
  initKonva({ commit }, id, data) {
    commit('initKonva', id, data)
  },
  setSale({ commit }, size) {
    commit('setSale', size)
  },
  setKonva({ commit }, attr) {
    commit('setSale', attr)
  },
}
export default {
  state,
  getters,
  mutations,
  actions,
  topo,
}
