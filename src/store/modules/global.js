/*
 * @Author: h7ml
 * @Date: 2021-6-2 15:17:50
 * @LastEditTime: 2021-6-2 17:16:21
 * @LastEditors: h7ml
 * @Description: global vuex
 */
import { getToken, setToken } from '@/utils/vuex'
import { storage } from '@/config'

const state = () => ({
  roleTree: JSON.parse(getToken('roleTree', storage)), // 处理数据类型不匹配
})
const getters = {
  roleTree: (state) => state.roleTree,
}
const mutations = {
  setRoleTree(state, tree) {
    state.roleTree = tree
    setToken('roleTree', tree, storage) // 解决数据持久化问题
  },
}
const actions = {
  setRoleTree({ commit }, tree) {
    commit('setRoleTree', tree)
  },
}
export default { state, getters, mutations, actions }
