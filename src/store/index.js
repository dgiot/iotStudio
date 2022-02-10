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
import { appId, uid, name, email, subscriptionType, isPwa } from '@/config'
const info = require('@/config/index')
Vue.use(Vuex)
const files = require.context('./modules', false, /\.js$/)
const modules = {}
const plugins = []
files.keys().forEach((key) => {
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})
Object.keys(modules).forEach((key) => {
  modules[key]['namespaced'] = true
})
const store = new Vuex.Store({
  modules,
  // plugins: [createLogger()],
  plugins,
})
export default store
info.secret = Base64.encode(JSON.stringify(info.secret))
info.secretMsg =
  'dgiot.secret字段属于机密信息,为了安全起见不予直接展示。已使用Base64加密'
// 解密方法 Base64.decode(dgiot.secret)
window.dashboard = info
window.dgiot = info
console.log(
  `%c dashboard %c version v${dashboard.version} %c`,
  'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
  'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
  'background:transparent'
)
