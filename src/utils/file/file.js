// import requireFile from '@/utils/File/requireFile'
// const FileModule = requireFile(require.context('./File', true, /.js$/))
// dgiotlog.log(FileModule, 'FileModule')
// module.exports = {
//   ...FileModule,
// }

const modulesFiles = require.context('../File', true, /.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^.\/(.*)\.js/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})
module.exports = {
  ...modules,
}
