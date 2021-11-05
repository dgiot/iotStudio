import canvas from '@/utils/konva/core/canvas'
import addNodeEvent from '@/utils/konva/common'
let info = {
  tagevent:[],
  tag:[],
  evidence:[]
}
/**
 * @description 组态Stage公共函数
 * @type {{handleChildren(*=): void}}
 */
const topoStage = {
  handleChildren(args) {
    const {layer} = canvas
    info['handleArray'] = args
    const {stage } = args
    stage.find("Star").forEach((node)=>{
      info['Star'] = stage.find("Star")
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
      info['Label'] = stage.find("Label")
      if (node.getAttr('name') == 'thing') {
        const nodeTags = node.getChildren()
        nodeTags.forEach((tag) => {
          info['tag'].push(tag)
          const event = tag.getAttr('name')
          tag.on('click',e=>{
            canvas.clickItem = e.target
            console.log('tag click',e.target.attrs)
          })
          if (event) {
            info.tagevent.push({ tag:tag,event:event ,name:tag.getAttr('name')})
            addNodeEvent({ type: node.getAttr('name'),event:`${event}`, node:node })
          }
        })
      }
    })
    stage.find('Text').forEach((node) => {
      info['Text'] = stage.find('Text')
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
        canvas.contextmenu={}
        canvas.clickItem = e.target
        console.log('click',e.target.attrs)
      })
    })
    stage.find('Path').forEach((node) => {
      info['Path'] = stage.find('Path')
      if (node.getAttr('name') == 'evidence'){
        info['evidence'].push(node)
        addNodeEvent({ type: node.getAttr('name'),node:node })
      }
      // node.setAttrs({
      //   scaleX: args.saleInfo.scaleX,
      //   scaleY: args.saleInfo.scaleY,
      // })
      // 定义事件监听
      // node.on('mouseover', function(e) {
      //   console.log('鼠标mouseover')
      //   layer.draw()
      // })
      // node.on('mouseout', function() {
      //   console.log('鼠标mouseout')
      //   layer.draw()
      // })
      // node.on('mousedown', function(e){
      //   console.log('mousedown',e)
      //   layer.draw()
      // })
      // node.on('mouseup', function(e) {
      //   console.log('鼠标移出星',e)
      //   layer.draw()
      // })
      // node.on('contextmenu',e=>{
      //   canvas.contextmenu = e.target
      //   console.log('contextmenu',e.target)
      // })
      node.on('click',e=>{
        console.log(e,'eeeeee')
        canvas.clickItem = e.target
        canvas.contextmenu={}
        console.log('click',e.target.attrs)
      })
    })
    console.groupCollapsed(
      '%ctopoStage log',
      'color:#009a61; font-size: 28px; font-weight: 300'
    )
    console.info(info)
    console.groupEnd()
  }
}
export default  topoStage
