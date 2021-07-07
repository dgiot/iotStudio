/*
 * @Author: h7ml
 * @Date: 2021-6-2 15:17:50
 * @LastEditTime: 2021-6-24 15:27:24
 * @LastEditors: h7ml
 * @Description: Global vuex
 */
import { getToken, setToken } from '@/utils/vuex'
import { storage } from '@/config'
const state = () => ({
  _tableDict: getToken('_tableDict', storage, {}),
  _tableParser: getToken('_tableParser', storage, {}),
  _deviceFlag: getToken('_deviceFlag', storage, false),
})
const getters = {
  _tableDict: (state) => state._tableDict,
  _tableParser: (state) => state._tableParser,
  _deviceFlag: (state) => state._deviceFlag,
}
const mutations = {
  set_deviceFlag(state, flag) {
    state._deviceFlag = flag
    setToken('_tableDict', flag)
  },
  set_tableDict(state, dict) {
    state._tableDict = dict
    setToken('_tableDict', dict)
  },
  set_tableParser(state, Parser) {
    state._tableParser = Parser
    setToken('_tableParser', Parser)
  },
}
const actions = {
  set_deviceFlag({ commit, flag }) {
    commit('set_deviceFlag', flag)
  },
  set_tableDict({ commit, dict }) {
    commit('set_tableDict', dict)
  },
  set_tableParser({ commit, Parser }) {
    commit('set_tableDict', Parser)
  },
}
export default { state, getters, mutations, actions }
