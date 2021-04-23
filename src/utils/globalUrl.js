function globalUrl(hostname = window.location.hostname, localHost) {
  if (localHost.indexOf(hostname) > -1) {
    return process.env.VUE_APP_URL
  } else {
    return ''
  }
}
export default globalUrl
