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
