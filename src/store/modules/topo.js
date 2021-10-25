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
  console.log('当前路由hash', hash)
  if (!hash.includes('Topo')) return false
  console.log(setattrs)
  const _json = {
    'attrs': {
      'width': 1200,
      'height': 700,
      'draggable': true,
    },
    'className': 'Stage',
    'children': [
      {
        'attrs': {},
        'className': 'Layer',
        'children': [
          {
            'attrs': {
              'id': 'bg',
              'width': 1200,
              'height': 700,
              'type': 'bg-image',
              'src': 'http://39.97.252.98:3000/thumb/2.png',
            },
            'className': 'Image',
          },
          {
            'attrs': {
              'draggable': true,
              'x': 306,
              'y': 303,
              'transformsEnabled': 'position',
            },
            'className': 'Group',
            'children': [
              {
                'attrs': {
                  'name': 'thing',
                  'x': 100,
                  'y': 100,
                  'draggable': true,
                },
                'className': 'Label',
                'children': [
                  {
                    'attrs': {
                      'name': 'click',
                    },
                    'className': 'Tag',
                  },
                  {
                    'attrs': {
                      'id': '9528ac1c5d_flow_text',
                      'text': 'dgiot',
                      'fontSize': 50,
                      'lineHeight': 1.2,
                      'padding': 10,
                      'fill': 'green',
                    },
                    'className': 'Text',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }

  const stage = Konva.Node.create(_json, 'dgiot')
  const layer = stage.findOne('Layer')

  stage.find('Image')
    .forEach((node) => {
      const img = new Image()
      img.src = node.getAttr('src')
      img.onload = () => {
        node.image(img)
        node.moveToBottom()
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
// 重绘
  topo.layer.draw()
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
  // 重绘
  topo.layer.draw()
}

function createPathDom(type, config) {
  const layer = topo.layer
  return layer
}

const state = () => ({
  Sale: topo.konvaAttr.scale ? topo.konvaAttr.scale : 300,
  konva: topo.konva,
  initKonva: createKonvaDom('dgiot', {}),
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
  initKonva({ commit }, id, data) {
    commit('initKonva', id, data)
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
