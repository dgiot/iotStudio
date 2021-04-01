/**
 * 全局--混入
 */
export default {
  methods: {
    /**
     * 数据--获取时间戳
     * @param prefix 前缀(默认为空)
     * @returns {string} 以prefix为前缀,内容为时间戳的字符串
     */
    getTimestamp(prefix = '') {
      const timestamp = new Date().getTime().toString()
      if (prefix) {
        return prefix + timestamp
      } else {
        return timestamp
      }
    },
    /**
     * 数据--通过src获取一个image元素
     * @param src 图片网络路径
     * @returns {HTMLImageElement}
     */
    getImage(src) {
      const image = new Image()
      image.src = src
      return image
    },
  },
}
