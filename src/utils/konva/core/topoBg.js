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
      : Cookies.get('fileServer') + topobgSrc
    const setattrs = canvas.konvaAttr
    // console.log('当前组态的背景底图是：', bgSrc, stage)
    // bgNode.on('contextmenu', (e) => {
    //   console.log('组态底图点击触发了鼠标右键事件 现在没有写处理事件 可能用得上 contextmenu', e.target)
    // })
    // bgNode.on('click', (e) => {
    //   // canvas.clickItem = e.target
    //   // console.log('img click', e.target)
    //   console.log('点击了组态底图 现在没有写处理事件 可能用得上 contextmenu', e.target)
    // })
    BgimageObj.onload = () => {
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
      yoda.setAttrs({
        class: '不刪1111除',
        id: '不刪除',
      })
      // removeBg(canvas.json.file)
      // layer.add(yoda)
      console.warn(yoda)
      // yoda.zIndex(-211111)
      yoda.moveToBottom()
    }
    BgimageObj.src = bgSrc
    layer.batchDraw()
    stage.batchDraw()
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
      canvas.layer.find('Image').forEach((bgImg) => {
        console.log(bgImg, bgImg.getAttr('class'), bgImg.attrs.type)
        if (bgImg.attrs.type == 'bg-image' || bgImg.attrs.id == 'bg') {
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
      const bgSrc = src.includes('//') ? src : Cookies.get('fileServer') + src
      // bgNode.on('contextmenu', (e) => {
      //   console.log('组态底图点击触发了鼠标右键事件 现在没有写处理事件 可能用得上 contextmenu', e.target)
      // })
      // bgNode.on('click', (e) => {
      //   // canvas.clickItem = e.target
      //   // console.log('img click', e.target)
      //   console.log('点击了组态底图 现在没有写处理事件 可能用得上 contextmenu', e.target)
      // })
      BgimageObj.onload = () => {
        // layer.add(yoda)
        console.warn('setBg', layer)
        const yoda = new Konva.Image(
          _.merge(
            {
              image: BgimageObj,
            },
            {
              src: bgSrc,
              class: ' created',
              id: ' created',
            }
          )
        )
        // console.log('11111这是大屏设置', window.location)
        if (window.location.hash.indexOf('dashboard=true') >= 0) {
          yoda.setAttrs({
            id: 'bg',
            type: 'bg-image',
            width: 1900,
            height: 900,
            src: bgSrc,
          })
        } else {
          yoda.setAttrs({
            id: 'bg',
            type: 'bg-image',
            width: 1200,
            height: 700,
            src: bgSrc,
          })
        }

        // removeBg(canvas.json.file)
        layer.add(yoda)
        console.warn(yoda)
        // yoda.zIndex(-211111)
        yoda.moveToBottom()
        // "attrs":{"id":"bg","type":"bg-image","width":1200,"height":700,"src":"//img7.ddove.com/upload/20181127/134600237598.jpg"
        console.log(yoda.toJSON())
        canvas.layer.batchDraw()
      }
      BgimageObj.src = bgSrc
      // canvas.stage.batchDraw()
      // await  KonvaBus(
      //   {
      //     type: 'createKonva',
      //     attr: 'kevCurrent',
      //     json: canvas.stage.toJSON(),
      //   }
      // )
    }
  },
}

export default topoBg
