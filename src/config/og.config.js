/**
 * @document https://ogp.me/
 * @document https://www.freecodecamp.org/news/what-is-open-graph-and-how-can-i-use-it-for-my-website/
 * @document https://stackoverflow.com/questions/19778620/provide-an-image-for-whatsapp-link-sharing
 * @document https://sharethis.com/support/legacy/how-to-customize-which-url-text-and-img-to-share/
 * @document https://juejin.cn/post/7023173942001008670#heading-21
 * @Description Open Graph Protocol（开放图谱协议）
 * @type {{ogConfig: {'og:image': string, 'og:type': string, 'article:section': string, 'og:image:width': string, 'twitter:card': string, 'og:site_name': string, 'og:title': string, 'og:image:height': string, 'og:description': string, 'article:publisher': string, 'og:image:secure_url': string, 'article:tag': string, 'og:url': string}}}
 */
module.exports = {
  ogConfig: {
    'og:site_name': 'dgiot-物联网平台',
    'og:title': 'dgiot-物联网开发平台',
    'og:description': '提供物联网垂直领域应用使能平台及解决方案',
    'og:url': 'https://prod.iotn2n.com',
    'og:type': 'article',
    'article:publisher': 'https://www.iotn2n.com',
    'article:section': 'dgiot',
    'article:tag': 'dgiot',
    'og:image':
      'https://www.iotn2n.com/attachment/images/2021/08/09/image_1628483547_LQMfGmnU.jpg',
    'og:image:secure_url':
      'https://www.iotn2n.com/attachment/images/2021/08/09/image_1628483547_LQMfGmnU.jpg',
    'og:image:width': '1280',
    'og:image:height': '640',
    'twitter:card': 'summary_large_image',
  },
}
