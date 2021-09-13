import animation from './visual/animation'
import compose from './visual/compose'
import contextmenu from './visual/contextmenu'
import copy from './visual/copy'
import event from './visual/event'
import layer from './visual/layer'
import snapshot from './visual/snapshot'
import lock from './visual/lock'
const state = {
  ...animation.state,
  ...compose.state,
  ...contextmenu.state,
  ...copy.state,
  ...event.state,
  ...layer.state,
  ...snapshot.state,
  ...lock.state,

  editMode: 'edit', // 编辑器模式 edit preview
  canvasStyleData: {
    // 页面全局数据
    width: 1200,
    height: 740,
    scale: 100,
  },
  componentData: [], // 画布组件数据
  curComponent: null,
  curComponentIndex: null,
  // 点击画布时是否点中组件，主要用于取消选中组件用。
  // 如果没点中组件，并且在画布空白处弹起鼠标，则取消当前组件的选中状态
  isClickComponent: false,
}
const mutations = {
  ...animation.mutations,
  ...compose.mutations,
  ...contextmenu.mutations,
  ...copy.mutations,
  ...event.mutations,
  ...layer.mutations,
  ...snapshot.mutations,
  ...lock.mutations,

  setClickComponentStatus(state, status) {
    state.isClickComponent = status
  },

  setEditMode(state, mode) {
    state.editMode = mode
  },

  setCanvasStyle(state, style) {
    state.canvasStyleData = style
  },

  setCurComponent(state, { component, index }) {
    state.curComponent = component
    state.curComponentIndex = index
  },

  setShapeStyle({ curComponent }, { top, left, width, height, rotate }) {
    if (top) curComponent.style.top = top
    if (left) curComponent.style.left = left
    if (width) curComponent.style.width = width
    if (height) curComponent.style.height = height
    if (rotate) curComponent.style.rotate = rotate
  },

  setShapeSingleStyle({ curComponent }, { key, value }) {
    curComponent.style[key] = value
  },

  setComponentData(state, componentData = []) {
    Vue.set(state, 'componentData', componentData)
  },

  addComponent(state, { component, index }) {
    if (index !== undefined) {
      state.componentData.splice(index, 0, component)
    } else {
      state.componentData.push(component)
    }
  },

  deleteComponent(state, index) {
    if (index === undefined) {
      index = state.curComponentIndex
    }

    if (index == state.curComponentIndex) {
      state.curComponentIndex = null
      state.curComponent = null
    }

    state.componentData.splice(index, 1)
  },
}
const getters = {
  ...animation.getters,
  ...compose.getters,
  ...contextmenu.getters,
  ...copy.getters,
  ...event.getters,
  ...layer.getters,
  ...snapshot.getters,
  ...lock.getters,
}
const actions = {
  ...animation.actions,
  ...compose.actions,
  ...contextmenu.actions,
  ...copy.actions,
  ...event.actions,
  ...layer.actions,
  ...snapshot.actions,
  ...lock.actions,
}
export default { state, mutations, getters, actions }
