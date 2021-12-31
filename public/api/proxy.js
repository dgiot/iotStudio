const {
  createProxyMiddleware
} = require('http-proxy-middleware')

module.exports = (req, res) => {
  let target = ''
  if (req.url.startsWith('/iotapi')) {
    target = 'http://dev.iotn2n.com'
  }
  // 创建代理对象并转发请求
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      '^/iotapi/': '/'
    }
  })(req, res)
}
