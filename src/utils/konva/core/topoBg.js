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
  bgMoveToBottom({ bgNode, layer, stage } = args) {
    const BgimageObj = new Image()
    const {
      randomXy,
      handlerArgs: { saleInfo },
      bgSrc: topobgSrc,
      json: konvaJson,
    } = canvas
    const bgSrc = topobgSrc.includes('//')
      ? topobgSrc
      : localStorage.getItem('fileServer') + topobgSrc
    const setattrs = canvas.konvaAttr
    console.log('当前组态的背景底图是：', bgSrc, stage)
    // bgNode.on('contextmenu', (e) => {
    //   console.log('组态底图点击触发了鼠标右键事件 现在没有写处理事件 可能用得上 contextmenu', e.target)
    // })
    // bgNode.on('click', (e) => {
    //   // canvas.clickItem = e.target
    //   // console.log('img click', e.target)
    //   console.log('点击了组态底图 现在没有写处理事件 可能用得上 contextmenu', e.target)
    // })
    BgimageObj.onload = () => {
      console.warn('创建的元素加载好了')
      // layer.add(yoda)
      console.warn('setBg', layer)
      var yoda = new Konva.Image(
        _.merge(
          bgNode.attrs,
          {
            image: BgimageObj,
          },
          {
            class: ' created',
            id: ' created',
          }
        )
      )
      yoda.setAttrs({ class: '不刪1111除', id: '不刪除' })
      // removeBg(canvas.json.file)
      layer.add(yoda)
      console.warn(yoda)
      // yoda.zIndex(-211111)
      yoda.moveToBottom()
    }
    BgimageObj.src = bgSrc
    layer.batchDraw()
    stage.batchDraw()
    // BgimageObj.src = bgSrc
    console.error('bgNode', bgNode)
  },
  /**
   * @description 设置背景图
   * @param src
   */
  setTopoBg({ src }) {
    const {
      randomXy,
      handlerArgs: { saleInfo },
      layer,
      stage,
      bgNode,
      json: konvaJson,
    } = canvas
    canvas.bgNode.class = 'isRemovebg'
    canvas.bgNode.type = 'bg-image'
    layer.batchDraw()
    stage.batchDraw()
    if (bgNode) {
      canvas.layer.find('Image')
        .forEach((bgImg) => {
          console.log(bgImg, bgImg.getAttr('class'), bgImg.attrs.type)
          if (bgImg.attrs.type !== 'bg-image' || bgImg.attrs.id == 'bg') {
            // 这里应该删掉所有的id为bg的元素 然后再创建
            console.log('删除这个元素', bgImg)
            bgImg.remove()
            bgImg.destroy()
          } else {
            console.log('该图元不删除')
          }
          // bgImg.hide()
          console.log(bgImg)
          canvas.layer.batchDraw()
          canvas.stage.batchDraw()
          // canvas.bgNode = {}
        })
      const BgimageObj = new Image()
      const bgSrc = src.includes('//')
        ? src
        : localStorage.getItem('fileServer') + src
      // bgNode.on('contextmenu', (e) => {
      //   console.log('组态底图点击触发了鼠标右键事件 现在没有写处理事件 可能用得上 contextmenu', e.target)
      // })
      // bgNode.on('click', (e) => {
      //   // canvas.clickItem = e.target
      //   // console.log('img click', e.target)
      //   console.log('点击了组态底图 现在没有写处理事件 可能用得上 contextmenu', e.target)
      // })
      BgimageObj.onload = () => {
        console.warn('创建的元素加载好了')
        // layer.add(yoda)
        console.warn('setBg', layer)
        const yoda = new Konva.Image(
          _.merge(
            bgNode,
            {
              image: BgimageObj,
            },
            {
              class: ' created',
              id: ' created',
            },
          )
        )
        yoda.setAttrs({
          "id":"bg",
          "type":"bg-image",
          "width":1200,
          "height":700,
          src:bgSrc,
        })
        // removeBg(canvas.json.file)
        layer.add(yoda)
        console.warn(yoda)
        // yoda.zIndex(-211111)
        yoda.moveToBottom()
        // "attrs":{"id":"bg","type":"bg-image","width":1200,"height":700,"src":"//cad.iotn2n.com/dgiot_file/product/topo/52c325bc55_bg?timestamp=1635422987361"
        console.log(yoda.toJSON())
      }
      BgimageObj.src = bgSrc
      canvas.layer.batchDraw()
      canvas.stage.batchDraw()
      // else {
      //   console.log('没有的话走这里')
      //   const imageObj = new Image()
      //   imageObj.onload = function () {
      //     const yoda = new Konva.Image({
      //       id: 'bg',
      //       src: bgSrc + randomXy(300, 10),
      //       image: imageObj,
      //       width: setattrs.width,
      //       height: setattrs.height,
      //       scaleX: saleInfo.scaleX,
      //       scaleY: saleInfo.scaleY,
      //     })
      //     // layer.add(yoda)
      //     console.log('setBg', layer, yoda)
      //     console.log('topo log: \n' + '设置背景图\n', bgSrc)
      //     yoda.zIndex(-211111)
      //     yoda.moveToBottom()
      //     stage.batchDraw()
      //   }
      //   // imageObj.src =
      //   //   'https://cad.iotn2n.com/dgiot_file/product/topo/52c325bc55_bg?timestamp=1635422987361127'
      //   imageObj.src = src + randomXy(300, 10)
      //   stage.batchDraw()
      // }
      // layer.findOne('bg').moveToBottom()
    }
  }

}

export default topoBg
