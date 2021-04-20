function createRect(
  x,
  y,
  width,
  height,
  fill,
  strokeWidth,
  offset,
  draggable,
  id
) {
  var rect = new Konva.Rect({
    x: x || 300,
    y: y || 90,
    width: width || 100,
    height: height || 50,
    fill: fill || 'green',
    strokeWidth: strokeWidth || 3,
    offset: offset || {
      x: 50,
      y: 25,
    },
    draggable: draggable | true,
    id: id || 'myRect',
  })
  return rect
}
export default createRect
