function globalUrl(hostname = window.location.hostname, localHost) {
  var result = localHost.some((i) => {
    return hostname.indexOf(i) > -1
  })
  if (result) {
    return process.env.VUE_APP_URL.split(':')[1]
  } else {
    return ''
  }
}
export default globalUrl
