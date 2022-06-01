const fs = require('fs')
const path = require('path')
const http = require('http')
const network = require('../../config/net.config')
const baseURL = network.proxy[0].target

function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  }
}

function getPath(pathUrl) {
  return path.resolve(__dirname, pathUrl)
}

function generateTemplate(arr) {
  return `import { ${arr.join(', ')} } from '@/utils/Request/request'\n`
}

function generateFunc(name, summary, type = 'post') {
  const arr = name.slice(1).split('/')
  const fun = arr[arr.length - 1]
  return `
// ${summary || ''}
export function ${fun}(data, cb, errHandle) {
  return ${type}('${name}', data, cb, errHandle)
}\n`
}

function httpgetJson(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        const { statusCode } = res
        const contentType = res.headers['content-type']

        let error
        if (statusCode !== 200) {
          error = new Error('请求失败。\n' + `状态码: ${statusCode}`)
        } else if (!/^application\/json/.test(contentType)) {
          error = new Error(
            '无效的 content-type.\n' +
              `期望 application/json 但获取的是 ${contentType}`
          )
        }
        if (error) {
          dgiotlog.warn(error.message)
          // 消耗响应数据以释放内存
          res.resume()
          return
        }

        res.setEncoding('utf8')
        let rawData = ''
        res.on('data', (chunk) => {
          rawData += chunk
        })
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData)
            resolve(parsedData)
          } catch (e) {
            reject(`错误: ${e.message}`)
          }
        })
      })
      .on('error', (e) => {
        reject(`错误: ${e.message}`)
      })
  })
}

const srcFolder = '/src'
const url = `${baseURL}/swagger.json`
// const argv = process.argv
// dgiotlog.log(argv)

async function main() {
  dgiotlog.log('获取远程json文件中...')
  const { paths } = await httpgetJson(url)
  dgiotlog.log('获取成功正在生成api文件')
  const obj = {}
  for (const name in paths) {
    const path = paths[name]

    let folder = ''
    if (path.post) {
      const tag = path.post.tags[0]
      if (!tag) continue
      const urlArray = name.slice(1).split('/')
      if (name.slice(1).split('/').length === 4) {
        folder = urlArray[1]
      } else {
        if (name.slice(1).split('/')[0] !== tag) {
          continue
        }
      }
      if (obj[path.post.tags[0]]) {
        obj[path.post.tags[0]].push({
          summary: path.post.summary,
          tag,
          name,
          type: 'post',
          folder,
        })
      } else {
        obj[path.post.tags[0]] = [
          {
            summary: path.post.summary,
            tag,
            name,
            type: 'post',
            folder,
          },
        ]
      }
    } else if (path.get) {
      const tag = path.get.tags[0]
      if (!tag) continue
      const urlArray = name.slice(1).split('/')
      if (name.slice(1).split('/').length === 4) {
        folder = urlArray[1]
      } else {
        if (name.slice(1).split('/')[0] !== tag) {
          continue
        }
      }
      if (obj[path.get.tags[0]]) {
        obj[path.get.tags[0]].push({
          summary: path.get.summary,
          tag,
          name,
          type: 'get',
          folder,
        })
      } else {
        obj[path.get.tags[0]] = [
          {
            summary: path.get.summary,
            tag,
            name,
            type: 'get',
            folder,
          },
        ]
      }
    }
  }
  for (const tagName in obj) {
    let jsString = ''
    const requestTypes = []
    let folder = ''
    for (const item of obj[tagName]) {
      const requestType = requestTypes.filter((o) => o === item.type)
      if (requestType.length === 0) requestTypes.push(item.type)
      jsString += generateFunc(item.name, item.summary, item.type)
      folder = item.folder
    }
    jsString = generateTemplate(requestTypes) + jsString
    mkdirsSync(getPath(`..${srcFolder}/apis/${folder}`))
    dgiotlog.log(jsString)
    fs.writeFileSync(
      getPath(`..${srcFolder}/apis/${folder}/${tagName}.js`),
      jsString
    )
  }
  dgiotlog.log('生成完毕')
}

main()
