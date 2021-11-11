/**
 * 首页订阅查询mqtt参数
 * @type {[{vuekey: string, dataType: string, query: {keys: string[], limit: number}, table: string}, {vuekey: string, dataType: string, query: {keys: string[], limit: number, where: {}}, table: string}, {vuekey: string, dataType: string, query: {keys: string[], limit: number, where: {category: string}}, table: string}, {vuekey: string, dataType: string, query: {keys: string[], limit: number, where: {status: string}, order: string}, table: string}, {vuekey: string, dataType: string, query: {keys: string[], limit: number, where: {status: string}, order: string}, table: string}, null, null]}
 */
const queryParams = [
  {
    dataType: 'map',
    vuekey: 'baiduMap',
    table: 'baidu',
    query: { keys: ['count(*)'] },
  },
  {
    dataType: 'card',
    vuekey: 'app_count',
    table: 'App',
    query: { limit: 1, keys: ['count(*)'], where: {} },
  },
  {
    dataType: 'card',
    vuekey: 'product_count',
    table: 'Product',
    query: {
      // limit: 1,
      keys: ['count(*)'],
      where: {
        // category: 'IotHub'
      },
    },
  },
  {
    dataType: 'card',
    vuekey: 'dev_online_count',
    table: 'Device',
    query: {
      order: '-updatedAt',
      limit: 15,
      keys: ['count(*)'],
      where: { status: 'ONLINE' },
    },
  },
  {
    dataType: 'card',
    vuekey: 'dev_off_count',
    table: 'Device',
    query: {
      limit: 15,
      order: '-updatedAt',
      keys: ['count(*)'],
      where: { status: 'OFFLINE' },
    },
  },
  {
    dataType: 'card',
    vuekey: 'project_count',
    table: 'Project',
    query: { limit: 1, keys: ['count(*)'], where: {} },
  },
  {
    dataType: 'card',
    vuekey: 'ChartStatus',
    table: 'ChartStatus',
    query: { limit: 1, keys: ['count(*)'], where: {} },
  },
  {
    dataType: 'card',
    vuekey: 'device_count',
    table: 'Device',
    query: { limit: 1, keys: ['count(*)'], where: {} },
  },
  {
    dataType: 'card',
    vuekey: 'warn_count',
    table: 'Notification',
    query: {
      limit: 1,
      keys: ['count(*)'],
      where: {},
    },
  },
]
export default queryParams
