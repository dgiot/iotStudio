/*
 * @Author: h7ml
 * @Date: 2022-5-5 17:57:00
 * @LastEditTime: 2022-5-5 17:57:00
 * @LastEditors: h7ml
 * @FilePath: \dgiot-dashboard\src\store\modules\product.js
 * @Description: product vuex store
 */
import { getToken, setToken } from '@/utils/vue'

const state = () => ({
  protocol: getToken('protocol') || [],
  chartType: getToken('chartType') || [],
})
const getters = {
  protocol: (state) => state.protocol,
  chartType: (state) => state.chartType,
}
const mutations = {
  setChartType(state, chart) {
    state.chartType = chart
    setToken('chartType', chart)
  },
  setProtocol(state, protocol) {
    state.protocol = protocol
    setToken('protocol', protocol)
  },
}
const actions = {
  setProtocol({ commit }, protocol) {
    commit('setProtocol', protocol)
  },
  setChartType({ commit }, chart) {
    commit('setChartType', chart)
  },
}
export default {
  state,
  getters,
  mutations,
  actions,
}
