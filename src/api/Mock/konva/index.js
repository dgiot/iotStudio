const Layer = []
const count = Mock.mock({
  'number|10-200': 50,
}).number
for (let i = 0; i < count; i++) {
  Layer.push(
    Mock.mock({
      id: '@id(1, 2)',
      x: Mock.mock({
        'number|1-1000': 1000,
      }).number,
      y: Mock.mock({
        'number|1-1000': 1000,
      }).number,
      text: '@csentence',
      fontSize: Mock.mock({
        'number|12-36': 24,
      }).number,
      fontFamily: 'Calibri',
      'imgUrl|1': [
        'http://www.dmoe.cc/random.php',
        'https://unsplash.it/1600/900?random',
        'http://pic.tsmp4.net/api/fengjing/img.php',
        'http://pic.tsmp4.net/api/nvsheng/img.php',
        'http://pic.tsmp4.net/api/yingshi/img.php',
        'http://pic.tsmp4.net/api/erciyuan/img.php',
        'http://www.dmoe.cc/random.php',
        'https://api.dujin.org/bing/1366.php',
        'https://api.dujin.org/bing/1920.php',
        'http://api.mtyqx.cn/api/random.php',
        'http://api.mtyqx.cn/tapi/random.php',
        'http://api.pingping6.com/girl/?type=302',
      ],
      fill: '@hex()',
      'type|1': ['image', 'text', 'rect'],
    })
  )
}
const data = {
  code: 200,
  msg: 'success',
  data: {
    Stage: {
      container: 'container',
      id: Mock.mock('@string(5)'),
    },
    count,
    Layer,
  },
}

export default data
