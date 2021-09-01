import { getToken, setToken } from '@/utils/vuex'
import { storage } from '@/config'
const state = () => ({
  mapTopic: getToken('mapTopic', storage, new Map()),
})

const getters = {
  mapTopic: (state) => state.mapTopic,
}
const mutations = {
  setMapTopic(state, MapTopic) {
    state.mapTopic = MapTopic
    setToken('mapTopic', MapTopic, storage)
  },
}
const actions = {
  setMapTopic({ commit }, MapTopic) {
    setToken('setMapTopic', MapTopic)
  },
}
export default { state, getters, mutations, actions }
