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
/**
 * @description konva画布默认参数
 * @type {{width: number, scale: number, height: number}}
 */
let konvaAttr = {
  width: 1200, // 布局宽度
  height: 700, // 布局高度
  scale: 100, // 缩放比例
}
/**
 * @description 鼠标右键操作项
 * @type {string[]}
 */
const Layering =['moveDown','moveToBottom','moveToTop','moveUp']
/**
 *
 * @type {{clickItem: {}, konva: ({mutations: {setPointStart(*, *): void, setGraphColor(*, *): void, setFlag(*, *): void, setDrawing(*, *): void, setGraphNow(*, *): void, setDrawParams(*, *): void, setSizeForm(*, *): void, setDraw(*, *): void}, state: function(): {sizeForm: {}, pointStart: [], flag: null, drawing: boolean, graphNow: null, graphColor: string, draw: [], drawParams: {}}, getters: {sizeForm: function(*): *, pointStart: function(*): *, flag: function(*): *, drawing: function(*): *, graphNow: function(*): *, graphColor: function(*): *, draw: function(*): *, drawParams: function(*): *}, actions: {setPointStart({commit: *}, *=): void, setGraphColor({commit: *}, *=): void, setFlag({commit: *}, *=): void, setDrawing({commit: *}, *=): void, setGraphNow({commit: *}, *=): void, setDrawParams({commit: *}, *=): void, setSizeForm({commit: *}, *=): void, setDraw({commit: *}, *=): void}}|*), Transformer: *, stage: *, data: *[], contextmenu: {}, listener: (function(): string), toDataURL: string, konvaAttr: {width: number, scale: number, height: number}, activeShape: {}, Konvajson: {}, layer: *}}
 */
var topo = {
  konva,
  konvaAttr: konvaAttr,
  activeShape: {},
  stage: konva.stage,
  layer: konva.layer,
  Konvajson: {},
  clickItem:{},
  contextmenu:{},
    Transformer: konva.Transformer,
  data: [],
  listener: function () {
    return 'listener res'
  },
  toDataURL:''
}
window.topo = topo

/**
 * @description EventKey 操作konva对象的属性
 * @type {string}
 */
let EventKey = 'clickNode'

/**
 * @description 生成随机数
 * @param max
 * @param min
 * @return {number}
 */
function randomXy(max,min){
  return Math.floor(Math.random()*(max-min+1)+min);
}

/**
 * @description 将konva组态模块方法封装到统一管理
 * @param args
 * @constructor
 */
export function KonvaBus(args) {
  const {
    type,
    attr = 'kevCurrent',
    json,
    productid='',
    setattrs = topo.konvaAttr,
    src = '',
    removeNode,
    node,
    text='单击修改文字',
    saleInfo = {
      width:konvaAttr.width,
      height:konvaAttr.height,
      scaleX:1,
      scaleY:1
    }
  } = args
  console.log('KonvaBus type is ' + type)
  console.log(args)
  const { hash } = location
  // if (!hash.includes('Topo') || $(`${attr}`).length === 0) return false
  console.log($(`${attr}`))
  var stage = Konva.Node.create(json, attr)
  var layer = stage.findOne('Layer')
  console.log(layer)
  if (type === 'selectBg') {
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
          width: setattrs.width,
          height: setattrs.height,
            scaleX: saleInfo.scaleX,
            scaleY: saleInfo.scaleY,
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
  }else if(type ==='createText'){
    console.log(text)
    const complexText = new Konva.Text({
      x: randomXy(100,50),
      y: randomXy(70,30),
      text:text,
      fontSize: 18,
      fontFamily: 'Calibri',
      fill: '#555',
      width: 300,
      padding: 20,
      scaleX: saleInfo.scaleX,
      scaleY: saleInfo.scaleY,
      align: 'center',
      draggable:true,
      "attrs":{
      "id":productid+"_flow",
        "name":"thing",
        x: randomXy(300,10),
        y: randomXy(170,30),
        "draggable":true
    },
      "className":"Label",
      "children":[
      {
        "attrs":{
          "name":"mousemove"
        },
        "className":"Tag"
      },
      {
        "attrs":{
          "id":"9528ac1c5d_flow_text",
          "text":"dgiot",
          "fontSize":50,
          "lineHeight":1.2,
          "padding":10,
          "fill":"green"
        },
        "className":"Text"
      }
    ]
    });
    console.error(complexText)
    layer.add(complexText)
  }else if(Layering.indexOf(type) >0){
    // https://github.dev/fastdgiot/vue-konva-demo
    console.error('Layering',type,node, node[`${type}`]())
    node[`${type}`]()
    layer.draw()
  } else if(type ==='setSale'){
    console.log('缩放',saleInfo)
    // updateCanvasAttr(scaleX)
    stage.batchDraw()
    layer.batchDraw()
  }else{
    console.log(type,"type")
  }
  stage.find('Text').forEach((node) => {
    console.log('Text',node)
    node.setAttrs({
      scaleX: saleInfo.scaleX,
      scaleY: saleInfo.scaleY,
    })
    node.on('contextmenu',e=>{
      topo.contextmenu = e.target
      console.log('contextmenu',e.target)
    })
    // node.on('click',e=>{
    //   topo.clickItem = e.target
    //   console.log('click',e)
    //
    // })
  })
  stage.find('Image').forEach((node) => {
    const img = new Image()
    if (node.getAttr('src')) {
      img.src = node.getAttr('src').includes('http')
        ? node.getAttr('src')
        : localStorage.getItem('fileServer') + node.getAttr('src')
      console.log('设置konva图片地址', img.src)
      img.onload = () => {
        node.image(img)
        node.on('contextmenu',e=>{
          topo.contextmenu = e.target
          console.log('img contextmenu',e.target)
        })
        node.on('click',e=>{
          topo.clickItem = e.target
          console.log('img click',e.target)
        })
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
        console.log("all tag",tag)
        const event = tag.getAttr('name')
        if (event) {
          addNodeEvent(addNodeEvent(node.getAttr('name'), event, node))
        }
      })
      console.log()
    }

    console.log('node..', node, Konva)
  })
  if(type === 'removeNode') {
    console.error('removeNode',removeNode)
    removeNode.remove()
    removeNode.destroy()
    stage.batchDraw()
  }
  const konvaDom = new Konva.Stage({
    container: attr,
    // width: setattrs.width ? setattrs.width : konvaAttr.width,
    // height: setattrs.height ? setattrs.height : konvaAttr.height,
    width: saleInfo.width,
    height: saleInfo.height,
    scaleX: saleInfo.scaleX,
    scaleY: saleInfo.scaleY,
  })
  topo.Konvajson = stage.toJSON()
  topo.json = stage
  topo.layer = layer
  topo.stage = konvaDom
  console.log(topo)
  // console.log('将传入的json添加到layer里', topo.Konvajson)
  topo.stage.add(topo.layer)
  topo.toDataURL= konvaDom.toDataURL()
}

