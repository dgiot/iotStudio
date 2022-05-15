// 该服务为 vercel serve跨域处理
const { createProxyMiddleware } = require('http-proxy-middleware')
const targetUrl = 'https://prod.iotn2n.com/'
const startsWith = [
  '/iotapi',
  '/dgiot_dashboard',
  '/dgiot_swagger',
  '/dgiot_file',
  '/dgiot-amis-dashboard',
]
module.exports = (req, res) => {
  let target = ''
  // 判断 res.url 开头是否包含startsWith
  if (req.url.startsWith('/iotapi')) {
    target = targetUrl
  } else if (req.url.startsWith('/dgiot_dashboard')) {
    target = targetUrl
  } else if (req.url.includes('/dgiot_swagger')) {
    target = targetUrl
  } else if (req.url.startsWith('/dgiot_file')) {
    target = targetUrl
  } else if (req.url.includes('/dgiot-amis-dashboard')) {
    target = targetUrl
  }
  // 创建代理对象并转发请求
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      '^/iotapi/': '/',
      '^/dgiot_dashboard/': '/',
      '^/dgiot_swagger/': '/',
      '^/dgiot_file/': '/',
      '^/dgiot-amis-dashboard/': '/',
    },
  })(req, res)
}
