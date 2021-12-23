/**
 * @description require context module
 */
function requirefile(modulesFiles, path, flag, type) {
  let modules = {}
  if (modulesFiles) {
    modules = modulesFiles.keys().reduce((modules, modulePath) => {
      const moduleName = modulePath.replace(/^.\/(.*)\.js/, '$1')
      const value = modulesFiles(modulePath)
      modules[moduleName] = value.default
      return modules
    }, {})
  }
  return modules
}

export default requirefile
