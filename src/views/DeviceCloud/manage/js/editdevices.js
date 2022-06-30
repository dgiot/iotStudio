import info from '@/components/Device/info'
import SceneLog from '@/views/DeviceCloud/manage/component/SceneLog'
import task from '@/views/DeviceCloud/manage/component/task'
import deviceLog from '@/views/CloudSystem/logs/device'
import { mapGetters, mapActions } from 'vuex'
import { getCardDevice, getDabDevice, getDevice } from '@/api/Device/index.js'
import Instruct from '@/views/DeviceCloud/category/instruct_manage'
import { queryView } from '@/api/View'
import runningState from '@/views/DeviceCloud/manage/component/Device/runningState'
const columns = [
  {
    title: '图片',
    width: 120,
    dataIndex: 'imgurl',
    fixed: 'left',
    key: 'imgurl',
    scopedSlots: { customRender: 'imgurl' },
  },
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '值',
    dataIndex: 'number',
    key: 'number',
  },
  {
    title: '单位',
    dataIndex: 'unit',
    key: 'unit',
  },
]

export default {
  components: {
    Instruct,
    info,
    deviceLog,
    SceneLog,
    'device-task': task,
    runningState,
  },

  directives: {
    'el-select-loadmore': {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector(
          '.el-select-dropdown .el-select-dropdown__wrap'
        )
        SELECTWRAP_DOM.addEventListener('scroll', function () {
          /**
           * scrollHeight 获取元素内容高度(只读)
           * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
           * clientHeight 读取元素的可见高度(只读)
           * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
           * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
           */
          const condition =
            this.scrollHeight - this.scrollTop <= this.clientHeight
          if (condition) {
            binding.value()
          }
        })
      },
    },
  },
  data() {
    this.chartExtend = {
      series: {
        barMaxWidth: 35,
      },
      dataZoom: [
        // 鼠标滚轮滚动
        // {
        //   type: 'inside',
        // },
        // 坐标轴滚动
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          left: '9%',
          bottom: -5,
          start: 10,
          end: 90, //初始化滚动条
        },
      ],
      grid: {
        right: 40,
      },
    }
    this.toolbox = {
      orient: 'vertical',
      right: -5,
      feature: {
        dataZoom: {
          yAxisIndex: 'none',
        },
        magicType: {
          type: [
            'line',
            'bar',
            'histogram',
            'pie',
            'ring',
            'waterfall',
            'funnel',
            'radar',
            'heatmap',
            'scatter',
            'candle',
            'stack',
          ],
        },
        dataView: {
          show: true,
          readOnly: false,
        },
        saveAsImage: { show: true },
        restore: { show: true },
      },
    }
    return {
      commandInfo: {
        dialog: false,
        data: {},
      },
      amisTable: '0_j',
      bmLabel: false,
      mapLabel: {
        content: '我爱北京天安门',
        style: {
          color: 'red',
          fontSize: '24px',
        },
        position: {
          lng: 116.404,
          lat: 39.915,
        },
        title: '我爱北京天安门',
      },
      router: '',
      chartKey: moment(new Date()).valueOf(),
      machinelist: {},
      thirdtbKey: moment(new Date()).valueOf(),
      deviceInfo: {},
      columns,
      productId: this.$route.query.productid,
      activeNames: ['1'],
      queryForm: {
        account: '',
        searchDate: '',
        pageNo: 1,
        pageSize: 20,
      },
      buttonactive: 1,
      loading: true,
      xl: 6,
      xs: 24,
      sm: 24,
      md: 12,
      dataEmpty: true,
      chartDataZoom: [{ type: 'slider' }],
      pickerOptions: {
        shortcuts: [
          {
            text: this.$translateTitle('developer.LastWeek'),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: this.$translateTitle('developer.LastMonth'),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: this.$translateTitle('developer.LastThreeMonths'),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            },
          },
        ],
      },
      pickerOptionsDay: {
        shortcuts: [
          {
            text: this.$translateTitle('developer.today'),
            onClick(picker) {
              picker.$emit('pick', new Date())
            },
          },
          {
            text: this.$translateTitle('developer.yesterday'),
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            },
          },
          {
            text: this.$translateTitle('developer.A week ago'),
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            },
          },
        ],
      },
      chartData: {
        identifier: [],
        columns: [],
        rows: [],
      },
      params: {
        _function: 'last',
        style: '',
        number: 1,
        interval: 'h',
        datetimerange: '',
        keys: '*',
        limit: 100,
        endTime: new Date().getTime(),
        startTime: new Date().getTime() - 3600 * 1000 * 24 * 7,
      },
      interval: [
        {
          type: 'y',
          name: '年',
        },
        {
          type: 'n',
          name: '月',
        },
        {
          type: 'w',
          name: '周',
        },
        {
          type: 'd',
          name: '日',
        },
        {
          type: 'h',
          name: '时',
        },
        {
          type: 'm',
          name: '分',
        },
        {
          type: 's',
          name: '秒',
        },
        {
          type: 'a',
          name: '毫秒',
        },
        {
          type: 'u',
          name: '微秒',
        },
      ],
      functionarr: [
        'count',
        'avg',
        'sum',
        'stddev',
        'min',
        'max',
        'first',
        'last',
      ],
      disabledChart: [
        'map',
        'sankey',
        'wordcloud',
        'liquidfill',
        'tree',
        'gauge',
      ],
      options: [
        {
          value: '选项1',
          label: '黄金糕',
        },
        {
          value: '选项2',
          label: '双皮奶',
        },
        {
          value: '选项3',
          label: '蚵仔煎',
        },
        {
          value: '选项4',
          label: '龙须面',
        },
        {
          value: '选项5',
          label: '北京烤鸭',
        },
      ],
      value: '',
      chartSettings: {},
      queryFlag: true,
      width: 0,
      lineChartData: '',
      datafordetail: [],
      datadialogVisible: false,
      childDialog: false,
      ninthform: {
        product: '',
        devices: '',
      },
      wmxform: {
        product: '',
        devices: '',
      },
      tableData: [],
      activeName: 'first',
      text: '1111111',
      deviceid: '',
      topicData: [],
      thirdstart: 1,
      thirdlength: 10,
      thirdtotal: 0,
      topic: [
        {
          topic: '$dg/thing/{productId}/{deviceAddr}/properties/report',
          type: 'pub',
          desc: '设备上报',
          isdef: true,
        },
        {
          topic: '$dg/device/{productId}/{deviceAddr}/profile',
          type: 'sub',
          desc: '消息下发',
          isdef: true,
        },
      ],
      thirdData: [],
      thirdDatas: [],
      ispushdata: true,
      timer: null,
      isshowtable: false,
      // 子设备数据
      childrendevices: {
        devicesname: '',
      },
      multipleTable: [],
      devicesTableData: [],
      childrenDeviceLength: 10,
      childrenDeviceStart: 0,
      childrenDeviceTotal: 0,
      childrenForm: {
        product: '',
        device: '',
        route: '',
      },
      isshowchild: false,
      allProudct: [],
      productDevices: [],
      ischange: false,
      ischildren: false,
      productid: '',
      dataDeviceTotal: 0,
      dataDeviceLength: 10,
      dataDeviceStart: 1,
      devicedevaddr: '',
      dirstart: 1,
      dirlength: 20,
      selectproduct: '',
      watchNum: 0,
    }
  },
  computed: {
    ...mapGetters({
      Device: 'settings/device',
      chartType: 'product/chartType',
    }),
  },
  watch: {
    sm(v) {
      this.$nextTick((_) => {
        this.resizeTheChart()
        setTimeout(() => {
          this.loading = false
        }, 2000)
      })
    },
  },
  mounted() {
    // this.deviceInfo.product.objectId = this.$route.query.productid
    this.getDeviceInfo(this.$route.query.deviceid)
    this.setTreeFlag(false)
    this.params.style = this.chartType[0].type
    console.log(' this.params.style', this.params.style)
    this.subtopic = `$dg/user/realtimecard/${this.$route.query.deviceid}/report` // 设备实时数据topic
    this.router = this.$dgiotBus.router(location.href + this.$route.fullPath)
    this.topicKey = this.$dgiotBus.topicKey(this.router, this.subtopic) // dgiot-mqtt topicKey 唯一标识
    // if (this.$route.query.deviceid) {
    this.deviceid = this.$route.query.deviceid
    this.subRealtimedata()
    this.initChart()
    window.addEventListener('resize', this.resizeTheChart)
    // }
  },
  // 清除定时器
  destroyed: function () {
    this.Unbscribe()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeTheChart)
    this.Unbscribe()
  },
  methods: {
    /**
     * @Author: dext7r
     * @Date: 2021-12-24 12:13:39
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description: 订阅实时数据
     */
    async subRealtimedata() {
      try {
        // 订阅mqtt
        // this.$dgiotBus.$emit('MqttSubscribe', {
        //   router: this.router,
        //   topic: this.subtopic,
        //   qos: 0,
        //   ttl: 1000 * 60 * 60 * 3,
        // })
        await this.$subscribe(this.subtopic)
        console.log(this.$mqttInfo)
        // mqtt 消息回调
        console.groupCollapsed(
          `%c mqtt 订阅日志`,
          'color:#009a61; font-size: 28px; font-weight: 300'
        )
        console.log('topic:', this.subtopic)
        console.log('router:', this.router)
        console.groupEnd()

        this.$dgiotBus.$off(this.$mqttInfo.topicKey) // dgiotBus 关闭事件
        this.$dgiotBus.$on(this.$mqttInfo.topicKey, (mqttMsg) => {
          // mqtt 消息回调
          console.groupCollapsed(
            `%c mqttMsg消息回调`,
            'color:#009a61; font-size: 28px; font-weight: 300'
          )
          console.log(mqttMsg)
          console.log(Base64.decode(mqttMsg.payloadString))
          console.log(JSON.parse(Base64.decode(mqttMsg.payloadString)).data)
          console.log(
            'Base64.decode(payload):',
            Base64.decode(mqttMsg.payloadString)
          )
          console.groupEnd()
          const { data = [] } = JSON.parse(Base64.decode(mqttMsg.payloadString))
          this.renderCard(data)
          if (data) {
            // this.renderCard(data)
          } else {
            this.CardDevice()
          }
        })
      } catch (error) {
        console.log(error)
        this.$baseMessage(
          this.$translateTitle('alert.Data request error') + `${error}`,
          'error',
          'dgiot-hey-message-error'
        )
      }
    },
    ...mapActions({
      setTreeFlag: 'settings/setTreeFlag',
      delVisitedRoute: 'tabs/delVisitedRoute',
      addVisitedRoute: 'tabs/addVisitedRoute',
    }),
    Unbscribe() {
      console.log('Unbscribe all topic')
      const subtopic = '$dg/user/trace/' + this.deviceInfo.objectId + '/#'
      const topicKey = this.$dgiotBus.topicKey(this.router, subtopic)
      this.$dgiotBus.$emit('MqttUnbscribe', topicKey, subtopic)
      this.subtopic = `$dg/user/trace/${this.$route.query.deviceid}/realtimecard/report` // 设备实时数据topic
      this.topicKey = this.$dgiotBus.topicKey(this.router, this.subtopic) // dgiot-mqtt topicKey 唯一标识
      this.$dgiotBus.$emit('MqttUnbscribe', this.topicKey, this.subtopic)
    },
    /**
     * @Author: h7ml
     * @Date: 2021-12-13 11:42:07
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async getDeviceInfo(deviceid) {
      try {
        // const loading = this.$baseColorfullLoading()
        var resultes = await getDevice(deviceid)
        const { location = { longitude: '116.404', latitude: '39.915' } } =
          resultes
        let mapLabel = {
          content: resultes.name,
          style: {
            color: 'red',
            fontSize: '24px',
          },
          position: {
            lng: Number(location.longitude),
            lat: Number(location.latitude),
          },
          title: resultes.name,
        }
        if (
          resultes.basedata &&
          resultes.basedata.baiduaddr &&
          resultes.basedata.baiduaddr.formatted_address
        ) {
          mapLabel = {
            content: resultes.name,
            style: {
              color: 'red',
              fontSize: '24px',
            },
            position: {
              lng: Number(resultes.basedata.baiduaddr.location.lng),
              lat: Number(resultes.basedata.baiduaddr.location.lat),
            },
            title: resultes.name,
          }
        }

        var ProductId = resultes.product.objectId ?? ''
        const DevAddr = resultes.devaddr
        // const deviceid = resultes.objectId
        let _toppic = [
          {
            topic: `$dg/thing/${ProductId}/${DevAddr}/properties/report`,
            type: 'pub',
            desc: '属性上报',
            isdef: true,
          },
          {
            topic: `$dg/device/${ProductId}/${DevAddr}/properties`,
            type: 'pub',
            desc: '属性采集',
            isdef: true,
          },
          {
            topic: `$dg/user/konva/${deviceid}/report`,
            type: 'pub',
            desc: '组态消息',
            isdef: true,
          },
          {
            topic: `$dg/user/realtimecard/${deviceid}/report`,
            type: 'pub',
            desc: '卡片消息',
            isdef: true,
          },
          {
            topic: `$dg/device/${ProductId}/${DevAddr}/profile`,
            type: 'pub',
            desc: '设备控制',
            isdef: true,
          },
        ]

        resultes.topicData = resultes.product.topics
          ? resultes.product.topics.concat(_toppic)
          : _toppic
        console.log(resultes, 'resultes')
        this.deviceInfo = resultes
        // this.$baseMessage(
        //   this.$translateTitle('alert.Data request successfully'),
        //   'success',
        //   'dgiot-hey-message-success'
        // )
        // loading.close()
        this.mapLabel = mapLabel
        if (this.$refs['map'])
          this.$refs['map'].baiduCenter = this.mapLabel.position
        this.bmLabel = true
        // this.$refs['map'].label = this.mapLabel
        console.info('vm.mapLabel\n', this.mapLabel)
        console.info('vm.mapLabel\n', this.$refs['map'])
      } catch (error) {
        console.log(error)
        this.$baseMessage(
          this.$translateTitle('alert.Data request error') + `${error}`,
          'error',
          'dgiot-hey-message-error'
        )
      }
    },
    toggleChart(e) {
      this.chartKey = moment(new Date()).valueOf()
      this.loading = false
      console.log(e)
      this.chartExtend = {}
      this.chartDataZoom = []
      let type = ['funnel', 'radar', 'radar']
      if (type.indexOf(e) != -1) {
        this.chartExtend = {}
        this.chartDataZoom = []
      } else {
        this.chartExtend = {
          series: {
            barMaxWidth: 35,
          },
          dataZoom: [
            // 鼠标滚轮滚动
            // {
            //   type: 'inside',
            // },
            // 坐标轴滚动
            {
              type: 'slider',
              show: true,
              xAxisIndex: [0],
              left: '9%',
              bottom: -5,
              start: 10,
              end: 90, //初始化滚动条
            },
          ],
          grid: {
            right: 40,
          },
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                formatter: '{value} %',
              },
            },
          ],
        }
        this.chartDataZoom = [{ type: 'slider' }]
      }
      this.resizeTheChart()
    },
    resizeTheChart() {
      let charts = this.$refs[`charts`]
      if (charts instanceof Array) {
        charts.forEach((chart) => {
          chart.$children[0].resize()
        })
        console.log('重绘完成', charts)
      } else {
        charts.$children[0].resize()
      }
    },
    toggleCardRow(index, xs, sm, md, xl) {
      sm == 24 ? (this.sm = 12) : (this.sm = 24)
      md == 12 ? (this.md = 24) : (this.md = 12)
      xl == 6 ? (this.xl = 12) : (this.xl = 6)
      this.loading = true
    },
    afterConfig(options) {
      options.tooltip.showDelay = 500
      return options
    },
    initChart() {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      this.params.datetimerange = [start, end]
      this.queryFlag = false
      this.$queryProduct({}).then((res) => {
        this.allProudct = res.results
      })
    },
    async queryChart() {
      this.loading = true
      dgiotlogger.log('queryChart', this.params)
      this.chartData = {
        identifier: [],
        columns: [],
        rows: [],
      }
      if (this.params.startTime && this.params.endTime) {
        // this.$baseColorfullLoading(
        //   1,
        //   this.$translateTitle('home.messag_loding')
        // )
        let deviceid = this.$route.query.deviceid
        // let endTime = moment(this.params.datetimerange[1]).valueOf()
        // let startTime = moment(this.params.datetimerange[0]).valueOf()
        // console.log('endTime', endTime)
        // console.log('startTime', startTime)
        // const limit = moment(endTime).diff(moment(startTime), 'days')
        const {
          interval,
          keys,
          limit,
          number,
          style,
          _function,
          startTime,
          endTime,
        } = this.params
        let params = {
          starttime: moment(startTime).valueOf(),
          endtime: moment(endTime).valueOf(),
          interval: number + interval,
          keys: keys,
          limit: limit,
          function: _function,
          style: style,
        }
        await getDabDevice(deviceid, params)
          .then((res) => {
            // this.$baseColorfullLoading().close()
            console.log(res, 'res charts')
            if (res?.chartData) {
              const { chartData = {} } = res
              this.chartData = chartData
              this.$nextTick(() => {
                setTimeout(() => {
                  this.loading = true
                  this.toggleChart('line')
                }, 1000)
              })
            }
            console.log('this.chartData', this.chartData)
            this.loading = false
            this.dataEmpty = false
          })
          .catch((e) => {
            console.log(e)
            this.loading = false
            // this.$baseColorfullLoading().close()
          })
      } else {
        // this.$message.error(
        //   this.$translateTitle('developer.Please select the query Time')
        // )
      }
    },
    print(item) {
      console.log(item)
    },
    async tabHandleClick(tab) {
      localStorage.removeItem('parse_objectid')
      localStorage.setItem('parse_objectid', this.deviceid)
      // this.$dgiotBus.$emit('MqttUnbscribe', this.topicKey, this.subtopic)
      await this.$unSubscribe(this.subtopic)
      switch (tab.name) {
        case 'ninth':
          await this.$router.push({
            path: '/roles/onlinetest',
            query: {
              deviceid: this.devicedevaddr,
              productid: this.productid,
            },
          })
          break
        case 'children':
          await this.getDevices()
          this.loading = true
          setTimeout(() => {
            this.loading = false
          }, 300)
          break
        case 'instruct':
          this.loading = true
          setTimeout(() => {
            this.loading = false
          }, 300)
          break
        case 'third':
          await this.queryChart()
          break
        case 'right':
          await this.toggleClass('rightrow')
          this.loading = true
          setTimeout(() => {
            this.loading = false
          }, 300)
          break
        case 'task':
          await this.$refs.SceneLog.get_topic()
          break
        case 'view':
          const { results = [] } = await queryView({
            where: {
              class: 'Product',
              type: { $ne: 'topo' },
              title: { $ne: null },
              key: this.productId,
              objectId: { $ne: null },
            },
          })
          if (_.isEmpty(results)) {
            return false
          } else {
            this.commandInfo.data = results
            localStorage.setItem('parse_objectid', this.deviceid)
          }
          break
        case 'devicetask':
          await this.$refs['device-task'].featchData()
          break
        case 'first1':
          await this.subRealtimedata()
          await this.CardDevice()
          break
      }
    },
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000)
      var Y = date.getFullYear() + '-'
      var M =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
      var D =
        (date.getDate() + 1 <= 10 ? '0' + date.getDate() : date.getDate()) + ' '
      var h =
        (date.getHours() + 1 <= 10 ? '0' + date.getHours() : date.getHours()) +
        ':'
      var m =
        (date.getMinutes() + 1 <= 10
          ? '0' + date.getMinutes()
          : date.getMinutes()) + ':'
      var s =
        date.getSeconds() + 1 <= 10
          ? '0' + date.getSeconds()
          : date.getSeconds()
      return Y + M + D + h + m + s
    },
    getDevices(start) {
      if (start == 0) {
        this.childrenDeviceStart = 0
      }
      this.devicesTableData = []
      const params = {
        limit: this.childrenDeviceLength,
        skip: this.childrenDeviceStart,
        count: 'objectId',
        include: 'product',
        where: { parentId: this.deviceInfo.objectId },
      }
      if (this.childrendevices.devicesname != '') {
        params.where.devaddr = this.childrendevices.devicesname
      }
      console.log('this.params', params)
      this.$queryDevice(params)
        .then((res) => {
          this.childrenDeviceTotal = res.count
          if (res.results) {
            res.results.map((items) => {
              var obj = {}
              obj.objectId = items.objectId
              obj.name = items.name
              obj.status = items.status
              obj.originstatus = items.status
              obj.nodeType = items.product.nodeType
              obj.productName = items.product.name
              obj.devaddr = items.devaddr
              obj.isEnable = items.isEnable
              obj.route = items.route
              this.devicesTableData.push(obj)
            })
          }
        })
        .catch((err) => {
          console.log(err)
          this.$baseMessage('请求出错11', err.error, 3000)
        })
    },
    CardDevice() {
      var vm = this
      vm.loading = true
      getCardDevice(vm.$route.query.deviceid)
        .then((response) => {
          if (response?.data) {
            vm.renderCard(response.data)
          }
        })
        .catch((error) => {
          console.log('update error 清除timer', error)
        })
      setTimeout(() => {
        vm.loading = false
      }, 800)
    },
    //渲染卡片
    renderCard(resData) {
      var vm = this
      // vm.machinelist = {}
      let array = []
      resData.forEach((item) => {
        item.devicetype = item.devicetype === '' ? 'default' : item.devicetype
        if (item.devicetype) array.push(item.devicetype)
      })
      array = _.uniqBy(array)
      let machine = {}
      array.forEach((item) => {
        let arr = []
        resData.forEach((item1) => {
          item1.module = 'card'
          if (item == item1.devicetype) arr.push(item1)
        })
        machine[item] = arr
      })
      vm.machinelist = machine
      vm.thirdtbKey = moment(new Date()).valueOf()
    },
    // 实时数据的分页
    dataDeviceSizeChange(val) {
      this.dataDeviceStart = 1
    },
    dataDeviceCurrentChange(val) {
      this.dataDeviceStart = val
    },
    handleSizeChange1(val) {
      this.thirdstart = 1
      this.thirdlength = val
    },
    handleCurrentChange1(val) {
      this.thirdstart = val
    },
    // 子设备管理表格
    DevicesSelectionChange(val) {
      this.multipleTable = val
    },
    // 子设备分页
    childrenDeviceCurrentChange(val) {
      this.childrenDeviceStart = (val - 1) * this.childrenDeviceLength
      this.getDevices()
    },
    childrenDeviceSizeChange(val) {
      this.childrenDeviceLength = val
      this.getDevices()
    },
    checkProduct(val) {
      this.ischange = true
      this.selectproduct = val
      // devices.equalTo('product', val)
      // devices.notEqualTo('objectId', this.deviceid)
      // devices.notEqualTo('parentId', this.deviceid)
      const params = {
        limit: this.dirlength,
        skip: (this.dirstart - 1) * this.dirlength,
        count: 'objectId',
        where: {
          product: val,
        },
      }
      this.$queryDevice(params).then((response) => {
        if (response.results && response.results.length > 0) {
          this.productDevices = response.results
        } else {
          this.productDevices = []
        }
        this.childrenForm.device = ''
      })
    },
    async deviceToDetail(row) {
      console.log('row', row)
      const query = {
        deviceid: row.objectId,
        nodeType: row.nodeType,
        ischildren: 'false',
        productid: this.productId,
      }
      await this.delVisitedRoute(this.$route.path)
      this.activeName = 'first'
      this.$router.push({ path: this.$route.path, query })
      this.getDeviceInfo(query.deviceid)
      this.setTreeFlag(false)
      this.params.style = this.chartType[0].type
      console.log(' this.params.style', this.params.style)
      // | 卡片消息 | $dg/user/realtimecard/{DeviceId}/report|平台|用户|
      this.subtopic = `$dg/user/realtimecard${this.$route.query.deviceid}/report` // 设备实时数据topic
      this.router = this.$dgiotBus.router(location.href + this.$route.fullPath)
      this.topicKey = this.$dgiotBus.topicKey(this.router, this.subtopic) // dgiot-mqtt topicKey 唯一标识
      // if (this.$route.query.deviceid) {
      this.deviceid = query.deviceid
      this.subRealtimedata()
      this.initChart()
      window.addEventListener('resize', this.resizeTheChart)
      this.CardDevice()
    },
    loadmore() {
      this.dirstart++
      this.checkProduct(this.selectproduct)
    },
    submitDevice(formName) {
      // 添加子设备
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var route = {}
          route[this.deviceInfo.devaddr] = this.childrenForm.route
          var childrenDevicesParmas = {
            parentId: {
              __type: 'Pointer',
              className: 'Device',
              objectId: this.deviceid,
            },
            route: route,
          }
          this.$putDevice(this.childrenForm.device, childrenDevicesParmas).then(
            (resultes) => {
              if (resultes) {
                this.$message({
                  showClose: true,
                  duration: 2000,
                  type: 'success',
                  message: '添加成功',
                })
                this.childDialog = false
                this.getDevices()
                this.$refs['childrenForm'].resetFields()
              }
            }
          )
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    deleteDevcie(val) {
      Promise.all([
        this.multipleTable.map((item) => {
          const params = {
            parentId: null,
          }
          this.$putDevice(item.objectId, params).then((resultes) => {})
        }),
      ])
        .then((data) => {
          if (data && data.length != 0) {
            this.$message({
              showClose: true,
              duration: 2000,
              message: '解除关联成功',
              type: 'success',
            })
            this.getDevices()
          } else {
            this.$message({
              showClose: true,
              duration: 2000,
              message: '解除关联失败',
              type: 'error',
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // 设备多个启用和禁用
    unactiveDevice(val) {
      Promise.all([
        this.multipleTable.map((item) => {
          const params = {
            isEnable: false,
          }
          this.$putDevice(item.objectId, params).then((resultes) => {})
        }),
      ])
        .then((data) => {
          if (data && data.length != 0) {
            this.$message({
              showClose: true,
              duration: 2000,
              message: '禁用成功',
              type: 'success',
            })
            this.getDevices()
          } else {
            this.$message({
              showClose: true,
              duration: 2000,
              message: '禁用失败',
              type: 'error',
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    activeDevice(val) {
      Promise.all([
        this.multipleTable.map((item) => {
          const params = {
            isEnable: true,
          }
          this.$putDevice(item.objectId, params).then((resultes) => {})
        }),
      ])
        .then((data) => {
          if (data && data.length != 0) {
            this.$message({
              showClose: true,
              duration: 2000,
              message: '启用成功',
              type: 'success',
            })
            this.getDevices()
          } else {
            this.$message({
              showClose: true,
              duration: 2000,
              message: '启用失败',
              type: 'error',
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    /* el-popover点击关闭*/
    makeSure(row, $index) {
      this.$confirm('此操作将解除设备间的关系, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // 可以在这里执行删除数据的回调操作.......删除操作.....
          const objRoute = JSON.parse(JSON.stringify(row.route))
          const routeKey = this.deviceInfo.devaddr
          // 删除key为上级设备地址值
          delete objRoute[routeKey]
          const params = {
            parentId: {
              __type: 'Pointer',
              className: 'Device',
              objectId: 0,
            },
            route: objRoute,
          }
          this.$putDevice(row.objectId, params).then((response) => {
            if (response) {
              this.$message({
                showClose: true,
                duration: 2000,
                type: 'success',
                message: '解除关联成功',
              })
              // row._self.$refs[`popover-${$index}`].doClose()
              this.getDevices()
            }
          })
        })
        .catch(() => {})
    },
    handelUpdate(event, row, index) {
      var newData1 = {}
      for (var key in row) {
        newData1[key] = row[key]
      }
      newData1.isEnable = newData1.isEnable != true
      this.devicesTableData[index] = newData1
      this.$confirm('是否修改此设备状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          var newData2 = {}
          for (var key in row) {
            newData2[key] = row[key]
          }
          newData2.isEnable = newData2.isEnable == true
          const params = {
            isEnable: newData2.isEnable,
          }
          this.$putDevice(row.objectId, params).then((resultes) => {
            this.$message({
              showClose: true,
              duration: 2000,
              type: 'success',
              message: '状态修改成功',
            })
          })
          this.getDevices()
        })
        .catch(() => {
          this.$message({
            showClose: true,
            duration: 2000,
            type: 'info',
            message: '已取消修改',
          })
          const newData = row
          newData.isEnable = newData.isEnable != true
          this.devicesTableData[index] = newData
        })
    },
  },
}
