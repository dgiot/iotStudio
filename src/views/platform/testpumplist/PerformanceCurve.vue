<template>
  <div class="PerformanceCurve">
    <div ref="chartViewTop" class="view-chart-box">Click to bind data.</div>
  </div>
</template>
<script>
  import echarts from 'echarts'

  import { mapGetters, mapState } from 'vuex'
  import { eventBus } from '@/api/eventBus'
  /*     var flowArray = []
    var headArray = []
    var effectArray = []
    var powerArray = []
 */
  export default {
    name: 'PerformanceCurve',
    components: {},
    data() {
      return {
        pageId: '',
        chart: '',
        wenTimer: '',
        chartOption: {},
        xAxisDataArray: [],
        flowArray: [],
        headArray: [],
        effectArray: [],
        powerArray: [],
        evidenceDataBackUp: [],

        mqttClient: {},
      }
    },
    computed: {
      factoryName() {
        return this.$store.state.SMHuser.factoryName
      },
      ...mapState({
        /*    currentFactoryData: state => state.SMHuser.currentFactoryData*/
        currentTask: (state) => state.deviceData.currentTask,
        currentChildPageData: (state) => state.deviceData.currentChildPageData,
      }),
    },
    created() {
      // var mqttClientId = "C_" + new Date().getTime();
      let mqttClientId = 'paho_mqtt_javascript11'

      this.mqttClient = new Paho.MQTT.Client(
        this.$globalConfig.hostname,
        this.$globalConfig.mqttPort,
        mqttClientId
      )

      console.log('this.mqttClient', this.mqttClient)

      // set callback handlers
      this.mqttClient.onConnectionLost = this.onConnectionLost
      this.mqttClient.onMessageArrived = this.onMessageArrived

      // connect the client
      this.mqttClient.connect({ onSuccess: this.onConnect })
    },
    mounted() {
      eventBus.$on('childPageChange', (pageId) => {
        this.resetOption()
        this.pageId = pageId
        setTimeout(() => {
          this.drawLine()
          this.getData()
        }, 200)
      })

      this.$nextTick(() => {
        const view = this.$refs.chartViewTop
        this.chartTop = echarts.init(view)
        this.chartTop.on('click', this.dataTransfer)
        this.chartTop.on('dataZoom', this.dataTransfer)
        this.drawLine()
      })
    },
    beforeDestroy() {
      // eventBus.$off("chartClick", this.chartClickHnadle);
      eventBus.$off('childPageChange')

      console.log(' brfore destroy ### ')
      // this.chartTop.dispose()
    },
    methods: {
      onConnect(res) {
        // Once a connection has been made, make a subscription and send a message.

        console.log('### onConnect')
        // 订阅主题
        this.mqttClient.subscribe('World')

        const message = new Paho.MQTT.Message('Hello 11')

        // 这里要与subscribe方法里的字符串一致 ?
        message.destinationName = 'World'

        this.mqttClient.send(message)
      },
      onConnectionLost(responseObject) {
        if (responseObject) {
          console.log('onConnectionLost:', responseObject)
        }
      },
      onMessageArrived(message) {
        // message.payloadString
        console.log('### onMessageArrived: ', message.payloadString)
      },

      drawLine() {
        this.chartOption = {
          title: {
            text: '时间-性能',
          },
          tooltip: {
            trigger: 'axis',
          },
          dataZoom: {
            show: true,
            start: 0,
            end: 50,
            throttle: 500,
            backgroundColor: '#fff',
            dataBackgroundColor: '#FF0000',
            fillerColor: 'rgba(144,197,237,0.2)',
            handleColor: 'rgba(70,130,180,1)',
          },
          legend: {
            // flow 流量, head 扬程  temp 温度  ,effect 效率
            data: ['流量', '扬程', '效率', '功率'],
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              data: this.xAxisDataArray,
            },
          ],
          yAxis: [
            {
              type: 'value',
              name: 'H/m',
              position: 'left',
              axisLabel: {
                formatter: '{value}  H/m',
              },
            },
            {
              type: 'value',
              name: 'P(kW)',
              position: 'left',
              offset: 50,
              axisLabel: {
                formatter: '{value}',
              },
            },
            // 右侧Y轴
            {
              type: 'value',
              name: 'η(%)',
              position: 'right',
              axisLabel: {
                formatter: '{value}',
              },
            },
          ],
          series: [
            {
              name: '流量',
              type: 'line',
              smooth: true,
              data: this.flowArray,
            },
            {
              name: '扬程',
              type: 'line',
              smooth: true,
              data: this.headArray,
            },
            {
              name: '效率',
              type: 'line',
              smooth: true,
              data: this.effectArray,
            },
            {
              name: '功率',
              type: 'line',
              smooth: true,
              data: this.powerArray,
            },
          ],
        }

        this.chartTop.setOption(this.chartOption)
      },
      dataTransfer(param) {
        console.log('param ###', param)

        // console.log('this.evidenceDataBackUp',this.evidenceDataBackUp);

        switch (param.type) {
          case 'click':
            const dataObj = this.evidenceDataBackUp[param.dataIndex]

            eventBus.$emit('chartClick', dataObj)

            break
          case 'datazoom':
            // this.$root.$emit("dataZoomDrag")
            {
              /*   var endTime = this.chartTop.getModel().option.xAxis[0].data[endX];

            console.log('startTime ',startTime);//区间开始值："17-11-06"
            console.log('endTime ',endTime);//区间结束值："17-11-08  */
            }
            break
          default:
            break
        }

        // this.chartTop.getModel().option.dataZoom[1].startValue;
        // console.log('dataZoom ###',this.chartTop.getModel().option.dataZoom);
        // console.log("xAxis 1 ###", this.chartTop.getModel().option.xAxis);
        // console.log('xAxis 2 ###',this.chartTop.xAxis);
      },
      getData() {
        if (!this.pageId) {
          this.$message({ message: '没有 id' })
          return
        }

        if (!this.currentTask.createdAt) {
          this.$router.push({ path: '/inspection/index' })
          return
        }

        this.getEvidence(this.pageId).then((res) => {
          if (res) {
            const list = res.results
            this.pushData(list)
          }
        })
      },
      pushData(list) {
        // 逆序 遍历

        console.log('pushData ###')

        for (let index = list.length - 1; index >= 0; index--) {
          const item = list[index]

          // push xAxisArray
          // 时间戳 -> 日期

          this.evidenceDataBackUp.push(item)

          const curDateStr = this.$timestampToTime(item.timestamp, true)
          // curDateStr = curDateStr.substring(5)
          this.xAxisDataArray.push(curDateStr)

          // seriesArray
          // 流量
          this.flowArray.push(this.$objGet(item, 'original.data.flow'))
          // 扬程
          this.headArray.push(this.$objGet(item, 'original.data.head'))
          // 效率
          this.effectArray.push(this.$objGet(item, 'original.data.effect'))
          // 功率
          this.powerArray.push(this.$objGet(item, 'original.data.power'))
        }

        /*
      list.forEach((item,index, arr) => {
      }); */

        // true, 覆盖以前的数据
        this.chartTop.setOption(this.chartOption, true)
      },
      getTimeStamp(param) {
        if (param == 'startTime') {
          var startX = this.chartTop.getModel().option.dataZoom[0].startValue
          var startTime = this.chartTop.getModel().option.xAxis[0].data[startX]

          return startTime

          return this.$dateTostamp(startTime)
        } else if (param == 'endTime') {
          var endX = this.chartTop.getModel().option.dataZoom[0].endValue
          var endTime = this.chartTop.getModel().option.xAxis[0].data[endX]

          return this.$dateTostamp(endTime)
        }
      },
      getEvidence(reportId) {
        const where = {}

        var taskTimestamp = this.$dateTostamp(this.currentTask.createdAt)

        where['reportId'] = reportId

        where['timestamp'] = {
          $gt: taskTimestamp,
        }

        // 获取当前时间戳
        // var timestamp = Date.parse(new Date())/1000
        // where["original.sourcetype"] = '9CA525AD9639'
        // var taskTimestamp = this.$dateTostamp(new Date(this.currentTask.createdAt))
        // console.log( this.$dateTostamp(new Date(this.currentTask.createdAt)) );

        return this.$axiosWen.get('/classes/Evidence', {
          params: {
            order: '-timestamp',
            limit: '300',
            where: JSON.stringify(where),
            keys: 'original,timestamp,count(*)',
          },
        })
      },
      evidenceDetail() {
        var taskid = this.$route.query.taskid

        this.$axios.get('/classes/Evidence', {
          params: {
            order: '-createdAt',
            include: 'product',
            where: {
              parentId: {
                $exists: false,
              },
            },
          },
        })
      },
      resetOption() {
        // this.chartTop.dispose()

        this.chartTop.clear()

        this.xAxisDataArray = []

        // 流量
        this.flowArray = []
        // 扬程
        this.headArray = []
        // 效率
        this.effectArray = []
        // 功率
        this.powerArray = []
      },
    },
  }
</script>
<style lang="scss">
  .view-chart-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 380px;
    text-align: center;
  }
</style>
