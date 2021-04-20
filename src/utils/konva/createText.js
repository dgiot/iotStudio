function createText(id, x, y, text, fontSize, fontFamily, fill) {
  var simpleText = new Konva.Text({
    id: id || '_text',
    x: x || '20',
    y: y || '20',
    text: text || 'text',
    fontSize: fontSize || 30,
    fontFamily: fontFamily || 'Calibri',
    fill: fill || 'green',
  })
  return simpleText
}
export default createText
