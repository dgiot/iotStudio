const { cdnUrl, useCdn } = require('../src/config')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const log = require('logger-color')

/**
 * @description Create resource folder
 * @param files
 */
function createFile(files) {
  files.forEach((e) => {
    const dirPath = path.join(__dirname, `../public/${e}`)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath)
      log.info(`${e} Folder created successfully`)
    } else {
      log.error(`${e} Folder already exists`)
    }
  })
}

/**
 * @description Download cdn resources
 * @param _static
 */
function download(_static) {
  log.warning('Execute download cdn resource script')
  const { css, js } = _static
  createFile(['js', 'css'])
  // console.log(css, js)
  css.forEach((_css) => {
    axios.get(_css).then((rescss) => {
      let cssfille = _css.substring(_css.lastIndexOf('/') + 1).indexOf('.css')!=-1
        ? _css.substring(_css.lastIndexOf('/') + 1)
        : _css.substring(_css.lastIndexOf('/') + 1) + '.css'
      writeFile('css/' + cssfille, rescss.data)
    })
  })
  js.forEach((_js) => {
    axios.get(_js).then((resjs) => {
      let jsfille = _js.substring(_js.lastIndexOf('/') + 1).indexOf('.js') !=-1
        ? _js.substring(_js.lastIndexOf('/') + 1)
        : _js.substring(_js.lastIndexOf('/') + 1) + '.js'
      log.error(jsfille)
      writeFile('js/' + jsfille, resjs.data)
    })
  })
}

/**
 * @description File resource file
 * @param files
 * @param data
 */
function writeFile(files, data) {
  const dirPath = path.join(__dirname, `../public/${files}`)
  log.info(files, dirPath)
  fs.readFile(dirPath, function (err, _data) {
    // if (err) {
    //   console.log(err, 'err')
    //   return err
    // }
    fs.writeFile(dirPath, data, function (err) {
      if (err) {
        log.error(`${files} File written successfully ${err}`)
      }
      log.info(`${files} File written successfully`)
    })
  })
}
// export default download

if (useCdn) download(cdnUrl)
