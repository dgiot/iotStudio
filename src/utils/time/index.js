/**
 * @description 获取当前时间，每秒刷新
 * @return {number|*}
 */

var datetime = null,
  date = null

export function tickTime() {
  console.log('start tick Time')
  setInterval(update, 1000)
}

function update() {
  date = moment(new Date())
  datetime = date.format('YYYY-MM-DD HH:mm:ss')
  window.datetime = datetime
}
