<template>
  <div ref="chartView" class="view-chart">Click to bind data.</div>
</template>

<script>
  import BaseView from '../View'

  export default {
    name: 'ViewChart',
    extends: BaseView,
    props: {},
    data() {
      return {
        echart: null,
        dataStepLine: [100, 0, 100, 100, 0, 0, 100],
        dataLine: [820, 932, 901, 934, 1290, 1330, 1320],
        option: {
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            silent: true,
          },
          yAxis: {
            type: 'value',
            silent: true,
          },
          series: [
            {
              data: [820, 932, 901, 934, 1290, 1330, 1320],
              clickable: false,
              type: 'line',
              smooth: true,
            },
          ],
        },
      }
    },
    watch: {
      detail: function (newVal) {
        this.setOption(this.option)
      },
    },
    mounted() {
      this.$nextTick(function () {
        this.setOption(this.option)
      })
    },
    methods: {
      setOption(option) {
        if (this.echart) {
          this.echart.dispose()
        }
        if (this.detail.type === 'chart-line') {
          this.option.series[0].type = 'line'
          this.option.series[0].data = this.dataLine
          delete this.option.series[0]['step']
          this.option.series[0]['smooth'] = true
        } else if (this.detail.type == 'chart-line-step') {
          this.option.series[0].type = 'line'
          this.option.series[0].data = this.dataStepLine
          this.option.series[0].step = 'start'
          delete this.option.series[0]['smooth']
        } else if (this.detail.type == 'chart-bar') {
          this.option.series[0].type = 'bar'
          this.option.series[0].data = this.dataLine
          delete this.option.series[0]['step']
        }
        let view = this.$refs.chartView
        this.echart = this.$echarts.init(view)
        this.echart.setOption(option)
      },
      onResize() {
        if (this.echart) {
          this.echart.resize()
        }
      },
      updateView() {
        this.setOption(this.option)
      },
    },
  }
</script>

<style lang="scss">
  .view-chart {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    text-align: center;
  }
</style>
