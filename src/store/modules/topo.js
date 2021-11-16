// * @Author: h7ml
// * @Date: 2021-10-20 18:22:35
// * @LastEditors: h7ml
// * @LastEditTime: 2021-10-20 18:22:35
// * @Description: 将konva封装到自己的js里 方便管理
// * @FilePath: src\utils\konva\core\index.js
// * @DocumentLink: https://konvajs.org/docs/index.html
// * @Demo http://39.97.252.98:3000
import addNodeEvent from '@/utils/konva/common'
import canvas from '@/utils/konva/core/canvas'

const { konvaAttr, Layering, randomXy } = canvas
window.canvas = canvas

/**
 * @description 将konva组态模块方法封装到统一管理
 * @param args
 * @constructor
 */
export async function KonvaBus(args) {
  const {
    type,
    attr = 'kevCurrent',
    json,
    productid,
    src,
    removeNode,
    node,
    text,
    saleInfo = {
      width: konvaAttr.width,
      height: konvaAttr.height,
      scaleX: 1,
      scaleY: 1,
    },
  } = args
  if (_.isEmpty(json)) return false
  canvas.handlerArgs = _.merge(args, {
    type,
    attr: 'kevCurrent',
    json,
    productid,
    setattrs: canvas.konvaAttr,
    src,
    removeNode,
    node,
    text,
    saleInfo: {
      width: konvaAttr.width,
      height: konvaAttr.height,
      scaleX: 1,
      scaleY: 1,
    },
  })
  const { hash } = location
  // if (!hash.includes('Topo') || $(`${attr}`).length === 0) return false
  var stage = Konva.Node.create(json, attr)
  canvas.json = stage
  var layer = Konva.Node.create(json, attr).findOne('Layer')
  canvas.layer = layer
  // const bg = layer.findOne('bg')
  // if (bg?.length) {
  //   bg.moveToBottom()
  //   console.log("topo log: \n"+'设置背景图\n',bg.getAttrs('src'))
  //   stage.batchDraw()
  //   // this.emit('clickNode', bg[0].attrs)
  // }
  if (Layering.indexOf(type) > 0) {
    // https://github.dev/fastdgiot/vue-konva-demo
    console.error('Layering', type, node, node[`${type}`]())
    node[`${type}`]()
    layer.draw()
  } else if (type === 'setSale') {
    console.log('缩放', saleInfo)
    // updateCanvasAttr(scaleX)
    stage.batchDraw()
    layer.batchDraw()
  } else {
    console.log(type, 'type')
  }
  if (type === 'removeNode') {
    console.error('removeNode', removeNode)
    removeNode.remove()
    removeNode.destroy()
    stage.batchDraw()
  }
  // stageSettings(stage,layer,args)
  addNodeEvent({
    type: 'handleChildren',
    stage,
    layer,
    args: canvas.handlerArgs,
  })
  addNodeEvent({
    type: 'handleImage',
    stage: stage,
    layer: layer,
    args: canvas.handlerArgs,
  })
  stage.batchDraw()
  const konvaDom = new Konva.Stage({
    container: attr,
    // width: setattrs.width ? setattrs.width : konvaAttr.width,
    // height: setattrs.height ? setattrs.height : konvaAttr.height,
    width: saleInfo.width,
    height: saleInfo.height,
    scaleX: saleInfo.scaleX,
    scaleY: saleInfo.scaleY,
  })
  canvas.Konvajson = stage.toJSON()
  canvas.json = stage
  canvas.layer = layer
  canvas.stage = konvaDom
  console.log(canvas)
  // console.log('将传入的json添加到layer里', canvas.Konvajson)
  canvas.stage.add(canvas.layer)
  canvas.toDataURL = konvaDom.toDataURL()
}

