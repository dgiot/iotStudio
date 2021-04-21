/**
 *
 * @param {*} id
 * @param {*} x
 * @param {*} y
 * @param {*} text
 * @param {*} fontSize
 * @param {*} fontFamily
 * @param {*} fill
 * @returns
 */
// https://konvajs.org/api/Konva.Text.html
// https://konvajs.org/docs/shapes/Text.html
function createText(params) {
  const {
    id = '_text',
    x = Mock.mock({
      'number|1-100': 100,
    }).number,
    y = Mock.mock({
      'number|1-100': 100,
    }).number,
    text = Mock.mock('@cname'),
    fontSize = Mock.mock({
      'number|12-36': 36,
    }).number,
    fontFamily = 'Calibri',
    fill = Mock.mock('@hex()'),
  } = params
  var simpleText = new Konva.Text({
    id,
    x,
    y,
    text,
    fontSize,
    fontFamily,
    fill,
  })
  return simpleText
}
export default createText
