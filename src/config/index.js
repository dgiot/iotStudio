const cli = require('./cli.config')
const setting = require('./setting.config')
const theme = require('./theme.config')
const network = require('./net.config')
const local = require('./local.config')
const pwa = require('./pwa.config')
const og = require('./og.config')
const mqtt = require('./mqtt.config')
const secret = require('./secret.config')
const packages = require('../../package.json')
const monaco = require('./monaco.config')
const info = {
  ...cli,
  ...setting,
  ...theme,
  ...network,
  ...pwa,
  ...mqtt,
  ...local,
  ...og,
  ...secret,
  ...packages,
  ...monaco,
}
module.exports = info
