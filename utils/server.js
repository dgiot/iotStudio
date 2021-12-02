#!/usr/bin/env node
/**
 * @document https://github.com/scottcorgan/pushstate-server#usage
 * @type {{start?: function(*=, *=): *}}
 */
const server = require('pushstate-server')
const chalk = require('chalk')
const ip = require('ip')
const serverConfig = {
  port: 5000,
  host: '127.0.0.1',
  directory: './dist',
}

server.start(serverConfig)
const messages = [
  '  App running at:',
  `  - Local:   ${chalk.cyan(
    `http://127.0.0.1:${serverConfig.port}`
  )} (copied to clipboard)`,
  `  - Network: ${chalk.cyan(
    `http://${ip.address('public', 'ipv4')}:${serverConfig.port}`
  )}`,
]
// eslint-disable-next-line no-console
dgiotlog.log(messages.join('\n'))
