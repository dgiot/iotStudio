<template>
  <div class="PerformanceCurve">
    <div
      ref="chartViewTop"
      class="view-chart-box"
    >
      Click to bind data.
    </div>
  </div>
</template>
<script>
  import echarts from 'echarts'

  import { mapGetters, mapState } from 'vuex'

  export default {
    name: 'PerformanceCurve',
    components: {},
    data() {
      return {
        chartOption: {},
        xAxisDataArray: [],

        dataArrayScatterLift: [],
        dataArrayScatterPower: [],
        dataArrayScatterEfficiency: [],

        dataArrayLift: [],
        dataArrayPower: [],
        dataArrayEfficiency: [],
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
    created() {},
    mounted() {
      this.$nextTick(() => {
        const view = this.$refs.chartViewTop
        this.chartTop = echarts.init(view)
        this.drawLine()
      })
    },
    beforeDestroy() {
      // eventBus.$off("childPageChange");

      console.log(' brfore destroy ### ')
      this.resetOption()
      // this.chartTop.dispose();
    },
    methods: {
      initData() {
        console.log('initData')
      },
      reset() {
        this.resetOption()
      },
      drawLine() {
        this.xAxisDataArray = this.getFlowGapList(2750)

        console.log('this.xAxisDataArray', this.xAxisDataArray)

        // lift 扬程 散点
        this.dataArrayScatterLift = (function () {
          var d = []
          var len = 10
          var value
          while (len--) {
            d.push([
              Math.round(Math.random() * 29) + 1,
              (Math.random() * 30).toFixed(2) - 0,
              180,
            ])
          }
          return d
        })()

        // 功率 power 散点

        this.dataArrayScatterPower = (function () {
          var d = []
          var len = 10
          var value
          while (len--) {
            d.push([
              Math.round(Math.random() * 29) + 1,
              (Math.random() * 30).toFixed(2) - 0,
              180,
            ])
          }
          return d
        })()

        // 效率 efficiency 散点

        this.dataArrayScatterEfficiency = (function () {
          var d = []
          var len = 10
          var value
          while (len--) {
            d.push([
              Math.round(Math.random() * 29) + 1,
              (Math.random() * 30).toFixed(2) - 0,
              180,
            ])
          }
          return d
        })()

        // 曲线

        this.dataArrayLift = (function () {
          var list = []
          for (var i = 1; i <= 20; i++) {
            list.push(Math.round(Math.random() * 30))
          }
          return list
        })()

        this.dataArrayPower = (function () {
          var list = []
          for (var i = 1; i <= 20; i++) {
            list.push(Math.round(Math.random() * 30))
          }
          return list
        })()

        this.dataArrayEfficiency = (function () {
          var list = []
          for (var i = 1; i <= 20; i++) {
            list.push(Math.round(Math.random() * 30))
          }
          return list
        })()

        this.chartOption = {
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            // flow 流量, head 扬程  temp 温度  ,effect 效率
            data: ['扬程', '功率', '效率'],
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: this.xAxisDataArray, // 流量(m3/h)
            },
            {
              type: 'value',
              scale: true,
              splitNumber: 29,
              axisLabel: { show: false },
              splitLine: { show: false },
            },
          ],
          yAxis: [
            // 左侧的Y轴 ###
            //扬程
            {
              type: 'value',
              name: '扬程H/m',
              position: 'left',
              axisLabel: {
                formatter: '{value}  H/m',
              },
            },

            // 右侧的两个Y轴 ###
            //功率
            {
              type: 'value',
              name: '功率(kW)',
              position: 'right',
              offset: 50,
              axisLabel: {
                formatter: '{value}',
              },
            },

            //效率
            {
              type: 'value',
              // name: "效率η(%)",
              name: '效率(%)',
              position: 'right',
              axisLabel: {
                formatter: '{value}',
              },
            },
          ],
          animation: false,
          // 组成曲线的点
          series: [
            {
              name: '扬程',
              type: 'scatter',

              yAxisIndex: 1,
              xAxisIndex: 1,
              symbol: 'circle',
              symbolSize: 10,
              data: this.dataArrayScatterLift,
            },
            {
              name: '效率',
              type: 'scatter',

              yAxisIndex: 1,
              xAxisIndex: 1,
              symbol: 'circle',
              symbolSize: 10,
              data: this.dataArrayScatterEfficiency,
            },
            {
              name: '功率',
              type: 'scatter',

              yAxisIndex: 1,
              xAxisIndex: 1,
              symbol: 'circle',
              symbolSize: 10,
              data: this.dataArrayScatterPower,
            },

            {
              name: '扬程',
              type: 'line',
              smooth: true,
              data: this.dataArrayLift,
            },
            {
              name: '效率',
              type: 'line',
              smooth: true,
              data: this.dataArrayPower,
            },
            {
              name: '功率',
              type: 'line',
              smooth: true,
              data: this.dataArrayEfficiency,
            },
          ],
        }

        this.symbolSizeArray = function (value) {
          return Math.round(value[2] / 10)
        }

        this.chartTop.setOption(this.chartOption)
      },
      getFlowGapList(end) {
        if (!end) {
          return []
        }

        var gap = end / 10

        // 得到整数 gap

        // [0,25,50,75,100,125,150,175,200,225,250,275,300,325,350,375,400,425,450,475,500]

        // parseInt
        gap = Math.round(gap / 25) * 25

        let multiple = gap / 25

        if (multiple % 2 !== 0) {
          // 奇数 + 1
          gap = (multiple + 1) * 25
        }

        var list = []

        for (var i = 0; i <= 10; i++) {
          let tempVal = i * gap
          list.push(tempVal)
        }

        return list
      },
      getH(a, b, c, d, Q) {
        return (
          a -
          b * Math.pow(10, -3) * Q +
          c * Math.pow(10, -7) * Math.pow(Q, 2) -
          d * Math.pow(10, -9) * Math.pow(Q, 3)
        )
      },
      getE(a, b, c, d, Q) {
        return (
          a +
          b * Math.pow(10, -2) * Q -
          c * Math.pow(10, -7) * Math.pow(Q, 2) -
          d * Math.pow(10, -9) * Math.pow(Q, 3)
        )
      },
      getP(a, b, c, d, Q) {
        return (
          a +
          b * Math.pow(10, -2) * Q -
          c * Math.pow(10, -6) * Math.pow(Q, 2) -
          d * Math.pow(10, -9) * Math.pow(Q, 3)
        )
      },
      resetOption() {
        // this.chartTop.dispose()

        this.chartTop.clear()
        this.xAxisDataArray = []

        this.dataArrayScatterLift = []
        this.dataArrayScatterPower = []
        this.dataArrayScatterEfficiency = []

        this.dataArrayLift = []
        this.dataArrayPower = []
        this.dataArrayEfficiency = []
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
