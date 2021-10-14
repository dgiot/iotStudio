// * @Author: h7ml
// * @Date: 2021-10-14 14:55:34
// * @LastEditors: vivi
// * @LastEditTime: 2021-10-14 14:55:34
// * @Description: 此脚本是为了兼容windows下的cp命令
// * @FilePath: utils\cp.js
// * @DocumentLink: http://prod.iotn2n.com/swagger/#/
const shell = require('shelljs')
// https://www.npmjs.com/package/shelljs
function moveDist() {
  shell.exec(
    'cp -r swagger.json dist && cd dist && rm -rf manifest.webmanifest && cp -i manifest.json manifest.webmanifest',
    (code, stdout, stderr) => {
      console.log('Exit code:', code)
      console.log('Program output:', stdout)
      console.log('Program stderr:', stderr)
    }
  )
}
moveDist()
