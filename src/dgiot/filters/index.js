const modulesFiles = require.context('./package', true, /.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^.\/(.*)\.js/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})
const filters = {
  ...modules,
}
export default {
  install(Vue) {
    Object.keys(filters).forEach((key) => {
      Vue.filter(key, filters[key])
    })
  },
}
