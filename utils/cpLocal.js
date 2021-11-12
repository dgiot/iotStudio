#!/usr/bin/env node
// * @Author: h7ml
// * @Date: 2021-10-14 14:55:34
// * @LastEditors: h7ml
// * @LastEditTime: 2021-10-14 14:55:34
// * @Description: 此脚本是为了兼容windows下的cp命令
// * @FilePath: utils\cp.js
// * @DocumentLink: http://prod.iotn2n.com/swagger/#/
const shell = require('shelljs')
const path = require('path')

// https://www.npmjs.com/package/shelljs
/**
 *
 * @param target 要复制的文件路径
 * @param root 根路径
 * @param filename 文件名
 */
function moveEnv(target, root, filename) {
  shell.exec(
    `cp -r ${path.join(__dirname, target)} ${path.join(
      __dirname,
      root,
    )}${filename}`,
    (code, stdout, stderr) => {
      console.log('Exit code:', code)
    },
  )
}

moveEnv('../envlocal', '../', '.env')
