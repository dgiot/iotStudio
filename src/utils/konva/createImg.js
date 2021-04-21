function createImg(params) {
  const {
    id = '_text',
    x = Mock.mock({
      'number|1-1000': 100,
    }).number,
    y = Mock.mock({
      'number|1-1000': 100,
    }).number,
    height = Mock.mock({
      'number|12-1000': 36,
    }).number,
    width = Mock.mock({
      'number|12-1000': 36,
    }).number,
    imageObj = new Image(),
    imgUrl = 'https://konvajs.org/assets/darth-vader.jpg',
  } = params
  imageObj.src = imgUrl
  let res = new Konva.Image({
    x,
    y,
    image: imageObj,
    width: imageObj.width,
    height: imageObj.height,
  })
  return res
}
export default createImg
