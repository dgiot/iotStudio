/*
 * @Author: h7ml
 * @Date: 2021-01-14 14:35:36
 * @LastEditTime: 2021-03-25 20:33:20
 * @LastEditors: h7ml
 * @FilePath: \shuwa_dashboard\src\store\acl.js
 * @Description:
 */
/**
 * @description 导入所有 vuex 模块，自动加入namespaced:true，用于解决vuex命名冲突，请勿修改。
 */

Vue.use(Vuex)
import LogRocket from 'logrocket';
LogRocket.init('wj9jpe/dgiot');
import createPlugin from 'logrocket-vuex';
const logrocketPlugin = createPlugin(LogRocket);
const files = require.context('./modules', false, /\.js$/)
const modules = {}
files.keys().forEach((key) => {
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})
Object.keys(modules).forEach((key) => {
  modules[key]['namespaced'] = true
})
const store = new Vuex.Store({
  modules,
  // plugins: [createLogger()],
  plugins: [logrocketPlugin]
})
export default store
window.store = store
