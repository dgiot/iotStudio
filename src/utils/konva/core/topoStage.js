import canvas from '@/utils/konva/core/canvas'
import addNodeEvent from '@/utils/konva/common'
/**
 * @description 组态Stage公共函数
 * @type {{handleChildren(*=): void}}
 */
const topoStage = {
  handleChildren(args) {
    console.groupCollapsed(
      '%ctopoStage handleChildren',
      'color:#009a61; font-size: 28px; font-weight: 300'
    )
    console.info(args)
    console.groupEnd()
    const {stage } = args
    stage.find("Star").forEach((node)=>{
      console.log(node,'Star')
      node.setAttrs({
        x: 5,
        fill: 'red'
      });
      const bgSrc = node.getAttr('src').includes('//')
        ? node.getAttr('src')
        : localStorage.getItem('fileServer') + node.getAttr('src').includes('//')
      localStorage.setItem('konvaBg',bgSrc)
      // node.destroy()
      canvas.bgNode = node
      addNodeEvent({ type:'bgMoveToBottom',bgNode:node,layer:args.layer,stage:args.stage })
    })
    stage.find('Label').forEach((node) => {
      console.warn('Label',node, node.attrs)
      if (node.getAttr('name') == 'thing') {
        const nodeTags = node.getChildren()
        console.error(nodeTags)
        nodeTags.forEach((tag) => {
          console.error(tag)
          const event = tag.getAttr('name')
          tag.on('click',e=>{
            canvas.clickItem = e.target
            console.log('tag click',e.target.attrs)
          })
          if (event) {
            console.error('图元处理 \n',"all tag",tag,event,tag.getAttr('name'))
            addNodeEvent({ type: node.getAttr('name'),event:`${event}`, node:node })
          }
        })
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
        console.log('click',e.target.attrs)
      })
    })
  }
}
export default  topoStage
