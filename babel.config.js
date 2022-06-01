/*
 * @Author: h7ml
 * @Date: 2021-03-11 18:38:56
 * @LastEditTime: 2021-03-15 15:48:37
 * @LastEditors: h7ml
 * @FilePath: \dgiot-dashboard\babel.config.js
 * @Description:
 */
const { clearConsole } = require('./src/config')
let plugins = ['dynamic-import-node', '@babel/plugin-transform-runtime']
if (process.env.NODE_ENV !== 'development' && clearConsole)
  plugins.push('transform-remove-console')

module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins,
}
