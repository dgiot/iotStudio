/**
 * 自动引入当前文件夹下所有konva
 * require.context(directory, useSubdirectories = false, regExp = /^.//);
 * @param {String} directory 读取文件的路径
 * @param {Boolean} directory 匹配文件的正则表达式
 * @param {regExp} regExp 读取文件的路径
 */

const modulesFiles = require.context('../konva', true, /.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^.\/(.*)\.js/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})
module.exports = {
  ...modules,
}
