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
import canvas from '@/utils/konva/core/canvas'
const { konvaAttr,Layering ,randomXy} = canvas
window.canvas = canvas

/**
 * @description 将konva组态模块方法封装到统一管理
 * @param args
 * @constructor
 */
export async function KonvaBus(args) {
  const  {
    type,
    attr = 'kevCurrent',
    json,
    productid,
    setattrs = canvas.konvaAttr,
    src,
    removeNode,
    node,
    text,
    saleInfo = {
      width:konvaAttr.width,
      height:konvaAttr.height,
      scaleX:1,
      scaleY:1
    }
  } = args
  canvas.handlerArgs =_.merge(args , {
    type,
    attr: 'kevCurrent',
    json,
    productid,
    setattrs : canvas.konvaAttr,
    src,
    removeNode,
    node,
    text,
    saleInfo : {
      width:konvaAttr.width,
      height:konvaAttr.height,
      scaleX:1,
      scaleY:1
    }
  })
  const { hash } = location
  // if (!hash.includes('Topo') || $(`${attr}`).length === 0) return false
  var stage = Konva.Node.create(json, attr)
  var layer = Konva.Node.create(json, attr).findOne('Layer')
  // const bg = layer.findOne('bg')
  // if (bg?.length) {
  //   bg.moveToBottom()
  //   console.log("topo log: \n"+'设置背景图\n',bg.getAttrs('src'))
  //   stage.batchDraw()
  //   // this.emit('clickNode', bg[0].attrs)
  // }
  // if(Layering.indexOf(type) >0){
  //   // https://github.dev/fastdgiot/vue-konva-demo
  //   console.error('Layering',type,node, node[`${type}`]())
  //   node[`${type}`]()
  //   layer.draw()
  // } else if(type ==='setSale'){
  //   console.log('缩放',saleInfo)
  //   // updateCanvasAttr(scaleX)
  //   stage.batchDraw()
  //   layer.batchDraw()
  // }else{
  //   console.log(type,"type")
  // }
  // if(type === 'removeNode') {
  //   console.error('removeNode',removeNode)
  //   removeNode.remove()
  //   removeNode.destroy()
  //   stage.batchDraw()
  // }
  // stageSettings(stage,layer,args)
  addNodeEvent({ type:'handleChildren',stage,layer,args:canvas.handlerArgs })
  addNodeEvent({ type:'handleImage',stage:stage,layer:layer,args:canvas.handlerArgs })
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
  canvas.toDataURL= konvaDom.toDataURL()
}
const state = () => ({
  Sale: canvas.konvaAttr.scale ? canvas.konvaAttr.scale : 300,
  konva: canvas.konva,
  konvaBg: localStorage.getItem('konvaBg'),
  // 当前操作的组态
  activeShape: {},
})
const getters = {
  konvaBg: (state) => state.konvaBg,
  Sale: (state) => state.Sale,
  activeShape: (state) => state.activeShape,
}
const mutations = {
   initKonva(state, args) {
    //  初始化konva
     KonvaBus({
       type: 'createKonva',
       attr: args.id,
       json: args.data
     })
  },
  setSale(state, size) {
    // 长与宽的比例是12:7
    // 比例值是1200/700 1.7142857142857142
    canvas.konvaAttr.scale = size
    const { width, height } = canvas.konvaAttr
    const newWidth = width * size / 100
    const newHeight = width * size / 100 * 1200/700
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
      saleInfo
    }
    canvas.konvaAttr = canvasAttr
    KonvaBus({
      type: 'setSale',
      id: 'kevCurrent',
      json: canvas.Konvajson,
      saleInfo
    })
    state.Sale = size
    console.error('缩放大小', canvas.konvaAttr.scale)
    console.error('konvaAttr', canvas.konvaAttr)
  },
  setKonva(state, attr) {
    state.konva = attr
    canvas.konva = attr
  },
  setKonvaBg(state, bg) {
    addNodeEvent(_.merge(
      canvas.handlerArgs,{type:'setTopoBg',src:bg}
    ))
  },
  createThing(state, thing) {
    const simpleText = addNodeEvent({type:'createThing',thing,saleInfo: {
        scaleX: 100 * 0.01,
        scaleY: 100 * 0.01,
      }, randomXy})
    canvas.layer.add(simpleText)
    canvas.layer.batchDraw()
    canvas.stage.batchDraw()
    addNodeEvent({ type:'handleChildren',stage:canvas.stage,layer:canvas.layer,args:canvas.handlerArgs })
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
  setKonvaBg({ commit }, bg) {
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
}
export default {
  state,
  getters,
  mutations,
  actions,
  canvas,
}
