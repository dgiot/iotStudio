const { iconfontId } = require('../src/config')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const log = require('logger-color')
const resourceType = ['css', 'js', 'json', 'ttf', 'woff', 'woff2']
const filePath = ['js', 'css', 'iconfont']
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
    }
    log.error(`${e} Folder already exists`)
  })
}

/**
 * @description Download cdn resources
 * @param _static
 */
function downIconfront(_static) {
  log.warning('Execute downIconfront resource script')
  createFile(filePath)
  _static.forEach((fontId) => {
    resourceType.forEach((resource) => {
      try {
        const donwUrl = `https://at.alicdn.com/t/${fontId}.${resource}`
        axios
          .get(donwUrl)
          .then((res) => {
            if (res.status == 200) {
              if (res.data && resource == 'json')
                res.data = JSON.stringify(res.data)
              writeFile(`iconfont/iconfont.${resource}`, res.data, resource)
            } else log.error(donwUrl, 'downIconfront error')
          })
          .catch((e) => {
            log.error(e, donwUrl, 'downIconfront error')
          })
      } catch (error) {
        log.error(error, 'downIconfront error')
      }
    })
  })
}

/**
 * @description File resource file
 * @param files
 * @param data
 */
function writeFile(files, data, resource) {
  const dirPath = path.join(__dirname, `../public/${files}`)
  log.info(files, dirPath)
  fs.readFile(dirPath, function (err, _data) {
    // if (err) {
    //   console.log(err, 'err')
    //   return err
    // }
    fs.writeFile(dirPath, data, function (err) {
      if (err) {
        log.error(`${files} File written error ${err}  ${data}`)
      }
      log.info(`${files} File written successfully`)
    })
    if (resource == 'json') {
      const jsonPath = path.join(
        __dirname,
        `../src/views/topo/components/iconfont.json`
      )
      upIconJson(jsonPath, data)
    }
  })
}

function upIconJson(path, data) {
  fs.writeFile(path, data, function (err) {
    if (err) {
      log.error(`${path} File written error ${err}  ${data}`)
    }
    log.info(`${path} File written successfully`)
  })
}

// export default download

if (iconfontId) downIconfront(iconfontId)
