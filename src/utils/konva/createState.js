/**
 *
 * @param {*} params
 * @returns
 */
// https://konvajs.org/api/Konva.Stage.html
function createState(type, offsetX, offsetY, color, params) {
  var state
  switch (type) {
    case 'pencil':
      state = new Konva.Line({
        name: 'line',
        id: `line_${Mock.mock('@string')}`,
        // points: [5, 70, 140, 23, 250, 60, 300, 20],
        stroke: color,
        strokeWidth: 15,
        lineCap: 'round',
        lineJoin: 'round',
        tension: 0.5,
        draggable: true,
      })
      break
    case 'ellipse':
      // 椭圆
      state = new Konva.Ellipse({
        name: 'ellipse',
        id: `ellipse_${Mock.mock('@string')}`,
        x: offsetX,
        y: offsetY,
        radiusX: 20,
        radiusY: 20,
        stroke: color,
        strokeWidth: 4,
        draggable: true,
      })
      break
    case 'rect':
    case 'rectH':
      state = new Konva.Rect({
        name: 'rect',
        x: offsetX,
        id: `rect_${Mock.mock('@string')}`,
        y: offsetY,
        width: 100,
        height: 50,
        fill: color,
        stroke: 'black',
        strokeWidth: 4,
        opacity: 1,
        draggable: true,
      })
      break
    case 'text':
      state = new Konva.Text({
        text: '双击编辑文字',
        id: `text_${Mock.mock('@string')}`,
        x: offsetX,
        y: offsetY,
        fill: color,
        fontSize: 12,
        width: 300,
        draggable: true,
      })
      break
    case 'image':
      let imgsrc =
        'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2234238213,2776120128&fm=26&gp=0.jpg'
      var imageObj = new Image()
      state = new Konva.Image({
        x: offsetX,
        y: offsetY,
        source: imgsrc,
        id: `image_${Mock.mock('@string')}`,
        image: imageObj,
        width: 106,
        height: 118,
        draggable: true,
      })

      imageObj.src = imgsrc
      imageObj.crossOrigin = 'Anonymous'
      // alternative API:
      break
    default:
      break
  }
  return state
}
export default createState
