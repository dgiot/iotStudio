export function getSetting(
  params = 'v1/home/setting',
  type = 'get',
  docUrl = 'https://ww.iotn2n.com/docs/'
) {
  return type == 'get'
    ? axios.get(`${docUrl}${params}`)
    : axios.post(`${docUrl}${params}`)
}
