const canvars = {
  namespaced: true,
  state: {
    data: {
      scale: 1,
      lineName: 'polyline',
      fromArrowType: '',
      toArrowType: '',
      locked: 0,
      lineStyle: 'default',
    },
    event: {
      name: '',
      data: null,
    },
  },
  mutations: {
    setData(state, data) {
      state.data = data
    },
    setEvent(state, event) {
      state.event = event
    },
  },
}
export default canvars
