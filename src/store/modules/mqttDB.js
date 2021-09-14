import { getToken, setToken } from '@/utils/vuex'
const state = () => ({
  MqttTopic: new Map(),
  connectStatus: getToken('connectStatus'),
  pathRouter: getToken('pathRouter'),
  mqttSettings: getToken('mqttSettings'),
  historyMsg: new Map(),
})

const getters = {
  connectStatus: (state) => state.connectStatus,
  MqttTopic: (state) => state.MqttTopic,
  pathRouter: (state) => state.pathRouter,
  mqttSettings: (state) => state.mqttSettings,
  historyMsg: (state) => state.historyMsg,
}
const mutations = {
  setHistoryMsg(state, Msg) {
    state.historyMsg = Msg
    setToken('historyMsg', Msg)
  },
  setConnectStatus(state, flag) {
    state.connectStatus = flag
    setToken('connectStatus', flag)
  },
  setMqttTopic(state, MqttTopic) {
    // state.MqttTopic = _.merge(state.MqttTopic, MqttTopic)
    state.MqttTopic = MqttTopic
    setToken('MqttTopic', MqttTopic)
  },
  setPathRouter(state, path) {
    state.pathRouter = _.merge(state.pathRouter, path)
    setToken('pathRouter', path)
  },
  setMqttSettings(state, Settings) {
    state.mqttSettings = Settings
    setToken('mqttSettings', Settings)
  },
}
const actions = {
  setHistoryMsg({ commit }, Msg) {
    commit('setHistoryMsg', Msg)
  },
  setPathRouter({ commit }, path) {
    commit('setPathRouter', path)
  },
  setConnectStatus({ commit }, flag) {
    commit('setConnectStatus', flag)
  },
  setMqttTopic({ commit }, MqttTopic) {
    commit('setMqttTopic', MqttTopic)
  },
  setMqttSettings({ commit }, Settings) {
    commit('setMqttSettings', Settings)
  },
}
export default { state, getters, mutations, actions }
