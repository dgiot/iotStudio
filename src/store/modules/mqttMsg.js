import { getToken, setToken } from '@/utils/vuex'
const state = () => ({
  mapTopic: getToken('mapTopic', new Map()),
})

const getters = {
  mapTopic: (state) => state.mapTopic,
}
const mutations = {
  setMapTopic(state, MapTopic) {
    state.mapTopic = MapTopic
    setToken('mapTopic', MapTopic)
  },
}
const actions = {
  setMapTopic({ commit }, MapTopic) {
    setToken('setMapTopic', MapTopic)
  },
}
export default { state, getters, mutations, actions }
