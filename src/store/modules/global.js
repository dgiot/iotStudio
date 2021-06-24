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
  _tableDict: getToken('_tableDict') || {},
})
const getters = {
  _tableDict: (state) => state._tableDict,
}
const mutations = {
  set_tableDict(state, dict) {
    state._tableDict = dict
    setToken('_tableDict', dict) // 解决数据持久化问题
  },
}
const actions = {
  set_tableDict({ commit, dict }) {
    commit('set_tableDict', dict)
  },
}
export default { state, getters, mutations, actions }
