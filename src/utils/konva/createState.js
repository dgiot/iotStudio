/**
 *
 * @param {*} params
 * @returns
 */
// https://konvajs.org/api/Konva.Stage.html
import { uuid } from '@/utils'
function createState(type, offsetX, offsetY, color, params) {
  console.log(params, 'konva create params')
  var state
  switch (type) {
    case 'pencil':
      state = new Konva.Line({
        name: 'line',
        id: `line_${uuid(6)}`,
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
        id: `ellipse_${uuid(6)}`,
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
        id: `rect_${uuid(6)}`,
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
        text: params.text,
        id: `text_${uuid(6)}`,
        x: offsetX,
        y: offsetY,
        fill: color,
        fontSize: 12,
        width: 300,
        draggable: true,
      })
      break
    case 'image':
      var imageObj = new Image()
      console.log(params)
      state = new Konva.Image({
        x: offsetX,
        y: offsetY,
        id: `image_${uuid(6)}`,
        image: imageObj,
        source: params.src,
        width: params.width,
        height: params.height,
        draggable: true,
      })
      imageObj.src = params.src
      imageObj.crossOrigin = 'Anonymous'

      // imageObj.src = imgsrc
      // imageObj.crossOrigin = 'Anonymous'
      // alternative API:
      break
    default:
      break
  }
  console.log(state, 'konva  state')
  return state
}
export default createState
