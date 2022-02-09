/**
 *
 * @param {*} oElement
 * @returns
 */
export default function Position(oElement) {
  var _x = 0
  var _y = 0
  var _width = oElement.offsetWidth
  var _height = oElement.offsetHeight
  var _Position = {
    offsetLeft: _width,
    offsetTop: _height,
    x: _x,
    y: _y,
    offsetParent: 'auto',
  }
  if (typeof oElement.offsetParent != 'undefined') {
    for (var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent) {
      posX += oElement.offsetLeft
      posY += oElement.offsetTop
    }
    _x = posX + _width
    _y = posY + _height
    _Position = {
      offsetLeft: posX,
      offsetTop: posY,
      x: _x,
      y: _y,
      offsetParent: 'exist',
    }
  } else {
    _x = oElement.x + _width
    _y = oElement.y + _height
    _Position = {
      offsetLeft: posX,
      offsetTop: posY,
      x: x,
      y: y,
      offsetParent: 'undefined',
    }
  }
  return _Position
}
