const state = () => ({
  viewData: {},
})
const getters = {
  viewData: (state) => state.viewData,
}
const mutations = {
  setData(state, json) {
    state.viewData = json
  },
}
const actions = {
  setData({ commit, json }) {
    commit('setData', json)
  },
}
export default {
  state,
  getters,
  mutations,
  actions,
}
