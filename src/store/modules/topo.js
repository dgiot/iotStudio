// * @Author: h7ml
// * @Date: 2021-10-20 18:22:35
// * @LastEditors: h7ml
// * @LastEditTime: 2021-10-20 18:22:35
// * @Description: 将konva封装到自己的js里 方便管理
// * @FilePath: src\utils\konva\core\index.js
// * @DocumentLink: https://konvajs.org/docs/index.html
// * @Demo http://39.97.252.98:3000
import konva from 'konva'
import addNodeEvent from '@/utils/konva/common'
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
  // if (!hash.includes('Topo') || $(`${attr}`).length === 0) return false
  console.log($(`${attr}`))
  console.table(json)
  const stage = Konva.Node.create(json, attr)
  const layer = stage.findOne('Layer')
  stage.find('Image')
    .forEach((node) => {
      const img = new Image()
      img.src = node.getAttr('src')
      img.onload = () => {
        node.image(img)
        // 只将背景图置底
        if (node.getAttr('id') == 'bg') node.moveToBottom()
        stage.batchDraw()
      }
    })
  stage.find('Label')
    .forEach((node) => {
      console.log(node, node.attrs)
      if (node.getAttr('name') == 'thing') {
        const nodeTags = node.getChildren()
        nodeTags.forEach((tag) => {
          const event = tag.getAttr('name')
          if (event) {
            addNodeEvent(addNodeEvent(node.getAttr('name'), event, node))
          }
        })
        console.log()
      }

      console.log('node..', node, Konva)
    })
  const konvaDom = new Konva.Stage({
    container: attr,
    // width: setattrs.width ? setattrs.width : konvaAttr.width,
    // height: setattrs.height ? setattrs.height : konvaAttr.height,
    width: 1200,
    height: 700,
  })
  topo.json = stage
  topo.layer = layer
  topo.stage = konvaDom
  // 辅助线
  console.log('将传入的json添加到layer里', json)
  topo.stage.add(topo.layer)

}

export function createdText(config) {
  return {}
}

// window.onload = isKonvaDom('kevCurrent')
function selectBg() {
  const bg = topo.layer.findOne('#bg')
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
}

function createPathDom(type, config) {
  const layer = topo.layer
  return layer
}

const state = () => ({
  Sale: topo.konvaAttr.scale ? topo.konvaAttr.scale : 300,
  konva: topo.konva,
  initKonva: {},
  // 当前操作的组态
  activeShape: {},
  //  添加的图元
  topoPath: createPathDom(),
})
const getters = {
  Sale: (state) => state.Sale,
  activeShape: (state) => state.activeShape,
  createdText: (config) => createdText(config),
}
const mutations = {
  initKonva(state, args) {
    console.log('vuex', state, args.id, args.data)
    //  初始化konva
    state.initKonva = createKonvaDom(args.id, args.data)
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
    state.Sale = size
    console.error('缩放大小', topo.konvaAttr.scale)
    console.table('topo', topo)
  },
  createdText(state, config) {
    //
    state.createdText = config
    console.log('createdText')
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
  initKonva({ commit }, args) {
    commit('initKonva', args)
  },
  createdText({ commit }, config) {
    commit('createdText', config)
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
