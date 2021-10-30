import Konva from 'konva'
import canvas from '@/utils/konva/core/canvas'

/**
 * @description 组态背景公共函数
 * @type {{bgMoveToBottom(*=): void, setTopoBg(*=): void}}
 */
const topoBg = {
  /**
   * @description 置底背景图
   * @param bgNode
   * @param bgNode
   * @param layer
   * @param stage
   */
  bgMoveToBottom({
    bgNode,
    layer,
    stage,
  }=args){
      const  bgSrc = bgNode.getAttr('src')
      console.log('当前组态的背景底图是：',bgSrc)
      const BgimageObj = new Image()
      BgimageObj.onload = function () {
        const yoda = new Konva.Image({
          id: 'bg',
          src:bgSrc+randomXy(300,10),
          image: BgimageObj,
          // width: setattrs.width,
          // height: setattrs.height,
          // scaleX: saleInfo.scaleX,
          // scaleY: saleInfo.scaleY,
        })
        layer.add(yoda)
        console.log('setBg', layer, yoda)
        console.log("topo log: \n"+'设置背景图\n',bgSrc)
        BgimageObj.src = bgSrc
        yoda.zIndex(-211111)
        yoda.moveToBottom()
        stage.batchDraw()
    }
  },
  /**
   * @description 设置背景图
   * @param src
   */
  setTopoBg({ src }){
    const {randomXy,handlerArgs:{saleInfo},layer} = canvas
      const bgSrc = src.includes('http')
        ? localStorage.getItem('konvaBg')
        : localStorage.getItem('fileServer') + src
      console.error('背景图',bgSrc)
      const setattrs=  canvas.konvaAttr
      // const bg = canvas.layer.findOne('#bg')
      // KonvaBus({
      //   type: 'selectBg',
      //   src: bgSrc,
      //   json: canvas.Konvajson,
      // })
      // console.error(src ,bg)
      const bg = canvas.layer.findOne('bg')
      console.error(bg)
      if (bg?.length) {
        bg.setAttrs({ src: bgSrc+randomXy(300,10) })
        bg.zIndex(-21111+Number(randomXy(300,10)))
        bg.moveToBottom()
        console.log("topo log: \n"+'更新背景图\n',bg.getAttrs('src'))
        stage.batchDraw()
        // this.emit('clickNode', bg[0].attrs)
      } else {
        console.log('没有的话走这里')
        const imageObj = new Image()
        imageObj.onload = function () {
          const yoda = new Konva.Image({
            id: 'bg',
            src:bgSrc+randomXy(300,10),
            image: imageObj,
            width: setattrs.width,
            height: setattrs.height,
            scaleX: saleInfo.scaleX,
            scaleY: saleInfo.scaleY,
          })
          layer.add(yoda)
          console.log('setBg', layer, yoda)
          console.log("topo log: \n"+'设置背景图\n',bgSrc)
          yoda.zIndex(-211111)
          yoda.moveToBottom()
          stage.batchDraw()
        }
        // imageObj.src = 'https://cad.iotn2n.com/dgiot_file/product/topo/52c325bc55_bg?timestamp=1635422987361127'
        // imageObj.src = src+randomXy(300,10)
        // layer.findOne('bg').moveToBottom()
        // stage.batchDraw()
      }
  },
}

export default topoBg
