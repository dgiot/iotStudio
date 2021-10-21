import topo, { createKonvaDom } from '@/utils/konva/core'

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
})
const getters = {
  Sale: (state) => state.Sale,
}
const mutations = {
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
}
const actions = {
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
}
