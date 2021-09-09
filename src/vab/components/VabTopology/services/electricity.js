import p1 from '@/assets/images/electricity/断路器分闸.png'
import p2 from '@/assets/images/electricity/断路器合闸.png'
const arr = [
  { name: '断路器分闸', url: p1 },
  { name: '断路器合闸', url: p2 },
]

const pipeImg = {
  group: '变配电',
  children: arr.map((item) => {
    return {
      name: item.name,
      data: {
        rect: {
          width: 200,
          height: 80,
        },
        name: 'image',
        image: item.url,
      },
    }
  }),
}
export default pipeImg
