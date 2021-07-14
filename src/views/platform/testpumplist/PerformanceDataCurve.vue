<template>
  <div class="PerformanceDataCurve">
    <p><br /></p>
    <div ref="chartViewTop" class="view-chart-box">Click to bind data.</div>

    <h3 style="text-align: center">性能曲线</h3>
  </div>
</template>
<script>
  import echarts from 'echarts'

  import { mapGetters, mapState } from 'vuex'

  export default {
    name: 'PerformanceDataCurve',
    components: {},
    data() {
      return {
        chartOption: {},
        xAxisDataArray: [],

        dataArrayLift: [],
        dataArrayPower: [],
        dataArrayEfficiency: [],

        testData: [],
      }
    },
    computed: {
      ...mapState({
        /*    currentFactoryData: state => state.SMHuser.currentFactoryData*/
        currentTask: (state) => state.deviceData.currentTask,
        currentChildPageData: (state) => state.deviceData.currentChildPageData,
      }),
    },
    created() {},
    mounted() {
      this.$baseEventBus.$on('itemChange', (testData) => {
        this.resetOption()
        this.testData = testData

        this.processData(testData)

        setTimeout(() => {
          this.drawLine()
          this.getData()
        }, 200)
      })

      this.$nextTick(() => {
        const view = this.$refs.chartViewTop
        this.chartTop = echarts.init(view)
        this.drawLine()
      })
    },
    beforeDestroy() {
      // this.$baseEventBus.$off("childPageChange");

      console.log(' brfore destroy ### ')
      this.resetOption()
      // this.chartTop.dispose();
    },
    methods: {
      initData() {
        console.log('initData')
      },
      processData(testData) {
        var xAxisDataArrayTemp = [],
          dataArrayLiftTemp = [],
          dataArrayPowerTemp = [],
          dataArrayEfficiencyTemp = []

        testData.forEach((item) => {
          // 流量
          xAxisDataArrayTemp.push(item.Q2)

          // 扬程
          dataArrayLiftTemp.push(item.H2)
          // 功率
          dataArrayPowerTemp.push(item.W2)
          // 效率
          dataArrayEfficiencyTemp.push(item.Eff)
        })

        this.xAxisDataArray = xAxisDataArrayTemp

        this.dataArrayLift = dataArrayLiftTemp
        this.dataArrayPower = dataArrayPowerTemp
        this.dataArrayEfficiency = dataArrayEfficiencyTemp
      },
      drawLine() {
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
            // 扬程
            {
              type: 'value',
              name: '扬程H/m',
              position: 'left',
              axisLabel: {
                formatter: '{value}  H/m',
              },
            },

            // 右侧的两个Y轴 ###
            // 功率
            {
              type: 'value',
              name: '功率(kW)',
              position: 'right',
              offset: 50,
              axisLabel: {
                formatter: '{value}',
              },
            },

            // 效率
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

        this.chartTop.setOption(this.chartOption)
      },
      resetOption() {
        // this.chartTop.dispose()

        this.chartTop.clear()
        this.xAxisDataArray = []

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