const state = () => ({
  defaultKonva:
    '{"attrs":{"width":1200,"height":700},"className":"Stage","children":[{"attrs":{"id":"Layer_Thing"},"className":"Layer","children":[{"attrs":{"id":"bg","type":"bg-image","width":1200,"height":700,"src":"//img7.ddove.com/upload/20181127/134600237598.jpg?timestamp=1635422987361"},"className":"Image"},{"attrs":{"id":"_flow","name":"thing","x":100,"y":100},"className":"Label","children":[{"attrs":{"draggable":true,"name":"dblclick","width":72.04296875,"height":48.8},"className":"Tag"},{"attrs":{"draggable":true,"id":"d88c262aa4_flow_text","text":"dgiot","fontSize":24,"lineHeight":1.2,"padding":10,"fill":"yellow"},"className":"Text"}]},{"attrs":{"name":"thing","x":81,"y":62,"id":"d88c262aa4_flow"},"className":"Label","children":[{"attrs":{"hidden":true,"fill":"yellow","draggable":true,"id":"d88c262aa4_flow_text","text":"dgiot_flow_text8rrgo","fontSize":24,"lineHeight":1.2,"padding":10,"visible":false},"className":"Text"},{"attrs":{"draggable":true,"name":"dblclick","width":236.12890625,"height":48.8},"className":"Tag"}]},{"attrs":{"name":"evidence","id":"d88c262aa4_evidence_17_live_tv","evidenceList":[],"icon":"live_tv","x":187,"y":621,"draggable":true,"data":"M21 6h-7.59l3.29-3.29L16 2l-4 4-4-4-.71.71L10.59 6H3c-1.1 0-2 .89-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.11-.9-2-2-2zm0 14H3V8h18v12zM9 10v8l7-4z","handler":"dblclick","fill":"black","scaleX":2,"scaleY":2},"className":"Path"},{"attrs":{"name":"evidence","id":"d88c262aa4_evidence_22_timeline","evidenceList":[],"icon":"timeline","x":101,"y":625,"draggable":true,"data":"M23,8c0,1.1-0.9,2-2,2c-0.18,0-0.35-0.02-0.51-0.07l-3.56,3.55C16.98,13.64,17,13.82,17,14c0,1.1-0.9,2-2,2s-2-0.9-2-2 c0-0.18,0.02-0.36,0.07-0.52l-2.55-2.55C10.36,10.98,10.18,11,10,11s-0.36-0.02-0.52-0.07l-4.55,4.56C4.98,15.65,5,15.82,5,16 c0,1.1-0.9,2-2,2s-2-0.9-2-2s0.9-2,2-2c0.18,0,0.35,0.02,0.51,0.07l4.56-4.55C8.02,9.36,8,9.18,8,9c0-1.1,0.9-2,2-2s2,0.9,2,2 c0,0.18-0.02,0.36-0.07,0.52l2.55,2.55C14.64,12.02,14.82,12,15,12s0.36,0.02,0.52,0.07l3.55-3.56C19.02,8.35,19,8.18,19,8 c0-1.1,0.9-2,2-2S23,6.9,23,8z","handler":"dblclick","fill":"black","scaleX":2,"scaleY":2},"className":"Path"},{"attrs":{"name":"evidence","id":"d88c262aa4_evidence_28_personal_video","evidenceList":[],"icon":"personal_video","x":264,"y":625,"draggable":true,"data":"M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12z","handler":"dblclick","fill":"black","scaleX":2,"scaleY":2},"className":"Path"},{"attrs":{"name":"evidence","id":"d88c262aa4_evidence_33_image","evidenceList":[],"icon":"image","x":354,"y":626,"draggable":true,"data":"M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z","handler":"dblclick","fill":"black","scaleX":2,"scaleY":2},"className":"Path"},{"attrs":{"name":"evidence","id":"d88c262aa4_evidence_21_archive","evidenceList":[],"icon":"archive","x":431,"y":624,"draggable":true,"data":"M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z","handler":"dblclick","fill":"black","scaleX":2,"scaleY":2},"className":"Path"}]}]}',
  Sale: canvas.konvaAttr.scale ? canvas.konvaAttr.scale : 300,
  konva: canvas.konva,
  konvaBg: localStorage.getItem('konvaBg'),
  createdEvidence: {},
  activeShape: {},
})
const getters = {
  defaultKonva: (state) => state.defaultKonva,
  konvaBg: (state) => state.konvaBg,
  Sale: (state) => state.Sale,
  activeShape: (state) => state.activeShape,
  createdEvidence: (state) => state.createdEvidence,
}
const mutations = {
  initKonva(state, args) {
    //  初始化konva
    KonvaBus({
      type: 'createKonva',
      attr: args.id,
      json: args.data,
    })
  },
  setSale(state, size) {
    // 长与宽的比例是12:7
    // 比例值是1200/700 1.7142857142857142
    canvas.konvaAttr.scale = size
    const { width, height } = canvas.konvaAttr
    const newWidth = (width * size) / 100
    const newHeight = (height * size) / 100
    const saleInfo = {
      width: newWidth,
      height: newHeight,
      scaleX: size * 0.01,
      scaleY: size * 0.01,
    }
    const canvasAttr = {
      width: width,
      height: height,
      scale: size,
      saleInfo,
    }
    canvas.konvaAttr = canvasAttr
    state.Sale = size
    canvas.sale(saleInfo.scaleX)
    console.error('缩放大小参数')
    console.table(canvas.konvaAttr)
  },
  setKonva(state, attr) {
    state.konva = attr
    canvas.konva = attr
  },
  contextMenu(state, handler) {
    addNodeEvent({
      type: 'contextMenu',
      stage: canvas.stage,
      layer: canvas.layer,
      args: canvas.handlerArgs,
      contextmenu: canvas.contextmenu,
      handler,
    })
  },
  createdEvidence(state, Evidence) {
    state.createdEvidence = Evidence
    const simpleEvidence = addNodeEvent(
      _.merge(canvas.handlerArgs, {
        type: 'createdEvidence',
        path: Evidence,
      })
    )
    canvas.layer.add(simpleEvidence)
    canvas.layer.batchDraw()
    canvas.stage.batchDraw()
    addNodeEvent({
      type: 'handleChildren',
      stage: canvas.stage,
      layer: canvas.layer,
      args: canvas.handlerArgs,
    })
  },
  setKonvaBg(state, bg) {
    const args = _.merge(canvas.handlerArgs, {
      type: 'setTopoBg',
      src: bg,
    })
    addNodeEvent(args)
  },
  createThing(state, thing) {
    const simpleText = addNodeEvent({
      type: 'createThing',
      thing,
      saleInfo: {
        scaleX: 100 * 0.01,
        scaleY: 100 * 0.01,
      },
      randomXy,
    })
    canvas.layer.add(simpleText)
    canvas.layer.batchDraw()
    canvas.stage.batchDraw()
    addNodeEvent({
      type: 'handleChildren',
      stage: canvas.stage,
      layer: canvas.layer,
      args: canvas.handlerArgs,
    })
  },
  removeNode(state, args) {
    removeNode(args)
  },
  moveToTop(state, args) {
    moveToTop(args)
  },
  moveToBottom(state, args) {
    moveToBottom(args)
  },
  moveDown(state, args) {
    moveDown(args)
  },
  moveUp(state, args) {
    moveUp(args)
  },
  setZIndex(state, index) {
    setZIndex(index)
  },
  activeShape(state, shape) {
    state.activeShape = shape
    canvas.activeShape = shape
  },
}
const actions = {
  createdEvidence({ commit }, evidence) {
    commit('createdEvidence', evidence)
  },
  setKonvaBg({ commit }, bg) {
    localStorage.setItem('konvaBg', bg)
    commit('setKonvaBg', bg)
  },
  moveUp({ commit }, args) {
    commit('moveUp', args)
  },
  setZIndex({ commit }, index) {
    commit('setZIndex', index)
  },
  moveDown({ commit }, args) {
    commit('moveDown', args)
  },
  moveToBottom({ commit }, args) {
    commit('moveToBottom', args)
  },
  moveToTop({ commit }, args) {
    commit('moveToTop', args)
  },
  removeNode({ commit }, args) {
    commit('removeNode', args)
  },
  createThing({ commit }, args) {
    commit('createThing', args)
  },
  initKonva({ commit }, args) {
    commit('initKonva', args)
  },
  setSale({ commit }, size) {
    commit('setSale', size)
  },
  setKonva({ commit }, attr) {
    commit('setSale', attr)
  },
  contextMenu({ commit }, attr) {
    commit('contextMenu', attr)
  },
}
export default {
  state,
  getters,
  mutations,
  actions,
  canvas,
}
