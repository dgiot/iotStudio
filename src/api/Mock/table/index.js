const imgCdn = [
  'http://www.dmoe.cc/random.php',
  'https://unsplash.it/1600/900?random',
  'http://www.dmoe.cc/random.php',
  'https://api.dujin.org/bing/1366.php',
  'https://api.dujin.org/bing/1920.php',
  'http://api.mtyqx.cn/api/random.php',
  'http://api.mtyqx.cn/tapi/random.php',
  'https://source.unsplash.com/random',
  'http://www.dmoe.cc/random.php',
  'https://acg.yanwz.cn/api.php',
  'https://img.paulzzh.tech/touhou/random',
  'https://acg.toubiec.cn/random.php',
  'https://tuapi.eees.cc/api.php?category=dongman&type=302',
  'https://api.dujin.org/bing/1366.php',
  'https://api.ixiaowai.cn/api/api.php',
  'https://api.ixiaowai.cn/mcapi/mcapi.php',
  'https://api.ixiaowai.cn/gqapi/gqapi.php',
  'https://api.123home.page/api.php?category=all',
]

const List = []
const count = 50
for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      uuid: '@uuid',
      id: '@id',
      title: '@cword(3,10)',
      objectId: /\S\d{5,6}/,
      code: /\S\d{5,6}/,
      description: '@csentence',
      'status|1': ['published', 'draft', 'deleted'],
      author: '@cname',
      datetime: '@datetime',
      createdAt: '@datetime',
      updatedAt: '@datetime',
      pageViews: '@integer(300, 5000)',
      img: _.sampleSize(imgCdn, 1)[0],
      switch: '@boolean',
      percent: '@integer(80,99)',
      'rate|1': [1, 2, 3, 4, 5],
      percentage: '@integer(0,100)',
    })
  )
}

export function getList(params) {
  const { title, pageNo = 1, pageSize = 20 } = params
  const mockList = List.filter(
    (item) => !(title && item.title.indexOf(title) < 0)
  )
  const list = mockList.filter(
    (item, index) =>
      index < pageSize * pageNo && index >= pageSize * (pageNo - 1)
  )
  return {
    code: 200,
    msg: 'success',
    data: { list, ...{ total: mockList.length } },
  }
}

export function queryMock(Id) {
  return Mock.mock({
    uuid: '@uuid',
    id: Id,
    title: '@cword(3,10)',
    objectId: Id,
    code: /\S\d{5,6}/,
    description: '@csentence',
    'status|1': ['published', 'draft', 'deleted'],
    author: '@cname',
    datetime: '@datetime',
    createdAt: '@datetime',
    updatedAt: '@datetime',
    pageViews: '@integer(300, 5000)',
    img: _.sampleSize(imgCdn, 1)[0],
    switch: '@boolean',
    percent: '@integer(80,99)',
    'rate|1': [1, 2, 3, 4, 5],
    percentage: '@integer(0,100)',
  })
}
export function doEdit() {
  return {
    code: 200,
    msg: '修改成功',
  }
}

export function doDelete() {
  return {
    code: 200,
    msg: '删除成功',
  }
}
