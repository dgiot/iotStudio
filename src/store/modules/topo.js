import topo from '@/utils/konva/core'

console.error('vuex', topo)
const state = () => ({})
const getters = {
  graphColor: (state) => state.graphColor,
}
const mutations = {
  setSizeForm(state, form) {
    state.sizeForm = form
  },
}
const actions = {
  setSizeForm({ commit }, form) {
    commit('setSizeForm', form)
  },
}
export default {
  state,
  getters,
  mutations,
  actions,
}
