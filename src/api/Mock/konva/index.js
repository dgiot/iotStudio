const Layer = []
const count = Mock.mock({
  'number|12-36': 24,
}).number
for (let i = 0; i < count; i++) {
  Layer.push(
    Mock.mock({
      id: '@id(1, 2)',
      x: Mock.mock({
        'number|1-1000': 1000,
      }).number,
      y: Mock.mock({
        'number|1-1000': 1000,
      }).number,
      text: '@csentence',
      fontSize: Mock.mock({
        'number|12-36': 24,
      }).number,
      fontFamily: 'Calibri',
      fill: '@hex()',
      'type|1': ['text', 'rect', 'image'],
    })
  )
}
const data = {
  code: 200,
  msg: 'success',
  data: {
    Stage: {
      container: 'container',
      id: Mock.mock('@string(5)'),
    },
    count,
    Layer,
  },
}

export default data
