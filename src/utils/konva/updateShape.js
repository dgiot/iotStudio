import _setText from '@/utils/konva/setText'
import _setRect from '@/utils/konva/setRect'
import _setImage from '@/utils/konva/setImg'
let _errorDate = []
export default async function updateShape(Shape) {
  Shape.forEach((_item) => {
    switch (_item.type) {
      case 'Image':
        _setImage(_item.id, _item.text)
        break
      case 'Text':
        _setText(_item.id, _item.text)
        break
      case 'Rect':
        _setRect(_item.id, _item.text)
        break
      default:
        _errorDate.push(_item)
        break
    }
  })
  console.log(_errorDate, '此类型数据更新暂不支持')
  return Shape
}
