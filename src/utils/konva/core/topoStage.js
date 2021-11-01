import canvas from '@/utils/konva/core/canvas'
import addNodeEvent from '@/utils/konva/common'
/**
 * @description 组态Stage公共函数
 * @type {{handleChildren(*=): void}}
 */
const topoStage = {
  handleChildren(args) {
    const {randomXy} = canvas
    console.groupCollapsed(
      '%ctopoStage handleChildren',
      'color:#009a61; font-size: 28px; font-weight: 300'
    )
    console.info(args)
    console.groupEnd()
    const {stage,layer, saleInfo } = args
    stage.find('Label').forEach((node) => {
      console.warn('Label',node, node.attrs)
      if (node.getAttr('name') == 'thing') {
        const nodeTags = node.getChildren()
        nodeTags.forEach((tag) => {
          const event = tag.getAttr('name')
          if (event) {
            console.error('图元处理 \n',"all tag",tag,event,tag.getAttr('name'))
            addNodeEvent({ type: node.getAttr('name'),event:`${event}`, node:node })
          }
        })
      }
    })
    stage.find('Image').forEach((node) => {
      const img = new Image()
      console.log('图片处理：',node)
      if (node.getAttr('src')) {
        img.src = node.getAttr('src').includes('http')
          ? node.getAttr('src') +randomXy(300,10)
          : localStorage.getItem('fileServer') + node.getAttr('src') +randomXy(300,10)
        console.log('图片路径处理 \n', img.src)
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
          stage.batchDraw()
        }
      }
    })
    console.log('文本处理：',stage.find('Text'))
    stage.find('Text').forEach((node) => {
      if(node.getAttr('hidden') === true) node.hide()
      // node.setAttrs({
      //   scaleX: args.saleInfo.scaleX,
      //   scaleY: args.saleInfo.scaleY,
      // })
      node.on('contextmenu',e=>{
        canvas.contextmenu = e.target
        console.log('contextmenu',e.target)
      })
      node.on('click',e=>{
        canvas.clickItem = e.target
        console.log('click',e)
      })
    })
  }
}
export default  topoStage
