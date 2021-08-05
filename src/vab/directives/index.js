/**
 * @description Vue custom directives
 * @date 2021-8-5 19:25:14
 * @author h7ml
 * @email h7ml@qq.com
 * @url https://cn.vuejs.org/v2/guide/custom-directive.html
 * @url https://www.jianshu.com/p/8d3980334b80
 */
import { $clipboard } from './package/clipboard'

const modulesFiles = require.context('./package', true, /.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^.\/(.*)\.js/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})
const directives = {
  ...modules,
}
export default {
  install(Vue) {
    Vue.prototype.$clipboard = $clipboard
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key])
    })
  },
}
