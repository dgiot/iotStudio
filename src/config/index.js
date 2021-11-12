const cli = require('./cli.config')
const setting = require('./setting.config')
const theme = require('./theme.config')
const network = require('./net.config')
const cdnConfig = require('./cdn.config')
const local = require('./local.config')
const pwa = require('./pwa.config')
const og = require('./og.config')
const mqtt = require('./mqtt.config')
module.exports = {
  ...cli,
  ...setting,
  ...theme,
  ...network,
  ...cdnConfig,
  ...pwa,
  ...mqtt,
  ...local,
  ...og,
}
