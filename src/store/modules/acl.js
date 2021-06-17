/*
 * @Author: h7ml
 * @Date: 2021-03-15 09:06:30
 * @LastEditTime: 2021-03-15 12:34:26
 * @LastEditors: h7ml
 * @FilePath: \dgiot_dashboard\src\store\modules\acl.js
 * @Description:
 */
import { getToken, setToken } from '@/utils/vuex'
const state = () => ({
  admin: false,
  role: [],
  copyright: getToken('copyright', 'sessionStorage'),
  license: getToken('license', 'sessionStorage'),
  Default: getToken('Default', 'sessionStorage'),
  logo: getToken('logo', 'sessionStorage'),
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
    setToken('copyright', copyright, 'sessionStorage')
  },
  setLogo(state, logo) {
    state.logo = logo
    setToken('logo', logo, 'sessionStorage')
  },
  setFull(state, admin) {
    state.admin = admin
  },
  setRole(state, role) {
    state.role = role
  },
  setAbility(state, ability) {
    state.ability = ability
  },
  setLicense(state, license) {
    state.license = license
    setToken('license', false, 'sessionStorage')
  },
  setDefault(state, Default) {
    state.Default = Default
    setToken('Default', JSON.stringify(Default), 'sessionStorage')
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
