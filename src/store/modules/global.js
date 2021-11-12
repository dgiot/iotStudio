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
  _deviceStep: getToken('_deviceFlag', storage, -1),
  cdnResource: getToken('cdnResource', storage, ''),
  selectedKeys: getToken('selectedKeys', storage, []),
  docDetails: getToken('docDetails', storage, []),
})
const getters = {
  _tableDict: (state) => state._tableDict,
  _tableParser: (state) => state._tableParser,
  _deviceFlag: (state) => state._deviceFlag,
  _deviceStep: (state) => state._deviceStep,
  cdnResource: (state) => state.cdnResource,
  selectedKeys: (state) => state.selectedKeys,
  docDetails: (state) => state.docDetails,
}
const mutations = {
  set_docDetails(state, details) {
    state.docDetails = details
    setToken('docDetails', details)
  },
  setSelectedKeys(state, keys) {
    state.selectedKeys = keys
    setToken('selectedKeys', keys)
  },
  setCdnResource(state, resource) {
    state._deviceFlag = resource
    setToken('cdnResource', resource)
  },
  set_deviceFlag(state, flag) {
    state._deviceFlag = flag
    setToken('_deviceFlag', flag)
  },
  set_deviceStep(state, step) {
    state._deviceStep = step
    setToken('_deviceStep', step)
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
  set_docDetails({
    commit,
    details,
  }) {
    commit('set_docDetails', details)
  },
  setSelectedKeys({
    commit,
    keys,
  }) {
    commit('setSelectedKeys', keys)
  },
  setCdnResource({
    commit,
    resource,
  }) {
    commit('setCdnResource', resource)
  },
  set_deviceStep({
    commit,
    step,
  }) {
    commit('set_deviceStep', step)
  },
  set_deviceFlag({
    commit,
    flag,
  }) {
    commit('set_deviceFlag', flag)
  },
  set_tableDict({
    commit,
    dict,
  }) {
    commit('set_tableDict', dict)
  },
  set_tableParser({
    commit,
    Parser,
  }) {
    commit('set_tableDict', Parser)
  },
}
export default {
  state,
  getters,
  mutations,
  actions,
}
