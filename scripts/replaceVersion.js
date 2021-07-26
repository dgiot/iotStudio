const fs = require('fs')
const path = require('path')
const axios = require('axios')

const pkgPath = path.resolve(__dirname, '../package.json')
const url = 'https://api.github.com/repos/dgiot/dgiot_dashboard/releases/latest'

axios.get(url).then(({ data }) => {
  const version = data.tag_name.replace('v', '').replace(' 🌈', '')
  console.log(version)
  const pkg = require(pkgPath)
  pkg.version = version
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
})
