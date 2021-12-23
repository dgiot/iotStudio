/*
 * @Author: h7ml
 * @Date: 2021-6-15 19:34:44
 * @LastEditTime: 2021-6-2 17:16:21
 * @LastEditors: h7ml
 * @Description: 存储首页mqtt数据
 */
import { getToken, setToken } from '@/utils/vue/vuex'

const state = () => ({
  _pcimg: getToken('_pcimg') || 'https://z3.ax1x.com/2021/06/16/2OxUUJ.png',
  _mimg:
    getToken('_mimg') || 'https://i.loli.net/2021/06/16/bPfZ8ejunyUVtQx.png',
  _dev_count: getToken('_dev_count') || 0,
  _project_count: getToken('_project_count') || 0,
  _app_count: getToken('_app_count') || 0,
  _product_count: getToken('_product_count') || 0,
  _Product: getToken('_Product') || [],
  _dev_online_count: getToken('_dev_online_count') || 0,
  _onlineData: getToken('_onlineData') || [],
  _dev_off_count: getToken('_dev_off_count') || 0,
  _offlineData: getToken('_offlineData') || [],
  _ChartStatus: getToken('_ChartStatus') || {
    columns: ['状态', '数量'],
    rows: [
      {
        状态: '在线',
        数量: 0,
      },
      {
        状态: '离线',
        数量: 0,
      },
    ],
  },
  _tableData: getToken('_tableData') || [],
})
const getters = {
  _pcimg: (state) => state._pcimg,
  _mimg: (state) => state._mimg,
  _dev_count: (state) => state._dev_count,
  _project_count: (state) => state._project_count,
  _app_count: (state) => state._app_count,
  _product_count: (state) => state._product_count,
  _Product: (state) => state._Product,
  _dev_online_count: (state) => state._dev_online_count,
  _onlineData: (state) => state._onlineData,
  _dev_off_count: (state) => state._dev_off_count,
  _offlineData: (state) => state._offlineData,
  _ChartStatus: (state) => state._ChartStatus,
  _tableData: (state) => state._tableData,
}
const mutations = {
  set_pcimg(state, img) {
    state._pcimg = img
    setToken('_pcimg', img)
  },
  set_mimg(state, img) {
    state._mimg = img
    setToken('_mimg', img)
  },
  set_dev_count(state, count) {
    state._dev_count = count
    setToken('_dev_count', count)
  },
  set_project_count(state, count) {
    state._project_count = count
    setToken('_project_count', count)
  },
  set_app_count(state, count) {
    state._app_count = count
    setToken('_app_count', count)
  },
  set_product_count(state, count) {
    state._product_count = count
    setToken('_product_count', count)
  },
  set_Product(state, Product) {
    state._Product = Product
    setToken('_Product', Product)
  },
  set_dev_online_count(state, count) {
    state._dev_online_count = count
    setToken('_dev_online_count', count)
  },
  set_onlineData(state, data) {
    state._onlineData = data
    setToken('_onlineData', data)
  },
  set_dev_off_count(state, count) {
    state._dev_off_count = count
    setToken('_dev_off_count', count)
  },
  set_offlineData(state, data) {
    state._offlineData = data
    setToken('_offlineData', data)
  },
  set_ChartStatus(state, Chart) {
    state._ChartStatus = Chart
    setToken('_ChartStatus', Chart)
  },
  set_tableData(state, table) {
    state._tableData = table
    setToken('_tableData', table)
  },
}
const actions = {
  set_pcimg({ commit }, img) {
    commit('set_pcimg', img)
  },
  set_mimg({ commit }, img) {
    commit('set_mimg', img)
  },
  set_dev_count({ commit }, count) {
    commit('set_dev_count', count)
  },
  set_project_count({ commit }, count) {
    commit('set_project_count', count)
  },
  set_app_count({ commit }, count) {
    commit('set_app_count', count)
  },
  set_product_count({ commit }, count) {
    commit('set_product_count', count)
  },
  set_Product({ commit }, Product) {
    commit('set_Product', Product)
  },
  set_dev_online_count({ commit }, count) {
    commit('set_dev_online_count', count)
  },
  set_onlineData({ commit }, data) {
    commit('set_onlineData', data)
  },
  set_dev_off_count({ commit }, count) {
    commit('set_dev_off_count', count)
  },
  set_offlineData({ commit }, data) {
    commit('set_offlineData', data)
  },
  set_ChartStatus({ commit }, Chart) {
    commit('set_ChartStatus', Chart)
  },
  set_tableData({ commit }, table) {
    commit('set_tableData', table)
  },
}
export default {
  state,
  getters,
  mutations,
  actions,
}
