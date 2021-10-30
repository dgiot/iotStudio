import Konva from 'konva'
import { uuid } from '@/utils'

/**
 * @description 组态物模型公共函数
 * @type {{create(*, *, *): Text, on(*)}}
 */
const topoThing = {
  on(args) {},
  /**
   * @description 创建文本
   * @document https://konvajs.org/docs/shapes/Text.html
   * @param productid
   * @param text
   */
  create(productid, saleInfo, randomXy) {
    const topoThing = new Konva.Text({
      x: randomXy(100, 50),
      y: randomXy(70, 30),
      text: `${productid}_${uuid(3)}`,
      fontSize: 18,
      fontFamily: 'Calibri',
      fill: '#555',
      width: 300,
      padding: 20,
      scaleX: saleInfo.scaleX,
      scaleY: saleInfo.scaleY,
      align: 'center',
      draggable: true,
      attrs: {
        id: `${productid}_${uuid(4)}`,
        name: 'thing',
        x: randomXy(300, 10),
        y: randomXy(170, 30),
        draggable: true,
      },
      className: 'Label',
      children: [
        {
          attrs: {
            name: 'dblclick',
          },
          className: 'Tag',
        },
        {
          attrs: {
            id: `${productid}_${uuid(5)}`,
            text: 'dgiot',
            fontSize: 50,
            lineHeight: 1.2,
            padding: 10,
            fill: 'green',
          },
          className: 'Text',
        },
      ],
    })
    return topoThing;
  },
}

export default topoThing
