import canvas from '@/utils/konva/core/canvas'
import { KonvaBus } from '@/store/modules/topo'

function topoUtils() {
  /**
   * @description 组态置顶
   * @document https://konvajs.org/api/Konva.Rect.html#moveToTop__anchor
   */
  function moveToTop() {
    KonvaBus({
      type: 'moveToTop',
      node: canvas.contextmenu,
      json: canvas.Konvajson,
    })
  }

  /**
   * @description 组态置底
   * @document https://konvajs.org/api/Konva.Rect.html#moveToBottom__anchor
   */
  function moveToBottom() {
    KonvaBus({
      type: 'moveToBottom',
      node: canvas.contextmenu,
      json: canvas.Konvajson,
    })
  }

  /**
   * @description 组态上移
   * @document https://konvajs.org/api/Konva.Rect.html#moveDown__anchor
   */
  function moveDown() {
    KonvaBus({
      type: 'moveDown',
      node: canvas.contextmenu,
      json: canvas.Konvajson,
    })
  }

  /**
   * @description 组态下移
   * @document https://konvajs.org/api/Konva.Rect.html#moveUp__anchor
   */
  function moveUp() {
    KonvaBus({
      type: 'moveUp',
      node: canvas.contextmenu,
      json: canvas.Konvajson,
    })
  }

  /**
   * @description 设置层级
   * @document https://konvajs.org/api/Konva.Rect.html#zIndex__anchor
   */
  function setZIndex() {
    KonvaBus({
      type: 'ZIndex',
      node: canvas.contextmenu,
      json: canvas.Konvajson,
    })
  }

  /**
   * @description 删除节点
   * @document https://konvajs.org/api/Konva.Container.html#remove
   */
  function removeNode() {
    KonvaBus({
      type: 'removeNode',
      removeNode: canvas.contextmenu,
      json: canvas.Konvajson,
    })
    // canvas.contextmenu.remove()
    // canvas.contextmenu.destroy()
    // this.$message({
    //   type: 'success',
    //   message: '删除节点!',
    // })
  }

  function updateCanvasAttr(scale) {
    const {
      width,
      height,
    } = canvas.konvaAttr
    const newWidth = scale / 100
    const newHeight = scale / 100
    const canvasAttr = {
      width: width,
      height: height,
      scale: scale,
    }
    // canvas.konvaAttr = canvasAttr
    // canvas.stage.setAttrs({
    //   width: newWidth,
    //   height: newHeight,
    //   scaleX: scale,
    //   scaleY: scale,
    // })
    // canvas.layer.setAttrs({
    //   width: newWidth,
    //   height: newHeight,
    //   scaleX: scale,
    //   scaleY: scale,
    // })
    // const layChildren = canvas.layer.children
    // layChildren.forEach((child) =>{
    //   child.setAttrs({
    //       width: newWidth,
    //       height: newHeight,
    //       scaleX: scale,
    //       scaleY: scale,
    //     })
    //   console.log(child)
    // })
    // canvas.layer.draw()
    //
    // console.log(
    //   canvas.stage.setAttrs({
    //     width: newWidth,
    //     height: newHeight,
    //     scaleX: scale,
    //     scaleY: scale,
    //   })
    // )
  }
}

export default topoUtils
