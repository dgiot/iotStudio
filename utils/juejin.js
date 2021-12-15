const axios = require('axios')

const cookie =
  '_ga=GA1.2.1538005128.1623115707; MONITOR_WEB_ID=9fa7473d-6ca4-48fc-8c47-b099b251da69; passport_csrf_token_default=153adc1d270a964e9f8c2a4b71f7beba; passport_csrf_token=153adc1d270a964e9f8c2a4b71f7beba; sid_guard=c934e02d41e5e11875333670b22424f9%7C1634631789%7C5184000%7CSat%2C+18-Dec-2021+08%3A23%3A09+GMT; uid_tt=5bba3a519ba44f7a6596117025e444fb; uid_tt_ss=5bba3a519ba44f7a6596117025e444fb; sid_tt=c934e02d41e5e11875333670b22424f9; sessionid=c934e02d41e5e11875333670b22424f9; sessionid_ss=c934e02d41e5e11875333670b22424f9; sid_ucp_v1=1.0.0-KDRkMzgzMWU0ZmEzNDQxNTRlMmJhMzk2NzIyZDkyZDY2YzQwYzU5ZWUKFgjur-DA_fXFBBDtgLqLBhiwFDgIQDgaAmxmIiBjOTM0ZTAyZDQxZTVlMTE4NzUzMzM2NzBiMjI0MjRmOQ; ssid_ucp_v1=1.0.0-KDRkMzgzMWU0ZmEzNDQxNTRlMmJhMzk2NzIyZDkyZDY2YzQwYzU5ZWUKFgjur-DA_fXFBBDtgLqLBhiwFDgIQDgaAmxmIiBjOTM0ZTAyZDQxZTVlMTE4NzUzMzM2NzBiMjI0MjRmOQ; n_mh=hxtTYQc6XiWQFhsxHwH1d0MbBm0J47HR8DF-mxufcxE; _gid=GA1.2.252474946.1639541415' // 你的cookies
const mineral = 14482 // 你要梭哈的矿石

async function juejin() {
  const arr = []
  const num = Math.floor(mineral / 200)
  for (let i = 0; i < num; i++) {
    arr.push(getdata())
  }
  await Promise.all([...arr])
}

async function getdata() {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: `https://api.juejin.cn/growth_api/v1/lottery/draw`,
      headers: {
        cookie: cookie,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Safari/537.36',
      },
    })
      .then((res) => {
        console.log(
          `-----------抽奖成功,抽中：${res.data.data.lottery_name}----------`
        )
        resolve(res.data.data.lottery_name)
      })
      .catch((err) => {
        console.log(`-----------抽奖出错：${err}--------------`)
        reject({})
      })
  })
}
juejin()
