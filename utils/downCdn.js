const {
  cdnUrl,
  useCdn,
  ignoreCdn,
} = require('../src/config')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const log = console.log
const chalk = require('chalk')

/**
 * @description Create resource folder
 * @param files
 */
function createFile(files) {
  files.forEach((e) => {
    const dirPath = path.join(__dirname, `../public/assets/${e}`)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath)
      log(chalk.blue(`${e} Folder created successfully`))
    } else {
      log(chalk.red(`${e}  Folder already exists`))
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
  log(chalk.yellow('Execute download cdn resource script'))
  const {
    css,
    js,
  } = _static
  createFile(['js', 'css'])
  // console.log(css, js)
  css.forEach((_css) => {
    ignoreCdn.forEach((i) => {
      if (_css.indexOf(i) == -1) {
        log(chalk.red(_css, '_css', _css.indexOf(i)))
        axios.get(_css)
          .then((rescss) => {
            let cssfille =
              _css.substring(_css.lastIndexOf('/') + 1)
                .indexOf('.css') != -1
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
      log(chalk.red(_js, '_js', _js.indexOf(i)))
      if (_js.indexOf(i) == -1) {
        axios.get(_js)
          .then((resjs) => {
            let jsfille =
              _js.substring(_js.lastIndexOf('/') + 1)
                .indexOf('.js') != -1
                ? _js.substring(_js.lastIndexOf('/') + 1)
                : _js.substring(_js.lastIndexOf('/') + 1) + '.js'
            log(chalk.red(jsfille))
            writeFile('js/' + jsfille, resjs.data)
          })
      } else {
        ignoreStatic.js.push(_js)
      }
    })
  })
  log(chalk.red(ignoreStatic, 'ignoreStatic'))
}

/**
 * @description File resource file
 * @param files
 * @param data
 */
function writeFile(files, data) {
  const dirPath = path.join(__dirname, `../public/assets/${files}`)
  log(chalk.green(files, dirPath))
  fs.readFile(dirPath, function (err, _data) {
    // if (err) {
    //   console.log(err, 'err')
    //   return err
    // }
    fs.writeFile(dirPath, data, function (err) {
      if (err) {
        log(chalk.red(`${files} File written successfully ${err}`))
      }
      log(chalk.green(`${files} File written successfully`))
    })
  })
}

// export default download

if (useCdn || process.env.NODE_ENV !== 'development') download(cdnUrl)