/**
 * @description 设置背景图
 * @param src
 */
function selectBg(src) {
  const bgSrc = src.includes('http')
    ? localStorage.getItem('konvaBg')
    : localStorage.getItem('fileServer') + src
  // const bg = topo.layer.findOne('#bg')
  KonvaBus({
    type: 'selectBg',
    src: bgSrc,
    json: topo.Konvajson,
  })
}

/**
 * @description 组态置顶
 * @document https://konvajs.org/api/Konva.Rect.html#moveToTop__anchor
 */
function moveToTop() {
  KonvaBus({
    type: 'moveToTop',
    node: topo.contextmenu,
    json: topo.Konvajson,
  })
}

/**
 * @description 组态置底
 * @document https://konvajs.org/api/Konva.Rect.html#moveToBottom__anchor
 */
function moveToBottom() {
  KonvaBus({
    type: 'moveToBottom',
    node: topo.contextmenu,
    json: topo.Konvajson,
  })
}

/**
 * @description 组态上移
 * @document https://konvajs.org/api/Konva.Rect.html#moveDown__anchor
 */
function moveDown() {
  KonvaBus({
    type: 'moveDown',
    node: topo.contextmenu,
    json: topo.Konvajson,
  })
}

/**
 * @description 组态下移
 * @document https://konvajs.org/api/Konva.Rect.html#moveUp__anchor
 */
function moveUp() {
  KonvaBus({
    type: 'moveUp',
    node: topo.contextmenu,
    json: topo.Konvajson,
  })
}

/**
 * @description 设置层级
 * @document https://konvajs.org/api/Konva.Rect.html#zIndex__anchor
 */
function setZIndex() {
  KonvaBus({
    type: 'ZIndex',
    node: topo.contextmenu,
    json: topo.Konvajson,
  })
}

/**
 * @description 创建文本
 * @document https://konvajs.org/docs/shapes/Text.html
 * @param productid
 * @param text
 */
function createText({ productid,text }){
  KonvaBus({
    type: 'createText',
    productid,
    text,
    json: topo.Konvajson,
  })
}

/**
 * @description 删除节点
 * @document https://konvajs.org/api/Konva.Container.html#remove
 */
function removeNode(){
  KonvaBus({
    type: 'removeNode',
    removeNode: topo.contextmenu,
    json: topo.Konvajson,
  })
  // topo.contextmenu.remove()
  // topo.contextmenu.destroy()
  // this.$message({
  //   type: 'success',
  //   message: '删除节点!',
  // })
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
  // topo.konvaAttr = canvasAttr
  // topo.stage.setAttrs({
  //   width: newWidth,
  //   height: newHeight,
  //   scaleX: scale,
  //   scaleY: scale,
  // })
  // topo.layer.setAttrs({
  //   width: newWidth,
  //   height: newHeight,
  //   scaleX: scale,
  //   scaleY: scale,
  // })
  // const layChildren = topo.layer.children
  // layChildren.forEach((child) =>{
  //   child.setAttrs({
  //       width: newWidth,
  //       height: newHeight,
  //       scaleX: scale,
  //       scaleY: scale,
  //     })
  //   console.log(child)
  // })
  // topo.layer.draw()
  //
  // console.log(
  //   topo.stage.setAttrs({
  //     width: newWidth,
  //     height: newHeight,
  //     scaleX: scale,
  //     scaleY: scale,
  //   })
  // )
}

const state = () => ({
  Sale: topo.konvaAttr.scale ? topo.konvaAttr.scale : 300,
  konva: topo.konva,
  konvaBg: localStorage.getItem('konvaBg'),
  initKonva: {},
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
    console.log('vuex', state, args.id, args.data)
    //  初始化konva
    state.initKonva = KonvaBus({
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
    KonvaBus({
      type: 'setSale',
      id: 'kevCurrent',
      json: topo.Konvajson,
      saleInfo:{
      width: newWidth,
        height: newHeight,
      scaleX: size * 0.01,
      scaleY: size * 0.01,
    }
    })
    state.Sale = size
    console.error('缩放大小', topo.konvaAttr.scale)
    console.table('topo', topo)
  },
  setKonva(state, attr) {
    state.konva = attr
    topo.konva = attr
  },
  setKonvaBg(state, bg) {
    state.konvaBg = bg
    selectBg(bg)
  },
  createText(state, args) {
    createText(args)
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
    topo.activeShape = shape
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
  createText({ commit }, args) {
    commit('createText', args)
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
  topo,
}
