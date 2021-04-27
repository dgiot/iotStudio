function createImg(params) {
  const { width, height } = params
  var imgconfig = {}

  let createimg = new Image()
  // 处理图片跨域
  createimg.crossOrigin = 'anonymous'
  // 设置图图片链接地址
  createimg.src = imgUrl
  // 处理图片宽高不传的情况
  imgconfig.width = width ? width : createimg.width
  imgconfig.height = height ? height : createimg.height
  imgconfig.imageObj = createimg
  return new Konva.Image(Object.assign(params, imgconfig))
}
export default createImg
