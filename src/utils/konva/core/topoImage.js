import canvas from '@/utils/konva/core/canvas'
import addNodeEvent from '@/utils/konva/common'

/**
 * @description 组态图片公共函数
 */
const topoImage = {
  handleImage(args) {
    const { randomXy, json: konvaJson } = canvas
    const { stage, layer, saleInfo } = args
    if (konvaJson.findOne('#bg')) {
      konvaJson.find('#bg').forEach((item) => {
        item.class = 'isRemovebg'
        item.type = 'bg-image'
        layer.batchDraw()
      })
      const bgNode = konvaJson.findOne('#bg')
      console.log(bgNode)
      // 只将背景图置底
      // 暂不清楚为啥不能直接 bgNode.getAttrs('src') 找到元素背景图
      console.log('我找到背景图了', bgNode, bgNode.getAttrs('src').src)
      canvas.bgNode = konvaJson.findOne('#bg')
      canvas.bgNode.attrs = bgNode.attrs
      canvas.bgSrc = bgNode.getAttrs('src').src
      addNodeEvent({
        type: 'bgMoveToBottom',
        bgNode,
        layer,
        stage,
      })
      if (konvaJson.find('#bg').length > 2)
        canvas.removeBg('isRemovebg', konvaJson.find('#bg'), konvaJson)
    } else {
      const img = new Image()
      stage.find('Image').forEach((node) => {
        console.log("node.getAttr('id')", node.getAttr('id'))
        if (node.getAttr('id') && node.getAttr('id') != 'bg') {
          if (node.getAttr('src')) {
            img.src = node.getAttr('src').includes('//')
              ? node.getAttr('src') + randomXy(300, 10)
              : localStorage.getItem('fileServer') +
                node.getAttr('src') +
                randomXy(300, 10)
            img.onload = () => {
              node.image(img)
              node.on('contextmenu', (e) => {
                canvas.contextmenu = e.target
                console.log('img contextmenu', e.target)
              })
              node.on('click', (e) => {
                canvas.clickItem = e.target
                console.log('img click', e.target)
              })
            }
          }
        }
      })
    }
    layer.find('#bg').forEach((item) => {
      if (layer.find('#bg').length >= 2)
        canvas.removeBg('isRemovebg', layer.find('#bg'), konvaJson)
      layer.batchDraw()
      stage.batchDraw()
      // console.log(layer.toJSON())
    })
  },
}
export default topoImage
