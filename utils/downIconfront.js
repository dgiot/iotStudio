const { iconfontId } = require('../src/config')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const resourceType = ['css', 'js', 'json', 'ttf', 'woff', 'woff2']
const filePath = ['js', 'css', 'iconfont']
const log = console.log
const chalk = require('chalk')
/**
 * @description Create resource folder
 * @param files
 */
function createFile(files) {
  files.forEach((e) => {
    const dirPath = path.join(__dirname, `../public/assets/images/${e}`)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath)
      log(chalk.blue(`${e} Folder created successfully`))
    }
    log(chalk.red(`${e}  Folder already exists`))
  })
}

/**
 * @description Download cdn resources
 * @param _static
 */
function downIconfront(_static) {
  log(chalk.yellow('Execute downIconfront  resource script'))
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
            } else log(chalk.red(donwUrl, 'downIconfront error'))
          })
          .catch((e) => {
            log(chalk.red(e, donwUrl, 'downIconfront error'))
          })
      } catch (error) {
        log(chalk.red(error, 'downIconfront error'))
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
  const dirPath = path.join(__dirname, `../public/assets/images/${files}`)
  log(chalk.blue(files, dirPath))

  fs.readFile(dirPath, function (err, _data) {
    // if (err) {
    //   console.log(err, 'err')
    //   return err
    // }
    fs.writeFile(dirPath, data, function (err) {
      if (err) {
        log(chalk.red(`${files} File written error ${err}  ${data}`))
      }
      log(chalk.blue(`${files} File written successfully`))
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
      log(chalk.red(`${path} File written successfully ${err}`))
    }
    log(chalk.green(`${path} File written successfully`))
  })
}

// export default download

if (iconfontId) downIconfront(iconfontId)
