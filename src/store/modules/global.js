/*
 * @Author: h7ml
 * @Date: 2021-6-2 15:17:50
 * @LastEditTime: 2021-6-2 15:22:50
 * @LastEditors: h7ml
 * @Description: global vuex
 */
const state = () => ({
  roleTree: [],
})
const getters = {
  roleTree: (state) => state.roleTree,
}
const mutations = {
  setRoleTree(state, tree) {
    state.roleTree = tree
  },
}
const actions = {
  setRoleTree({ commit }, tree) {
    commit('setRoleTree', tree)
  },
}
export default { state, getters, mutations, actions }
