function isInnerIPFn() {
  // 获取当前页面url
  let curPageUrl = window.location.href
  console.log('当前页面路由： ' + curPageUrl)
  const reg1 = /(http|ftp|https|www):\/\//g
  //去掉前缀
  curPageUrl = curPageUrl.replace(reg1, '')
  // console.log('curPageUrl-1  '+curPageUrl);

  const reg2 = /\:+/g
  //替换冒号为一点
  curPageUrl = curPageUrl.replace(reg2, '.')
  // console.log('curPageUrl-2  '+curPageUrl);

  curPageUrl = curPageUrl.split('.')
  //通过一点来划分数组

  const ipAddress =
    curPageUrl[0] +
    '.' +
    curPageUrl[1] +
    '.' +
    curPageUrl[2] +
    '.' +
    curPageUrl[3]

  let isInnerIp = false
  //默认给定IP不是内网IP
  const ipNum = getIpNum(ipAddress)
  /**
   * 私有IP：
   *       A类  10.0.0.0    -10.255.255.255
   *       B类  172.16.0.0  -172.31.255.255
   *       C类  192.168.0.0 -192.168.255.255
   *       D类  127.0.0.0   -127.255.255.255(环回地址)
   **/
  const aBegin = getIpNum('10.0.0.0')
  const aEnd = getIpNum('10.255.255.255')

  const bBegin = getIpNum('172.16.0.0')
  const bEnd = getIpNum('172.31.255.255')

  const cBegin = getIpNum('192.168.0.0')
  const cEnd = getIpNum('192.168.255.255')

  const dBegin = getIpNum('127.0.0.0')
  const dEnd = getIpNum('127.255.255.255')

  isInnerIp =
    isInner(ipNum, aBegin, aEnd) ||
    isInner(ipNum, bBegin, bEnd) ||
    isInner(ipNum, cBegin, cEnd) ||
    isInner(ipNum, dBegin, dEnd)
  window.isInnerIp = isInnerIp
  return isInnerIp
}

function getIpNum(ipAddress) {
  /*获取IP数*/
  const ip = ipAddress.split('.')
  const a = parseInt(ip[0])
  const b = parseInt(ip[1])
  const c = parseInt(ip[2])
  const d = parseInt(ip[3])
  const ipNum = a * 256 * 256 * 256 + b * 256 * 256 + c * 256 + d
  return ipNum
}

function isInner(userIp, begin, end) {
  return userIp >= begin && userIp <= end
}

if (!isInnerIPFn()) {
  console.info('外网加载百度统计')
  const baidu = [
    '24f17767262929947cc3631f99bfd274',
    'a0f8b01930320b849a92a00e0c6da990',
    '32e7c4bdc95a01203a3c27102912a44e',
  ]
  const cnzz = ['1279876845']
  var _hmt = _hmt || []
  ;(function (analytics) {
    analytics.forEach((i) => {
      var hm = document.createElement('script')
      hm.src = `https://hm.baidu.com/hm.js?` + i
      var s = document.getElementsByTagName('script')[0]
      s.parentNode.insertBefore(hm, s)
    })
    console.info('加载百度统计成功')
  })(baidu)
  ;(function (analytics) {
    analytics.forEach((i) => {
      var hm = document.createElement('script')
      hm.src = `//s4.cnzz.com/z_stat.php?id=` + i + `&web_id=` + i
      var s = document.getElementsByTagName('script')[0]
      s.parentNode.insertBefore(hm, s)
    })
    console.info('加载cnzz统计成功')
  })(cnzz)
}
// doc https://mp.umeng.com/realtime/61cc0914e014255fcbcf694d/overview
// https://tongji.baidu.com/web/welcome/ico?s=a0f8b01930320b849a92a00e0c6da990
// https://tongji.baidu.com/web/welcome/ico?s=32e7c4bdc95a01203a3c27102912a44e
// https://new.cnzz.com/v1/login.php?siteid=1279876845
;(function (w, d, s, q, i) {
  w[q] = w[q] || []
  var f = d.getElementsByTagName(s)[0],
    j = d.createElement(s)
  j.async = true
  j.id = 'beacon-aplus'
  j.src = 'https://d.alicdn.com/alilog/mlog/aplus/' + i + '.js'
  f.parentNode.insertBefore(j, f)
})(window, document, 'script', 'aplus_queue', '203467608')

//集成应用的appKey
aplus_queue.push({
  action: 'aplus.setMetaInfo',
  arguments: ['appKey', '61cc0914e014255fcbcf694d'],
})
