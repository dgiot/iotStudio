/**
 *
 * @param {*} shape
 * @param {*} value
 * @returns
 */
// https://konvajs.org/docs/tweens/Linear_Easing.html
export async function setText(shape, value) {
  var text = shape.text()
  shape.text(value)
  var tween
  if (tween) {
    tween.destroy()
  }

  tween = new Konva.Tween({
    node: shape,
    duration: 1,
  }).play()
  return tween
}
export default setText
