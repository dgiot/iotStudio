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
    'og:site_name': 'Colby Fayock',
    'og:title':
      'Anyone Can Map! Inspiration and an introduction to the world of mapping - Colby Fayock',
    'og:description':
      'Chef Gusteau was a visionary who created food experiences for the world to enjoy. How can we take his lessons and apply them to the world of…',
    'og:url':
      'https://www.colbyfayock.com/2020/03/anyone-can-map-inspiration-and-an-introduction-to-the-world-of-mapping/',
    'og:type': 'article',
    'article:publisher': 'https://www.colbyfayock.com',
    'article:section': 'Coding',
    'article:tag': 'Coding',
    'og:image':
      'https://res.cloudinary.com/fay/image/upload/w_1280,h_640,c_fill,q_auto,f_auto/w_860,c_fit,co_rgb:232129,g_west,x_80,y_-60,l_text:Source%20Sans%20Pro_70_line_spacing_-10_semibold:Anyone%20Can%20Map!%20Inspiration%20and%20an%20introduction%20to%20the%20world%20of%20mapping/blog-social-card-1.1',
    'og:image:secure_url':
      'https://res.cloudinary.com/fay/image/upload/w_1280,h_640,c_fill,q_auto,f_auto/w_860,c_fit,co_rgb:232129,g_west,x_80,y_-60,l_text:Source%20Sans%20Pro_70_line_spacing_-10_semibold:Anyone%20Can%20Map!%20Inspiration%20and%20an%20introduction%20to%20the%20world%20of%20mapping/blog-social-card-1.1',
    'og:image:width': '1280',
    'og:image:height': '640',
    'twitter:card': 'summary_large_image',
  },
}
