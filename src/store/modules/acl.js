/*
 * @Author: h7ml
 * @Date: 2021-03-15 09:06:30
 * @LastEditTime: 2021-03-15 12:34:26
 * @LastEditors: h7ml
 * @FilePath: \dgiot-dashboard\src\store\modules\acl.js
 * @Description:
 */
import { getToken, setToken } from '@/utils/vuex'
const state = () => ({
  admin: false,
  role: getToken('role') || [],
  copyright: getToken('copyright'),
  license: getToken('license'),
  Default: getToken('Default'),
  logo: getToken('logo'),
})
const getters = {
  copyright: (state) => state.copyright,
  admin: (state) => state.admin,
  role: (state) => state.role,
  ability: (state) => state.ability,
  license: (state) => state.license,
  Default: (state) => state.Default,
  logo: (state) => state.logo,
}
const mutations = {
  setCopyright(state, copyright) {
    state.copyright = copyright
    setToken('copyright', copyright)
  },
  setLogo(state, logo) {
    state.logo = logo
    setToken('logo', logo)
  },
  setFull(state, admin) {
    state.admin = admin
  },
  setRole(state, role) {
    state.role = role
    setToken('role', role)
  },
  setAbility(state, ability) {
    state.ability = ability
  },
  setLicense(state, license) {
    state.license = license
    setToken('license', false)
  },
  setDefault(state, Default) {
    state.Default = Default
    setToken('Default', JSON.stringify(Default))
  },
}
const actions = {
  setCopyright({ commit }, copyright) {
    commit('setCopyright', copyright)
  },
  setLogo({ commit }, logo) {
    commit('setLogo', logo)
  },
  setFull({ commit }, admin) {
    commit('setFull', admin)
  },
  setRole({ commit }, role) {
    commit('setRole', role)
  },
  setAbility({ commit }, ability) {
    commit('setAbility', ability)
  },
  setLicense({ commit }, license) {
    commit('setLicense', license)
  },
  setDefault({ commit }, Default) {
    commit('setDefault', Default)
  },
}
export default { state, getters, mutations, actions }
