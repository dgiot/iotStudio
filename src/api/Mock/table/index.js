function handleRandomImage(/* width = 50, height = 50 */) {
  //return `https://picsum.photos/${width}/${height}?random=${Random.guid()}`
  return `https://gitee.com/chu1204505056/image/raw/master/table/vab-image-${Mock.Random.integer(
    1,
    38,
  )}.jpg`
}

const List = []
const count = 50
for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      uuid: '@uuid',
      id: '@id',
      title: '@title(1, 2)',
      description: '@csentence',
      'status|1': ['published', 'draft', 'deleted'],
      author: '@cname',
      datetime: '@datetime',
      pageViews: '@integer(300, 5000)',
      img: handleRandomImage(228, 228),
      switch: '@boolean',
      percent: '@integer(80,99)',
      'rate|1': [1, 2, 3, 4, 5],
      percentage: '@integer(0,100)',
    }),
  )
}

export function getList(params) {
  const {
    title,
    pageNo = 1,
    pageSize = 20,
  } = params
  const mockList = List.filter(
    (item) => !(title && item.title.indexOf(title) < 0),
  )
  const list = mockList.filter(
    (item, index) =>
      index < pageSize * pageNo && index >= pageSize * (pageNo - 1),
  )
  return {
    code: 200,
    msg: 'success',
    data: { list, ...{ total: mockList.length } },
  }
}

export function doEdit(data) {
  return {
    code: 200,
    msg: '模拟保存成功',
  }
}

export function doDelete(data) {
  return {
    code: 200,
    msg: '模拟删除成功',
  }
}
