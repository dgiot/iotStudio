function handleRandomImage(/* width = 50, height = 50 */) {
  //return `https://picsum.photos/${width}/${height}?random=${Random.guid()}`
  return `https://gitee.com/chu1204505056/image/raw/master/table/dgiot-image-${Mock.Random.integer(
    1,
    38
  )}.jpg`
}

const List = []
const count = 5
for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: '@id',
      title: '@ctitle(2, 5)',
      description: '@csentence',
      datetime: '@datetime',
      percent: '@integer(80,99)',
      percentage: '@integer(0,100)',
    })
  )
}

export function getList() {
  // const { title, pageNo = 1, pageSize = 20 } = params
  // const mockList = List.filter(
  //   (item) => !(title && item.title.indexOf(title) < 0)
  // )
  // const list = mockList.filter(
  //   (item, index) =>
  //     index < pageSize * pageNo && index >= pageSize * (pageNo - 1)
  // )
  return {
    code: 200,
    msg: 'success',
    data: { List },
  }
}
export function doEdit() {
  return {
    code: 200,
    msg: '模拟保存成功',
  }
}

export function doDelete() {
  return {
    code: 200,
    msg: '模拟删除成功',
  }
}
