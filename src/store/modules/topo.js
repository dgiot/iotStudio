// * @Author: h7ml
// * @Date: 2021-10-20 18:22:35
// * @LastEditors: h7ml
// * @LastEditTime: 2021-10-20 18:22:35
// * @Description: 将konva封装到自己的js里 方便管理
// * @FilePath: src\utils\konva\core\index.js
// * @DocumentLink: https://konvajs.org/docs/index.html
// * @Demo http://39.97.252.98:3000
import konva from 'konva'
// konva画布默认参数
let konvaAttr = {
  width: 1200, // 布局宽度
  height: 700, // 布局宽度
  scale: 100, // 缩放比例
}
var topo = {
  konva,
  konvaAttr: konvaAttr,
  activeShape: {},
  stage: konva.stage,
  layer: konva.layer,
  Konvajson: {},
  Transformer: konva.Transformer,
  data: [],
  listener: function () {
    return 'listener res'
  },
}
window.topo = topo
import addNodeEvent from '@/utils/konva/common'
// EventKey 操作konva对象的属性
let EventKey = 'clickNode'

// 创建konva
/**
 *
 * @param attr
 * @param json
 */
export function createKonvaDom(args) {
  const {
    type,
    attr = 'kevCurrent',
    json,
    setattrs = konvaAttr,
    src = '',
  } = args
  console.log('createKonvaDom type is ' + type)
  console.log(args)
  const { hash } = location
  // if (!hash.includes('Topo') || $(`${attr}`).length === 0) return false
  console.log($(`${attr}`))
  console.table(json)
  var stage = Konva.Node.create(json, attr)
  var layer = stage.findOne('Layer')
  console.log(layer)
  if (type == 'selectBg') {
    // console.error(src ,bg)
    const bg = layer.findOne('bg')
    if (bg?.length) {
      console.log(bg)
      bg.setAttrs({ src: src })
      bg.zIndex(-211111)
      bg.moveToBottom()
      // stage.batchDraw()
      // this.emit('clickNode', bg[0].attrs)
    } else {
      const imageObj = new Image()
      imageObj.onload = function () {
        const yoda = new Konva.Image({
          id: 'bg',
          src,
          image: imageObj,
          width: konvaAttr.width,
          height: konvaAttr.height,
        })
        layer.add(yoda)
        console.log('setBg', layer, yoda)
        yoda.zIndex(-211111)
        yoda.moveToBottom()
      }
      imageObj.src = src
      // layer.findOne('bg').moveToBottom()
      // stage.batchDraw()
    }
  }
  stage.find('Image').forEach((node) => {
    const img = new Image()
    if (node.getAttr('src')) {
      img.src = node.getAttr('src').includes('http')
        ? node.getAttr('src')
        : localStorage.getItem('fileServer') + node.getAttr('src')
      console.log('设置konva图片地址', img.src)
      img.onload = () => {
        node.image(img)
        // 只将背景图置底
        if (node.getAttr('id') == 'bg') {
          console.log('设置背景图片置底')
          node.moveToBottom()
          node.zIndex(-211111)
        }
        stage.batchDraw()
      }
    }
  })
  stage.find('Label').forEach((node) => {
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
  topo.Konvajson = stage.toJSON()
  topo.json = stage
  topo.layer = layer
  topo.stage = konvaDom
  // 辅助线
  console.log(topo)
  console.log('将传入的json添加到layer里', topo.Konvajson)
  topo.stage.add(topo.layer)
}

export function createdText(config) {
  return {}
}

// window.onload = isKonvaDom('kevCurrent')
function selectBg(src) {
  const bgSrc = src.includes('http')
    ? localStorage.getItem('konvaBg')
    : localStorage.getItem('fileServer') + src
  // const bg = topo.layer.findOne('#bg')
  createKonvaDom({
    type: 'selectBg',
    src: bgSrc,
    json: topo.Konvajson,
  })
  // console.error(src ,bg)
  // if (bg?.length) {
  //   console.log(bg[0])
  //   bg.setAttrs({'src':bgSrc})
  //   // this.emit('clickNode', bg[0].attrs)
  // }else{
  //   var imageObj = new Image();
  //   imageObj.onload = function () {
  //     var yoda = new Konva.Image({
  //       id:'bg',
  //       image: imageObj,
  //       width: konvaAttr.width,
  //       height: konvaAttr.height,
  //     });
  //     topo.layer.add(yoda);
  //     topo.stage.batchDraw()
  //   };
  //   imageObj.src =bgSrc
  // }
}

function updateCanvasAttr(scale) {
  const { width, height } = topo.konvaAttr
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
  console.log(
    topo.stage.setAttrs({
      width: newWidth,
      height: newHeight,
      scaleX: scale,
      scaleY: scale,
    })
  )
}

function createPathDom(type, config) {
  const layer = topo.layer
  return layer
}
const state = () => ({
  Sale: topo.konvaAttr.scale ? topo.konvaAttr.scale : 300,
  konva: topo.konva,
  konvaBg: localStorage.getItem('konvaBg'),
  initKonva: {},
  // 当前操作的组态
  activeShape: {},
  //  添加的图元
  topoPath: createPathDom(),
})
const getters = {
  konvaBg: (state) => state.konvaBg,
  Sale: (state) => state.Sale,
  activeShape: (state) => state.activeShape,
  createdText: (config) => createdText(config),
}
const mutations = {
  initKonva(state, args) {
    console.log('vuex', state, args.id, args.data)
    //  初始化konva
    state.initKonva = createKonvaDom({
      type: 'created',
      attr: args.id,
      json: args.data,
    })
  },
  setSale(state, size) {
    topo.konvaAttr.scale = size
    const { width, height } = topo.konvaAttr
    const newWidth = (width * size) / 100
    const newHeight = (width * size) / 100
    const canvasAttr = {
      width: width,
      height: height,
      scale: size,
    }
    topo.konvaAttr = canvasAttr
    createKonvaDom({
      type: 'setSale',
      id: 'kevCurrent',
      width: newWidth,
      json: topo.Konvajson,
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
  setKonvaBg(state, bg) {
    state.konvaBg = bg
    selectBg(bg)
  },
  activeShape(state, shape) {
    state.activeShape = shape
    topo.activeShape = shape
  },
}
const actions = {
  setKonvaBg({ commit }, bg) {
    commit('setKonvaBg', bg)
  },
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
