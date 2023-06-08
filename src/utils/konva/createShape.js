import createText from '@/utils/konva/createText'
import createRect from '@/utils/konva/createRect'
import createImg from '@/utils/konva/createImg'

export default function createShape(group, Shape) {
  Shape.forEach((_item) => {
    switch (_item.type) {
      case 'image':
        group.add(createImg(_item))
        break
      case 'text':
        group.add(createText(_item))
        break
      case 'rect':
        group.add(createRect(_item))
        break
      default:
        group.add(createText(_item))
        dgiotlog.log(_item.type, _item)
        break
    }
  })
  return group
}
