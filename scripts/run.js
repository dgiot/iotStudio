// const fs = require('fs')
const axios = require('axios')
console.log(axios)
const url = 'https://api.github.com/repos/dgiot/dgiot_dashboard/releases/latest'

axios.get(url).then(({ data }) => {
  console.log(data)
})
