/**
 * @description 4个子配置，vue/cli配置|通用配置|主题配置|网络配置导出
 */
const cli = require('./cli.config')
const setting = require('./setting.config')
const theme = require('./theme.config')
const network = require('./net.config')
const cdnConfig = require('./cdn.config')
const pwa = require('./pwa.config')
const mqtt = require('./mqtt.config')
module.exports = {
  ...cli,
  ...setting,
  ...theme,
  ...network,
  ...cdnConfig,
  ...pwa,
  ...mqtt,
}
