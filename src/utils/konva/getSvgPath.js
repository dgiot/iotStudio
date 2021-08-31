const regxD = /d="([^"]+)"/
const regxFile = /fill="([^"]+)"/
// const regxPathId = /id="([^"]+)"/
// const iconfont = require('https://at.alicdn.com/t/font_2759556_r8d9wroaw8.json')
function getSvgPath(item) {
  const path = []
  const topo = []
  const font_class = item.font_class || ''
  if (!font_class) alert('No font class')
  const svgId = `#dgiot-${item.font_class}` || ''
  let el = $(svgId)
  const childPath = el
  let result = {
    id: svgId,
    el: el[0],
    path: path,
    topo: topo,
  }
  childPath[0].children.forEach((child, index) => {
    let _d = (regxD.exec(child.outerHTML) || '')[1]
    let _fill = (regxFile.exec(child.outerHTML) || '')[1]
    path[index] = {
      d: _d,
      path: _fill,
    }
    topo[index] = {
      attrs: {
        data: _d,
        originX: 'center',
        originY: 'bottom',
        id: `${svgId}-${index}-${moment(new Date()).valueOf()}`,
        x: 10,
        y: 15,
        angle: -30,
        fill: _fill,
        scaleX: 0.15,
        scaleY: 0.15,
        rotation: 0,
      },
      className: 'Path',
    }
  })
  return result
}
export default getSvgPath
