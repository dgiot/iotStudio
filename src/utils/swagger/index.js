/**
 * 自动构建执行,其他情况禁止执行
 * @type {module:fs}
 */
const fs = require('fs')
const path = require('path')
const { proxy } = require('../../config/net.config')
const http = require('http')
const swaggerFile = path.join(__dirname, '../../../swagger.json')
http
  .get(`${proxy[0].target}/swagger.json`, (resp) => {
    let data = ''
    resp.on('data', (chunk) => {
      data += chunk
    })

    resp.on('end', () => {
      fs.writeFile(swaggerFile, data, function (err) {
        if (err) {
          return dgiotlog.log('Failed to crawl' + err)
        }
        dgiotlog.log(
          'File created swagger successfully, address：' + swaggerFile
        )
      })
    })
  })
  .on('error', (err) => {
    dgiotlog.log('Error: ' + err.message)
  })
