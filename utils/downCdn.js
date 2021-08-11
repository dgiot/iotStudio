const { cdnUrl, useCdn, ignoreCdn } = require('../src/config')
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
  const ignoreStatic = {
    js: [],
    css: [],
  }
  log.warning('Execute download cdn resource script')
  const { css, js } = _static
  createFile(['js', 'css'])
  // console.log(css, js)
  css.forEach((_css) => {
    ignoreCdn.forEach((i) => {
      if (_css.indexOf(i) == -1) {
        log.error(_css, '_css', _css.indexOf(i))
        axios.get(_css).then((rescss) => {
          let cssfille =
            _css.substring(_css.lastIndexOf('/') + 1).indexOf('.css') != -1
              ? _css.substring(_css.lastIndexOf('/') + 1)
              : _css.substring(_css.lastIndexOf('/') + 1) + '.css'
          writeFile('css/' + cssfille, rescss.data)
        })
      } else {
        ignoreStatic.css.push(_css)
      }
    })
  })
  js.forEach((_js) => {
    ignoreCdn.forEach((i) => {
      log.error(_js, '_js', _js.indexOf(i))
      if (_js.indexOf(i) == -1) {
        axios.get(_js).then((resjs) => {
          let jsfille =
            _js.substring(_js.lastIndexOf('/') + 1).indexOf('.js') != -1
              ? _js.substring(_js.lastIndexOf('/') + 1)
              : _js.substring(_js.lastIndexOf('/') + 1) + '.js'
          log.error(jsfille)
          writeFile('js/' + jsfille, resjs.data)
        })
      } else {
        ignoreStatic.js.push(_js)
      }
    })
  })
  log.error(ignoreStatic, 'ignoreStatic')
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
