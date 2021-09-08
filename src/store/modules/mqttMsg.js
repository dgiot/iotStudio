import { getToken, setToken } from '@/utils/vuex'
const state = () => ({
  mapTopic: getToken('mapTopic', 'localStorage', new Map()),
})

const getters = {
  mapTopic: (state) => state.mapTopic,
}
const mutations = {
  setMapTopic(state, MapTopic) {
    state.mapTopic = MapTopic
    setToken('mapTopic', 'localStorage', MapTopic)
  },
}
const actions = {
  setMapTopic({ commit }, MapTopic) {
    commit('setMapTopic', MapTopic)
  },
}
export default { state, getters, mutations, actions }
