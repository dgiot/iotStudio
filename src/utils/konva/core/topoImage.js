import canvas from '@/utils/konva/core/canvas'
import addNodeEvent from '@/utils/konva/common'

/**
 * @description 组态图片公共函数
 */
const topoImage = {
  handleImage(args) {
    const {randomXy} = canvas
    const {stage,layer, saleInfo } = args
    const img = new Image()
    stage.find('Image').forEach((node) => {
      console.error('handleImage --------------------图片处理：',node)
      if(node.getAttr('id'))
      if (node.getAttr('src')) {
        img.src = node.getAttr('src').includes('//')
          ? node.getAttr('src') +randomXy(300,10)
          : localStorage.getItem('fileServer') + node.getAttr('src') +randomXy(300,10)
        img.onload = () => {
          node.image(img)
          node.on('contextmenu',e=>{
            canvas.contextmenu = e.target
            console.log('img contextmenu',e.target)
          })
          node.on('click',e=>{
            canvas.clickItem = e.target
            console.log('img click',e.target)
          })
          // 只将背景图置底
          if (node.getAttr('id') == 'bg') {
            canvas.bgNode = node
            addNodeEvent({ type:'bgMoveToBottom',bgNode:node,layer,stage })
          }
        }
      }
    })
  }

}
export default  topoImage
