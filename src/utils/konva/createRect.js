/**
 *
 * @param x
 * @param y
 * @param width
 * @param height
 * @param fill
 * @param strokeWidth
 * @param offset
 * @param draggable
 * @param id
 * @returns
 */
// https://konvajs.org/docs/shapes/Rect.html
function createRect(params) {
  const {
    x = Mock.mock({
      'number|1-100': 100,
    }).number,
    y = Mock.mock({
      'number|1-100': 100,
    }).number,
    width = Mock.mock({
      'number|1-100': 100,
    }).number,
    height = Mock.mock({
      'number|1-100': 100,
    }).number,
    fill = Mock.mock('@hex()'),
    strokeWidth = Mock.mock({
      'number|1-10': 10,
    }).number,
    offset = {
      x: Mock.mock({
        'number|1-100': 100,
      }).number,
      y: Mock.mock({
        'number|1-100': 100,
      }).number,
    },
    draggable = true,
    id = 'myRect',
  } = params
  var rect = new Konva.Rect({
    x,
    y,
    width,
    height,
    fill,
    strokeWidth,
    offset,
    draggable,
    id,
  })
  return rect
}
export default createRect
