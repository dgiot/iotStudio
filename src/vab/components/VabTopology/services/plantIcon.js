const arr = [
  {
    name: '空调机组',
    class: 'icon-kongtiaojizu',
    unicode: '\uecda',
  },

  {
    name: '手动报警',
    class: 'icon-shoudongbaojinganniu',
    unicode: '\uecdb',
  },

  {
    name: '枪机',
    class: 'icon-qiangji',
    unicode: '\uecdc',
  },

  {
    name: '双鉴探测',
    class: 'icon-shuangjiantance',
    unicode: '\uece7',
  },

  {
    name: '新风机组',
    class: 'icon-xinfengjizu',
    unicode: '\uecdf',
  },

  {
    name: '电表',
    class: 'icon-bianpeidian-dianbiao',
    unicode: '\uece1',
  },

  {
    name: '火警',
    class: 'icon-huojing',
    unicode: '\uece2',
  },

  {
    name: '温度计',
    class: 'icon-wenqi',
    unicode: '\uece3',
  },

  {
    name: '给水系统',
    class: 'icon-geishuixitong',
    unicode: '\uece4',
  },

  {
    name: '环境传感器',
    class: 'icon-huanjingchuanganqi',
    unicode: '\uece5',
  },

  {
    name: '集水井2',
    class: 'icon-jishuijing2',
    unicode: '\uece6',
  },

  {
    name: '电梯',
    class: 'icon-dianti',
    unicode: '\uece8',
  },

  {
    name: '集水井1',
    class: 'icon-jishuijing',
    unicode: '\uece9',
  },

  {
    name: '智能照明',
    class: 'icon-zhinengzhaoming',
    unicode: '\uecea',
  },

  {
    name: '门禁',
    class: 'icon-menjin',
    unicode: '\ueceb',
  },

  {
    name: '摄像头',
    class: 'icon-shexiangji',
    unicode: '\uecec',
  },

  {
    name: '烟感',
    class: 'icon-yangan',
    unicode: '\ueced',
  },

  {
    name: 'VAV',
    class: 'icon-VAVduolianjizu',
    unicode: '\uecee',
  },

  {
    name: '风机盘管',
    class: 'icon-FCUfengjipanguan',
    unicode: '\uecef',
  },

  {
    name: '排风机',
    class: 'icon-paifengji',
    unicode: '\uecf0',
  },

  {
    name: '水表',
    class: 'icon-shuibiao',
    unicode: '\uecf1',
  },

  {
    name: 'UPS',
    class: 'icon-UPSbujianduandianyuan',
    unicode: '\uecf2',
  },

  {
    name: 'VRF',
    class: 'icon-VRFduolianjizu',
    unicode: '\uecf3',
  },

  {
    name: '送风机',
    class: 'icon-songfengji',
    unicode: '\uecf4',
  },

  {
    name: '全热交换机',
    class: 'icon-quanrejiaohuanji',
    unicode: '\uecf5',
  },

  {
    name: '吊顶式空调',
    class: 'icon-diaodingshikongtiaojizu',
    unicode: '\uecf6',
  },

  {
    name: '功能广播',
    class: 'icon-gonggongguangbo',
    unicode: '\uecf7',
  },
]

const pipeImg = {
  group: '设备图标',
  children: arr.map((item) => {
    return {
      name: item.name,
      data: {
        rect: {
          width: 32,
          height: 32,
        },
        borderColor: 'rgba(0,0,0,0)', // 去除边框
        strokeStyle: 'rgba(0,0,0,0)',
        icon: item.unicode,
        iconFamily: 'iconfont',
        iconColor: '#00dc94',
        iconClass: item.class,
        iconSize: 40,
        name: 'rectangle',
        borderRadius: 16,
      },
    }
  }),
}
export default pipeImg
