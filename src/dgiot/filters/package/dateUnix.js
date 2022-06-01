/**
 * @description 时间格式化过滤器
 * @param date
 * @param format
 * @returns {string}
 */
function dateUnix(date, format) {
  if (!date) {
    return ''
  }
  if (!format) {
    format = 'YYYY-MM-DD HH:mm:ss'
  }
  return moment.unix(date).format(format)
}

export default dateUnix
