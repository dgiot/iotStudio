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
  return new Konva.Rect(params)
}
export default createRect
