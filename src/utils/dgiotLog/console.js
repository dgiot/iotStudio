/**
 * @description 重新console groupCollapsed
 * @param label
 * @param info
 */
function dgiotConsole(label, info) {
  console.groupCollapsed(`%c ${label.text}`, label.style ?? '')
  info.type
    ? console[info.type](
        '%c%s',
        info.style ?? 'color: #409EFF;font-size: 24px;',
        info.message
      )
    : console.log(
        '%c%s',
        info.style ?? 'color: #E6A23C;font-size: 24px;',
        info.message
      )
  console.groupEnd()
}
export default dgiotConsole
