/*
 * @Author: h7ml
 * @Date: 2021-6-2 15:17:50
 * @LastEditTime: 2021-6-24 15:27:24
 * @LastEditors: h7ml
 * @Description: Global vuex
 */
import { getToken, setToken } from '@/utils/vue'
import { storage } from '@/config'
import formItemCommonDefault from '@/assets/data/form-item-common'

const state = () => ({
  _formItemCommon: getToken('_formItemCommon', storage, formItemCommonDefault),
})
const getters = {
  _formItemCommon: (_formItemCommon) => state._formItemCommon,
}
const mutations = {
  set_formItemCommon(state, formItem) {
    state.formItemCommon = formItem
    setToken('_formItemCommonDefault', formItem)
  },
}
const actions = {
  set_formItemCommon({ commit, formItem }) {
    commit('set_formItemCommon', formItem)
  },
}
export default {
  state,
  getters,
  mutations,
  actions,
}
